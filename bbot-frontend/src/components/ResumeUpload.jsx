import React, { useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
export default function ResumeQnA() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(50); // default number of questions

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
  };

  const generateQuestions = async () => {
    if (!file) {
      alert("⚠️ Please upload a resume first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("count", count);

      const res = await axios.post(
        `${backendUrl}/api/upload-and-generate`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestions(["❌ Failed to generate questions."]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">📄 Resume-Based Q&A</h1>

      {/* Upload Resume */}
      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileUpload}
        className="mb-4 block w-full border p-2 rounded-lg"
      />

      {/* Question Count Selector */}
      <label className="block mb-2 font-medium">Number of Questions:</label>
      <select
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="mb-4 p-2 border rounded-lg w-full"
      >
        <option value={5}>5 Questions</option>
        <option value={10}>10 Questions</option>
        <option value={15}>15 Questions</option>
        <option value={20}>20 Questions</option>
        <option value={50}>50 Questions</option>
      </select>

      {/* Generate Button */}
      <button
        onClick={generateQuestions}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "⏳ Generating..." : "🚀 Generate Questions"}
      </button>

      {/* Questions Display */}
      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">✅ Generated Questions:</h2>
          <ul className="list-disc pl-6 space-y-2">
            {questions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
