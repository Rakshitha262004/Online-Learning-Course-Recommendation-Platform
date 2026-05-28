import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", interests: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const registerUser = async () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) { setError("Name, email and password are required."); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        interests: formData.interests.split(",").map((s) => s.trim()).filter(Boolean),
      });
      navigate("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",      label: "Full name",      type: "text",     placeholder: "Raksh Kumar" },
    { name: "email",     label: "Email address",  type: "email",    placeholder: "you@example.com" },
    { name: "password",  label: "Password",        type: "password", placeholder: "Min. 8 characters" },
    { name: "interests", label: "Interests",       type: "text",     placeholder: "AI, Cybersecurity, Web Dev",
      hint: "Comma-separated — used to personalise your recommendations" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandName}>Learn<span style={{ color: "var(--accent)" }}>Flow</span></span>
        </div>
        <h2 style={styles.heading}>Create account</h2>
        <p style={styles.sub}>Start your learning journey today</p>

        {error && <p style={styles.errorBox}>{error}</p>}

        {fields.map(({ name, label, type, placeholder, hint }) => (
          <div key={name}>
            <label style={styles.label}>{label}</label>
            <input style={styles.input} type={type} name={name}
              placeholder={placeholder} onChange={handleChange} />
            {hint && <p style={styles.hint}>{hint}</p>}
          </div>
        ))}

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={registerUser} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/" style={styles.link}>Sign in</a>
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
    background: "var(--code-bg)", color: "var(--text-h)", outline: "none", display: "block" },
  hint: { fontSize: 12, color: "var(--text)", marginTop: 5, opacity: 0.8 },
  btn: { marginTop: 20, width: "100%", height: 42, background: "var(--accent)",
    color: "#fff", border: "none", borderRadius: 8, fontSize: 14,
    fontWeight: 600, cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "var(--text)" },
  link: { color: "var(--accent)", fontWeight: 500, textDecoration: "none" },
  errorBox: { background: "var(--accent-bg)", color: "var(--text-h)",
    border: "1px solid var(--accent-border)", borderRadius: 8,
    padding: "8px 12px", fontSize: 13, marginBottom: 12 },
};

export default Register;