import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const NAV = [
  { path: "/",         icon: "⬡", label: "Dashboard"  },
  { path: "/focus",    icon: "◎", label: "Focus Mode"  },
  { path: "/plan",     icon: "▦", label: "Daily Plan"  },
  { path: "/analytics",icon: "▲", label: "Analytics"   },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.div
      animate={{ width: expanded ? 200 : 56 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(20px)",
        borderRight: "0.5px solid rgba(29,158,117,0.15)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", userSelect: "none"
      }}
    >
      {/* Logo */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: "18px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "10px",
          borderBottom: "0.5px solid rgba(255,255,255,0.05)"
        }}
      >
        <span style={{
          fontFamily: "Space Mono, monospace", fontSize: "16px",
          fontWeight: 700, color: "#1D9E75", flexShrink: 0
        }}>F</span>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{
                fontFamily: "Space Mono, monospace", fontSize: "13px",
                fontWeight: 700, color: "#e8e8e8", whiteSpace: "nowrap"
              }}
            >
              OCUS<span style={{ color: "#1D9E75" }}>AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "12px 0" }}>
        {NAV.map(item => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
                background: active ? "rgba(29,158,117,0.12)" : "transparent",
                borderLeft: active ? "2px solid #1D9E75" : "2px solid transparent",
                transition: "all 0.15s", position: "relative"
              }}
            >
              <span style={{
                fontSize: "16px", flexShrink: 0,
                color: active ? "#1D9E75" : "#444",
                transition: "color 0.15s"
              }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      fontFamily: "Space Mono, monospace", fontSize: "10px",
                      letterSpacing: "0.08em", whiteSpace: "nowrap",
                      color: active ? "#1D9E75" : "#555"
                    }}
                  >
                    {item.label.toUpperCase()}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* User + logout */}
      <div style={{
        padding: "12px 16px",
        borderTop: "0.5px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: "rgba(29,158,117,0.2)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", color: "#1D9E75", fontFamily: "Space Mono, monospace",
            fontWeight: 700
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <div style={{
                  fontSize: "11px", color: "#888", fontFamily: "DM Sans, sans-serif",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {user?.name}
                </div>
                <div
                  onClick={() => { logout(); toast.success("Signed out."); }}
                  style={{
                    fontSize: "9px", color: "#444", cursor: "pointer",
                    fontFamily: "Space Mono, monospace", letterSpacing: "0.05em",
                    marginTop: "2px"
                  }}
                >
                  LOGOUT
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}