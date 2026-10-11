import { sql } from "../src/db.js";

// container_name column is reused to store the sandbox directory path
export const addSession = async (sessionId, session) => {
  await sql`
    INSERT INTO sessions (id, container_name, challenge_id, user_id)
    VALUES (${sessionId}, ${session.sandboxDir}, ${session.challengeId}, ${session.userId ?? null})
  `;
};

export const getSession = async (sessionId) => {
  const rows = await sql`SELECT * FROM sessions WHERE id = ${sessionId}`;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    sandboxDir: row.container_name,
    challengeId: row.challenge_id,
    userId: row.user_id,
  };
};

export const getSessionByChallengeId = async (challengeId) => {
  const rows = await sql`SELECT * FROM sessions WHERE challenge_id = ${challengeId} LIMIT 1`;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    sandboxDir: row.container_name,
    challengeId: row.challenge_id,
    userId: row.user_id,
  };
};

export const removeSession = async (sessionId) => {
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
};
