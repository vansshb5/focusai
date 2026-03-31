import { updateTask, deleteTask } from "../services/api";

const priorityColors = {
  high: { bg: "#2a1010", text: "#E24B4A" },
  medium: { bg: "#2a1e08", text: "#BA7517" },
  low: { bg: "#0a1f18", text: "#1D9E75" },
};

export default function TaskList({ tasks, onUpdate }) {
  const toggleDone = async (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await updateTask(task._id, { status: newStatus });
    onUpdate();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    onUpdate();
  };

  if (!tasks.length) return (
    <div style={{ padding: "30px 20px", textAlign: "center", color: "#444", fontSize: "13px" }}>
      No tasks yet. Add one above.
    </div>
  );

  return (
    <div style={{ overflowY: "auto", maxHeight: "380px" }}>
      {tasks.map(task => {
        const done = task.status === "done";
        const p = priorityColors[task.priority] || priorityColors.medium;
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
                {task.deadline && (
                  <span style={{ fontSize: "10px", color: "#555" }}>
                    due {new Date(task.deadline).toLocaleDateString()}
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
                onClick={() => handleDelete(task._id)}
                style={{
                  background: "none", border: "none", color: "#333",
                  cursor: "pointer", fontSize: "14px", lineHeight: 1,
                  padding: "0 2px"
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