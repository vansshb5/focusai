import { useState } from "react";
import { registerUser, loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const field = {
  width: "100%", background: "#1a1a1a", border: "0.5px solid #2a2a2a",
  borderRadius: "6px", padding: "11px 14px", color: "#e8e8e8",
  fontSize: "13px", fontFamily: "DM Sans, sans-serif", outline: "none",
  marginBottom: "10px", boxSizing: "border-box"
};

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = mode === "register"
        ? await registerUser({ name, email, password })
        : await loginUser({ email, password });

      login(res.data, res.data.token);
      toast.success(mode === "register" ? `Welcome, ${res.data.name}!` : `Welcome back, ${res.data.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0e0e0e"
    }}>
      <div style={{
        width: "100%", maxWidth: "380px", padding: "0 20px"
      }}>

        {/* Logo */}
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: "20px",
          fontWeight: 700, color: "#1D9E75", letterSpacing: "0.08em",
          marginBottom: "8px"
        }}>
          FOCUS<span style={{ color: "#e8e8e8" }}>AI</span>
        </div>
        <div style={{ fontSize: "13px", color: "#444", marginBottom: "32px" }}>
          {mode === "login" ? "Sign in to your workspace" : "Create your workspace"}
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", marginBottom: "24px",
          border: "0.5px solid #2a2a2a", borderRadius: "6px", overflow: "hidden"
        }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "9px", border: "none", cursor: "pointer",
                background: mode === m ? "#0F6E56" : "transparent",
                color: mode === m ? "#fff" : "#444",
                fontFamily: "Space Mono, monospace", fontSize: "10px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "all 0.15s"
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Form */}
        {mode === "register" && (
          <input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={field}
          />
        )}
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={field}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={field}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#0a4a38" : "#0F6E56",
            border: "none", color: "#fff", borderRadius: "6px",
            padding: "12px", fontSize: "12px", marginTop: "4px",
            fontFamily: "Space Mono, monospace", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em", transition: "all 0.15s"
          }}
        >
          {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#444" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{ color: "#1D9E75", cursor: "pointer" }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </span>
        </div>

      </div>
    </div>
  );
}