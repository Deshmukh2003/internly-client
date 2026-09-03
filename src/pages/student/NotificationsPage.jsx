import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/http";

export default function NotificationsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api("/notifications").then((d) => setItems(d.content || [])).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  const markRead = async (id) => { try { const updated = await api(`/notifications/${id}/read`, { method: "PATCH" }); setItems((current) => current.map((item) => item.id === id ? updated : item)); } catch (error) { toast.error(error.message); } };
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student">← Dashboard</Link><div className="eyebrow mt-3">Stay informed</div><h1 className="display-6 fw-semibold">Notifications</h1><p className="text-secondary">Updates about your applications and opportunities.</p>{loading ? <p className="text-secondary mt-5">Loading notifications…</p> : items.length ? <div className="notification-list mt-4">{items.map((item) => <article className={`notification-card ${!item.readAt ? "notification-unread" : ""}`} key={item.id}><div className="notification-content"><div className="notification-heading"><h2 className="h6 mb-0">{item.title}</h2>{!item.readAt && <span className="badge rounded-pill text-bg-primary">New</span>}</div><p className="text-secondary mb-1">{item.message}</p><time className="small text-secondary" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div>{!item.readAt && <button className="btn btn-sm btn-outline-primary notification-action" onClick={() => markRead(item.id)}>Mark read</button>}</article>)}</div> : <div className="feature-card mt-4"><h2 className="h5">You’re all caught up</h2><p className="text-secondary mb-0">New updates will appear here.</p></div>}</div>;
}
