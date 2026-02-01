import { useEffect, useState } from "react";
import "./RegisteredPlayers.css";

// ----------------------------------
// Types
// ----------------------------------
interface Player {
  firstName: string;
  lastName: string;
  primaryPosition: string | null;
  secondaryPosition: string | null;
  skillLevel: string | null;
  role: "Primary" | "Companion";
}

// ----------------------------------
// Constants
// ----------------------------------
const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

const API_BASE =
  "https://single-event-registration-api-v2-cqd5bferhcbsftda.centralus-01.azurewebsites.net";

const API_URL = `${API_BASE}/api/getregistrations?eventId=${EVENT_ID}`;

// ----------------------------------
// Component
// ----------------------------------
export default function RegisteredPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
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
      .then((data: Player[]) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load registrations", err);
        setError("Could not load registrations");
        setLoading(false);
      });
  }, []);

  // ----------------------------------
  // Render States
  // ----------------------------------
  if (loading) {
    return <p className="loading">Loading registrations...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // ----------------------------------
  // Render Table
  // ----------------------------------
  return (
    <div className="registered-page">
      <h1>Registered Players</h1>

      <table>
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Primary</th>
            <th>Secondary</th>
            <th>Role</th>
            <th>Skill</th>
          </tr>
        </thead>

        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
              <td>{p.primaryPosition || "-"}</td>
              <td>{p.secondaryPosition || "-"}</td>
              <td>{p.role}</td>
              <td>{p.skillLevel || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
