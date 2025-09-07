import React, { useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
export default function MockInterview({ resumeText, questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    const question = questions[currentIndex];

    try {
      const res = await axios.post(`${backendUrl}/api/feedback`, {
        resume: resumeText,
        question,
        answer,
      });

      const result = {
        question,
        answer,
        feedback: res.data.feedback,
      };

      // Save in history
      setHistory([...history, result]);
      setFeedback(res.data.feedback);

      // Clear answer
      setAnswer("");

      // Automatically go to next question after 3 seconds
      setTimeout(() => {
        setFeedback("");
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setFeedback("❌ Failed to get feedback. Try again.");
    }
  };

  // If finished
  if (currentIndex >= questions.length) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold text-green-700">✅ Interview Completed</h2>
        <p className="text-gray-600">Here’s your full feedback session:</p>

        <div className="mt-4 space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold text-gray-800">Q{idx + 1}: {item.question}</p>
              <p className="text-blue-700"><strong>Your Answer:</strong> {item.answer}</p>
              <p className="text-green-700"><strong>AI Feedback:</strong> {item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p className="text-gray-700">{questions[currentIndex]}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-2 border rounded-lg"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit Answer
      </button>

      {feedback && (
        <div className="mt-4 p-3 border-t bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-green-700">AI Feedback:</h3>
          <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
          <p className="text-sm text-gray-500">Next question loading...</p>
        </div>
      )}
    </div>
  );
}
