import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/api";

export default function Focus() {
  const navigate = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [current, setCurrent]   = useState(0);
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [running, setRunning]   = useState(false);
  const [mode, setMode]         = useState("work"); // "work" | "break"
  const intervalRef             = useRef(null);

  useEffect(() => {
    getTasks().then(r => setTasks(r.data.filter(t => t.status !== "done")));
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "work") {
              setMode("break");
              setTimerSecs(5 * 60);
            } else {
              setMode("work");
              setTimerSecs(25 * 60);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const mm  = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const ss  = String(timerSecs % 60).padStart(2, "0");
  const pct = Math.round((1 - timerSecs / (mode === "work" ? 25 * 60 : 5 * 60)) * 100);
  const task = tasks[current];

  const reset = () => {
    setRunning(false);
    setMode("work");
    setTimerSecs(25 * 60);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0e0e0e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "DM Sans, sans-serif"
    }}>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "20px", left: "20px",
          background: "transparent", border: "0.5px solid #2a2a2a",
          color: "#444", borderRadius: "4px", padding: "6px 12px",
          fontSize: "11px", fontFamily: "Space Mono, monospace",
          cursor: "pointer", letterSpacing: "0.05em"
        }}
      >
        ← BACK
      </button>

      {/* Mode badge */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: "10px",
        letterSpacing: "0.15em", color: mode === "work" ? "#1D9E75" : "#7F77DD",
        marginBottom: "16px"
      }}>
        {mode === "work" ? "FOCUS SESSION" : "BREAK TIME"}
      </div>

      {/* Current task */}
      <div style={{
        fontSize: "18px", fontWeight: 500, color: "#e8e8e8",
        marginBottom: "48px", textAlign: "center", maxWidth: "400px",
        minHeight: "28px"
      }}>
        {task ? task.title : "No tasks remaining"}
      </div>

      {/* Timer */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: "80px",
        fontWeight: 700, color: mode === "work" ? "#1D9E75" : "#7F77DD",
        letterSpacing: "0.04em", lineHeight: 1, marginBottom: "32px"
      }}>
        {mm}:{ss}
      </div>

      {/* Progress ring placeholder — bar */}
      <div style={{
        width: "300px", height: "3px", background: "#1a1a1a",
        borderRadius: "2px", marginBottom: "40px", overflow: "hidden"
      }}>
        <div style={{
          height: "100%", borderRadius: "2px",
          background: mode === "work" ? "#1D9E75" : "#7F77DD",
          width: `${pct}%`, transition: "width 1s linear"
        }} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "48px" }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            background: running
              ? (mode === "work" ? "#0F6E56" : "#534AB7")
              : "transparent",
            border: "0.5px solid #2a2a2a", color: "#e8e8e8",
            borderRadius: "6px", padding: "12px 28px",
            fontSize: "12px", fontFamily: "Space Mono, monospace",
            cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s"
          }}
        >
          {running ? "PAUSE" : "START"}
        </button>
        <button
          onClick={reset}
          style={{
            background: "transparent", border: "0.5px solid #2a2a2a",
            color: "#555", borderRadius: "6px", padding: "12px 20px",
            fontSize: "12px", fontFamily: "Space Mono, monospace",
            cursor: "pointer", letterSpacing: "0.08em"
          }}
        >
          RESET
        </button>
      </div>

      {/* Task switcher */}
      {tasks.length > 1 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              background: "transparent", border: "0.5px solid #2a2a2a",
              color: current === 0 ? "#2a2a2a" : "#555",
              borderRadius: "4px", padding: "6px 12px",
              fontSize: "11px", fontFamily: "Space Mono, monospace",
              cursor: current === 0 ? "not-allowed" : "pointer"
            }}
          >
            ←
          </button>
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "10px", color: "#444"
          }}>
            {current + 1} / {tasks.length}
          </span>
          <button
            onClick={() => setCurrent(c => Math.min(tasks.length - 1, c + 1))}
            disabled={current === tasks.length - 1}
            style={{
              background: "transparent", border: "0.5px solid #2a2a2a",
              color: current === tasks.length - 1 ? "#2a2a2a" : "#555",
              borderRadius: "4px", padding: "6px 12px",
              fontSize: "11px", fontFamily: "Space Mono, monospace",
              cursor: current === tasks.length - 1 ? "not-allowed" : "pointer"
            }}
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}