const SESSION_KEY = "internly-session";

function hasValidToken(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return false;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)));
    return Number.isFinite(payload.exp) && payload.exp * 1000 > Date.now();
  } catch { return false; }
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session?.token || !hasValidToken(session.token)) { clearSession(); return null; }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
