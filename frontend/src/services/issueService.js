// All API communication lives here.
// Components import functions from this module — they never call fetch directly.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    // Surface the backend's message if available, otherwise a generic one
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

export const getIssues = () => request('/issues');

export const getIssue = (id) => request(`/issues/${id}`);

export const getStats = () => request('/issues/stats');

export const createIssue = (data) =>
  request('/issues', { method: 'POST', body: JSON.stringify(data) });

export const updateIssue = (id, data) =>
  request(`/issues/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteIssue = (id) =>
  request(`/issues/${id}`, { method: 'DELETE' });
