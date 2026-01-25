import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerRegistrationForm from "./components/PlayerRegistrationForm";

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
    </Routes>
  );
}
