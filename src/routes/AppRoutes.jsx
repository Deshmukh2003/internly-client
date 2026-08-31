import { Navigate, Route, Routes } from "react-router-dom";
import { getSession } from "../auth/session";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AdminWorkspacePage from "../pages/admin/AdminWorkspacePage";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import InternshipBrowsePage from "../pages/student/InternshipBrowsePage";
import InternshipDetailPage from "../pages/student/InternshipDetailPage";
import RecommendationsPage from "../pages/student/RecommendationsPage";
import ApplicationsPage from "../pages/student/ApplicationsPage";
import NotificationsPage from "../pages/student/NotificationsPage";

function HomeRedirect() { const session = getSession(); return <Navigate to={session ? (session.role === "ADMIN" ? "/admin" : "/student") : "/login"} replace />; }

export default function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/verify-otp" element={<VerifyOtpPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} /><Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboardPage /></ProtectedRoute>} />
    <Route path="/student/profile" element={<ProtectedRoute role="STUDENT"><StudentProfilePage /></ProtectedRoute>} />
    <Route path="/student/internships" element={<ProtectedRoute role="STUDENT"><InternshipBrowsePage /></ProtectedRoute>} />
    <Route path="/student/internships/:id" element={<ProtectedRoute role="STUDENT"><InternshipDetailPage /></ProtectedRoute>} />
    <Route path="/student/recommendations" element={<ProtectedRoute role="STUDENT"><RecommendationsPage /></ProtectedRoute>} />
    <Route path="/student/applications" element={<ProtectedRoute role="STUDENT"><ApplicationsPage /></ProtectedRoute>} />
    <Route path="/student/notifications" element={<ProtectedRoute role="STUDENT"><NotificationsPage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminWorkspacePage /></ProtectedRoute>} />
    <Route path="*" element={<HomeRedirect />} />
  </Routes>;
}
