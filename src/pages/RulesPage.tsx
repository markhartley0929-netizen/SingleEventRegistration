import { Link } from "react-router-dom";
import "./RulesPage.css";

export default function RulesPage() {
  return (
    <div className="home">
      <header className="hero rules-hero">
        <img
          src="/wickdwear-logo.png"
          alt="WickdWear"
          className="logo"
        />

        <h1>WICKD Draft Tournament Rules</h1>
        <p className="subhead">
          Memorial Day Draft Tournament • May 23–24, 2026
        </p>

        <div className="rules-wrapper">

          <div className="rules-section">
            <h3>⚾ Tournament Format</h3>
            <ul>
              <li>5-game guarantee</li>
              <li>Double elimination bracket</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🧾 Lineups</h3>
            <ul>
              <li>Bat 10</li>
              <li>Lineups may only be exchanged before first pitch</li>
              <li>Everyone must bat and play</li>
              <li>Male spots cannot be EHD</li>
            </ul>
          </div>

                <div className="rules-section">
            <h3>🎯 Pitching</h3>
            <ul>
              <li>4–10 ft arc required</li>
              <li>1–1 count, courtesy foul</li>
              <li>Pump fakes allowed</li>
              <li>USSSA 240 bats</li>
              <li>44/400 Pro-M balls</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🎯  Pitching Net & Bucket</h3>
            <ul>
              <li>Pump fakes allowed</li>
              <li>Net and bucket may be used</li>
              <li>Net bucket must be fully behind the net</li>
              <li>Next batter retrieves balls from the net’s bucket on home runs</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🏃 Courtesy Runners</h3>
            <ul>
              <li>1 per inning per gender</li>
              <li>Plus one courtesy runner for the pitcher</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>💣 Home Runs</h3>
            <ul>
              <li>6 home runs per game, then OUT</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🚶 Walk Rule</h3>
            <ul>
              <li>
                Walked male — the female batting behind him may hit or walk
              </li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>📋 General Rules</h3>
            <ul>
              <li>60-minute time limit for most games</li>
              <li>Texas tie breaker for extra innings (runner starts on 2nd)</li>
              <li>Must be on official roster to win prizes</li>
              <li>12th spot used for missing players</li>
            </ul>
          </div>

          <p className="rules-footer">
            Everyone must bat & play. Have fun & stay <strong>WICKD!</strong>
          </p>

          {/* Optional return link — keep or remove */}
          <Link to="/" className="btn secondary rules-back">
            ← Back to Event
          </Link>

        </div>
      </header>
    </div>
  );
}
