import express from "express";
import challengesRouter from "../routes/challenges.routes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in the environment variables.");
}

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get("/api", (req, res) => {
  res.send({
    message: "API is working!",
  });
});

app.use("/api/challenges", challengesRouter);

export default app;
