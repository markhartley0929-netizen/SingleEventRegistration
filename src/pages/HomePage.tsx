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
          Competitive Slowpitch • Draft Format • One Weekend
        </p>

        <div className="meta">
          <span>📅 Memorial Day Weekend</span>
          <span>📍 Orlando, FL</span>
        </div>

        <div className="actions">
          <a href="/register" className="btn primary">
            Register Now
          </a>
          <a href="#details" className="btn secondary">
            View Details
          </a>
        </div>
      </header>
    </div>
  );
}
