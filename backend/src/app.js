import express from "express";
import challengesRouter from "../routes/challenges.routes.js";

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.send({
    message: "API is working!",
  });
});

app.use("/api/challenges", challengesRouter);

export default app;
