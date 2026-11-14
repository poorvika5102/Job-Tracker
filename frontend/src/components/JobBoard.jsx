import { STATUSES } from "../api.js";

export default function JobBoard({ jobs, onMove, onDelete }) {
  return (
    <div className="board">
      {STATUSES.map((col) => {
        const items = jobs.filter((j) => j.status === col.value);
        return (
          <section key={col.value} className={`column ${col.value}`}>
            <h2>
              {col.label} <span className="count">{items.length}</span>
            </h2>
            {items.length === 0 && <p className="empty">Nothing here yet</p>}
            {items.map((job) => (
              <article key={job.id} className="job">
                <strong>{job.role}</strong>
                <span>{job.company}</span>
                <small>Applied {job.date_applied}</small>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noreferrer">
                    View posting
                  </a>
                )}
                <div className="job-actions">
                  <select value={job.status} onChange={(e) => onMove(job.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button className="link danger" onClick={() => onDelete(job.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
