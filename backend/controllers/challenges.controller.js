import { randomUUID } from "crypto";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import {
  addSession,
  getSession,
  removeSession,
} from "../services/session.service.js";
import {
  copyFileToContainer,
  createContainer,
  executeCommandInContainer,
  removeContainer,
} from "../services/docker.service.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).slice(0, -1);
const challengesDir = join(__dirname, "../challenges");

export const getAllChallenges = async (req, res) => {
  try {
    const challengeDirs = await readdir(challengesDir);
    const challenges = [];

    for (const dir of challengeDirs) {
      const metadataPath = join(challengesDir, dir, "metadata.json");
      try {
        const metadata = await readFile(metadataPath, "utf-8");
        challenges.push(JSON.parse(metadata));
      } catch (error) {
        console.error(`Error reading metadata for ${dir}:`, error);
      }
    }

    res.status(200).json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const metadataPath = join(challengesDir, challengeId, "metadata.json");

    const metadata = await readFile(metadataPath, "utf-8");
    const challenge = JSON.parse(metadata);

    res.status(200).json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(404).json({ error: "Challenge not found" });
  }
};

export const startChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const sessionId = randomUUID();
    const containerName = `git-sandbox-${sessionId}`;

    const containerId = await createContainer(containerName);

    await copyFileToContainer(
      containerName,
      `./challenges/${challengeId}/repo`,
      "/workspace",
    );

    addSession(sessionId, {
      containerName,
      challengeId,
    });

    res.status(200).json({
      message: "Challenge started successfully",
      sessionId,
      containerId,
      containerName,
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

    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const { containerName, challengeId } = session;

    const output = await executeCommandInContainer(containerName, command);

    res.status(200).json({
      message: "Command executed successfully",
      output,
    });
  } catch (error) {
    console.error("Error executing command:", error);
    res.status(500).json({ error: "Failed to execute command" });
  }
};

export const stopChallenge = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    await removeContainer(session.containerName);

    removeSession(sessionId);

    res.status(200).json({
      message: "Challenge stopped successfully",
    });
  } catch (error) {
    console.error("Error stopping challenge:", error);
    res.status(500).json({ error: "Failed to stop challenge" });
  }
};

export const verifyChallenge = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const { containerName, challengeId } = session;

    const { default: verifier } = await import(
      `../challenges/${challengeId}/verify.js`
    );

    const result = await verifier((command) =>
      executeCommandInContainer(containerName, command),
    );

    res.json(result);
  } catch (error) {
    console.error("Error verifying challenge:", error);
    res.status(500).json({ error: "Failed to verify challenge" });
  }
};
