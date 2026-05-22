import { Router } from "express";
import User from "../models/User.js";
import { authRequired, signToken } from "../middleware/auth.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      role: ["Admin", "TeamLeader", "TeamMember"].includes(role) ? role : "TeamMember",
    });
    res.status(201).json({ user, token: signToken(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await user.comparePassword(password || ""))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user, token: signToken(user) });
  } catch (e) {
    next(e);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

export default router;
