import Task from "../models/Task.js";
import { calculatePriority } from "../utils/priorityEngine.js";

export const createTask = async (req, res) => {
  try {
    const data = { ...req.body, user: req.user._id };
    data.priorityScore = calculatePriority(data);
    const task = await Task.create(data);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ priorityScore: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const allTasks = await Task.find({ user: req.user._id });

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const dailyData = last7.map(date => {
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const start = new Date(date); start.setHours(0,0,0,0);
      const end   = new Date(date); end.setHours(23,59,59,999);
      return {
        day: dayStr,
        created:   allTasks.filter(t => new Date(t.createdAt) >= start && new Date(t.createdAt) <= end).length,
        completed: allTasks.filter(t => t.status === "done" && new Date(t.updatedAt) >= start && new Date(t.updatedAt) <= end).length,
      };
    });

    const priorityData = ["high", "medium", "low"].map(p => ({
      priority: p,
      count: allTasks.filter(t => t.priority === p).length,
      done:  allTasks.filter(t => t.priority === p && t.status === "done").length,
    }));

    res.json({
      dailyData,
      priorityData,
      totalDone:    allTasks.filter(t => t.status === "done").length,
      totalPending: allTasks.filter(t => t.status === "pending").length,
      avgScore:     allTasks.length ? Math.round(allTasks.reduce((a, t) => a + (t.priorityScore || 0), 0) / allTasks.length) : 0,
      totalHours:   allTasks.filter(t => t.status === "done").reduce((a, t) => a + (t.estimatedTime || 0), 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};