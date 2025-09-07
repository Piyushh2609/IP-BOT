import React, { useState } from "react";
import axios from "axios";
import "./ResumeQuestion.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

function ResumePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setQuestions([]);
    setResumeUrl("");
    setCurrentIndex(0);
    setCurrentAnswer("");
    setFeedback("");
  };

  const uploadResume = async () => {
    if (!file) return setMessage("Please select a file first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload-and-generate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
        setResumeUrl(res.data.resumeUrl || "");
        setMessage("Resume uploaded! Ready for questions.");
        setCurrentIndex(0);
      } else {
        setMessage("No questions generated. Try another resume.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Try again.");
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return setFeedback("Please write or speak an answer!");
    try {
      const res = await axios.post(`${backendUrl}/api/feedback`, {
        question: questions[currentIndex],
        answer: currentAnswer,
      });
      setFeedback(res.data.feedback || "No feedback available.");
    } catch (err) {
      console.error(err);
      setFeedback("Failed to get feedback.");
    }
  };

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setCurrentAnswer("");
    setFeedback("");
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
  };

  return (
    <div className="resume-page">
      <h1>Resume-Based Q&A</h1>

      <div className="file-upload">
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button onClick={uploadResume}>Upload & Generate Questions</button>
      </div>

      {message && <p className="message">{message}</p>}

      {questions.length > 0 && (
        <div className="qa-container">
          {/* LEFT: Resume Preview */}
          <div className="resume-preview">
            <h2>Uploaded Resume</h2>
            {resumeUrl ? (
              <iframe src={resumeUrl} title="Resume Preview" />
            ) : (
              <p>No resume available</p>
            )}
          </div>

          {/* RIGHT: Q&A Section */}
          <div className="qa-section">
            {currentIndex < questions.length ? (
              <>
                <h2>
                  Question {currentIndex + 1} 
                </h2>
                <p>{questions[currentIndex]}</p>

                <textarea
                  rows="3"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />

                <div className="qa-buttons">
                  <button onClick={handleAnswerSubmit}>Submit Answer</button>
                  {currentIndex < questions.length - 1 && (
                    <button onClick={handleNextQuestion}>Next Question</button>
                  )}
                  <button
                    onClick={startRecording}
                    className={isRecording ? "recording" : ""}
                  >
                    {isRecording ? "Listening..." : "🎤 Speak Answer"}
                  </button>
                </div>

                {feedback && <div className="feedback">{feedback}</div>}
              </>
            ) : (
              <p className="completed-message">🎉 You have completed all questions!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumePage;
