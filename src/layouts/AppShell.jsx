import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/http";
import { clearSession, getSession } from "../auth/session";
import BrandLogo from "../components/BrandLogo";
import { ToastContainer } from "react-toastify";

export default function AppShell({ children }) {
  const session = getSession();
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.role === "STUDENT") {
      api("/notifications/unread-count").then(setUnread).catch(() => {});
    }
  }, [session?.role]);

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/" aria-label="Internly home">
            <BrandLogo />
          </Link>
          <div className="d-flex align-items-center gap-3">
            {session?.role === "STUDENT" && (
              <Link className="small text-decoration-none" to="/student/notifications">
                Notifications {unread > 0 && <span className="badge rounded-pill text-bg-primary">{unread}</span>}
              </Link>
            )}
            {session && <span className="text-secondary small">{session.email}</span>}
            {session && <button className="btn btn-outline-dark btn-sm" onClick={logout}>Log out</button>}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <ToastContainer position="bottom-right" />
    </>
  );
}
