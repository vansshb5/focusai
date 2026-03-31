import Task from "../models/Task.js";
import { calculatePriority } from "../utils/priorityEngine.js";

export const createTask = async (req, res) => {
  try {
    const data = req.body;
    data.priorityScore = calculatePriority(data);
    const task = await Task.create(data);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priorityScore: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getStats = async (req, res) => {
  try {
    const allTasks = await Task.find();

    // Tasks completed per day (last 7 days)
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const dailyData = last7.map(date => {
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const start = new Date(date); start.setHours(0,0,0,0);
      const end   = new Date(date); end.setHours(23,59,59,999);

      const created = allTasks.filter(t =>
        new Date(t.createdAt) >= start && new Date(t.createdAt) <= end
      ).length;

      const completed = allTasks.filter(t =>
        t.status === "done" &&
        new Date(t.updatedAt) >= start &&
        new Date(t.updatedAt) <= end
      ).length;

      return { day: dayStr, created, completed };
    });

    // Priority breakdown
    const priorityData = ["high", "medium", "low"].map(p => ({
      priority: p,
      count: allTasks.filter(t => t.priority === p).length,
      done: allTasks.filter(t => t.priority === p && t.status === "done").length,
    }));

    // Overall stats
    const totalDone = allTasks.filter(t => t.status === "done").length;
    const totalPending = allTasks.filter(t => t.status === "pending").length;
    const avgScore = allTasks.length
      ? Math.round(allTasks.reduce((a, t) => a + (t.priorityScore || 0), 0) / allTasks.length)
      : 0;
    const totalHours = allTasks
      .filter(t => t.status === "done")
      .reduce((a, t) => a + (t.estimatedTime || 0), 0);

    res.json({ dailyData, priorityData, totalDone, totalPending, avgScore, totalHours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};