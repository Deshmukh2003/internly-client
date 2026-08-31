import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api/http";

export default function AdminWorkspacePage() {
  const [tab, setTab] = useState("internships");
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [companyData, internshipData, applicationData] = await Promise.all([
        api("/admin/companies"), api("/admin/internships"), api("/admin/applications"),
      ]);
      setCompanies(companyData); setInternships(internshipData); setApplications(applicationData.content || []);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addCompany = async (event) => {
    event.preventDefault(); if (!companyName.trim()) return;
    try { await api("/admin/companies", { method: "POST", body: JSON.stringify({ name: companyName }) }); setCompanyName(""); toast.success("Company created."); load(); }
    catch (error) { toast.error(error.message); }
  };
  const changeStatus = async (id, status) => {
    try { await api(`/admin/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); toast.success("Application status updated."); load(); }
    catch (error) { toast.error(error.message); }
  };

  return <div className="container py-5"><div className="eyebrow">Operations</div><h1 className="display-6 fw-semibold">Admin workspace</h1><p className="text-secondary">Manage the internship marketplace and review student applications.</p><div className="btn-group mt-4" role="group">{["internships", "companies", "applications"].map((name) => <button key={name} className={`btn ${tab === name ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab(name)}>{name[0].toUpperCase() + name.slice(1)}</button>)}</div>{loading ? <p className="text-secondary mt-5">Loading workspace…</p> : <div className="mt-4">{tab === "companies" && <><form className="d-flex gap-2 mb-3" onSubmit={addCompany}><input className="form-control" placeholder="New company name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} /><button className="btn btn-primary">Add company</button></form>{companies.map((company) => <div className="feature-card py-3 mb-2" key={company.id}><strong>{company.name}</strong><span className="text-secondary small ms-2">{company.industry || "No industry set"}</span></div>)}</>}{tab === "internships" && (internships.length ? internships.map((item) => <div className="feature-card py-3 mb-2 d-flex justify-content-between gap-3" key={item.id}><div><strong>{item.title}</strong><div className="small text-secondary">{item.company.name} · {item.domain}</div></div><span className="badge rounded-pill text-bg-light border">{item.status}</span></div>) : <div className="feature-card">No internships created yet.</div>)}{tab === "applications" && (applications.length ? applications.map((item) => <div className="feature-card py-3 mb-2 d-flex flex-wrap justify-content-between align-items-center gap-3" key={item.id}><div><strong>{item.internship.title}</strong><div className="small text-secondary">{item.studentEmail} · {item.status}</div></div><select className="form-select form-select-sm status-select" value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}><option>SUBMITTED</option><option>SHORTLISTED</option><option>ACCEPTED</option><option>REJECTED</option></select></div>) : <div className="feature-card">No applications yet.</div>)}</div>}</div>;
}
