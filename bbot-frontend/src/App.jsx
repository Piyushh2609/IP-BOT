import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AnonymousQuestion from "./components/AnonymousQuestion";
import ResumeQuestion from "./components/ResumeQuestion";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/anonymous" element={<AnonymousQuestion />} />
      <Route path="/resume" element={<ResumeQuestion />} />
    </Routes>
  );
}

export default App;
