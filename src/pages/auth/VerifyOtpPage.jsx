import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/http";
import AuthCard from "../../components/AuthCard";
import { getOtpCooldownSeconds, startOtpCooldown } from "../../auth/otpCooldown";

export default function VerifyOtpPage() {
  const navigate = useNavigate(); const [email, setEmail] = useState(sessionStorage.getItem("internly-verification-email") || ""); const [code, setCode] = useState(""); const [busy, setBusy] = useState(false); const [cooldown, setCooldown] = useState(getOtpCooldownSeconds);
  useEffect(() => { const timer = window.setInterval(() => setCooldown(getOtpCooldownSeconds()), 1000); return () => window.clearInterval(timer); }, []);
  const submit = async (event) => { event.preventDefault(); setBusy(true); try { await api("/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, code }) }); sessionStorage.removeItem("internly-verification-email"); toast.success("Email verified. You can now sign in."); navigate("/login"); } catch (error) { toast.error(error.message); } finally { setBusy(false); } };
  const resend = async () => { if (cooldown > 0 || !email) return; setBusy(true); try { await api("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) }); startOtpCooldown(); setCooldown(getOtpCooldownSeconds()); toast.success("A new code has been sent."); } catch (error) { toast.error(error.message); setCooldown(getOtpCooldownSeconds()); } finally { setBusy(false); } };
  return <AuthCard title="Verify your email" footer={<><span>Wrong email?</span> <Link to="/register">Start again</Link></>}><p className="text-secondary small">Enter the six-digit code sent to your email.</p><form onSubmit={submit}><label className="form-label">Email</label><input className="form-control mb-3" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><label className="form-label">Verification code</label><input className="form-control mb-4" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} /><button className="btn btn-primary w-100" disabled={busy}>{busy ? "Verifying…" : "Verify email"}</button></form><button className="btn btn-link px-0 mt-3" disabled={busy || cooldown > 0} onClick={resend}>{cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}</button></AuthCard>;
}
