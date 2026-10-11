import express from "express";
import {
  executeCommand,
  getAllChallenges,
  getChallengeById,
  getUserProgress,
  startChallenge,
  stopChallenge,
  verifyChallenge,
} from "../controllers/challenges.controller.js";
import { extractUser, requireAuth } from "../middleware/auth.middleware.js";

const challengesRouter = express.Router();

// Get all challenges
challengesRouter.get("/", getAllChallenges);

// Get authenticated user's progress
challengesRouter.get("/progress", extractUser, requireAuth, getUserProgress);

// Get a specific challenge by ID
challengesRouter.get("/:challengeId", getChallengeById);

// Start challenge (Create a new container for the challenge)
challengesRouter.post("/start/:challengeId", extractUser, requireAuth, startChallenge);

// Execute command in the challenge container
challengesRouter.post("/execute/:sessionId", extractUser, requireAuth, executeCommand);

// Stop challenge (Remove the container)
challengesRouter.delete("/stop/:sessionId", extractUser, requireAuth, stopChallenge);

// Verify challenge (Check if the challenge is completed successfully)
challengesRouter.post("/verify/:sessionId", extractUser, requireAuth, verifyChallenge);

export default challengesRouter;
