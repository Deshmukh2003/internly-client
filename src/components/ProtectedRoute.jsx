import { Navigate } from "react-router-dom";
import { getSession } from "../auth/session";

export default function ProtectedRoute({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role) {
    return <Navigate to={session.role === "ADMIN" ? "/admin" : "/student"} replace />;
  }
  return children;
}
