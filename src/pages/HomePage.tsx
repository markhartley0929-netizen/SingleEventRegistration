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

        <p className="subhead">
          Competitive Slowpitch Softball • Draft Format
        </p>

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
        </div>
      </header>
    </div>
  );
}
