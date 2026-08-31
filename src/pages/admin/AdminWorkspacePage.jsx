import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api/http";
import CompanyManagementPanel from "./components/CompanyManagementPanel";
import InternshipManagementPanel from "./components/InternshipManagementPanel";
import ApplicationReviewPanel from "./components/ApplicationReviewPanel";

const TABS = ["internships", "companies", "applications"];

export default function AdminWorkspacePage() {
  const [tab, setTab] = useState("internships");
  const [data, setData] = useState({ companies: [], internships: [], applications: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [companies, internships, applications] = await Promise.all([
        api("/admin/companies"), api("/admin/internships"), api("/admin/applications"),
      ]);
      setData({ companies, internships, applications: applications.content || [] });
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return <div className="container py-5"><div className="eyebrow">Operations</div><h1 className="display-6 fw-semibold">Admin workspace</h1><p className="text-secondary">Manage companies, internships, and student applications.</p><div className="btn-group mt-4" role="group">{TABS.map((name) => <button key={name} className={`btn ${tab === name ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab(name)}>{name[0].toUpperCase() + name.slice(1)}</button>)}</div>{loading ? <p className="text-secondary mt-5">Loading workspace…</p> : <div className="mt-4">{tab === "companies" && <CompanyManagementPanel companies={data.companies} onChanged={load} />}{tab === "internships" && <InternshipManagementPanel companies={data.companies} internships={data.internships} onChanged={load} />}{tab === "applications" && <ApplicationReviewPanel applications={data.applications} onChanged={load} />}</div>}</div>;
}
