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
    <img
      src="/wickdwear-logo.png"
      alt="WickdWear"
      className="registered-logo"
      onClick={() => (window.location.href = "/")}
    />

      <h1>Registered Players</h1>
      <p style={{ opacity: 0.7, marginBottom: "16px" }}>
  Roster updates as players register
</p>


      <div className="table-wrapper">
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
            <tr key={i} className={p.role === "Companion" ? "companion-row" : ""}>

              <td>{p.firstName}</td>
             <td><strong>{p.lastName}</strong></td>

              <td>{p.primaryPosition || "-"}</td>
              <td>{p.secondaryPosition || "-"}</td>
              <td>{p.role}</td>
             <td>
  <span className={`skill ${p.skillLevel?.toLowerCase() || ""}`}>
    {p.skillLevel || "-"}
  </span>
</td>

            </tr>
          ))}
        </tbody>
      </table>
      </div>
   <p className="cta">
  Don’t see your name?{" "}
  <a href="/register">Register here →</a>
</p>


    </div>



  );
}
