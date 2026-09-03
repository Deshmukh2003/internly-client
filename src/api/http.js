import { clearSession, getSession } from "../auth/session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function api(path, options = {}) {
  const session = getSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) { clearSession(); window.dispatchEvent(new Event("internly:session-expired")); }
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export async function uploadFile(path, file) {
  const session = getSession();
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}${path}`, { method: "POST", body: formData, headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {} });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) { clearSession(); window.dispatchEvent(new Event("internly:session-expired")); }
  if (!response.ok) throw new Error(data.message || "Upload failed");
  return data;
}
