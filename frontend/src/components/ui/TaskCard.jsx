import { motion } from "framer-motion";
import { updateTask, deleteTask } from "../../services/api";
import toast from "react-hot-toast";

const priorityColors = {
  high:   { bg: "rgba(226,75,74,0.12)",  text: "#E24B4A", glow: "rgba(226,75,74,0.3)" },
  medium: { bg: "rgba(186,117,23,0.12)", text: "#BA7517", glow: "rgba(186,117,23,0.3)" },
  low:    { bg: "rgba(29,158,117,0.12)", text: "#1D9E75", glow: "rgba(29,158,117,0.3)" },
};

const getDeadlineBadge = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return { label: "OVERDUE",    color: "#E24B4A" };
  if (diff === 0) return { label: "DUE TODAY",  color: "#BA7517" };
  if (diff === 1) return { label: "TOMORROW",   color: "#BA7517" };
  return { label: `${diff}d left`, color: "#555" };
};

export default function TaskCard({ task, index, onUpdate }) {
  const done = task.status === "done";
  const p    = priorityColors[task.priority] || priorityColors.medium;
  const badge = getDeadlineBadge(task.deadline);

  const toggle = async () => {
    await updateTask(task._id, { status: done ? "pending" : "done" });
    toast.success(done ? `Reopened` : `✓ Completed!`);
    onUpdate();
  };

  const remove = async () => {
    await deleteTask(task._id);
    toast.error(`Deleted`);
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      style={{
        padding: "12px 16px",
        background: done ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        borderLeft: `2px solid ${done ? "#2a2a2a" : p.text}`,
        borderRadius: "8px",
        marginBottom: "8px",
        display: "flex", alignItems: "flex-start", gap: "10px",
        opacity: done ? 0.45 : 1,
        transition: "opacity 0.2s",
        cursor: "pointer",
        boxShadow: done ? "none" : `0 0 12px ${p.glow}`,
      }}
    >
      {/* Checkbox */}
      <motion.div
        onClick={toggle}
        whileTap={{ scale: 0.85 }}
        style={{
          width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
          marginTop: "2px", cursor: "pointer",
          background: done ? "#1D9E75" : "transparent",
          border: done ? "none" : `0.5px solid ${p.text}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: done ? "0 0 8px rgba(29,158,117,0.4)" : "none"
        }}
      >
        {done && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ color: "#fff", fontSize: "9px", lineHeight: 1 }}
          >
            ✓
          </motion.span>
        )}
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px", color: done ? "#555" : "#e8e8e8",
          textDecoration: done ? "line-through" : "none",
          fontFamily: "DM Sans, sans-serif", lineHeight: 1.4
        }}>
          {task.title}
        </div>
        <div style={{
          display: "flex", gap: "6px", marginTop: "5px",
          flexWrap: "wrap", alignItems: "center"
        }}>
          <span style={{
            fontSize: "9px", padding: "2px 7px", borderRadius: "20px",
            background: p.bg, color: p.text,
            fontFamily: "Space Mono, monospace", border: `0.5px solid ${p.text}40`
          }}>
            {task.priority}
          </span>
          <span style={{
            fontSize: "9px", padding: "2px 7px", borderRadius: "20px",
            background: "rgba(255,255,255,0.04)", color: "#555",
            fontFamily: "Space Mono, monospace",
            border: "0.5px solid rgba(255,255,255,0.06)"
          }}>
            {task.estimatedTime}h
          </span>
          {badge && (
            <span style={{
              fontSize: "9px", color: badge.color,
              fontFamily: "Space Mono, monospace"
            }}>
              {badge.label}
            </span>
          )}
          {task.aiParsed && (
            <span style={{ fontSize: "9px", color: "#1D9E75", opacity: 0.6 }}>AI</span>
          )}
        </div>
      </div>

      {/* Score + delete */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
        <span style={{
          fontFamily: "Space Mono, monospace", fontSize: "11px",
          color: p.text, fontWeight: 700,
          textShadow: `0 0 8px ${p.glow}`
        }}>
          {task.priorityScore}
        </span>
        <motion.button
          onClick={remove}
          whileHover={{ color: "#E24B4A" }}
          style={{
            background: "none", border: "none", color: "#2a2a2a",
            cursor: "pointer", fontSize: "14px", lineHeight: 1,
            transition: "color 0.15s"
          }}
        >
          ×
        </motion.button>
      </div>
    </motion.div>
  );
}