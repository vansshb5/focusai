export const calculatePriority = (task) => {
  let score = 0;

  if (task.priority === "high") score += 50;
  else if (task.priority === "medium") score += 25;

  if (task.deadline) {
    const daysLeft = (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft <= 1) score += 40;
    else if (daysLeft <= 3) score += 25;
    else if (daysLeft <= 7) score += 10;
  }

  if (task.estimatedTime && task.estimatedTime <= 1) score += 10;

  return Math.min(score, 100);
};