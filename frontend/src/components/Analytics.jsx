import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a1a1a", border: "0.5px solid #2a2a2a",
      borderRadius: "6px", padding: "8px 12px", fontSize: "11px",
      fontFamily: "Space Mono, monospace"
    }}>
      <p style={{ color: "#888", marginBottom: "4px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, color }) => (
  <div style={{
    background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "6px",
    padding: "14px 16px", flex: 1, minWidth: 0
  }}>
    <div style={{
      fontFamily: "Space Mono, monospace", fontSize: "24px",
      fontWeight: 700, color: color || "#e8e8e8", lineHeight: 1
    }}>
      {value}
    </div>
    <div style={{ fontSize: "10px", color: "#444", marginTop: "4px", letterSpacing: "0.05em" }}>
      {label}
    </div>
    {sub && <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{sub}</div>}
  </div>
);

export default function Analytics({ stats }) {
  if (!stats) return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: "#444", fontSize: "13px" }}>
      Loading analytics...
    </div>
  );

  const { dailyData, priorityData, totalDone, totalPending, avgScore, totalHours } = stats;
  const completionRate = totalDone + totalPending > 0
    ? Math.round((totalDone / (totalDone + totalPending)) * 100)
    : 0;

  return (
    <div style={{ padding: "20px" }}>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard label="TASKS DONE"       value={totalDone}           color="#1D9E75" />
        <StatCard label="COMPLETION RATE"  value={`${completionRate}%`} color="#1D9E75" />
        <StatCard label="AVG PRIORITY SCORE" value={avgScore}          color="#BA7517" />
        <StatCard label="FOCUS HOURS"      value={`${totalHours.toFixed(1)}h`} color="#7F77DD" />
      </div>

      {/* Daily activity chart */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "10px",
          color: "#444", letterSpacing: "0.1em", marginBottom: "14px"
        }}>
          DAILY ACTIVITY — LAST 7 DAYS
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyData} barGap={4} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              tick={{ fill: "#444", fontSize: 10, fontFamily: "Space Mono, monospace" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "#444", fontSize: 10, fontFamily: "Space Mono, monospace" }}
              axisLine={false} tickLine={false} allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="created"   name="created"   fill="#2a2a2a" radius={[3,3,0,0]} />
            <Bar dataKey="completed" name="completed" fill="#0F6E56" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          {[["#0F6E56","completed"],["#2a2a2a","created"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
              <span style={{ fontSize: "10px", color: "#444", fontFamily: "Space Mono, monospace" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority breakdown */}
      <div>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "10px",
          color: "#444", letterSpacing: "0.1em", marginBottom: "14px"
        }}>
          PRIORITY BREAKDOWN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {priorityData.map(({ priority, count, done }) => {
            const pct = count > 0 ? Math.round((done / count) * 100) : 0;
            const colors = { high: "#E24B4A", medium: "#BA7517", low: "#1D9E75" };
            const color = colors[priority];
            return (
              <div key={priority}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: "4px", alignItems: "center"
                }}>
                  <span style={{
                    fontFamily: "Space Mono, monospace", fontSize: "10px", color
                  }}>
                    {priority.toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: "Space Mono, monospace", fontSize: "10px", color: "#444"
                  }}>
                    {done}/{count} done · {pct}%
                  </span>
                </div>
                <div style={{
                  background: "#1a1a1a", height: "4px", borderRadius: "2px", overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%", background: color, borderRadius: "2px",
                    width: `${pct}%`, transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}