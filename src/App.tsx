import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerRegistrationForm from "./components/PlayerRegistrationForm";

export default function App() {
  return (
    <Routes>
      {/* HOME PAGE */}
      <Route path="/" element={<HomePage />} />

      {/* REGISTRATION PAGE */}
      <Route
        path="/register"
        element={<PlayerRegistrationForm eventId="demo-event-id" />}
      />
    </Routes>
  );
}
