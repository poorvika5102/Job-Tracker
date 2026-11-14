// All calls to the Django API live here, so components stay simple.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export const listJobs = (search = "") =>
  request(`/jobs/${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const createJob = (job) => request("/jobs/", { method: "POST", body: JSON.stringify(job) });
export const updateJob = (id, patch) =>
  request(`/jobs/${id}/`, { method: "PATCH", body: JSON.stringify(patch) });
export const deleteJob = (id) => request(`/jobs/${id}/`, { method: "DELETE" });
export const analyze = (description, skills) =>
  request("/analyze/", { method: "POST", body: JSON.stringify({ description, skills }) });
