import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import FDARGenAI from "../pages/FDARGenAI";
import GenHistory from "../pages/GenHistory";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/FDARGenAI" element={<FDARGenAI />} />
        <Route path="/history" element={<GenHistory />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
