import { useState } from "react";
import { analyze } from "../api.js";

export default function Analyzer() {
  const [skills, setSkills] = useState("python, django, react, sql, git");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async (e) => {
    e.preventDefault();
    try {
      const list = skills.split(",").map((s) => s.trim()).filter(Boolean);
      setResult(await analyze(description, list));
      setError("");
    } catch {
      setError("Could not analyze this description. Check that the API is running.");
    }
  };

  return (
    <div className="analyzer">
      <form onSubmit={run}>
        <label>
          Your skills (comma separated)
          <input value={skills} onChange={(e) => setSkills(e.target.value)} />
        </label>
        <label>
          Job description
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the job description here"
            required
          />
        </label>
        <button type="submit">Check match</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="score">{result.score}% match</p>
          {result.required_skills.length === 0 ? (
            <p>No known skills were found in this description.</p>
          ) : (
            <>
              <p>
                <strong>You have:</strong> {result.matched.join(", ") || "none of the listed skills"}
              </p>
              <p>
                <strong>To learn:</strong> {result.missing.join(", ") || "nothing, you cover them all"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
