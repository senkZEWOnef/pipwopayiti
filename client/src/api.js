export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Small fetch wrapper: JSON in/out, optional admin token, throws {status, code} on errors.
export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `http_${res.status}`);
    err.status = res.status;
    err.code = data?.error;
    err.data = data;
    throw err;
  }
  return data;
}

export const adminToken = () => localStorage.getItem("admin_token");
