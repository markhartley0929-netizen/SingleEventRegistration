import { useEffect, useState } from "react";
import "./RepLeaderboard.css";

// ----------------------------------
// Types
// ----------------------------------
interface RepLeaderboardRow {
  rep_code_id: number;
  rep_code: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  registrations: number;
}

// ----------------------------------
// Constants
// ----------------------------------
const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

const API_BASE =
  "https://single-event-registration-api-v2-cqd5bferhcbsftda.centralus-01.azurewebsites.net";

const API_URL = `${API_BASE}/api/getrepleaderboard?eventId=${EVENT_ID}`;

// ----------------------------------
// Component
// ----------------------------------
export default function RepLeaderboard() {
  const [rows, setRows] = useState<RepLeaderboardRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRows(data.leaderboard || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load rep leaderboard", err);
        setError("Could not load rep leaderboard");
        setLoading(false);
      });
  }, []);

  // ----------------------------------
  // Render States
  // ----------------------------------
  if (loading) {
    return <p className="loading">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // ----------------------------------
  // Render Table
  // ----------------------------------
  return (
    <div className="rep-leaderboard-page">
      <img
        src="/wickdwear-logo.png"
        alt="WickdWear"
        className="registered-logo"
        onClick={() => (window.location.href = "/")}
      />

      <h1>Rep Leaderboard</h1>

      <p style={{ opacity: 0.7, marginBottom: "16px" }}>
        Signups attributed to each rep
      </p>

      <div className="table-wrapper">
        {rows.length === 0 ? (
          <div className="rep-empty">
            No rep signups yet.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Rep</th>
                <th>Organization</th>
                <th>Rep Code</th>
                <th>Registrations</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((rep, index) => (
                <tr key={rep.rep_code_id}>
                  <td className="rep-rank">{index + 1}</td>

                  <td>
                    <strong>
                      {rep.first_name} {rep.last_name}
                    </strong>
                  </td>

                  <td>{rep.organization ?? "—"}</td>

                  <td>{rep.rep_code}</td>

                  <td className="rep-count">
                    {rep.registrations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
