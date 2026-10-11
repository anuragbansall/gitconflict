import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  addSession,
  getSession,
  getSessionByChallengeId,
  removeSession,
} from "../services/session.service.js";
import {
  createSandbox,
  executeCommandInSandbox,
  removeSandbox,
} from "../services/sandbox.service.js";
import { readRepoFiles } from "../utils/readRepoFiles.js";
import { sql } from "../src/db.js";

const execAsync = promisify(exec);

let _s3 = null;
const getS3 = () => {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return _s3;
};

const REPOS_BUCKET = "challenge-repos";

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function downloadAndExtractRepo(challengeId, destDir) {
  const response = await getS3().send(
    new GetObjectCommand({ Bucket: REPOS_BUCKET, Key: `${challengeId}.tar.gz` }),
  );
  const tarBuffer = await streamToBuffer(response.Body);
  const tarPath = join(destDir, `${challengeId}.tar.gz`);
  await writeFile(tarPath, tarBuffer);
  await execAsync(`tar xzf "${tarPath}" -C "${destDir}"`);
}

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await sql`
      SELECT id, title, description, difficulty, xp, estimated_time AS "estimatedTime",
             tags, what_you_will_learn AS "whatYouWillLearn"
      FROM challenges
      ORDER BY difficulty, xp
    `;
    res.status(200).json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const session = await getSessionByChallengeId(challengeId);

    const rows = await sql`
      SELECT id, title, description, difficulty, xp, estimated_time AS "estimatedTime",
             tags, what_you_will_learn AS "whatYouWillLearn", hints, solution, story
      FROM challenges
      WHERE id = ${challengeId}
    `;

    if (!rows[0]) return res.status(404).json({ error: "Challenge not found" });

    const { hints, solution, story, ...challenge } = rows[0];

    let repo;
    if (session?.sandboxDir) {
      try {
        repo = await readRepoFiles(join(session.sandboxDir, "repo"));
      } catch {
        // Sandbox expired (server restarted) — fall through to S3
      }
    }

    if (!repo) {
      const tmpDir = await mkdtemp(join(tmpdir(), "gitchallenge-"));
      try {
        await downloadAndExtractRepo(challengeId, tmpDir);
        repo = await readRepoFiles(join(tmpDir, "repo"));
      } finally {
        await rm(tmpDir, { recursive: true, force: true });
      }
    }

    res.status(200).json({ challenge, hints, solution, story, repo });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(404).json({ error: "Challenge not found" });
  }
};

export const startChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const sessionId = randomUUID();

    const sandboxDir = await createSandbox();
    await downloadAndExtractRepo(challengeId, sandboxDir);

    await addSession(sessionId, {
      sandboxDir,
      challengeId,
      userId: req.userId ?? null,
    });

    res.status(200).json({
      message: "Challenge started successfully",
      sessionId,
      challengeId,
    });
  } catch (error) {
    console.error("Error starting challenge:", error);
    res.status(500).json({ error: "Failed to start challenge" });
  }
};

export const executeCommand = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: "Command is required" });
    }

    if (!/^git(\s|$)/.test(command.trim())) {
      return res.status(400).json({ error: "Only git commands are allowed." });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const output = await executeCommandInSandbox(session.sandboxDir, command);

    res.status(200).json({ message: "Command executed successfully", output });
  } catch (error) {
    console.error("Error executing command:", error);
    res.status(500).json({ error: "Failed to execute command" });
  }
};

export const stopChallenge = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await removeSandbox(session.sandboxDir);
    await removeSession(sessionId);

    res.status(200).json({ message: "Challenge stopped successfully" });
  } catch (error) {
    console.error("Error stopping challenge:", error);
    res.status(500).json({ error: "Failed to stop challenge" });
  }
};

export const verifyChallenge = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { sandboxDir, challengeId, userId } = session;

    const rows = await sql`SELECT verify_js FROM challenges WHERE id = ${challengeId}`;
    if (!rows[0]?.verify_js) {
      return res.status(500).json({ error: "Verifier not found for this challenge" });
    }

    const tmpDir = await mkdtemp(join(tmpdir(), "gitverify-"));
    let verifier;
    try {
      const tmpFile = join(tmpDir, `verify-${challengeId}.mjs`);
      await writeFile(tmpFile, rows[0].verify_js, "utf-8");
      ({ default: verifier } = await import(pathToFileURL(tmpFile).href));
    } finally {
      await rm(tmpDir, { recursive: true, force: true });
    }

    const result = await verifier((command) =>
      executeCommandInSandbox(sandboxDir, command),
    );

    if (result.success && userId) {
      await sql`
        INSERT INTO user_progress (user_id, challenge_id)
        VALUES (${userId}, ${challengeId})
        ON CONFLICT (user_id, challenge_id) DO NOTHING
      `;
    }

    res.json(result);
  } catch (error) {
    console.error("Error verifying challenge:", error);
    res.status(500).json({ error: "Failed to verify challenge" });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const rows = await sql`
      SELECT challenge_id, completed_at FROM user_progress WHERE user_id = ${userId}
    `;
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};
