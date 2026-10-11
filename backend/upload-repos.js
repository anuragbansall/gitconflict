import { readFile, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const execAsync = promisify(exec);
const __dirname = fileURLToPath(new URL(".", import.meta.url)).slice(0, -1);

dotenv.config({ path: join(__dirname, "../.env.local") });
dotenv.config({ path: join(__dirname, ".env") });

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = "challenge-repos";
const challengesDir = join(__dirname, "challenges");

const CHALLENGE_IDS = [
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

async function uploadRepo(challengeId) {
  const repoDir = join(challengesDir, challengeId);
  const tmpDir = await mkdtemp(join(tmpdir(), "gitchallenge-"));
  const tarPath = join(tmpDir, `${challengeId}.tar.gz`);

  try {
    // Create tar.gz of the repo/ directory, preserving .git
    await execAsync(`tar czf "${tarPath}" -C "${repoDir}" repo`);

    const content = await readFile(tarPath);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${challengeId}.tar.gz`,
        Body: content,
        ContentType: "application/gzip",
      }),
    );

    console.log(`  ✓ ${challengeId} (${(content.length / 1024).toFixed(1)} KB)`);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

async function upload() {
  console.log(`Uploading ${CHALLENGE_IDS.length} challenge repos to ${BUCKET}...`);
  for (const id of CHALLENGE_IDS) {
    await uploadRepo(id);
  }
  console.log("\nDone!");
}

upload().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
