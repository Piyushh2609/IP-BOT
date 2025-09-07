import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>RESUME INTERVIEW BOT</h1>
      <div className="sections">
        <button onClick={() => navigate("/anonymous")}>
          Anonymous Questions
        </button>
        <button onClick={() => navigate("/resume")}>
          Resume-Based Questions
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
