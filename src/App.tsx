import { Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import HomePage from "./pages/HomePage";
import PlayerRegistrationForm from "./components/PlayerRegistrationForm";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import RegisteredPlayers from "./pages/RegisteredPlayers";
import RepLeaderboard from "./pages/RepLeaderboard";
import RulesPage from "./pages/RulesPage";
import DraftEngine from "./pages/DraftEngine"; // Added this import

const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

const paypalOptions = {
  clientId: "AfEjrWK-IRiVSotpdREEKBai9pOh5sDlakO_BiR0iGEwY9A6e_cjwNFrCoxyEDW8Y3i8bob68xu_wo5S",
  currency: "USD",
  intent: "capture",
  components: "buttons,messages,googlepay,applepay",
  "enable-funding": "venmo,paylater,card",
};

export default function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={<PlayerRegistrationForm eventId={EVENT_ID} />}
        />
        <Route path="/registrations" element={<RegisteredPlayers />} />
        <Route path="/rep-leaderboard" element={<RepLeaderboard />} />
        <Route path="/rules" element={<RulesPage />} />
        
        {/* New Route for the Draft Engine Page */}
        <Route path="/draft-engine" element={<DraftEngine />} />

        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </PayPalScriptProvider>
  );
}