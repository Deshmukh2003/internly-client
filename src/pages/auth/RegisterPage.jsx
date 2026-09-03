import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/http";
import AuthCard from "../../components/AuthCard";
import { startOtpCooldown } from "../../auth/otpCooldown";

export default function RegisterPage() {
  const navigate = useNavigate(); const [form, setForm] = useState({ email: "", password: "", confirm: "" }); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); if (form.password !== form.confirm) return toast.error("Passwords do not match"); setBusy(true); try { await api("/auth/register", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) }); sessionStorage.setItem("internly-verification-email", form.email.trim()); startOtpCooldown(); navigate("/verify-otp"); } catch (error) { toast.error(error.message); } finally { setBusy(false); } };
  return <AuthCard title="Create your account" footer={<><span>Already have an account?</span> <Link to="/login">Sign in</Link></>}><form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-3" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><label className="form-label">Password</label><input className="form-control mb-3" type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><label className="form-label">Confirm password</label><input className="form-control mb-4" type="password" required minLength="8" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} /><button className="btn btn-primary w-100" disabled={busy}>{busy ? "Sending code…" : "Continue"}</button></form></AuthCard>;
}
