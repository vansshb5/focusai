import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:         { type: String, required: true },
  deadline:      { type: Date },
  priority:      { type: String, enum: ["low", "medium", "high"], default: "medium" },
  priorityScore: { type: Number, default: 0 },
  estimatedTime: { type: Number, default: 1 },
  status:        { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
  aiParsed:      { type: Boolean, default: false },
  rawInput:      { type: String },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);