import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BADGE_COLORS = {
  AI:            { bg: "rgba(29,158,117,0.1)",  color: "#085041" },
  Cybersecurity: { bg: "rgba(56,130,221,0.1)",  color: "#0C447C" },
  Data:          { bg: "rgba(186,117,23,0.1)",  color: "#633806" },
  Web:           { bg: "rgba(212,83,126,0.1)",  color: "#72243E" },
};

function CourseCard({ course }) {
  const badge = BADGE_COLORS[course.category] || BADGE_COLORS["AI"];
  return (
    <div style={cardStyles.card}>
      <span style={{ ...cardStyles.badge, background: badge.bg, color: badge.color }}>
        {course.category}
      </span>
      <h4 style={cardStyles.title}>{course.title}</h4>
      <p style={cardStyles.desc}>{course.description}</p>
      {course.instructor && (
        <div style={cardStyles.meta}>👤 {course.instructor}</div>
      )}
      {(course.duration || course.rating) && (
        <div style={cardStyles.meta}>
          {course.duration && <>⏱ {course.duration}</>}
          {course.duration && course.rating && <>&nbsp;&nbsp;</>}
          {course.rating && <>⭐ {course.rating}</>}
        </div>
      )}
      <button style={cardStyles.enrollBtn}>Enroll now</button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={cardStyles.card}>
      <div style={{ ...sk.block, width: 70, height: 22, borderRadius: 20, marginBottom: 10 }} />
      <div style={{ ...sk.block, width: "90%", height: 16, marginBottom: 8 }} />
      <div style={{ ...sk.block, width: "70%", height: 14, marginBottom: 6 }} />
      <div style={{ ...sk.block, width: "50%", height: 12, marginBottom: 6 }} />
      <div style={{ ...sk.block, width: "100%", height: 32, marginTop: 12, borderRadius: 8 }} />
    </div>
  );
}

const sk = {
  block: {
    background: "var(--border)",
    borderRadius: 4,
    animation: "pulse 1.3s ease-in-out infinite",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) { navigate("/"); return; }

    axios
      .get(`http://localhost:5000/api/recommend/${user._id}`)
      .then((res) => {
        // handle both { courses: [] } and plain array responses
        const data = Array.isArray(res.data) ? res.data : res.data.courses ?? [];
        setCourses(data);
      })
      .catch(() => setError("Failed to load recommendations. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];
  const visible = filter === "All" ? courses : courses.filter((c) => c.category === filter);
  const initials = user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={dash.header}>
          <span style={dash.brandName}>
            Learn<span style={{ color: "var(--accent)" }}>Flow</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={dash.avatar}>{initials}</div>
            <span style={{ fontSize: 14, color: "var(--text)" }}>{user?.name}</span>
            <button
              style={dash.logoutBtn}
              onClick={() => { localStorage.removeItem("user"); navigate("/"); }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={dash.statsRow}>
          {[
            ["Recommended", loading ? "…" : courses.length],
            ["In progress",  3],
            ["Completed",    1],
          ].map(([label, val]) => (
            <div key={label} style={dash.statCard}>
              <div style={dash.statLabel}>{label}</div>
              <div style={dash.statValue}>{val}</div>
            </div>
          ))}
        </div>

        {/* Section header + filters */}
        <div style={dash.sectionHead}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-h)" }}>
            Recommended for you
          </h3>

          {!loading && courses.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    ...dash.filterTab,
                    background: filter === cat ? "var(--accent)" : "transparent",
                    color: filter === cat ? "#fff" : "var(--text)",
                    borderColor: filter === cat ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={dash.errorBox}>
            ⚠️ {error}
            <button
              style={dash.retryBtn}
              onClick={() => {
                setError("");
                setLoading(true);
                axios
                  .get(`http://localhost:5000/api/recommend/${user._id}`)
                  .then((res) => {
                    const data = Array.isArray(res.data) ? res.data : res.data.courses ?? [];
                    setCourses(data);
                  })
                  .catch(() => setError("Failed again. Check your connection."))
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={dash.grid}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div style={dash.emptyState}>
            <p style={{ fontSize: 15, color: "var(--text-h)", fontWeight: 500 }}>
              No recommendations yet
            </p>
            <p style={{ fontSize: 13, color: "var(--text)", marginTop: 6 }}>
              Update your interests in your profile to get personalised course suggestions.
            </p>
          </div>
        )}

        {/* Empty filter state */}
        {!loading && !error && courses.length > 0 && visible.length === 0 && (
          <p style={{ fontSize: 14, color: "var(--text)", marginTop: 12 }}>
            No courses in this category.
          </p>
        )}

        {/* Course grid */}
        {!loading && !error && visible.length > 0 && (
          <div style={dash.grid}>
            {visible.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

      </div>
    </>
  );
}

const dash = {
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1.75rem",
  },
  brandName: { fontSize: 18, fontWeight: 700, color: "var(--text-h)" },
  avatar: {
    width: 30, height: 30, borderRadius: "50%", background: "var(--accent-bg)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 600, color: "var(--accent)",
  },
  logoutBtn: {
    border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px",
    fontSize: 13, background: "none", cursor: "pointer", color: "var(--text)",
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: "1.75rem" },
  statCard: { background: "var(--code-bg)", borderRadius: 10, padding: "1rem" },
  statLabel: { fontSize: 12, color: "var(--text)", marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 600, color: "var(--text-h)" },
  sectionHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "1rem", flexWrap: "wrap", gap: 8,
  },
  filterTab: {
    border: "1px solid", borderRadius: 20, padding: "4px 12px",
    fontSize: 12, fontWeight: 500, cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  errorBox: {
    background: "var(--accent-bg)", border: "1px solid var(--accent-border)",
    borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--text-h)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 16,
  },
  retryBtn: {
    background: "var(--accent)", color: "#fff", border: "none",
    borderRadius: 6, padding: "5px 14px", fontSize: 13, cursor: "pointer",
  },
  emptyState: {
    border: "1px dashed var(--border)", borderRadius: 12, padding: "3rem 2rem",
    textAlign: "center", marginTop: 12,
  },
};

const cardStyles = {
  card: {
    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14,
    padding: "1rem", display: "flex", flexDirection: "column",
  },
  badge: {
    display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 8px",
    borderRadius: 20, marginBottom: 10, alignSelf: "flex-start",
  },
  title: { fontSize: 14, fontWeight: 600, color: "var(--text-h)", marginBottom: 6, lineHeight: 1.4 },
  desc:  { fontSize: 12, color: "var(--text)", lineHeight: 1.5, flexGrow: 1 },
  meta:  { fontSize: 12, color: "var(--text)", marginTop: 6 },
  enrollBtn: {
    marginTop: 12, height: 32, background: "none", border: "1px solid var(--accent)",
    borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer",
  },
};