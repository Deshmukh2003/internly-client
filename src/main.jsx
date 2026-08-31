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
function Protected({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role)
    return (
      <Navigate to={session.role === "ADMIN" ? "/admin" : "/student"} replace />
    );
  return children;
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
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card">
            <span>02</span>
            <h2 className="h5 mt-4">Recommendations</h2>
            <p className="text-secondary mb-0">
              Transparent matching based on skills, domain, and eligibility.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card">
            <span>03</span>
            <h2 className="h5 mt-4">Applications</h2>
            <p className="text-secondary mb-0">
              Track every application and status in one calm workspace.
            </p>
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
