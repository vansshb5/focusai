import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  generatedPlan: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);