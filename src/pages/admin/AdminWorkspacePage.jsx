import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api/http";
import CompanyManagementPanel from "./components/CompanyManagementPanel";
import InternshipManagementPanel from "./components/InternshipManagementPanel";
import ApplicationReviewPanel from "./components/ApplicationReviewPanel";

const TABS = ["internships", "companies", "applications"];

export default function AdminWorkspacePage() {
  const [tab, setTab] = useState("internships"); const [data, setData] = useState({ companies: [], internships: [], applications: [] }); const [dummyData, setDummyData] = useState({ seeded: false, companyCount: 0, internshipCount: 0 }); const [loading, setLoading] = useState(true); const [dummyBusy, setDummyBusy] = useState(false);
  const load = async () => { setLoading(true); try { const [companies, internships, applications, status] = await Promise.all([api("/admin/companies"), api("/admin/internships"), api("/admin/applications"), api("/admin/dummy-data")]); setData({ companies, internships, applications: applications.content || [] }); setDummyData(status); } catch (error) { toast.error(error.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const toggleDummyData = async () => { setDummyBusy(true); try { const status = await api("/admin/dummy-data", { method: dummyData.seeded ? "DELETE" : "POST" }); setDummyData(status); toast.success(dummyData.seeded ? "Dummy data removed." : `Added ${status.companyCount} companies and ${status.internshipCount} internships.`); await load(); } catch (error) { toast.error(error.message); } finally { setDummyBusy(false); } };
  return <div className="container py-5"><div className="eyebrow">Operations</div><h1 className="display-6 fw-semibold">Admin workspace</h1><p className="text-secondary">Manage companies, internships, and student applications.</p><div className="admin-dummy-data mt-4"><div><strong>End-to-end test data</strong><p className="small text-secondary mb-0">{dummyData.seeded ? `${dummyData.companyCount} dummy companies and ${dummyData.internshipCount} internships are available.` : "Add a realistic, removable dataset for matching and application testing."}</p></div><button className={`btn ${dummyData.seeded ? "btn-outline-danger" : "btn-outline-primary"}`} disabled={dummyBusy || loading} onClick={toggleDummyData}>{dummyBusy ? "Working…" : dummyData.seeded ? "Remove Dummy Data" : "Add Dummy Data"}</button></div><div className="btn-group mt-4" role="group">{TABS.map((name) => <button key={name} className={`btn ${tab === name ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab(name)}>{name[0].toUpperCase() + name.slice(1)}</button>)}</div>{loading ? <p className="text-secondary mt-5">Loading workspace…</p> : <div className="mt-4">{tab === "companies" && <CompanyManagementPanel companies={data.companies} onChanged={load} />}{tab === "internships" && <InternshipManagementPanel companies={data.companies} internships={data.internships} onChanged={load} />}{tab === "applications" && <ApplicationReviewPanel applications={data.applications} onChanged={load} />}</div>}</div>;
}
