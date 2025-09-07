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
  const [history, setHistory] = useState([]);

  let recognition;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setQuestions([]);
    setResumeUrl("");
    setCurrentIndex(0);
    setCurrentAnswer("");
    setFeedback("");
    setHistory([]);
  };

  const uploadResume = async () => {
    if (!file) return setMessage("Please select a file first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ Match backend endpoint
      const res = await axios.post(`${backendUrl}/api/upload-a`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Expecting backend to return: { status, fileName, resumeUrl, questions }
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
        resume: resumeUrl,
      });

      const result = {
        question: questions[currentIndex],
        answer: currentAnswer,
        feedback: res.data.feedback || "No feedback available.",
      };

      setHistory((prev) => [...prev, result]);
      setFeedback(result.feedback);

      // Auto-advance after showing feedback
      setTimeout(() => {
        setFeedback("");
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
        setCurrentAnswer("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to get feedback.");
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCurrentAnswer((prev) => prev + " " + transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.start();
    setIsRecording(true);
  };

  // 🎉 Show summary when finished
  if (currentIndex >= questions.length && questions.length > 0) {
    return (
      <div className="resume-page">
        <h1>✅ Interview Completed</h1>
        <p>Here’s your full feedback session:</p>

        <div className="qa-container">
          {history.map((item, idx) => (
            <div key={idx} className="qa-summary">
              <p><strong>Q{idx + 1}:</strong> {item.question}</p>
              <p className="answer"><strong>Your Answer:</strong> {item.answer}</p>
              <p className="feedback"><strong>AI Feedback:</strong> {item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            <h2>
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <p>{questions[currentIndex]}</p>

            <textarea
              rows="3"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />

            <div className="qa-buttons">
              <button onClick={handleAnswerSubmit}>Submit Answer</button>
              <button
                onClick={startRecording}
                className={isRecording ? "recording" : ""}
              >
                {isRecording ? "Listening..." : "🎤 Speak Answer"}
              </button>
            </div>

            {feedback && <div className="feedback">{feedback}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumePage;
