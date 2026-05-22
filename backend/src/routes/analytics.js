import { Router } from "express";
import Project from "../models/Project.js";
import Session from "../models/Session.js";
import { authRequired } from "../middleware/auth.js";
import { computeAnalytics } from "../utils/analytics.js";

const router = Router();

router.get("/:projectId", authRequired, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "members",
      "name role"
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    const sessions = await Session.find({ project: project.id });
    res.json(computeAnalytics(project, sessions));
  } catch (e) {
    next(e);
  }
});

export default router;
