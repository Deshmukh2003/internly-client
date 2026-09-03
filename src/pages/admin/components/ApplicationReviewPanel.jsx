import { toast } from "react-toastify";
import { api } from "../../../api/http";

export default function ApplicationReviewPanel({ applications, onChanged }) {
  const changeStatus = async (id, status) => { try { await api(`/admin/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); toast.success("Application status updated."); onChanged(); } catch (error) { toast.error(error.message); } };
  if (!applications.length) return <div className="feature-card">No applications yet.</div>;
  return <div className="admin-application-list">{applications.map((item) => <article className="admin-application-card" key={item.id}><div className="admin-application-main"><h3 className="h6 mb-1">{item.internship.title}</h3><div className="small text-secondary">{item.studentEmail}</div></div><div className="admin-application-controls"><span className="badge rounded-pill text-bg-light border">{item.status}</span><select className="form-select form-select-sm status-select" aria-label={`Update status for ${item.internship.title}`} value={item.status} onChange={(e) => changeStatus(item.id, e.target.value)}><option>SUBMITTED</option><option>SHORTLISTED</option><option>ACCEPTED</option><option>REJECTED</option></select></div></article>)}</div>;
}
