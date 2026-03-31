import { updateTask, deleteTask } from "../services/api";
import toast from "react-hot-toast";

const priorityColors = {
  high:   { bg: "#2a1010", text: "#E24B4A" },
  medium: { bg: "#2a1e08", text: "#BA7517" },
  low:    { bg: "#0a1f18", text: "#1D9E75" },
};

const getDeadlineBadge = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return { label: "OVERDUE",     color: "#E24B4A", bg: "#2a1010" };
  if (diff === 0) return { label: "DUE TODAY",  color: "#BA7517", bg: "#2a1e08" };
  if (diff === 1) return { label: "TOMORROW",   color: "#BA7517", bg: "#2a1e08" };
  return { label: `${diff}d left`, color: "#555", bg: "transparent" };
};

export default function TaskList({ tasks, filter, onUpdate }) {
  const filtered = tasks.filter(task => {
    if (filter === "all")    return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "done")    return task.status === "done";
    if (filter === "high")    return task.priority === "high" && task.status !== "done";
    return true;
  });

  const toggleDone = async (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await updateTask(task._id, { status: newStatus });
    toast.success(newStatus === "done" ? `"${task.title}" completed!` : `"${task.title}" reopened`);
    onUpdate();
  };

  const handleDelete = async (task) => {
    await deleteTask(task._id);
    toast.error(`"${task.title}" deleted`);
    onUpdate();
  };

  if (!filtered.length) return (
    <div style={{ padding: "30px 20px", textAlign: "center", color: "#444", fontSize: "13px" }}>
      {tasks.length === 0 ? "No tasks yet. Add one above." : "No tasks match this filter."}
    </div>
  );

  return (
    <div style={{ overflowY: "auto", maxHeight: "340px" }}>
      {filtered.map(task => {
        const done = task.status === "done";
        const p = priorityColors[task.priority] || priorityColors.medium;
        const badge = getDeadlineBadge(task.deadline);
        return (
          <div
            key={task._id}
            style={{
              padding: "10px 20px", borderBottom: "0.5px solid #1e1e1e",
              display: "flex", alignItems: "flex-start", gap: "10px",
              opacity: done ? 0.4 : 1, transition: "opacity 0.2s"
            }}
          >
            <div
              onClick={() => toggleDone(task)}
              style={{
                width: "16px", height: "16px", borderRadius: "3px",
                border: done ? "none" : "0.5px solid #444",
                background: done ? "#0F6E56" : "transparent",
                flexShrink: 0, marginTop: "2px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              {done && <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✓</span>}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "13px", color: "#e8e8e8",
                textDecoration: done ? "line-through" : "none"
              }}>
                {task.title}
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{
                  fontSize: "10px", padding: "2px 6px", borderRadius: "3px",
                  background: p.bg, color: p.text, fontFamily: "Space Mono, monospace"
                }}>
                  {task.priority}
                </span>
                <span style={{
                  fontSize: "10px", padding: "2px 6px", borderRadius: "3px",
                  background: "#1a1a1a", color: "#666", fontFamily: "Space Mono, monospace"
                }}>
                  {task.estimatedTime}h
                </span>
                {badge && (
                  <span style={{
                    fontSize: "10px", padding: "2px 6px", borderRadius: "3px",
                    background: badge.bg, color: badge.color,
                    fontFamily: "Space Mono, monospace"
                  }}>
                    {badge.label}
                  </span>
                )}
                {task.aiParsed && (
                  <span style={{ fontSize: "10px", color: "#1D9E75" }}>AI</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontFamily: "Space Mono, monospace", fontSize: "10px",
                color: "#1D9E75", fontWeight: "700"
              }}>
                {task.priorityScore}
              </span>
              <button
                onClick={() => handleDelete(task)}
                style={{
                  background: "none", border: "none", color: "#333",
                  cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px"
                }}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}