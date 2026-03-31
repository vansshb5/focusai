import { useState } from "react";
import { parseTaskAI } from "../services/api";

export default function TaskInput({ onTaskAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      await parseTaskAI(text);
      setText("");
      onTaskAdded();
    } catch (err) {
      setError("Failed to parse task. Try again.");
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
      {error && <p style={{ color: "#E24B4A", fontSize: "11px", marginTop: "6px" }}>{error}</p>}
      {loading && (
        <p style={{ color: "#1D9E75", fontSize: "11px", marginTop: "6px", fontStyle: "italic" }}>
          AI is parsing your task...
        </p>
      )}
    </div>
  );
}