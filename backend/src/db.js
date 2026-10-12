import { neon } from "@neondatabase/serverless";

let _sql = null;

const getSql = () => {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Check your .env.local or deployment env.");
    }
    // Strip Postgres wire-protocol params that break the Neon HTTP driver
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("channel_binding");
    _sql = neon(url.toString());
  }
  return _sql;
};

const isTransient = (err) =>
  err?.sourceError?.code === "ETIMEDOUT" ||
  err?.message?.includes("ETIMEDOUT") ||
  err?.message?.includes("fetch failed") ||
  err?.message?.includes("ECONNREFUSED");

async function withRetry(fn, retries = 4, delay = 3000) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0 || !isTransient(err)) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay * 1.5);
  }
}

// Lazily initialize the Neon connection on first query (after env vars are loaded)
export const sql = (strings, ...values) =>
  withRetry(() => getSql()(strings, ...values));
