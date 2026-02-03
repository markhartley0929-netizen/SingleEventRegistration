import { useEffect, useState } from "react";

type RepLeaderboardRow = {
  rep_code_id: number;
  rep_code: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  registrations: number;
};

const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

export default function RepLeaderboard() {
  const [rows, setRows] = useState<RepLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch(
          `/api/getRepLeaderboard?eventId=${EVENT_ID}`
        );

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error("Failed to load leaderboard");
        }

        setRows(data.leaderboard);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading leaderboard…</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center" }}>🏆 Rep Leaderboard</h1>

      <table
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "24px auto",
          borderCollapse: "collapse",
        }}
      >
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
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}

          {rows.map((rep, index) => (
            <tr key={rep.rep_code_id}>
              <td style={{ textAlign: "center" }}>
                {index + 1}
              </td>
              <td>
                {rep.first_name} {rep.last_name}
              </td>
              <td>{rep.organization ?? ""}</td>
              <td>{rep.rep_code}</td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>
                {rep.registrations}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
