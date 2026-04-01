import { Routes, Route, useNavigate } from "react-router-dom";
import Focus from "./pages/Focus";
import { useState, useEffect, useRef } from "react";
import { getTasks, getDailyPlan, getDailyReview, getStats } from "./services/api";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Planner from "./components/Planner";
import Analytics from "./components/Analytics";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
const styles = {
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
  const { user, logout, loading } = useAuth();

if (loading) return (
  <div style={{
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0e0e0e",
    fontFamily: "Space Mono, monospace", color: "#1D9E75", fontSize: "12px"
  }}>
    LOADING...
  </div>
);

if (!user) return <AuthPage />;
  const [tasks, setTasks]       = useState([]);
  const [plan, setPlan]         = useState([]);
  const [review, setReview]     = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [filter, setFilter]     = useState("all");
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [running, setRunning]   = useState(false);
  const [time, setTime]         = useState("");
  const intervalRef             = useRef(null);

  const fetchAll = async () => {
    try {
      const [t, p, st] = await Promise.all([getTasks(), getDailyPlan(), getStats()]);
      setTasks(t.data);
      setPlan(p.data);
      setStatsData(st.data);
    } catch (err) {
      toast.error("Failed to load data.");
    }
  };

  const fetchReview = async () => {
    const toastId = toast.loading("Generating your daily review...");
    try {
      const r = await getDailyReview();
      setReview(r.data);
      toast.success(`Productivity score: ${r.data.productivityScore}/100`, { id: toastId });
    } catch {
      toast.error("Failed to generate review.", { id: toastId });
    }
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
        setTimerSecs(prev => {
          if (prev <= 1) { setRunning(false); clearInterval(intervalRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const done       = tasks.filter(t => t.status === "done").length;
  const score      = tasks.length ? Math.round(50 + (done / tasks.length) * 50) : 50;
  const focusHours = tasks.filter(t => t.status === "done").reduce((a, t) => a + (t.estimatedTime || 0), 0);
  const mm         = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const ss         = String(timerSecs % 60).padStart(2, "0");
  const focusTask  = plan[0];

  return (
    <div>
      <div style={styles.topbar}>
        <div style={styles.logo}>FOCUS<span style={{ color: "#e8e8e8" }}>AI</span></div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
  <span style={{ fontFamily: "Space Mono, monospace", fontSize: "12px", color: "#444" }}>{time}</span>
  <span style={{
    background: "#0a2e22", color: "#1D9E75", fontSize: "11px",
    fontFamily: "Space Mono, monospace", padding: "3px 10px", borderRadius: "20px"
  }}>
    Score: {score}
  </span>
  <span style={{ fontSize: "12px", color: "#555" }}>{user.name}</span>
  <button
    onClick={() => { logout(); toast.success("Signed out."); }}
    style={{
      background: "transparent", border: "0.5px solid #2a2a2a",
      color: "#444", borderRadius: "4px", padding: "4px 10px",
      fontSize: "10px", fontFamily: "Space Mono, monospace",
      cursor: "pointer", letterSpacing: "0.05em"
    }}
  >
    LOGOUT
  </button>
</div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCell}>
          <div style={styles.statNum}>{tasks.length}</div>
          <div style={styles.statLabel}>tasks today</div>
        </div>
        <div style={styles.statCell}>
          <div style={styles.statNum}>{done}</div>
          <div style={styles.statLabel}>completed</div>
        </div>
        <div style={{ ...styles.statCell, borderRight: "none" }}>
          <div style={styles.statNum}>{focusHours.toFixed(1)}</div>
          <div style={styles.statLabel}>focus hours</div>
        </div>
      </div>

      <div style={styles.grid}>

        {/* LEFT PANEL */}
        <div style={styles.panel}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "0.5px solid #1e1e1e" }}>
            {["tasks", "analytics"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "11px", background: "transparent", border: "none",
                  borderBottom: activeTab === tab ? "2px solid #1D9E75" : "2px solid transparent",
                  color: activeTab === tab ? "#1D9E75" : "#444", cursor: "pointer",
                  fontFamily: "Space Mono, monospace", fontSize: "10px",
                  letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "tasks" ? (
            <>
              <div style={styles.sectionHeader}>
                <span style={styles.label}>task input</span>
                <span style={{ ...styles.label, color: "#1D9E75" }}>AI parsed</span>
              </div>
              <TaskInput onTaskAdded={fetchAll} />

              <div style={{
                padding: "10px 20px", borderBottom: "0.5px solid #1e1e1e",
                display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap"
              }}>
                {["all", "pending", "done", "high"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "4px 10px", borderRadius: "4px", cursor: "pointer",
                      fontSize: "10px", fontFamily: "Space Mono, monospace",
                      letterSpacing: "0.05em", border: "0.5px solid",
                      borderColor: filter === f ? "#1D9E75" : "#2a2a2a",
                      background: filter === f ? "#0a2e22" : "transparent",
                      color: filter === f ? "#1D9E75" : "#444",
                      transition: "all 0.15s"
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              <TaskList tasks={tasks} filter={filter} onUpdate={fetchAll} />

              <div style={{ padding: "12px 20px", borderTop: "0.5px solid #1e1e1e" }}>
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
            </>
          ) : (
            <Analytics stats={statsData} />
          )}
        </div>

        {/* RIGHT PANEL */}
        <div>
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #1e1e1e", background: "#111" }}>
            <div style={{ ...styles.label, marginBottom: "8px" }}>active focus session</div>
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

          <div style={styles.sectionHeader}>
            <span style={styles.label}>today's plan</span>
            <span style={{ ...styles.label, color: "#1D9E75" }}>AI scheduled</span>
          </div>
          <Planner plan={plan} />
        </div>

      </div>
    </div>
  );
}