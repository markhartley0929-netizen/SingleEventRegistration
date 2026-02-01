import { useEffect, useState } from "react";
import "./RegisteredPlayers.css";

export default function RegisteredPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/registrations")
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading registrations...</p>;

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
              <td>{p.primaryPosition}</td>
              <td>{p.secondaryPosition || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
