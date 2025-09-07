import React, { useState } from "react";
import axios from "axios";
import "./AnonymousPage.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";


// Shared behavioral questions
const behavioralQuestions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why should we hire you?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work in this company?",
  "Describe a time when you worked in a team.",
  "Tell me about a time you showed leadership skills.",
  "How do you handle stress and pressure?",
  "Give an example of when you faced a conflict and how you resolved it.",
  "What motivates you?",
  "Tell me about a time you failed and what you learned.",
  "How do you prioritize your tasks?",
  "Describe a situation where you took initiative.",
  "Tell me about a time you had to learn something quickly.",
  "How do you handle criticism?",
  "What are your hobbies and interests?",
  "Describe a time when you had to adapt to change.",
  "What is your greatest achievement?",
  "Tell me about a situation where you went above and beyond.",
  "How do you handle tight deadlines?",
  "Describe a time you made a mistake and how you corrected it.",
  "How do you deal with difficult team members?",
  "What makes you a good team player?",
  "Describe a time you had to convince someone of your idea.",
  "How do you manage multiple projects at once?",
  "What do you consider your biggest failure?",
  "Tell me about a time you handled a difficult customer or client.",
  "How do you stay motivated during repetitive tasks?",
  "Describe a time you had to work with limited resources.",
  "How do you handle ambiguity in tasks?",
  "Tell me about a time you received constructive feedback.",
  "Describe a time you solved a problem creatively.",
  "How do you handle disagreements with your supervisor?",
  "What is your approach to learning new skills?",
  "Describe a time you had to make a difficult decision.",
  "How do you handle conflicts within a team?",
  "Tell me about a time you demonstrated responsibility.",
  "What are your core values?",
  "Describe a time you handled a stressful situation successfully.",
  "How do you stay organized?",
  "Tell me about a time you faced ethical dilemmas at work.",
  "What do you do to improve yourself professionally?",
  "Describe a situation where you had to meet tight deadlines.",
  "How do you deal with failure or rejection?",
  "Tell me about a time you influenced others positively.",
  "Describe a time when you showed initiative without being asked.",
  "What motivates you to succeed?",
  "How do you handle disagreements with peers?",
  "Tell me about a time when you had to adapt your communication style."
];


