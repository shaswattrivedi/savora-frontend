const API_BASE = import.meta.env.VITE_API_URL || "/api";

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");
  if (!entries.length) return "";
  const query = new URLSearchParams(entries).toString();
  return `?${query}`;
};

/**
 * Lightweight wrapper around fetch to keep API calls consistent.
 */
export const apiRequest = async (
  endpoint,
  { method = "GET", data, token, params, headers = {} } = {}
) => {
  const body = data ? JSON.stringify(data) : null;
  const response = await fetch(`${API_BASE}${endpoint}${buildQuery(params)}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || "Request failed");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};
