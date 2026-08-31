import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function AuthCard({ title, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <BrandLogo className="auth-logo mb-2" />
          <p className="text-secondary mb-4">Find work that fits who you are.</p>
          <h1 className="h4 mb-4">{title}</h1>
          {children}
          {footer && <div className="small text-secondary mt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return <Link to={to}>{children}</Link>;
}
