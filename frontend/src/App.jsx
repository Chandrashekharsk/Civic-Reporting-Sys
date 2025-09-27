import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreateNewReport from "./pages/CreateNewReport";
import CheckStatus from "./pages/CheckStatus";
import UserDashboard from "./pages/UserDashboard";
import "./App.css"
import CameraCapture from "./components/CameraCapture";



function App() {
  return (
    <BrowserRouter>
      {/* <ToastContainer /> */}
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-report" element={<CreateNewReport />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/test" element={<CameraCapture />} />
        <Route path="/*" element={<>Not found</>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
