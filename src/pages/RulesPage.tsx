import { Link } from "react-router-dom";
import "./RulesPage.css";

export default function RulesPage() {
  return (
    <div className="home">
      <header className="hero rules-hero">
        {/* FIX: Wrapped logo in Link to return home */}
        <Link to="/" className="logo-link">
          <img
            src="/wickdwear-logo.png"
            alt="WickdWear"
            className="logo"
          />
        </Link>

        <h1>WICKD Draft Tournament Rules</h1>
        <p className="subhead">
          Memorial Day Draft Tournament • May 23–24, 2026
        </p>

        <div className="rules-container">

          {/* 🏆 FORMAT */}
          <div className="rules-card">
            <h2>🏆 Format</h2>
            <div className="rules-block">
              <ul>
                <li><strong>CO-ED</strong></li>
                <li>5-Game Guarantee</li>
                <li>3 pool play games (for seeding) followed by a double-elimination championship bracket.</li>
              </ul>
            </div>
          </div>

          {/* 🥎 EQUIPMENT */}
          <div className="rules-card">
            <h2>🥎 Equipment</h2>
            <div className="rules-block">
              <h3>Softballs</h3>
              <ul>
                <li>USSSA Pro M stamped 44/375</li>
                <li>Teams receive 6 men’s balls; women’s balls are provided to the umpires.</li>
                <li>
                  <strong>Illegal Ball Appeal:</strong> Must be appealed before the first pitch (warning issued). 
                  If appealed after the ball is in play but before the next pitch, it is a dead ball out.
                </li>
              </ul>
            </div>
            <div className="rules-block">
              <h3>Bats</h3>
              <ul>
                <li>USSSA stamped 240 bats only. No senior bats. No banned Suncoast bats.</li>
                <li>
                  <strong>Penalty:</strong> 1st offense is a dead ball out + team warning. 
                  2nd offense (same team) is a dead ball out + hitter ejection.
                </li>
              </ul>
            </div>
          </div>

          {/* 🎯 PITCHING */}
          <div className="rules-card">
            <h2>🎯 Pitching</h2>
            <div className="rules-block">
              <ul>
                <li><strong>Pitch Arch:</strong> 4 ft – 10 ft (measured from the ground).</li>
                <li>Pump fakes are allowed.</li>
                <li>Pitchers may pitch up to 6 feet behind the rubber.</li>
                <li>Pitching screens are allowed.</li>
                <li>Pitcher must toe the rubber if using a net.</li>
                <li>1–1 count with one courtesy foul.</li>
              </ul>
            </div>
          </div>

          {/* 🏃 BASE RUNNING */}
          <div className="rules-card">
            <h2>🏃 Base Running & Runners</h2>
            <div className="rules-block">
              <ul>
                <li>No Stealing.</li>
                <li>Females can be thrown out at 1st base from the outfield.</li>
                <li><strong>Courtesy Runners:</strong> 1 per inning per gender, plus one for the pitcher.</li>
                <li>
                  <strong>ADA Runner:</strong> Runner provided each at-bat starting from home plate. 
                  Must be the last out of the same gender.
                </li>
              </ul>
            </div>
          </div>

          {/* 👫 COED & LINEUP */}
          <div className="rules-card">
            <h2>👫 Coed & Lineup Rules</h2>
            <div className="rules-block">
              <ul>
                <li>Lineups must be exchanged before the first pitch. Everyone must be in the lineup and play.</li>
                <li>Max 10 players on the field.</li>
                <li>No CO-ED line.</li>
                <li>No two players of the same gender may sit at the same time.</li>
                <li>Only 1 male and 1 female may EH. You cannot use 2 female EHs to stack extra males in the field.</li>
                <li>
                  <strong>Walk Rule:</strong> If a male is walked with a female behind him in the line, the female behind him chooses to hit or walk.
                  <ul>
                    <li>If she hits: Male to 1st base.</li>
                    <li>If she walks: Male to 2nd base (must touch 1st).</li>
                  </ul>
                </li>
                <li>Each team will be provided with a scorebook.</li>
                <li>Coed M/F ratio will be determined at the time of the draft.</li>
              </ul>
            </div>
          </div>

          {/* ⏱️ GAME PLAY */}
          <div className="rules-card">
            <h2>⏱️ Game Play & Limits</h2>
            <div className="rules-block">
              <ul>
                <li><strong>Home Runs:</strong> 6 then an out.</li>
                <li>60-minute "Drop Dead" game time for pool play.</li>
                <li>60-minute "finish the inning" for Bracket, Championship, and "IF" games.</li>
                <li><strong>Run Rules:</strong>
                  <ul>
                    <li>20 runs after 3 innings</li>
                    <li>15 runs after 4 innings</li>
                    <li>10 runs after 5 innings</li>
                  </ul>
                </li>
                <li><strong>Extra Innings:</strong> Texas Tie Breaker (last recorded out starts at second base).</li>
              </ul>
            </div>
          </div>

          {/* ⚠️ ROSTERS & DISCIPLINE */}
          <div className="rules-card">
            <h2>⚠️ Injuries, Ejections & No Shows</h2>
            <div className="rules-block">
              <h3>Injuries</h3>
              <ul>
                <li>First missed at-bat is an out. If the player cannot continue to hit that game, subsequent at bats will be skipped without penalty.</li>
                <li>If the player wishes to stay in the game and continue to play, their at-bat will remain an out if they cannot physically take the at-bat.</li>
                <li>A player who cannot bat, cannot continue in playing the tournament.</li>
              </ul>
            </div>
            <div className="rules-block">
              <h3>Ejections & No-Shows</h3>
              <ul>
                <li><strong>Ejections:</strong> Result in an automatic out in that lineup spot for the remainder of the game.</li>
                <li>The Tournament Director will determine further eligibility. Ejected players are ineligible for prizes.</li>
                <li><strong>No-Shows:</strong> If a player is missing by the end of Game 1 with no contact, they are removed from the tournament.</li>
                <li>If the player has been contacted but will be late, their team can choose to add them as the 12th player.</li>
                <li>If not there by the time of their at-bat, the team can choose to remove them.</li>
                <li>Removed players are ineligible for prize package distribution.</li>
                <li>No roster additions unless approved by tournament director.</li>
                <li>If a player drops within 1 week, director will attempt to fill from the waitlist.</li>
              </ul>
            </div>
          </div>

          {/* 🏆 PRIZES */}
          <div className="rules-card">
            <h2>🏆 Prizes</h2>
            <div className="rules-block">
              <ul>
                <li>Must be on official roster to receive prizes.</li>
              </ul>
            </div>
          </div>

          {/* ⛈️ WEATHER & REFUNDS */}
          <div className="rules-card">
            <h2>⛈️ Weather & Refunds</h2>
            <div className="rules-block">
              <ul>
                <li><strong>Weather:</strong> The Director reserves the right to modify game formats (1-pitch, shortened times) due to weather.</li>
                <li><strong>Refunds:</strong> No refunds are issued after pool play begins.</li>
                <li>If cancelled during bracket play, prizes are awarded to the top 2 remaining teams based on seeding/run differential.</li>
              </ul>
            </div>
          </div>

          <p className="rules-footer">
            Have fun & stay <strong>WICKD!</strong>
          </p>

          {/* Updated Action Buttons for the bottom */}
          <div className="actions" style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn secondary">
              ← Back to Event
            </Link>
            <Link to="/register" className="btn primary">
              Register Now
            </Link>
          </div>

        </div>
      </header>
    </div>
  );
}