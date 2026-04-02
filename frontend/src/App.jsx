import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, getDailyPlan, getDailyReview, getStats } from "./services/api";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Planner from "./components/Planner";
import Analytics from "./components/Analytics";

import Focus from "./pages/Focus";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import Aurora from "./components/ui/Aurora";
import Sidebar from "./components/ui/Sidebar";
import GlassCard from "./components/ui/GlassCard";
import GlitchText from "./components/ui/GlitchText";
import CountUp from "./components/ui/CountUp";
import toast from "react-hot-toast";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [tasks, setTasks]           = useState([]);
  const [plan, setPlan]             = useState([]);
  const [review, setReview]         = useState(null);
  const [statsData, setStatsData]   = useState(null);
  const [activeTab, setActiveTab]   = useState("tasks");
  const [filter, setFilter]         = useState("all");
  const [timerSecs, setTimerSecs]   = useState(25 * 60);
  const [running, setRunning]       = useState(false);
  const [time, setTime]             = useState("");
  const intervalRef                 = useRef(null);

  const fetchAll = async () => {
    try {
      const [t, p, st] = await Promise.all([getTasks(), getDailyPlan(), getStats()]);
      setTasks(t.data);
      setPlan(p.data);
      setStatsData(st.data);
    } catch { toast.error("Failed to load data."); }
  };

  const fetchReview = async () => {
    const id = toast.loading("Generating review...");
    try {
      const r = await getDailyReview();
      setReview(r.data);
      toast.success(`Score: ${r.data.productivityScore}/100`, { id });
    } catch { toast.error("Failed.", { id }); }
  };

  useEffect(() => {
    if (user) fetchAll();
    const tick = () => {
      const n = new Date();
      setTime(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`);
    };
    tick();
    const cl = setInterval(tick, 10000);
    return () => clearInterval(cl);
  }, [user]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(p => {
          if (p <= 1) { setRunning(false); return 0; }
          return p - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Space Mono, monospace", color: "#1D9E75", fontSize: "12px",
      letterSpacing: "0.2em"
    }}>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        LOADING...
      </motion.div>
    </div>
  );

  if (!user) return (
    <>
      <Aurora />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AuthPage />
      </div>
    </>
  );

  const done       = tasks.filter(t => t.status === "done").length;
  const score      = tasks.length ? Math.round(50 + (done / tasks.length) * 50) : 50;
  const focusHours = tasks.filter(t => t.status === "done").reduce((a, t) => a + (t.estimatedTime || 0), 0);
  const mm         = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const ss         = String(timerSecs % 60).padStart(2, "0");
  const focusTask  = plan[0];

  const Dashboard = (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginLeft: "56px", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}
    >
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px"
      }}>
        <div>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: "11px",
            color: "#444", letterSpacing: "0.15em", marginBottom: "4px"
          }}>
            {time} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <h1 style={{
            fontFamily: "Space Mono, monospace", fontSize: "22px",
            fontWeight: 700, color: "#e8e8e8", margin: 0
          }}>
            <GlitchText text={`Hey, ${user.name}`} />
          </h1>
        </div>
        <div style={{
          background: "rgba(29,158,117,0.1)", border: "0.5px solid rgba(29,158,117,0.3)",
          borderRadius: "20px", padding: "6px 16px",
          fontFamily: "Space Mono, monospace", fontSize: "11px", color: "#1D9E75",
          boxShadow: "0 0 16px rgba(29,158,117,0.15)"
        }}>
          SCORE: {score}
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "TASKS TODAY",   value: tasks.length,      decimals: 0, suffix: "" },
          { label: "COMPLETED",     value: done,              decimals: 0, suffix: "" },
          { label: "FOCUS HOURS",   value: focusHours,        decimals: 1, suffix: "h" },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.1} style={{ padding: "16px 20px" }}>
            <div style={{
              fontFamily: "Space Mono, monospace", fontSize: "28px",
              fontWeight: 700, color: "#e8e8e8", lineHeight: 1,
              textShadow: "0 0 20px rgba(29,158,117,0.3)"
            }}>
              <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: "9px", color: "#444", marginTop: "6px", letterSpacing: "0.1em" }}>
              {s.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <GlassCard delay={0.2} hover={false}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              {["tasks", "analytics"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: "12px", background: "transparent", border: "none",
                  borderBottom: activeTab === tab ? "2px solid #1D9E75" : "2px solid transparent",
                  color: activeTab === tab ? "#1D9E75" : "#444", cursor: "pointer",
                  fontFamily: "Space Mono, monospace", fontSize: "10px",
                  letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s"
                }}>
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "tasks" ? (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ padding: "16px 16px 0" }}>
                    <TaskInput onTaskAdded={fetchAll} />
                  </div>
             
                  <div style={{
                    padding: "8px 16px",
                    display: "flex", gap: "6px", flexWrap: "wrap"
                  }}>
                    {["all", "pending", "done", "high"].map(f => (
                      <button key={f} onClick={() => setFilter(f)} style={{
                        padding: "3px 10px", borderRadius: "20px", cursor: "pointer",
                        fontSize: "9px", fontFamily: "Space Mono, monospace",
                        letterSpacing: "0.05em", border: "0.5px solid",
                        borderColor: filter === f ? "#1D9E75" : "rgba(255,255,255,0.08)",
                        background: filter === f ? "rgba(29,158,117,0.12)" : "transparent",
                        color: filter === f ? "#1D9E75" : "#444", transition: "all 0.15s"
                      }}>
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <TaskList tasks={tasks} filter={filter} onUpdate={fetchAll} />
                  <div style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
                    <button onClick={fetchReview} style={{
                      background: "rgba(29,158,117,0.12)",
                      border: "0.5px solid rgba(29,158,117,0.3)",
                      color: "#1D9E75", borderRadius: "6px",
                      padding: "8px 16px", fontSize: "10px",
                      fontFamily: "Space Mono, monospace", cursor: "pointer",
                      letterSpacing: "0.05em",
                      boxShadow: "0 0 12px rgba(29,158,117,0.1)"
                    }}>
                      AI DAILY REVIEW
                    </button>
                  </div>
                  {review && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
                    >
                      <div style={{ fontSize: "9px", color: "#1D9E75", fontFamily: "Space Mono, monospace", marginBottom: "6px" }}>
                        DAILY REVIEW
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>
                        Completed: {review.completedCount} · Missed: {review.missedCount}<br />
                        Score: {review.productivityScore}/100<br />
                        {review.suggestion}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Analytics stats={statsData} />
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Pomodoro */}
          <GlassCard delay={0.3} hover={false} style={{ padding: "20px" }}>
            <div style={{ fontSize: "9px", color: "#444", fontFamily: "Space Mono, monospace", letterSpacing: "0.12em", marginBottom: "10px" }}>
              ACTIVE FOCUS SESSION
            </div>
            <div style={{ fontSize: "13px", color: "#888", fontFamily: "DM Sans, sans-serif", marginBottom: "16px", minHeight: "20px" }}>
              {focusTask ? focusTask.title : "No tasks scheduled"}
            </div>
            <motion.div
              animate={{ textShadow: running ? ["0 0 8px rgba(29,158,117,0.4)", "0 0 24px rgba(29,158,117,0.8)", "0 0 8px rgba(29,158,117,0.4)"] : "none" }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                fontFamily: "Space Mono, monospace", fontSize: "48px",
                fontWeight: 700, color: "#1D9E75", letterSpacing: "0.04em",
                lineHeight: 1, marginBottom: "16px"
              }}
            >
              {mm}:{ss}
            </motion.div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setRunning(r => !r)}
                style={{
                  background: running ? "rgba(29,158,117,0.2)" : "transparent",
                  border: `0.5px solid ${running ? "rgba(29,158,117,0.5)" : "rgba(255,255,255,0.1)"}`,
                  color: "#e8e8e8", borderRadius: "6px", padding: "8px 20px",
                  fontSize: "10px", fontFamily: "Space Mono, monospace",
                  cursor: "pointer", letterSpacing: "0.08em",
                  boxShadow: running ? "0 0 16px rgba(29,158,117,0.2)" : "none"
                }}
              >
                {running ? "PAUSE" : "START"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setRunning(false); setTimerSecs(25 * 60); }}
                style={{
                  background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)",
                  color: "#444", borderRadius: "6px", padding: "8px 16px",
                  fontSize: "10px", fontFamily: "Space Mono, monospace", cursor: "pointer"
                }}
              >
                RESET
              </motion.button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", height: "2px", borderRadius: "2px" }}>
              <motion.div
                animate={{ width: `${Math.round((1 - timerSecs / (25 * 60)) * 100)}%` }}
                transition={{ duration: 1, ease: "linear" }}
                style={{
                  height: "100%", background: "#1D9E75", borderRadius: "2px",
                  boxShadow: "0 0 8px rgba(29,158,117,0.6)"
                }}
              />
            </div>
          </GlassCard>

          {/* Today's plan */}
          <GlassCard delay={0.4} hover={false}>
            <div style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              display: "flex", justifyContent: "space-between"
            }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "9px", color: "#444", letterSpacing: "0.12em" }}>TODAY'S PLAN</span>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "9px", color: "#1D9E75", letterSpacing: "0.08em" }}>AI SCHEDULED</span>
            </div>
            <Planner plan={plan} />
          </GlassCard>

        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Aurora />
      <div style={{ background: "#050505", minHeight: "100vh", position: "relative" }}>
        <Sidebar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"      element={Dashboard} />
            <Route path="/focus" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ marginLeft: "56px", position: "relative", zIndex: 1 }}
              >
                <Focus />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}