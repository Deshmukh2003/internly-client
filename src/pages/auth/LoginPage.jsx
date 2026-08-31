import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/http";
import { saveSession } from "../../auth/session";
import AuthCard from "../../components/AuthCard";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true);
    try { const data = await api("/auth/login", { method: "POST", body: JSON.stringify(form) }); saveSession(data); navigate(data.role === "ADMIN" ? "/admin" : "/student"); }
    catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <AuthCard title="Welcome back" footer={<><span>New to Internly?</span> <Link to="/register">Create a student account</Link></>}>
    <form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-3" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><label className="form-label">Password</label><input className="form-control mb-4" type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button className="btn btn-primary w-100" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>
    <Link className="btn btn-link px-0 mt-3" to="/forgot-password">Forgot password?</Link>
  </AuthCard>;
}
