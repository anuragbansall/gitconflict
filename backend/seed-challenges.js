import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).slice(0, -1);

dotenv.config({ path: join(__dirname, "../.env.local") });
dotenv.config({ path: join(__dirname, ".env") });

const sql = neon(process.env.DATABASE_URL);
const challengesDir = join(__dirname, "challenges");

async function readOptional(path) {
  return readFile(path, "utf-8").catch(() => null);
}

async function seed() {
  const dirs = await readdir(challengesDir);
  let count = 0;

  for (const dir of dirs) {
    const base = join(challengesDir, dir);
    let meta;
    try {
      meta = JSON.parse(await readFile(join(base, "metadata.json"), "utf-8"));
    } catch {
      console.warn(`Skipping ${dir}: no metadata.json`);
      continue;
    }

    const hints = await readOptional(join(base, "hints.md"));
    const solution = await readOptional(join(base, "solution.md"));
    const story = await readOptional(join(base, "story.md"));

    await sql`
      INSERT INTO challenges
        (id, title, description, difficulty, xp, estimated_time, tags, what_you_will_learn, hints, solution, story)
      VALUES
        (${meta.id}, ${meta.title}, ${meta.description}, ${meta.difficulty}, ${meta.xp},
         ${meta.estimatedTime ?? null}, ${meta.tags ?? []}, ${meta.whatYouWillLearn ?? []},
         ${hints}, ${solution}, ${story})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        difficulty = EXCLUDED.difficulty,
        xp = EXCLUDED.xp,
        estimated_time = EXCLUDED.estimated_time,
        tags = EXCLUDED.tags,
        what_you_will_learn = EXCLUDED.what_you_will_learn,
        hints = EXCLUDED.hints,
        solution = EXCLUDED.solution,
        story = EXCLUDED.story
    `;
    count++;
    console.log(`  ✓ ${meta.id}`);
  }

  console.log(`\nSeeded ${count} challenges.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
