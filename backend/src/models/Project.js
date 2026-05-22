import mongoose from "mongoose";

const kanbanCardSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    assignee: String,
    points: { type: Number, default: 0 },
    status: { type: String, enum: ["todo", "inprogress", "review", "done"], default: "todo" },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sprintLengthDays: { type: Number, default: 14 },
    kanban: [kanbanCardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
