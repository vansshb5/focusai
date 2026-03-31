const levelColor = { high: "#E24B4A", medium: "#BA7517", low: "#1D9E75" };

const getTimeSlot = (index) => {
  const hours = [9, 10, 11, 13, 14];
  const h = hours[index] || 9 + index;
  return `${String(h).padStart(2, "0")}:00`;
};

export default function Planner({ plan }) {
  if (!plan.length) return (
    <div style={{ padding: "30px 20px", textAlign: "center", color: "#444", fontSize: "13px" }}>
      No plan yet. Add tasks to generate your schedule.
    </div>
  );

  return (
    <div>
      {plan.map((item, i) => (
        <div
          key={item.taskId}
          style={{
            padding: "10px 20px", borderBottom: "0.5px solid #1e1e1e",
            display: "flex", alignItems: "center", gap: "12px"
          }}
        >
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "10px",
            color: "#444", width: "42px", flexShrink: 0
          }}>
            {getTimeSlot(i)}
          </span>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: levelColor[item.priority] || "#1D9E75", flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", color: "#e8e8e8" }}>{item.title}</div>
            <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>
              {item.priority} priority · {item.estimatedTime}h
            </div>
          </div>
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "10px", color: "#1D9E75"
          }}>
            {item.priorityScore}
          </span>
        </div>
      ))}
    </div>
  );
}