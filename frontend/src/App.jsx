import { useCallback, useEffect, useState } from "react";
import { listJobs, createJob, updateJob, deleteJob } from "./api.js";
import JobForm from "./components/JobForm.jsx";
import JobBoard from "./components/JobBoard.jsx";
import Analyzer from "./components/Analyzer.jsx";

export default function App() {
  const [view, setView] = useState("board");
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setJobs(await listJobs(search));
      setError("");
    } catch {
      setError("Could not reach the API. Is the Django server running on port 8000?");
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (job) => {
    await createJob(job);
    load();
  };
  const handleMove = async (id, status) => {
    await updateJob(id, { status });
    load();
  };
  const handleDelete = async (id) => {
    await deleteJob(id);
    load();
  };

  return (
    <div className="app">
      <header>
        <h1>Job tracker</h1>
        <nav>
          <button className={view === "board" ? "tab active" : "tab"} onClick={() => setView("board")}>
            Applications
          </button>
          <button className={view === "match" ? "tab active" : "tab"} onClick={() => setView("match")}>
            Match a job
          </button>
        </nav>
      </header>

      {error && <p className="error">{error}</p>}

      {view === "board" ? (
        <>
          <JobForm onAdd={handleAdd} />
          <input
            className="search"
            placeholder="Search by company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <JobBoard jobs={jobs} onMove={handleMove} onDelete={handleDelete} />
        </>
      ) : (
        <Analyzer />
      )}
    </div>
  );
}
