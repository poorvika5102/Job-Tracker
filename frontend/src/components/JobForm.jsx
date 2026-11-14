import { useState } from "react";
import { STATUSES } from "../api.js";

const empty = { company: "", role: "", url: "", status: "applied", notes: "" };

export default function JobForm({ onAdd }) {
  const [form, setForm] = useState(empty);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    setForm(empty);
  };

  return (
    <form className="job-form" onSubmit={submit}>
      <input placeholder="Company" value={form.company} onChange={set("company")} required />
      <input placeholder="Role" value={form.role} onChange={set("role")} required />
      <input placeholder="Job link (optional)" type="url" value={form.url} onChange={set("url")} />
      <select value={form.status} onChange={set("status")}>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <button type="submit">Add application</button>
    </form>
  );
}
