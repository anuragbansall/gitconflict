import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).slice(0, -1);

dotenv.config({ path: join(__dirname, "../.env.local") });
dotenv.config({ path: join(__dirname, ".env") });

const sql = neon(process.env.DATABASE_URL);
const challengesDir = join(__dirname, "challenges");

async function seed() {
  const dirs = [
    "abort-the-merge",
    "delete-merged-branch",
    "embarrassing-commit-message",
    "implement-the-feature",
    "leaked-secrets",
    "merge-the-feature",
    "resolve-merge-conflict",
    "start-a-new-feature",
    "undo-debugging",
  ];

  let count = 0;
  for (const dir of dirs) {
    const verifyPath = join(challengesDir, dir, "verify.js");
    let verifyJs;
    try {
      verifyJs = await readFile(verifyPath, "utf-8");
    } catch {
      console.warn(`  ⚠ Skipping ${dir}: no verify.js`);
      continue;
    }

    const result = await sql`
      UPDATE challenges SET verify_js = ${verifyJs} WHERE id = ${dir}
    `;
    if (result.count === 0) {
      console.warn(`  ⚠ No row found for id=${dir}`);
    } else {
      count++;
      console.log(`  ✓ ${dir}`);
    }
  }

  console.log(`\nSeeded verify_js for ${count} challenges.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
