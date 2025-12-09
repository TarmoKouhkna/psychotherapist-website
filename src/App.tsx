import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { SchedulingPage } from "./components/SchedulingPage";
import { CancelBookingPage } from "./components/CancelBookingPage";
import { BookingConfirmationPage } from "./components/BookingConfirmationPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulingPage />} />
        <Route path="/cancel" element={<CancelBookingPage />} />
        <Route path="/confirm" element={<BookingConfirmationPage />} />
      </Routes>
    </Router>
  );
}
