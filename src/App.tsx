import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { SchedulingPage } from "./components/SchedulingPage";
import { CancelBookingPage } from "./components/CancelBookingPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulingPage />} />
        <Route path="/cancel" element={<CancelBookingPage />} />
      </Routes>
    </Router>
  );
}
