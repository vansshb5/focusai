import { useState } from "react";
import { parseTaskAI } from "../services/api";
import toast from "react-hot-toast";

export default function TaskInput({ onTaskAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a task first.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("AI is parsing your task...");
    try {
      const res = await parseTaskAI(text);
      toast.success(`Task added: "${res.data.title}"`, { id: toastId });
      setText("");
      onTaskAdded();
    } catch (err) {
      toast.error("Failed to parse task. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #2a2a2a" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder='e.g. "Finish report by Friday, urgent"'
          style={{
            flex: 1, background: "#1a1a1a", border: "0.5px solid #2a2a2a",
            borderRadius: "6px", padding: "10px 14px", color: "#e8e8e8",
            fontSize: "13px", fontFamily: "DM Sans, sans-serif", outline: "none"
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? "#0a4a38" : "#0F6E56", border: "none",
            color: "#fff", borderRadius: "6px", padding: "10px 18px",
            fontSize: "12px", fontFamily: "Space Mono, monospace",
            fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em", whiteSpace: "nowrap"
          }}
        >
          {loading ? "PARSING..." : "+ ADD"}
        </button>
      </div>
    </div>
  );
}