// Technical questions per branch
const questionsData = {
  "Computer Science Engineering (CSE)": {
     technical : [
  "Explain the difference between stack and queue.",
  "What is the difference between an array and a linked list?",
  "How does a hash table work?",
  "Explain Big O notation with examples.",
  "What is recursion? Provide an example.",
  "How do you detect a cycle in a linked list?",
  "Explain the difference between depth-first and breadth-first search.",
  "What are trees and binary trees?",
  "What is a binary search tree?",
  "How does quicksort work? Explain its complexity.",
  "Explain merge sort and its advantages.",
  "What is dynamic programming? Give an example problem.",
  "How do you reverse a linked list?",
  "Explain a priority queue and its use cases.",
  "What is a graph? Explain adjacency list vs adjacency matrix.",
  "How do you find the shortest path in a graph?",
  "Explain stack overflow and heap overflow.",
  "Difference between singly and doubly linked list.",
  "Explain the difference between linear and binary search.",
  "How to implement a circular queue?",
  "What are the four principles of OOP?",
  "Explain polymorphism with an example.",
  "What is encapsulation?",
  "What is inheritance?",
  "Explain the difference between abstraction and encapsulation.",
  "What are interfaces and abstract classes?",
  "What is method overloading vs method overriding?",
  "Explain constructor vs destructor.",
  "Difference between composition and aggregation.",
  "Explain the use of the 'this' keyword in OOP.",
  "What is normalization? Explain 1NF, 2NF, 3NF.",
  "Difference between SQL and NoSQL databases.",
  "Explain ACID properties.",
  "What is indexing in databases?",
  "Difference between primary key and foreign key.",
  "What is a join? Explain types of joins.",
  "How to prevent SQL injection?",
  "Difference between clustered and non-clustered index.",
  "What is a transaction in databases?",
  "Explain the difference between DELETE and TRUNCATE.",
  "Explain TCP vs UDP.",
  "What is a socket?",
  "What is DNS and how does it work?",
  "Explain the OSI model.",
  "What is a process vs a thread?",
  "Difference between concurrency and parallelism.",
  "Explain virtual memory.",
  "What is deadlock and how to prevent it?",
  "Explain paging vs segmentation in OS.",
  "What is multithreading and its advantages?"
],
    behavioral: behavioralQuestions
  },
  "Mechanical Engineering (ME)" : {
     technical :[
  "Explain the first and second law of thermodynamics.",
  "What is the difference between a two-stroke and a four-stroke engine?",
  "Explain the working of a four-stroke engine.",
  "Define stress and strain with examples.",
  "What is the difference between tensile and compressive stress?",
  "Explain the concept of moment of inertia.",
  "Define mechanical advantage and velocity ratio.",
  "What is a heat exchanger and its types?",
  "Explain the working principle of a refrigeration cycle.",
  "Define specific heat capacity and its importance.",
  "Difference between laminar and turbulent flow.",
  "Explain Bernoulli’s principle with an example.",
  "What is the difference between isothermal and adiabatic processes?",
  "Explain different types of gears and their applications.",
  "What is a bearing and what are its types?",
  "Define Reynolds number and its significance.",
  "Explain Pascal’s law with an example.",
  "What is the difference between ductile and brittle materials?",
  "Explain fatigue in materials and its effects.",
  "Define creep and its significance in design.",
  "Difference between static and dynamic loads.",
  "Explain torque and its calculation in mechanical systems.",
  "What is the difference between SI and CI engines?",
  "Explain the working of a centrifugal pump.",
  "Difference between a centrifugal and a reciprocating pump.",
  "Define bearing load capacity and types of loads.",
  "Explain the difference between elastic and plastic deformation.",
  "What is the difference between mild steel and carbon steel?",
  "Define coefficient of friction and types of friction.",
  "Explain the working principle of a four-bar linkage mechanism.",
  "Difference between open and closed loop control systems.",
  "Explain the difference between cantilever and simply supported beams.",
  "What is the difference between surface and volume heat transfer?",
  "Explain the concept of lubrication and types of lubricants.",
  "Define deflection in beams and how to calculate it.",
  "Explain the working of a boiler and its components.",
  "Difference between forced and natural convection.",
  "Explain the concept of power transmission using belts and pulleys.",
  "Define thermal conductivity and its importance.",
  "What is the difference between open and closed belt drive systems?",
  "Explain the principle and applications of CNC machines.",
  "What are the different types of welding and their applications?",
  "Explain Reynolds Transport Theorem in simple terms.",
  "Difference between isotropic and anisotropic materials.",
  "Explain the difference between linear and rotational motion.",
  "Define work, power, and energy with examples.",
  "Explain the difference between velocity and acceleration.",
  "What is a flywheel and its function in engines?",
  "Explain the concept of vibration and damping.",
  "Difference between internal and external combustion engines.",
  "What is meant by thermodynamic efficiency of a system?"
],
    behavioral: behavioralQuestions
  },
  "Electronics & Communication (EC)": {
    technical : [
  "Explain Ohm's Law with examples.",
  "What is the difference between analog and digital signals?",
  "Explain the working of a PN junction diode.",
  "What is a Zener diode and its applications?",
  "Explain the difference between NPN and PNP transistors.",
  "What is a BJT and how does it work?",
  "Explain the working of a MOSFET.",
  "Difference between BJT and MOSFET.",
  "Explain the concept of biasing in transistors.",
  "What is the difference between an amplifier and an oscillator?",
  "Explain the working of a common-emitter amplifier.",
  "What is a rectifier? Explain half-wave and full-wave rectifiers.",
  "Difference between synchronous and asynchronous circuits.",
  "What is a logic gate? Explain AND, OR, NOT gates.",
  "Explain combinational vs sequential circuits.",
  "What is flip-flop? Explain SR and D flip-flops.",
  "Difference between microprocessor and microcontroller.",
  "Explain the working of an ADC and DAC.",
  "What is the difference between PWM and PPM?",
  "Explain the concept of modulation and types of modulation.",
  "What is AM and FM modulation?",
  "Explain the working of a phase-locked loop (PLL).",
  "What is an op-amp? Explain its ideal characteristics.",
  "Difference between inverting and non-inverting amplifier.",
  "Explain integrator and differentiator circuits using op-amp.",
  "What is a filter? Explain low-pass, high-pass, and band-pass filters.",
  "Explain the working of a 555 timer IC.",
  "Difference between monostable, astable, and bistable multivibrators.",
  "What is noise? Explain types of noise in electronic circuits.",
  "Explain the concept of gain and bandwidth in amplifiers.",
  "What is an oscillator? Explain RC and LC oscillators.",
  "Difference between half adder and full adder.",
  "Explain shift registers and their types.",
  "What is memory? Explain RAM and ROM.",
  "Difference between SRAM and DRAM.",
  "Explain the working of a voltage regulator IC.",
  "What is a power supply? Explain linear and switching power supplies.",
  "Explain transmission lines and their importance in communication.",
  "What is a waveguide and its applications?",
  "Difference between coaxial cable and optical fiber.",
  "Explain the concept of modulation index.",
  "What is multiplexing? Explain TDM and FDM.",
  "Explain the working of a basic AM and FM receiver.",
  "Difference between baseband and broadband signals.",
  "Explain Nyquist sampling theorem.",
  "What is aliasing in signal processing?",
  "Explain Fourier transform and its importance.",
  "Difference between digital and analog communication.",
  "What is a microcontroller-based embedded system?",
  "Explain UART, SPI, and I2C communication protocols."
],
    behavioral: behavioralQuestions
  },
  "Electrical Engineering (EE)": {
    technical:[
  "Explain Ohm's Law with examples.",
  "What is the difference between AC and DC current?",
  "Define voltage, current, and power.",
  "What is a transformer? Explain its working principle.",
  "Difference between step-up and step-down transformers.",
  "Explain the concept of three-phase AC supply.",
  "What is the difference between star and delta connection?",
  "Explain power factor and its importance.",
  "What is a synchronous motor and how does it work?",
  "Explain the working of an induction motor.",
  "Difference between single-phase and three-phase induction motors.",
  "What is an alternator and its principle of operation?",
  "Explain the concept of electromagnetic induction.",
  "Difference between AC generator and DC generator.",
  "What are the types of electrical circuits?",
  "Explain series and parallel circuits with examples.",
  "What is a relay and its applications?",
  "Explain the working of a circuit breaker.",
  "Difference between fuse and MCB.",
  "What is the difference between RLC series and parallel circuits?",
  "Explain impedance, reactance, and admittance.",
  "What is resonance in electrical circuits?",
  "Explain the concept of load and no-load condition in transformers.",
  "Difference between single-phase and three-phase power.",
  "Explain Kirchhoff’s voltage and current laws.",
  "What is a capacitor and its applications in circuits?",
  "Explain inductors and their applications.",
  "Difference between active and passive filters.",
  "What is a rectifier? Explain half-wave and full-wave rectifiers.",
  "Explain the working of a voltage regulator.",
  "What is a power supply? Explain linear and switching types.",
  "Explain the difference between grounding and earthing.",
  "What is a semiconductor? Explain intrinsic and extrinsic types.",
  "Difference between diode, BJT, and MOSFET.",
  "Explain the working of a DC motor.",
  "Difference between shunt and series DC motors.",
  "What is the purpose of a star-delta starter?",
  "Explain the concept of load flow analysis.",
  "What is a circuit breaker and types of circuit breakers?",
  "Explain harmonic distortion in electrical systems.",
  "What is a PLC? Explain its basic operation.",
  "Difference between SCADA and DCS systems.",
  "Explain the working of an UPS system.",
  "What is an H-bridge and its applications?",
  "Difference between open loop and closed loop control systems.",
  "Explain the difference between synchronous and asynchronous machines.",
  "What is the difference between real, reactive, and apparent power?",
  "Explain the importance of protective relays in electrical systems.",
  "What is a current transformer (CT) and voltage transformer (VT)?",
  "Explain the working of a digital multimeter.",
  "Difference between AC and DC drives."
],

    behavioral: behavioralQuestions
  }
};

