import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import FDARGenAI from "../pages/FDARGenAI";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/FDARGenAI" element={<FDARGenAI />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
