import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/http";

export default function ApplicationsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api("/applications").then((data) => setItems(data.content || [])).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  return <div className="container py-5"><Link className="small text-decoration-none" to="/student">← Dashboard</Link><div className="eyebrow mt-3">Your progress</div><h1 className="display-6 fw-semibold">Applications</h1><p className="text-secondary">Keep track of every opportunity you’ve pursued.</p>{loading ? <p className="text-secondary mt-5">Loading applications…</p> : items.length ? <div className="student-application-list mt-4">{items.map((item) => <article className="student-application-card" key={item.id}><div className="student-application-main"><div className="eyebrow">{item.internship.domain}</div><h2 className="h6 mb-1 mt-1">{item.internship.title}</h2><span className="small text-secondary">{item.internship.company.name} · Applied {new Date(item.appliedAt).toLocaleDateString()}</span></div><span className="badge rounded-pill text-bg-light border">{item.status}</span></article>)}</div> : <div className="feature-card mt-4"><h2 className="h5">No applications yet</h2><p className="text-secondary mb-0">When you find the right internship, it will appear here.</p></div>}</div>;
}
