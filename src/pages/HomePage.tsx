import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

type RegistrationCounts = {
  women: number;
  men: number;
  total: number;
};

export default function HomePage() {
  // 🔴 REQUIRED: replace with your real EventID
  const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

  // Caps
  const WOMEN_CAP = 56;
  const MEN_CAP = 112;
  const TOTAL_CAP = 168;
  const TEAM_CAP = 14;
  const PLAYERS_PER_TEAM = 12;

  const [counts, setCounts] = useState<RegistrationCounts>({
    women: 0,
    men: 0,
    total: 0,
  });

  useEffect(() => {
    fetch(`/api/getRegistrationCounts?eventId=${EVENT_ID}`)
      .then((res) => res.json())
      .then((data: RegistrationCounts) => {
        setCounts(data);
      })
      .catch((err) => {
        console.error("Failed to load registration counts", err);
      });
  }, []);

  const teamsFilled = Math.floor(counts.total / PLAYERS_PER_TEAM);

  const isEventFull =
    counts.total >= TOTAL_CAP ||
    counts.women >= WOMEN_CAP ||
    counts.men >= MEN_CAP;

  return (
    <div className="home">
      <header className="hero">
        <img
          src="/wickdwear-logo.png"
          alt="WickdWear"
          className="logo"
        />

        <h1>Memorial Day Draft Tournament</h1>

        <p className="event-dates">
          May 23–24, 2026
        </p>

        <p className="subhead">
          Slowpitch Softball • Draft Format
        </p>

        {/* PLAYER COUNTER */}
        <div className="player-counter">
          <h3>👥 Player Registration</h3>

          <p>
            Women: <strong>{counts.women}</strong> / {WOMEN_CAP}
          </p>
          <p>
            Men: <strong>{counts.men}</strong> / {MEN_CAP}
          </p>

          <hr />

          <p>
            <strong>Total Players:</strong> {counts.total} / {TOTAL_CAP}
          </p>

          <p>
            <strong>Teams Filled:</strong> {teamsFilled} / {TEAM_CAP}
          </p>

          {isEventFull && (
            <p className="full-warning">🚫 Event is Full</p>
          )}
        </div>

        {/* PRIZE PACKAGE */}
        <div className="prizes">
          <h3>🏆 Prize Package</h3>
          <p><strong>1st Place:</strong> 12 Bats</p>
          <p><strong>2nd Place:</strong> 12 Softball Bags</p>
          <p><strong>3rd Place:</strong> TBD</p>
        </div>

        {/* LOCATION */}
        <div className="location">
          <p><strong>📍 Lake Fairview Softball Complex</strong></p>
          <p>
            2200 Lee Rd<br />
            Orlando, FL 32810
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=2200+Lee+Rd+Orlando+FL+32810"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            View on Google Maps
          </a>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          {!isEventFull ? (
            <Link to="/register" className="btn primary">
              Register Now
            </Link>
          ) : (
            <button className="btn primary disabled" disabled>
              Event Full
            </button>
          )}

          <Link to="/registrations" className="btn secondary">
            View Registered Players
          </Link>
        </div>
      </header>
    </div>
  );
}
