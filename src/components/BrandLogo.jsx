import internlyLogo from "../assets/internly-logo.png";

export default function BrandLogo({ className = "brand-logo" }) {
  return <img className={className} src={internlyLogo} alt="Internly" />;
}
