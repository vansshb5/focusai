import { useState, useEffect, useRef } from "react";
import { getTasks, getDailyPlan, getDailyReview } from "./services/api";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Planner from "./components/Planner";

const s = {
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px", borderBottom: "0.5px solid #2a2a2a", background: "#0e0e0e"
  },
  logo: { fontFamily: "Space Mono, monospace", fontSize: "13px", fontWeight: 700, color: "#1D9E75", letterSpacing: "0.08em" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 100px)" },
  panel: { borderRight: "0.5px solid #1e1e1e" },
  sectionHeader: {
    padding: "10px 20px", borderBottom: "0.5px solid #1e1e1e",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  },
  label: { fontFamily: "Space Mono, monospace", fontSize: "10px", color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" },
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "0.5px solid #1e1e1e" },
  statCell: { padding: "12px 16px", borderRight: "0.5px solid #1e1e1e", textAlign: "center" },
  statNum: { fontFamily: "Space Mono, monospace", fontSize: "22px", fontWeight: 700, color: "#e8e8e8" },
  statLabel: { fontSize: "10px", color: "#444", marginTop: "4px", letterSpacing: "0.05em" },
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [plan, setPlan] = useState([]);
  const [review, setReview] = useState(null);
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState("");
  const intervalRef = useRef(null);

  const fetchAll = async () => {
    const [t, p] = await Promise.all([getTasks(), getDailyPlan()]);
    setTasks(t.data);
    setPlan(p.data);
  };

  const fetchReview = async () => {
    const r = await getDailyReview();
    setReview(r.data);
  };

  useEffect(() => {
    fetchAll();
    const updateClock = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`);
    };
    updateClock();
    const cl = setInterval(updateClock, 10000);
    return () => clearInterval(cl);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(s => {
          if (s <= 1) { setRunning(false); clearInterval(intervalRef.current); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const done = tasks.filter(t => t.status === "done").length;
  const score = tasks.length ? Math.round(50 + (done / tasks.length) * 50) : 50;
  const focusHours = tasks.filter(t => t.status === "done").reduce((a, t) => a + (t.estimatedTime || 0), 0);
  const mm = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const ss = String(timerSecs % 60).padStart(2, "0");
  const focusTask = plan[0];

  return (
    <div>
      <div style={s.topbar}>
        <div style={s.logo}>FOCUS<span style={{ color: "#e8e8e8" }}>AI</span></div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "12px", color: "#444" }}>{time}</span>
          <span style={{
            background: "#0a2e22", color: "#1D9E75", fontSize: "11px",
            fontFamily: "Space Mono, monospace", padding: "3px 10px", borderRadius: "20px"
          }}>
            Score: {score}
          </span>
        </div>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCell}>
          <div style={s.statNum}>{tasks.length}</div>
          <div style={s.statLabel}>tasks today</div>
        </div>
        <div style={s.statCell}>
          <div style={s.statNum}>{done}</div>
          <div style={s.statLabel}>completed</div>
        </div>
        <div style={{ ...s.statCell, borderRight: "none" }}>
          <div style={s.statNum}>{focusHours.toFixed(1)}</div>
          <div style={s.statLabel}>focus hours</div>
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.panel}>
          <div style={s.sectionHeader}>
            <span style={s.label}>task input</span>
            <span style={{ ...s.label, color: "#1D9E75" }}>AI parsed</span>
          </div>
          <TaskInput onTaskAdded={fetchAll} />
          <div style={s.sectionHeader}>
            <span style={s.label}>all tasks</span>
            <span style={s.label}>{tasks.length} total</span>
          </div>
          <TaskList tasks={tasks} onUpdate={fetchAll} />
          <div style={{ padding: "12px 20px", display: "flex", gap: "8px", borderTop: "0.5px solid #1e1e1e" }}>
            <button onClick={fetchReview} style={{
              background: "#0F6E56", border: "none", color: "#fff", borderRadius: "4px",
              padding: "7px 14px", fontSize: "11px", fontFamily: "Space Mono, monospace",
              cursor: "pointer", letterSpacing: "0.03em"
            }}>
              AI daily review
            </button>
          </div>
          {review && (
            <div style={{ padding: "12px 20px", borderTop: "0.5px solid #1e1e1e" }}>
              <div style={{ fontSize: "10px", color: "#1D9E75", fontFamily: "Space Mono, monospace", marginBottom: "6px" }}>
                DAILY REVIEW
              </div>
              <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.6 }}>
                Completed: {review.completedCount} · Missed: {review.missedCount}<br />
                Score: {review.productivityScore}/100<br />
                {review.suggestion}
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #1e1e1e", background: "#111" }}>
            <div style={{ ...s.label, marginBottom: "8px" }}>active focus session</div>
            <div style={{ fontSize: "13px", color: "#e8e8e8", fontWeight: 500, marginBottom: "10px" }}>
              {focusTask ? focusTask.title : "No tasks scheduled"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{
                fontFamily: "Space Mono, monospace", fontSize: "28px",
                fontWeight: 700, color: "#1D9E75"
              }}>
                {mm}:{ss}
              </span>
              <button
                onClick={() => setRunning(r => !r)}
                style={{
                  background: running ? "#0F6E56" : "transparent",
                  border: "0.5px solid #2a2a2a", color: "#e8e8e8",
                  borderRadius: "4px", padding: "6px 12px",
                  fontSize: "11px", fontFamily: "Space Mono, monospace", cursor: "pointer"
                }}
              >
                {running ? "PAUSE" : "START"}
              </button>
              <button
                onClick={() => { setRunning(false); setTimerSecs(25 * 60); }}
                style={{
                  background: "transparent", border: "0.5px solid #2a2a2a", color: "#555",
                  borderRadius: "4px", padding: "6px 12px",
                  fontSize: "11px", fontFamily: "Space Mono, monospace", cursor: "pointer"
                }}
              >
                RESET
              </button>
            </div>
            <div style={{ marginTop: "8px", background: "#1a1a1a", height: "2px", borderRadius: "2px" }}>
              <div style={{
                height: "100%", background: "#1D9E75", borderRadius: "2px",
                width: `${Math.round((1 - timerSecs / (25 * 60)) * 100)}%`,
                transition: "width 1s linear"
              }} />
            </div>
          </div>

          <div style={s.sectionHeader}>
            <span style={s.label}>today's plan</span>
            <span style={{ ...s.label, color: "#1D9E75" }}>AI scheduled</span>
          </div>
          <Planner plan={plan} />
        </div>
      </div>
    </div>
  );
}