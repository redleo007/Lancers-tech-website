import { Router } from "express";
import Session from "../models/Session.js";
import { authRequired } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.post("/", authRequired, requireRole("Admin", "TeamLeader"), async (req, res, next) => {
  try {
    const { title, project, stories = [] } = req.body;
    const session = await Session.create({
      title,
      project,
      createdBy: req.user.id,
      stories,
      participants: [req.user.id],
    });
    res.status(201).json({ session });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("participants", "name email role avatarColor")
      .populate("createdBy", "name email");
    if (!session) return res.status(404).json({ message: "Not found" });
    res.json({ session });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/vote", authRequired, async (req, res, next) => {
  try {
    const { storyIndex, value } = req.body;
    if (![1, 2, 3, 5, 8, 13, 21].includes(value)) {
      return res.status(400).json({ message: "Invalid card value" });
    }
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Not found" });
    const story = session.stories[storyIndex];
    if (!story) return res.status(400).json({ message: "Invalid story" });

    story.votes = story.votes.filter((v) => v.user.toString() !== req.user.id);
    story.votes.push({ user: req.user.id, value });
    await session.save();

    req.app.get("io").to(`session:${session.id}`).emit("session:voteCast", {
      sessionId: session.id,
      storyIndex,
      voter: req.user.id,
    });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/:id/reveal",
  authRequired,
  requireRole("Admin", "TeamLeader"),
  async (req, res, next) => {
    try {
      const { storyIndex } = req.body;
      const session = await Session.findById(req.params.id);
      if (!session) return res.status(404).json({ message: "Not found" });
      const story = session.stories[storyIndex];
      if (!story) return res.status(400).json({ message: "Invalid story" });
      story.revealed = true;
      const avg =
        story.votes.reduce((s, v) => s + v.value, 0) / Math.max(story.votes.length, 1);
      const fib = [1, 2, 3, 5, 8, 13, 21];
      story.finalPoints = fib.reduce((p, c) =>
        Math.abs(c - avg) < Math.abs(p - avg) ? c : p
      );
      await session.save();

      req.app.get("io").to(`session:${session.id}`).emit("session:reveal", {
        sessionId: session.id,
        storyIndex,
        votes: story.votes,
        finalPoints: story.finalPoints,
      });

      res.json({ story });
    } catch (e) {
      next(e);
    }
  }
);

router.put("/:id/notes", authRequired, async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { notes: req.body.notes || "" },
      { new: true }
    );
    req.app.get("io").to(`session:${session.id}`).emit("notes:update", {
      sessionId: session.id,
      content: session.notes,
    });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
