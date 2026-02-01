import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home">
      <header className="hero">
        <img
          src="/wickdwear-logo.png"
          alt="WickdWear"
          className="logo"
        />

        <h1>Memorial Day Draft Tournament</h1>

        {/* EVENT DATES */}
        <p className="event-dates">
          May 24–26, 2026
        </p>

        <p className="subhead">
          Slowpitch Softball • Draft Format
        </p>

        {/* PRIZE PACKAGE */}
        <div className="prizes">
          <h3>🏆 Prize Package</h3>
          <p><strong>1st Place:</strong> 12 Bats</p>
          <p><strong>2nd Place:</strong> 12 Softball Bags</p>
          <p><strong>3rd Place:</strong> TBD</p>
        </div>

        {/* LOCATION BLOCK */}
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

       <div className="actions">
  <Link to="/register" className="btn primary">
    Register Now
  </Link>

  <Link to="/registrations" className="btn secondary">
    View Registered Players
  </Link>
</div>

      </header>
    </div>
  );
}
