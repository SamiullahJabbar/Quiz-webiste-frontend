import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestCodeVerification from "./pages/TestCodeVerification";
import TestInterface from "./pages/TestInterface";
import BreakScreen from './pages/BreakScreen';
import FinishTestScreen from './pages/FinishTestScreen';




function App() {
  return (
    <Router>
    
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Register />} />
          {/* <Route path="/courses" element={<Courses />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/TestCodeVerification" element={<TestCodeVerification />} />
          <Route path="/Testface" element={<TestInterface />} />
          <Route path="/break" element={<BreakScreen />} />
          <Route path="/finshTest" element={<FinishTestScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
