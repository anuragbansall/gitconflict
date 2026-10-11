import express from "express";
import {
  getMyProfile,
  getPublicProfile,
  updateMyProfile,
  presignAvatar,
  updateAvatar,
} from "../controllers/users.controller.js";
import { extractUser, requireAuth } from "../middleware/auth.middleware.js";

const usersRouter = express.Router();

usersRouter.get("/me", extractUser, requireAuth, getMyProfile);
usersRouter.patch("/profile", extractUser, requireAuth, updateMyProfile);
usersRouter.post("/avatar/presign", extractUser, requireAuth, presignAvatar);
usersRouter.patch("/avatar", extractUser, requireAuth, updateAvatar);
// :username must come last to avoid shadowing "me", "profile", "avatar"
usersRouter.get("/:username", getPublicProfile);

export default usersRouter;
