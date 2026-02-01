import { useEffect, useState } from "react";
import "./RegisteredPlayers.css";

interface Player {
  firstName: string;
  lastName: string;
  primaryPosition: string | null;
  secondaryPosition: string | null;
}

const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

export default function RegisteredPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/registrations?eventId=b04de545-5aee-4403-86b1-03db1e5c4a86`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load registrations");
        return res.json();
      })
      .then((data: Player[]) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load registrations");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">Loading registrations...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="registered-page">
      <h1>Registered Players</h1>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Primary Position</th>
            <th>Secondary Position</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
              <td>{p.primaryPosition || "-"}</td>
              <td>{p.secondaryPosition || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
