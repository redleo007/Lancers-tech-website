import { Router } from "express";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, async (_req, res, next) => {
  try {
    const users = await User.find().select("name email role avatarColor");
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

export default router;
