import { Router } from "express";
import Project from "../models/Project.js";
import { authRequired } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", authRequired, async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).populate("owner", "name email");
    res.json({ projects });
  } catch (e) {
    next(e);
  }
});

router.post("/", authRequired, requireRole("Admin", "TeamLeader"), async (req, res, next) => {
  try {
    const { name, description, members = [], sprintLengthDays } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members,
      sprintLengthDays,
    });
    res.status(201).json({ project });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("members", "name email role");
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json({ project });
  } catch (e) {
    next(e);
  }
});

router.put("/:id/kanban", authRequired, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { kanban: req.body.kanban || [] },
      { new: true }
    );
    req.app.get("io").to(`project:${req.params.id}`).emit("kanban:update", {
      projectId: req.params.id,
      kanban: project.kanban,
    });
    res.json({ project });
  } catch (e) {
    next(e);
  }
});

export default router;
