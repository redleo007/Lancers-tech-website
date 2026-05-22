import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, enum: [1, 2, 3, 5, 8, 13, 21], required: true },
  },
  { timestamps: true, _id: false }
);

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  risk: { type: String, enum: ["low", "medium", "high"], default: "low" },
  complexity: { type: Number, min: 1, max: 10, default: 3 },
  votes: [voteSchema],
  revealed: { type: Boolean, default: false },
  finalPoints: Number,
});

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    stories: [storySchema],
    notes: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
