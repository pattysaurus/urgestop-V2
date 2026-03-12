"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a1628 0%, #0f2040 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%", maxWidth: 420,
    background: "#152b52", border: "1px solid #1e3d6e",
    borderRadius: 20, overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  header: {
    background: "linear-gradient(135deg, #0f2040, #1a3a5c)",
    padding: "36px 32px 28px", textAlign: "center",
  },
  logo: {
    fontFamily: "Georgia, serif", fontSize: "2.2rem",
    color: "#2dd4bf", letterSpacing: "-0.02em", marginBottom: 8,
  },
  tagline: { fontSize: "0.88rem", color: "#7a9bc4", lineHeight: 1.6 },
  body: { padding: "28px 32px 32px" },
  tabs: { display: "flex", marginBottom: 24, borderBottom: "1px solid #1e3d6e" },
  tab: (active: boolean): React.CSSProperties => ({
    flex: 1, background: "transparent", border: "none",
    color: active ? "#2dd4bf" : "#7a9bc4",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "0.85rem", fontWeight: 600, padding: "10px",
    cursor: "pointer", borderBottom: active ? "2px solid #2dd4bf" : "2px solid transparent",
    transition: "all 0.2s",
  }),
  label: {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "#7a9bc4", marginBottom: 6,
  },
  input: {
    width: "100%", background: "#0f2040", border: "1px solid #1e3d6e",
    borderRadius: 10, color: "#e2eaf6",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "0.95rem", padding: "12px 16px", outline: "none",
    transition: "border-color 0.2s", marginBottom: 16,
  },
  btn: {
    width: "100%", background: "linear-gradient(135deg, #1a8a7a, #2dd4bf)",
    color: "#0a1628", border: "none",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "0.95rem", fontWeight: 700, padding: "14px",
    borderRadius: 12, cursor: "pointer", marginTop: 4,
    boxShadow: "0 4px 20px rgba(45,212,191,0.3)",
    transition: "transform 0.15s",
  },
  error: {
    background: "rgba(251,113,133,0.1)", border: "1px solid #fb7185",
    borderRadius: 10, padding: "12px 14px", marginBottom: 16,
    fontSize: "0.83rem", color: "#fb7185",
  },
  success: {
    background: "rgba(45,212,191,0.1)", border: "1px solid #2dd4bf",
    borderRadius: 10, padding: "12px 14px", marginBottom: 16,
    fontSize: "0.83rem", color: "#2dd4bf",
  },
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    setError(""); setSuccess(""); setLoading(true);
    if (!email || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }

    if (mode === "signup") {
      const { error: e } = await supabase.auth.signUp({ email, password });
      if (e) setError(e.message);
      else setSuccess("Account created! Check your email to confirm, or log in now.");
    } else {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) setError(e.message === "Invalid login credentials" ? "Wrong email or password." : e.message);
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.logo}>🌊 UrgeStop</div>
          <div style={S.tagline}>
            A safe space for addiction recovery.<br />
            Evidence-based · Private · Always here.
          </div>
        </div>
        <div style={S.body}>
          <div style={S.tabs}>
            <button style={S.tab(mode === "login")} onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>Log In</button>
            <button style={S.tab(mode === "signup")} onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>Sign Up</button>
          </div>

          {error && <div style={S.error}>⚠️ {error}</div>}
          {success && <div style={S.success}>✓ {success}</div>}

          <div>
            <label style={S.label}>Email address</label>
            <input
              style={S.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handle()}
              onFocus={e => (e.currentTarget.style.borderColor = "#2dd4bf")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e3d6e")}
            />
          </div>
          <div>
            <label style={S.label}>Password</label>
            <input
              style={S.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handle()}
              onFocus={e => (e.currentTarget.style.borderColor = "#2dd4bf")}
              onBlur={e => (e.currentTarget.style.borderColor = "#1e3d6e")}
            />
          </div>

          <button
            style={S.btn} onClick={handle} disabled={loading}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#7a9bc4", marginTop: 20, lineHeight: 1.6 }}>
            Your data is private and encrypted.<br />
            We will never sell your information.
          </p>
        </div>
      </div>
    </div>
  );
}
