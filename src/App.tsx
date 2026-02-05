import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerRegistrationForm from "./components/PlayerRegistrationForm";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import RegisteredPlayers from "./pages/RegisteredPlayers";
import RepLeaderboard from "./pages/RepLeaderboard";
import RulesPage from "./pages/RulesPage";

const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

export default function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route path="/" element={<HomePage />} />

      {/* REGISTRATION PAGE */}
      <Route
        path="/register"
        element={<PlayerRegistrationForm eventId={EVENT_ID} />}
      />

      {/* REGISTERED PLAYERS PAGE */}
      <Route path="/registrations" element={<RegisteredPlayers />} />

      {/* REP LEADERBOARD PAGE */}
      <Route path="/rep-leaderboard" element={<RepLeaderboard />} />

      {/* RULES PAGE (UI button added later after sign-off) */}
      <Route path="/rules" element={<RulesPage />} />

      {/* PAYPAL SUCCESS RETURN */}
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
    </Routes>
  );
}