function AnonymousPage() {
  const [step, setStep] = useState(1); // 1: branch, 2: category, 3: Q&A
  const [branch, setBranch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedbackData, setFeedbackData] = useState({ feedback: "", correctAnswer: "" });
  const [isRecording, setIsRecording] = useState(false);

  // Branch selection
  const handleBranchSelect = (selectedBranch) => {
    setBranch(selectedBranch);
    setStep(2);
  };

  // Category selection
  const handleCategorySelect = (selectedCategory) => {
    const selectedQuestions = questionsData[branch][selectedCategory];
    setQuestions(selectedQuestions);
    setStep(3);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setFeedbackData({ feedback: "", correctAnswer: "" });
  };

  // Submit answer and get feedback + correct answer
  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) {
      setFeedbackData({ feedback: "Please write or speak an answer!", correctAnswer: "" });
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/feedback`, {
        question: questions[currentIndex],
        answer: currentAnswer,
      });

      setFeedbackData({
        feedback: res.data.feedback || "No feedback available.",
        correctAnswer: res.data.correctAnswer || "No correct answer available."
      });
    } catch (err) {
      console.error(err);
      setFeedbackData({ feedback: "Failed to get feedback.", correctAnswer: "" });
    }
  };

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setCurrentAnswer("");
    setFeedbackData({ feedback: "", correctAnswer: "" });
  };

  // Speech-to-text
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
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
    <div className="anonymous-page">
      <h1>Anonymous Q&A</h1>

      {/* Step 1: Branch selection */}
      {step === 1 && (
        <div className="selection-section">
          <h2>Select Your Branch</h2>
          <div className="options">
            {Object.keys(questionsData).map((b) => (
              <button key={b} onClick={() => handleBranchSelect(b)}>{b}</button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Category selection */}
      {step === 2 && (
        <div className="selection-section">
          <h2>Select Question Type</h2>
          <div className="options">
            {["technical", "behavioral"].map((cat) => (
              <button key={cat} onClick={() => handleCategorySelect(cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Q&A Section */}
      {step === 3 && currentIndex < questions.length && (
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

          {feedbackData.feedback && (
            <div className="feedback">
              <strong>Feedback:</strong> {feedbackData.feedback}
              <br />
              <strong>Correct Answer:</strong> {feedbackData.correctAnswer}
            </div>
          )}
        </div>
      )}

      {/* Completion message */}
      {step === 3 && currentIndex >= questions.length && (
        <p className="completed-message">🎉 You have completed all questions!</p>
      )}
    </div>
  );
}

export default AnonymousPage;
