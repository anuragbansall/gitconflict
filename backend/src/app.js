import express from "express";
import challengesRouter from "../routes/challenges.routes.js";
import usersRouter from "../routes/users.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).slice(0, -1);

// Load Neon credentials from root .env.local, then local .env overrides
dotenv.config({ path: join(__dirname, "../../.env.local") });
dotenv.config({ path: join(__dirname, "../.env") });

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
app.use("/api/users", usersRouter);

export default app;
