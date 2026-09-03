const REQUIRED_FIELDS = [
  ["fullName", "your name"], ["domain", "your branch"], ["qualification", "your qualification"], ["college", "your college"], ["graduationYear", "your graduation year"], ["skills", "at least one skill"], ["resumeFileName", "your resume"],
];

export function getProfileCompletion(profile) {
  const missing = REQUIRED_FIELDS.filter(([key]) => key === "skills" ? !profile?.skills?.length : !profile?.[key]).map(([, label]) => label);
  const completed = REQUIRED_FIELDS.length - missing.length;
  return { completed, total: REQUIRED_FIELDS.length, percentage: Math.round(completed / REQUIRED_FIELDS.length * 100), complete: missing.length === 0, missing };
}
