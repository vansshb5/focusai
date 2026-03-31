export const generateDailyPlan = (tasks) => {
  return tasks
    .filter(t => t.status !== "done")
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5)
    .map((t, i) => ({
      order: i + 1,
      taskId: t._id,
      title: t.title,
      priority: t.priority,
      estimatedTime: t.estimatedTime,
      priorityScore: t.priorityScore
    }));
};