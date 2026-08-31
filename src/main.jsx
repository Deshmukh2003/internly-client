import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./styles.css";
import internlyLogo from "./assets/internly-logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("internly-session")) || null;
  } catch {
    return null;
  }
};
async function api(path, options = {}) {
  const session = getSession();
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

function Shell({ children }) {
  const session = getSession();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("internly-session");
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/" aria-label="Internly home">
            <img className="brand-logo" src={internlyLogo} alt="Internly" />
          </Link>
          <div className="d-flex align-items-center gap-3">
            {session && (
              <>
                <span className="text-secondary small">{session.email}</span>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={logout}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <ToastContainer position="bottom-right" />
    </>
  );
}
function AuthCard({ title, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <img className="auth-logo mb-2" src={internlyLogo} alt="Internly" />
          <p className="text-secondary mb-4">
            Find work that fits who you are.
          </p>
          <h1 className="h4 mb-4">{title}</h1>
          {children}
          {footer && <div className="small text-secondary mt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("internly-session", JSON.stringify(data));
      navigate(data.role === "ADMIN" ? "/admin" : "/student");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthCard
      title="Welcome back"
      footer={
        <>
          <span>New to Internly?</span>{" "}
          <Link to="/register">Create a student account</Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="form-label">Password</label>
        <input
          className="form-control mb-4"
          type="password"
          required
          minLength="8"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link className="btn btn-link px-0 mt-3" to="/forgot-password">
        Forgot password?
      </Link>
    </AuthCard>
  );
}
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match");
    setBusy(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      sessionStorage.setItem("internly-verification-email", form.email);
      navigate("/verify-otp");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthCard
      title="Create your account"
      footer={
        <>
          <span>Already have an account?</span> <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="form-label">Password</label>
        <input
          className="form-control mb-3"
          type="password"
          required
          minLength="8"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <label className="form-label">Confirm password</label>
        <input
          className="form-control mb-4"
          type="password"
          required
          minLength="8"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Creating account…" : "Continue"}
        </button>
      </form>
    </AuthCard>
  );
}
function VerifyOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    sessionStorage.getItem("internly-verification-email") || "",
  );
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      toast.success("Email verified. You can now sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  const resend = async () => {
    try {
      await api("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("A new code has been sent.");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <AuthCard
      title="Verify your email"
      footer={
        <>
          <span>Wrong email?</span> <Link to="/register">Start again</Link>
        </>
      }
    >
      <p className="text-secondary small">
        Enter the six-digit code sent to your email.
      </p>
      <form onSubmit={submit}>
        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="form-label">Verification code</label>
        <input
          className="form-control mb-4"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength="6"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Verifying…" : "Verify email"}
        </button>
      </form>
      <button className="btn btn-link px-0 mt-3" onClick={resend}>
        Resend code
      </button>
    </AuthCard>
  );
}
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      sessionStorage.setItem("internly-reset-email", email);
      toast.success("If an account exists, a reset code has been sent."); navigate("/reset-password");
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  return <AuthCard title="Reset your password" footer={<><span>Remembered it?</span> <Link to="/login">Sign in</Link></>}>
    <p className="text-secondary small">Enter your email and we’ll send a one-time reset code.</p>
    <form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-4" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><button className="btn btn-primary w-100" disabled={busy}>{busy ? "Sending…" : "Send reset code"}</button></form>
  </AuthCard>;
}
function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: sessionStorage.getItem("internly-reset-email") || "", code: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); if (form.password !== form.confirm) return toast.error("Passwords do not match"); setBusy(true);
    try { await api("/auth/reset-password", { method: "POST", body: JSON.stringify({ email: form.email, code: form.code, newPassword: form.password }) }); sessionStorage.removeItem("internly-reset-email"); toast.success("Password reset successfully."); navigate("/login"); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  return <AuthCard title="Choose a new password" footer={<><span>Need another code?</span> <Link to="/forgot-password">Start again</Link></>}>
    <form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-3" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><label className="form-label">Reset code</label><input className="form-control mb-3" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "") })} /><label className="form-label">New password</label><input className="form-control mb-3" type="password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><label className="form-label">Confirm new password</label><input className="form-control mb-4" type="password" minLength="8" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /><button className="btn btn-primary w-100" disabled={busy}>{busy ? "Updating…" : "Update password"}</button></form>
  </AuthCard>;
}
function Protected({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role)
    return (
      <Navigate to={session.role === "ADMIN" ? "/admin" : "/student"} replace />
    );
  return children;
}
function StudentProfile() {
  const [profile, setProfile] = useState(null); const [skill, setSkill] = useState(""); const [busy, setBusy] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { api("/student/profile").then(setProfile).catch((err) => toast.error(err.message)).finally(() => setBusy(false)); }, []);
  const update = (key, value) => setProfile({ ...profile, [key]: value });
  const save = async (e) => { e.preventDefault(); setSaving(true); const { fullName, mobile, domain, qualification, college, graduationYear, interests } = profile; try { const next = await api("/student/profile", { method: "PUT", body: JSON.stringify({ fullName, mobile, domain, qualification, college, graduationYear, interests }) }); setProfile(next); toast.success("Profile saved."); } catch (err) { toast.error(err.message); } finally { setSaving(false); } };
  const addSkill = async (e) => { e.preventDefault(); if (!skill.trim()) return; try { const added = await api("/student/skills", { method: "POST", body: JSON.stringify({ name: skill }) }); setProfile({ ...profile, skills: [...profile.skills.filter((item) => item.id !== added.id), added] }); setSkill(""); } catch (err) { toast.error(err.message); } };
  const removeSkill = async (id) => { try { await api(`/student/skills/${id}`, { method: "DELETE" }); setProfile({ ...profile, skills: profile.skills.filter((item) => item.id !== id) }); } catch (err) { toast.error(err.message); } };
  if (busy) return <div className="container py-5"><p className="text-secondary">Loading your profile…</p></div>;
  if (!profile) return null;
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student">← Dashboard</Link><h1 className="display-6 fw-semibold mt-3">Your profile</h1><p className="text-secondary">A stronger profile leads to more relevant recommendations.</p><form className="card border-0 shadow-sm p-4 mt-4" onSubmit={save}><div className="row g-3"><div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" required value={profile.fullName || ""} onChange={(e) => update("fullName", e.target.value)} /></div><div className="col-md-6"><label className="form-label">Mobile</label><input className="form-control" value={profile.mobile || ""} onChange={(e) => update("mobile", e.target.value)} /></div><div className="col-md-6"><label className="form-label">Domain / branch</label><input className="form-control" placeholder="e.g. Mechanical Engineering" value={profile.domain || ""} onChange={(e) => update("domain", e.target.value)} /></div><div className="col-md-6"><label className="form-label">Qualification</label><input className="form-control" placeholder="e.g. B.Tech" value={profile.qualification || ""} onChange={(e) => update("qualification", e.target.value)} /></div><div className="col-md-8"><label className="form-label">College / institute</label><input className="form-control" value={profile.college || ""} onChange={(e) => update("college", e.target.value)} /></div><div className="col-md-4"><label className="form-label">Graduation year</label><input className="form-control" type="number" min="1950" max="2200" value={profile.graduationYear || ""} onChange={(e) => update("graduationYear", e.target.value ? Number(e.target.value) : null)} /></div><div className="col-12"><label className="form-label">Interests</label><textarea className="form-control" rows="3" placeholder="Design, manufacturing, finance…" value={profile.interests || ""} onChange={(e) => update("interests", e.target.value)} /></div></div><button className="btn btn-primary mt-4" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></form><div className="card border-0 shadow-sm p-4 mt-4"><h2 className="h5">Skills</h2><div className="d-flex flex-wrap gap-2 mb-3">{profile.skills.length ? profile.skills.map((item) => <span className="badge rounded-pill text-bg-light border p-2" key={item.id}>{item.name} <button type="button" className="btn-close ms-1" aria-label={`Remove ${item.name}`} onClick={() => removeSkill(item.id)} /></span>) : <span className="text-secondary small">No skills added yet.</span>}</div><form className="d-flex gap-2" onSubmit={addSkill}><input className="form-control" placeholder="Add a skill" value={skill} onChange={(e) => setSkill(e.target.value)} /><button className="btn btn-outline-primary" type="submit">Add</button></form></div></div>;
}
function InternshipBrowse() {
  const [items, setItems] = useState([]); const [search, setSearch] = useState(""); const [domain, setDomain] = useState(""); const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); const params = new URLSearchParams(); if (search) params.set("search", search); if (domain) params.set("domain", domain); api(`/internships?${params}`).then((data) => setItems(data.content || [])).catch((err) => toast.error(err.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student">← Dashboard</Link><div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mt-3"><div><div className="eyebrow">Explore</div><h1 className="display-6 fw-semibold">Internships that fit.</h1><p className="text-secondary mb-0">Search across domains, not just job titles.</p></div></div><form className="row g-2 mt-4" onSubmit={(e) => { e.preventDefault(); load(); }}><div className="col-md-6"><input className="form-control" placeholder="Search internships" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="col-md-4"><input className="form-control" placeholder="Filter by domain" value={domain} onChange={(e) => setDomain(e.target.value)} /></div><div className="col-md-2"><button className="btn btn-primary w-100">Search</button></div></form>{loading ? <p className="text-secondary mt-5">Loading internships…</p> : items.length ? <div className="row g-4 mt-2">{items.map((item) => <div className="col-md-6 col-lg-4" key={item.id}><div className="feature-card h-100"><div className="eyebrow">{item.domain}</div><h2 className="h5 mt-3">{item.title}</h2><p className="small text-secondary">{item.company.name} · {item.location || "Flexible location"}</p><p className="text-secondary small">{item.description}</p><div className="d-flex flex-wrap gap-1">{item.requiredSkills.map((name) => <span className="badge rounded-pill text-bg-light border" key={name}>{name}</span>)}</div></div></div>)}</div> : <div className="feature-card mt-4"><h2 className="h5">No internships found</h2><p className="text-secondary mb-0">Try another search or complete your profile to improve recommendations.</p></div>}</div>;
}
function Recommendations() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api("/recommendations").then((data) => setItems(data.content || [])).catch((err) => toast.error(err.message)).finally(() => setLoading(false)); }, []);
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student">← Dashboard</Link><div className="eyebrow mt-3">For you</div><h1 className="display-6 fw-semibold">Recommended for your profile.</h1><p className="text-secondary">Every score is explainable: skills, domain, qualification, and interests all contribute.</p>{loading ? <p className="text-secondary mt-5">Calculating your matches…</p> : items.length ? <div className="row g-4 mt-2">{items.map((item) => <div className="col-md-6 col-lg-4" key={item.id}><div className="feature-card h-100"><div className="d-flex justify-content-between align-items-start"><div className="eyebrow">{item.internship.domain}</div><span className="match-score">{item.matchScore}%</span></div><h2 className="h5 mt-3">{item.internship.title}</h2><p className="small text-secondary">{item.internship.company.name}</p><p className="text-secondary small">{item.explanation}.</p><Link className="small text-decoration-none" to={`/student/internships/${item.internship.id}`}>View details →</Link></div></div>)}</div> : <div className="feature-card mt-4"><h2 className="h5">No recommendations yet</h2><p className="text-secondary mb-0">Add your domain and skills to your profile, then check back here.</p></div>}</div>;
}
function InternshipDetail() {
  const id = window.location.pathname.split("/").pop(); const [item, setItem] = useState(null); const [error, setError] = useState(false);
  useEffect(() => { api(`/internships/${id}`).then(setItem).catch(() => setError(true)); }, [id]);
  if (error) return <div className="container py-5"><Link to="/student/internships">← Internships</Link><div className="feature-card mt-4"><h1 className="h5">Internship not found</h1></div></div>;
  if (!item) return <div className="container py-5"><p className="text-secondary">Loading internship…</p></div>;
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student/internships">← Internships</Link><div className="feature-card mt-4"><div className="eyebrow">{item.domain}</div><h1 className="display-6 fw-semibold mt-3">{item.title}</h1><p className="lead text-secondary">{item.company.name} · {item.location || "Flexible location"}</p><p className="mt-4">{item.description}</p><h2 className="h5 mt-4">Required skills</h2><div className="d-flex flex-wrap gap-2">{item.requiredSkills.map((name) => <span className="badge rounded-pill text-bg-light border p-2" key={name}>{name}</span>)}</div><div className="row mt-4 small text-secondary"><div className="col-sm-4">Work mode<br/><strong className="text-dark">{item.workMode || "Not specified"}</strong></div><div className="col-sm-4">Duration<br/><strong className="text-dark">{item.durationWeeks ? `${item.durationWeeks} weeks` : "Not specified"}</strong></div><div className="col-sm-4">Deadline<br/><strong className="text-dark">{item.applicationDeadline || "Not specified"}</strong></div></div></div></div>;
}
function Dashboard({ role }) {
  return (
    <div className="container py-5">
      <div className="eyebrow">
        {role === "ADMIN" ? "Operations" : "Your workspace"}
      </div>
      <h1 className="display-6 fw-semibold">
        {role === "ADMIN"
          ? "Admin dashboard"
          : "Your next opportunity starts here."}
      </h1>
      <p className="lead text-secondary mt-3">
        {role === "ADMIN"
          ? "Manage internships, companies, students, and applications from one place."
          : "Complete your profile to unlock recommendations tailored to your skills, domain, and goals."}
      </p>
      <div className="row g-4 mt-3">
        <div className="col-md-4">
          <div className="feature-card">
            <span>01</span>
            <h2 className="h5 mt-4">Profile</h2>
            <p className="text-secondary mb-0">
              Tell Internly what you know and where you want to grow.
            </p>
            {role === "STUDENT" && <Link className="stretched-link" to="/student/profile">Complete profile</Link>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card">
            <span>02</span>
            <h2 className="h5 mt-4">Internships</h2>
            <p className="text-secondary mb-0">
              Browse opportunities across every academic and professional domain.
            </p>
            {role === "STUDENT" && <Link className="stretched-link" to="/student/internships">Browse internships</Link>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card">
            <span>03</span>
            <h2 className="h5 mt-4">Recommendations</h2>
            <p className="text-secondary mb-0">
              See transparent match scores tailored to your profile.
            </p>
            {role === "STUDENT" && <Link className="stretched-link" to="/student/recommendations">View recommendations</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <Navigate
              to={
                getSession()
                  ? getSession().role === "ADMIN"
                    ? "/admin"
                    : "/student"
                  : "/login"
              }
              replace
            />
          }
        />
        <Route
          path="/student"
          element={
            <Protected role="STUDENT">
              <Dashboard role="STUDENT" />
            </Protected>
          }
        />
        <Route path="/student/profile" element={<Protected role="STUDENT"><StudentProfile /></Protected>} />
        <Route path="/student/internships" element={<Protected role="STUDENT"><InternshipBrowse /></Protected>} />
        <Route path="/student/internships/:id" element={<Protected role="STUDENT"><InternshipDetail /></Protected>} />
        <Route path="/student/recommendations" element={<Protected role="STUDENT"><Recommendations /></Protected>} />
        <Route
          path="/admin"
          element={
            <Protected role="ADMIN">
              <Dashboard role="ADMIN" />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
