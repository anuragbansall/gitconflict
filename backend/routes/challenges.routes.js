import express from "express";
import {
  executeCommand,
  getAllChallenges,
  getChallengeById,
  startChallenge,
  stopChallenge,
  verifyChallenge,
} from "../controllers/challenges.controller.js";

const challengesRouter = express.Router();

// Get all challenges
challengesRouter.get("/", getAllChallenges);

// Get a specific challenge by ID
challengesRouter.get("/:challengeId", getChallengeById);

// Start challenge (Create a new container for the challenge)
challengesRouter.post("/start/:challengeId", startChallenge);

// Execute command in the challenge container
challengesRouter.post("/execute/:sessionId", executeCommand);

// Stop challenge (Remove the container)
challengesRouter.delete("/stop/:sessionId", stopChallenge);

// Verify challenge (Check if the challenge is completed successfully)
challengesRouter.post("/verify/:sessionId", verifyChallenge);

export default challengesRouter;
