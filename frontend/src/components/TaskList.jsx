import { AnimatePresence } from "framer-motion";
import TaskCard from "./ui/TaskCard";

export default function TaskList({ tasks, filter, onUpdate }) {
  const filtered = tasks.filter(task => {
    if (filter === "all")     return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "done")    return task.status === "done";
    if (filter === "high")    return task.priority === "high" && task.status !== "done";
    return true;
  });

  if (!filtered.length) return (
    <div style={{
      padding: "30px 20px", textAlign: "center",
      color: "#333", fontSize: "12px",
      fontFamily: "Space Mono, monospace"
    }}>
      {tasks.length === 0 ? "NO TASKS YET" : "NO TASKS MATCH"}
    </div>
  );

  return (
    <div style={{ padding: "12px 16px", overflowY: "auto", maxHeight: "360px" }}>
      <AnimatePresence>
        {filtered.map((task, i) => (
          <TaskCard key={task._id} task={task} index={i} onUpdate={onUpdate} />
        ))}
      </AnimatePresence>
    </div>
  );
}