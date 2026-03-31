import { useState, useCallback } from "react";
import { parseTaskAI } from "../services/api";
import toast from "react-hot-toast";
import VoiceButton from "./VoiceButton";

export default function TaskInput({ onTaskAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (inputText) => {
    const value = (inputText || text).trim();
    if (!value) {
      toast.error("Please enter a task first.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("AI is parsing your task...");
    try {
      const res = await parseTaskAI(value);
      toast.success(`Task added: "${res.data.title}"`, { id: toastId });
      setText("");
      onTaskAdded();
    } catch {
      toast.error("Failed to parse task. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Called when voice recognition returns a transcript
  const handleVoiceResult = useCallback((transcript) => {
    setText(transcript);
    toast("Heard: \"" + transcript + "\"", {
      icon: "🎤",
      style: {
        background: "#1a1a1a", color: "#e8e8e8",
        border: "0.5px solid #1D9E75", fontSize: "12px",
        fontFamily: "DM Sans, sans-serif"
      }
    });
    // Auto-submit after a short delay so user can see what was heard
    setTimeout(() => handleSubmit(transcript), 800);
  }, []);

  return (
    <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #2a2a2a" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder='Type or speak your task…'
          disabled={loading}
          style={{
            flex: 1, background: "#1a1a1a", border: "0.5px solid #2a2a2a",
            borderRadius: "6px", padding: "10px 14px", color: "#e8e8e8",
            fontSize: "13px", fontFamily: "DM Sans, sans-serif", outline: "none"
          }}
        />
        <VoiceButton onResult={handleVoiceResult} />
        <button
          onClick={() => handleSubmit()}
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