import React from "react";
import { Link } from "react-router-dom";
import "./RulesPage.css"; // Reuse existing styles
import "./DraftEngine.css"; // Load engine-specific tweaks

const DraftEngine: React.FC = () => {
  return (
    <div className="home">
      <header className="hero rules-hero">
        <Link to="/" className="logo-link">
          <img
            src="/wickdwear-logo.png"
            alt="WickdWear"
            className="logo"
          />
        </Link>

        <h1>How Our Proprietary Auto Draft Engine Works</h1>
      

        <div className="rules-container">
          
          {/* INTRO */}
          <div className="rules-card">
            <div className="rules-block">
              <p>
                We’ve taken the "luck of the draw" out of the tournament. To ensure every game is competitive and every team is functional, we use a proprietary <strong>Auto Draft Engine</strong>. This system is more thorough and impartial than any human director could be.
              </p>
            </div>
          </div>

          {/* 1. PROTOCOL */}
          <div className="rules-card">
            <h2>🛡️ 1. The Complete Team Protocol</h2>
            <div className="rules-block">
              <p>
                The engine doesn't just "fill spots." It builds a team that can take the field. 
                While most drafts just shuffle names, our engine performs a <strong>Three-Phase Audit</strong>:
              </p>
              <ul>
                <li><strong>The Pitcher:</strong> It secures a pitcher for every team first.</li>
                <li><strong>Defensive Alignment:</strong> The engine is programmed to know exactly what a team needs. Teams will be drafted with either a primary or secondary position player at each position.</li>
                <li><strong>Bench Fill:</strong> Once a legal team has been created, the engine fills any extra spots as bench players.</li>
              </ul>
              <div className="engine-audit-box">
                <strong>The Result:</strong> You won't show up to find a team with 6 Shortstops and no Outfielders. Every team is built with a specific defensive identity.
              </div>
            </div>
          </div>

          {/* 2. LOGIC */}
          <div className="rules-card">
            <h2>⚖️ 2. Zero Favorites, 100% Logic</h2>
            <div className="rules-block">
              <p>
                A human director might accidentally or on purpose "stack" a team. Our engine is 
                <strong> blind to names</strong>. It only sees positions, rules, and math. It simulates 
                hundreds of different draft combinations in seconds and only selects the one that 
                is mathematically the most balanced for everyone.
              </p>
            </div>
          </div>

          {/* 3. COMPANIONS */}
          <div className="rules-card">
            <h2>🤝 3. We Keep You and Your Companion Together</h2>
            <div className="rules-block">
              <p>
                If you register with a "Companion", the system assigns a <span className="seed-highlight">CompanionGroupID</span>. 
                The engine treats these as a single unit. It won't split you up to fill a gap elsewhere. 
                It finds a home for the group together while still balancing the defensive needs of the team.
              </p>
            </div>
          </div>

          {/* 4. PARITY */}
          <div className="rules-card">
            <h2>📉 4. The Parity Check (No "Super-Teams")</h2>
            <div className="rules-block">
              <p>
                Once the engine builds a functional draft, it runs a final <strong>Parity Test</strong>. 
                It compares the average skill level of every team. If one team is significantly stronger 
                than the rest, the engine "throws that draft in the trash" and starts over until the 
                skill gap between the top and bottom teams is as small as possible.
              </p>
            </div>
          </div>

          {/* 5. PROVABILITY */}
          <div className="rules-card">
            <h2>🧬 5. Total Provability</h2>
            <div className="rules-block">
              <p>
                The most unique feature of our Draft Engine is that it is <strong>Deterministic</strong>. 
                In plain English: the results are 100% repeatable and can be audited for fairness.
              </p>
              
              <h4>The "Digital Receipt" (The Seed)</h4>
              <ul>
                <li><strong>No Manual Tweaks:</strong> Once a draft is finalized, the results cannot be "nudged" or "adjusted" by a human.</li>
                <li><strong>The Replay Guarantee:</strong> If we took the exact same list of players and entered that unique Seed back into the engine, it would produce the exact same teams every single time.</li>
                <li><strong>Scientific Accuracy:</strong> This proves that the team you are on was chosen by a consistent mathematical formula.</li>
              </ul>
            </div>
          </div>

          <p className="rules-footer">
            Have fun & stay <strong>WICKD!</strong>
          </p>

          <div className="actions">
            <Link to="/rules" className="btn secondary">
              ← Back to Rules
            </Link>
            <Link to="/register" className="btn primary">
              Register Now
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default DraftEngine;