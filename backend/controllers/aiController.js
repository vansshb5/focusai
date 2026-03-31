import { parseTaskWithGrok } from "../services/grokService.js";
import { generateDailyPlan } from "../services/plannerService.js";
import Task from "../models/Task.js";
import { calculatePriority } from "../utils/priorityEngine.js";

const resolveDeadline = (deadline) => {
  if (!deadline) return null;

  const d = new Date(deadline);
  if (!isNaN(d)) return d;

  const lower = deadline.toLowerCase().trim();
  const today = new Date();

  if (lower === "today") return today;

  if (lower === "tomorrow") {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t;
  }

  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const dayIndex = days.indexOf(lower);
  if (dayIndex !== -1) {
    const result = new Date();
    const diff = (dayIndex - result.getDay() + 7) % 7 || 7;
    result.setDate(result.getDate() + diff);
    return result;
  }

  return null;
};

export const parseTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const parsed = await parseTaskWithGrok(text);
    parsed.deadline = resolveDeadline(parsed.deadline);
    parsed.priorityScore = calculatePriority(parsed);
    parsed.aiParsed = true;
    parsed.rawInput = text;

    const task = await Task.create(parsed);
    res.status(201).json(task);
  } catch (err) {
    console.error("Grok error:", err.message);
    res.status(500).json({ error: "AI parsing failed", detail: err.message });
  }
};

export const getDailyPlan = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "done" } }).sort({ priorityScore: -1 });
    const plan = generateDailyPlan(tasks);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDailyReview = async (req, res) => {
  try {
    const completed = await Task.find({ status: "done" });
    const missed = await Task.find({ status: "pending", deadline: { $lt: new Date() } });

    res.json({
      completedCount: completed.length,
      missedCount: missed.length,
      completed: completed.map(t => t.title),
      missed: missed.map(t => t.title),
      productivityScore: Math.min(100, Math.round(
        (completed.length / (completed.length + missed.length || 1)) * 100
      )),
      suggestion: missed.length > 0
        ? "You have overdue tasks. Consider breaking them into smaller chunks."
        : "Great job! All tasks completed on time."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};