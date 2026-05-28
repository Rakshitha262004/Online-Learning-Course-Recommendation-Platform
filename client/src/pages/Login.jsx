import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandName}>Learn<span style={{ color: "var(--accent)" }}>Flow</span></span>
        </div>
        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.sub}>Sign in to continue learning</p>

        {error && <p style={styles.errorBox}>{error}</p>}

        <label style={styles.label}>Email address</label>
        <input style={styles.input} type="email" placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)} />

        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)} />

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={loginUser} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>Create one</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "var(--bg)", padding: "2rem" },
  card: { width: "100%", maxWidth: 420, background: "var(--bg)",
    border: "1px solid var(--border)", borderRadius: 16, padding: "2.5rem" },
  brand: { marginBottom: "2rem" },
  brandName: { fontSize: 20, fontWeight: 700, color: "var(--text-h)" },
  heading: { fontSize: 22, marginBottom: 4, color: "var(--text-h)" },
  sub: { fontSize: 14, color: "var(--text)", marginBottom: "1.75rem" },
  label: { display: "block", fontSize: 13, fontWeight: 500,
    color: "var(--text)", marginBottom: 6, marginTop: 14 },
  input: { width: "100%", height: 40, border: "1px solid var(--border)",
    borderRadius: 8, padding: "0 12px", fontSize: 14,
    background: "var(--code-bg)", color: "var(--text-h)",
    outline: "none", display: "block" },
  btn: { marginTop: 20, width: "100%", height: 42,
    background: "var(--accent)", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 14,
    fontWeight: 600, cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "var(--text)" },
  link: { color: "var(--accent)", fontWeight: 500, textDecoration: "none" },
  errorBox: { background: "var(--accent-bg)", color: "var(--text-h)",
    border: "1px solid var(--accent-border)", borderRadius: 8,
    padding: "8px 12px", fontSize: 13, marginBottom: 12 },
};

export default Login;