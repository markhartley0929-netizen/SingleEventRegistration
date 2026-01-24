import { Routes, Route, Link } from "react-router-dom";
import PlayerRegistrationForm from "./components/PlayerRegistrationForm";

export default function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route
        path="/"
        element={
          <div style={{ padding: 48 }}>
            <h1>Single Event Registration</h1>
            <p>Welcome — the app is live.</p>

            <Link to="/register">
              <button style={{ marginTop: 16 }}>
                Register Player
              </button>
            </Link>
          </div>
        }
      />

      {/* REGISTRATION PAGE */}
      <Route
        path="/register"
        element={<PlayerRegistrationForm eventId="demo-event-id" />}
      />
    </Routes>
  );
}
