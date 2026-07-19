'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Maximize2, AlertTriangle, CheckCircle, Terminal, 
  HelpCircle, Sparkles, Cpu, Layers, Lock, RefreshCw, AlertCircle 
} from 'lucide-react';

interface SecureExamProps {
  onComplete: (score: number, integrity: number, examName: string, infractions: string[]) => void;
  onCancel: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

// Local pool of questions for "Astrophysics & Deep Networks"
const ASTRO_POOL: Question[] = [
  {
    question: "Which of the following activation functions is most likely to suffer from the dying gradient problem in deep neural networks?",
    options: ["Sigmoid", "Hyperbolic Tangent (tanh)", "Standard ReLU", "Leaky ReLU"],
    correctIndex: 2
  },
  {
    question: "In quantum wave mechanics, what does the absolute square of the wavefunction |Ψ(x,t)|^2 directly represent?",
    options: ["The energy state of the system", "The momentum density of the particle", "The position probability density of the particle", "The phase difference of overlapping waves"],
    correctIndex: 2
  },
  {
    question: "What is the primary mathematical reason for applying Backpropagation in Neural Networks?",
    options: ["To randomly initialize network weights", "To calculate the gradient of the loss function with respect to weights", "To compress the model dataset", "To translate continuous inputs into digital states"],
    correctIndex: 1
  },
  {
    question: "The Schwarzschild radius corresponds to the boundary of which cosmic phenomena?",
    options: ["A pulsar's magnetic pole", "The event horizon of a black hole", "The orbit of a binary neutron star", "The peak of a cosmic background wave"],
    correctIndex: 1
  },
  {
    question: "What limits Backpropagation convergence speed in sigmoidal neural networks?",
    options: ["Vanishing gradients at saturation limits", "Overfitting on test partitions", "The dying ReLU problem", "Excessive learning multipliers"],
    correctIndex: 0
  },
  {
    question: "In deep learning, what is a primary benefit of using residual (skip) connections?",
    options: ["They force weights to remain positive", "They mitigate vanishing gradients across extreme depths", "They eliminate the need for training labels", "They double the feature tensor resolution"],
    correctIndex: 1
  },
  {
    question: "Which parameter does the Huber loss combine to handle outliers in regression tasks?",
    options: ["Mean Squared Error and Mean Absolute Error", "Cross-entropy and Hinge loss", "L1 and L2 regularization penalties", "KL Divergence and Cosine similarity"],
    correctIndex: 0
  }
];

// Local pool of questions for "Quantum Wave Mechanics"
const QUANTUM_POOL: Question[] = [
  {
    question: "What forms the mathematical basis for the Heisenberg Uncertainty Principle?",
    options: ["Non-commuting operators in Hilbert space", "Relativistic mass expansions", "Thermodynamic entropy equations", "The second law of stellar nucleosynthesis"],
    correctIndex: 0
  },
  {
    question: "For an infinite square well of width L, how does the ground state energy E_1 scale with L?",
    options: ["Proportional to L", "Inversely proportional to L", "Inversely proportional to L^2", "Proportional to L^2"],
    correctIndex: 2
  },
  {
    question: "When a quantum particle encounters a potential barrier of energy V greater than its kinetic energy E, what happens?",
    options: ["It is always 100% reflected", "Its wavefunction decays exponentially inside the barrier", "It accelerates to superluminal velocities", "It collapses immediately into a point mass"],
    correctIndex: 1
  },
  {
    question: "Which quantum mechanical phenomenon allows electrons to travel through thin insulating gaps?",
    options: ["Photoelectric absorption", "Quantum Tunneling", "Compton scatter deflection", "Zeeman split resonance"],
    correctIndex: 1
  },
  {
    question: "What is the normalisation constraint for a continuous one-dimensional wavefunction Ψ(x)?",
    options: ["The integral of |Ψ(x)|^2 from -∞ to +∞ must equal 1", "The derivative dΨ/dx must remain positive", "The wavefunction must equal zero at x = 0", "The phase angle must remain a real number"],
    correctIndex: 0
  },
  {
    question: "What does the Hamiltonian operator represent in a quantum physical system?",
    options: ["The sum of kinetic and potential total energy", "The absolute spin projection matrix", "The orbital angular momentum vector", "The relativistic momentum drift"],
    correctIndex: 0
  }
];

export default function SecureExam({ onComplete, onCancel }: SecureExamProps) {
  const [sessionId] = useState<string>(() => Math.random().toString(36).substring(2, 9).toUpperCase());
  const [topic, setTopic] = useState<"astro" | "quantum" | "ai_custom">("astro");
  const [customTopicInput, setCustomTopicInput] = useState("Differential Calculus & Linear Maps");
  const [examStarted, setExamStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [infractions, setInfractions] = useState<string[]>([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [warningText, setWarningText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Shuffles any array helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Prepares the exam questions (Randomization & Shuffling)
  const generateRandomExam = async () => {
    setLoadingQuestions(true);
    setAnswers({});
    
    let baseQuestions: Question[] = [];

    if (topic === "ai_custom") {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "quiz",
            payload: {
              topic: customTopicInput,
              difficulty: "Advanced",
              count: 4
            }
          })
        });
        
        const data = await response.json();
        if (data.text) {
          // Parse dynamic JSON returned by Gemini
          let parsed: any[] = [];
          try {
            // Remove backticks if the model returned them despite system prompt
            let cleanJson = data.text.trim();
            if (cleanJson.startsWith("```json")) {
              cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
            } else if (cleanJson.startsWith("```")) {
              cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
            }
            parsed = JSON.parse(cleanJson);
          } catch (e) {
            console.error("Failed to parse Gemini dynamic JSON, falling back.", e);
            parsed = [];
          }

          if (Array.isArray(parsed) && parsed.length > 0) {
            baseQuestions = parsed.map((item: any) => ({
              question: item.question || "Advanced Mathematical Query",
              options: Array.isArray(item.options) ? item.options : ["Option A", "Option B", "Option C", "Option D"],
              correctIndex: typeof item.answerIndex === "number" ? item.answerIndex : 0
            }));
          }
        }
      } catch (err) {
        console.error("Gemini quiz generation failed:", err);
      }
    }

    // Fallbacks if dynamic generation fails or static topic is selected
    if (baseQuestions.length === 0) {
      const pool = topic === "quantum" ? QUANTUM_POOL : ASTRO_POOL;
      // Randomly select 4 questions from the pool
      const shuffledPool = shuffleArray(pool);
      baseQuestions = shuffledPool.slice(0, 4);
    }

    // Fully shuffle options for each selected question to guarantee absolute Random Questions protection
    const fullyShuffledQuestions = baseQuestions.map(q => {
      const optionsWithIndices = q.options.map((opt, idx) => ({
        text: opt,
        originalIndex: idx
      }));
      const shuffledOpts = shuffleArray(optionsWithIndices);
      const newCorrectIndex = shuffledOpts.findIndex(o => o.originalIndex === q.correctIndex);

      return {
        question: q.question,
        options: shuffledOpts.map(o => o.text),
        correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0
      };
    });

    setQuestions(fullyShuffledQuestions);
    setLoadingQuestions(false);
    
    // Start proctored sandbox
    setExamStarted(true);
    setInfractions([`[${new Date().toLocaleTimeString()}] Secure AI supervisor connected.`]);
    setIntegrityScore(100);

    // Request actual fullscreen
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
        setIsFullscreen(true);
        setFullscreenWarning(false);
      }
    } catch (err) {
      console.warn("Fullscreen permission failed:", err);
      // Fallback: we simulate it by setting isFullscreen to true anyway to allow play in iframe
      setIsFullscreen(true);
    }
  };

  // Anti-Cheat Events
  useEffect(() => {
    if (!examStarted) return;

    const logInfraction = (msg: string, penalty: number) => {
      const time = new Date().toLocaleTimeString();
      const detailedLog = `[${time}] ${msg} (-${penalty}% Integrity)`;
      setInfractions(prev => [detailedLog, ...prev]);
      setIntegrityScore(prev => {
        const next = Math.max(0, prev - penalty);
        return next;
      });
      setWarningText(`PROCTOR ALERT: ${msg} (-${penalty}% Integrity)`);
      setTimeout(() => setWarningText(null), 4000);
    };

    // 1. Right Click Interception
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logInfraction("Attempted right-click menu access", 8);
    };

    // 2. Clipboard Controls (Disable Copy, Disable Cut, Disable Paste)
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logInfraction("Copy action intercepted & blocked", 10);
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logInfraction("Cut action intercepted & blocked", 10);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logInfraction("Paste action intercepted & blocked", 10);
    };

    // 3. Tab switching/Focus loss detection (Tab Detection)
    const handleBlur = () => {
      logInfraction("Window focus lost / Tab switched", 15);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logInfraction("Tab blurred / Page minimized", 15);
      }
    };

    // 4. Print & developer shortcut blockers
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        logInfraction("Print command intercepted", 12);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        logInfraction("Ctrl+C copy shortcut blocked", 10);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        logInfraction("Ctrl+V paste shortcut blocked", 10);
      }
      if (e.key === 'F12') {
        e.preventDefault();
        logInfraction("Developer console hotkey blocked", 15);
      }
    };

    // 5. Fullscreen exit detection
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen) {
        setFullscreenWarning(true);
        logInfraction("Exited Fullscreen Proctored Sandbox", 12);
      } else {
        setFullscreenWarning(false);
      }
    };

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examStarted]);

  // Requesting to enter fullscreen mode again
  const reenterFullscreen = async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
        setIsFullscreen(true);
        setFullscreenWarning(false);
      }
    } catch (err) {
      console.warn("Fullscreen retry blocked:", err);
      // Simulated override
      setIsFullscreen(true);
      setFullscreenWarning(false);
    }
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitExam = () => {
    // Exit browser fullscreen on submission
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(e => console.log(e));
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const finalExamName = topic === "astro" 
      ? "Astrophysics & Deep Networks Final" 
      : topic === "quantum" 
        ? "Quantum Wave Mechanics Final" 
        : `AI-Generated: ${customTopicInput}`;

    onComplete(score, integrityScore, finalExamName, infractions);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans relative" ref={containerRef}>
      
      {/* 1. TOP NOTIFICATION BANNER */}
      <AnimatePresence>
        {warningText && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2.5 shadow-2xl z-50 max-w-md select-none"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>{warningText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FULLSCREEN BLOCKING OVERLAY */}
      <AnimatePresence>
        {examStarted && fullscreenWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-center select-none"
          >
            <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-5 animate-pulse">
              <Lock className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono mb-2">Secure Sandbox Locked</h3>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed mb-6">
              You exited the proctored fullscreen environment. To prevent exam cancellation and resume testing, please restore the fullscreen sandbox immediately.
            </p>
            <button
              onClick={reenterFullscreen}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              Restore Fullscreen Sandbox
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. WELCOME & SETUP CONFIGURATION */}
      {!examStarted ? (
        <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto text-center border border-slate-800">
          <div className="p-4 w-fit mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
            <Shield className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-mono">Nexora Proctored Sandbox</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-lg mx-auto">
            Choose your testing scope below. Academic metrics will be compiled using anti-cheat browser telemetry logs, which are securely verified server-side.
          </p>

          {/* Setup Configuration */}
          <div className="p-5 rounded-xl bg-[#0b0f19] border border-slate-900 text-left space-y-4 mb-6">
            <label className="text-slate-400 text-xs font-bold font-mono uppercase tracking-wider block">
              Choose testing curriculum:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTopic("astro")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  topic === "astro" 
                    ? "bg-blue-600/15 border-blue-500 text-blue-100" 
                    : "bg-[#111114]/50 border-slate-850 hover:border-slate-800 text-slate-400"
                }`}
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-[11px] font-bold block">Astrophysics</span>
                  <span className="text-[9px] text-slate-500 block">Randomized local pool</span>
                </div>
              </button>

              <button
                onClick={() => setTopic("quantum")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  topic === "quantum" 
                    ? "bg-blue-600/15 border-blue-500 text-blue-100" 
                    : "bg-[#111114]/50 border-slate-850 hover:border-slate-800 text-slate-400"
                }`}
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[11px] font-bold block">Quantum Physics</span>
                  <span className="text-[9px] text-slate-500 block">Randomized local pool</span>
                </div>
              </button>

              <button
                onClick={() => setTopic("ai_custom")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  topic === "ai_custom" 
                    ? "bg-blue-600/15 border-blue-500 text-blue-100" 
                    : "bg-[#111114]/50 border-slate-850 hover:border-slate-800 text-slate-400"
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-[11px] font-bold block">AI Dynamic Quiz</span>
                  <span className="text-[9px] text-slate-500 block">Gemini generated MCQ</span>
                </div>
              </button>
            </div>

            {topic === "ai_custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5 pt-2"
              >
                <label className="text-slate-400 text-[10px] font-mono">Input Custom Exam Topic:</label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-800 text-xs text-slate-200 outline-none font-mono"
                  placeholder="e.g. Backpropagation Jacobians & Linear Algebra"
                />
              </motion.div>
            )}
          </div>

          {/* Telemetry warnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-8 text-[11px] text-slate-400">
            <div className="flex items-start gap-2 bg-[#111114]/50 p-3 rounded-lg border border-slate-850">
              <span className="text-rose-400 font-bold">🚫 Copy Protection</span>
              <span>Visual text highlighting is disabled. Clipboard actions are fully blocked.</span>
            </div>
            <div className="flex items-start gap-2 bg-[#111114]/50 p-3 rounded-lg border border-slate-850">
              <span className="text-rose-400 font-bold">🚫 Integrity Sensor</span>
              <span>Exiting fullscreen, switching window tabs, or blurring triggers score drops.</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-[#111114] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={generateRandomExam}
              disabled={loadingQuestions}
              className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all border border-indigo-400/20 flex items-center gap-2 glow-blue disabled:opacity-50 cursor-pointer"
            >
              {loadingQuestions ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Proctored Questions...
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Enter Fullscreen & Start Exam
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* 4. ACTIVE EXAM SANDBOX LAYOUT (COMPLETELY SELECT-NONE FOR COPY PROTECTION) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
          {/* Main Exam Paper */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-md font-semibold text-white font-mono">
                  {topic === "astro" 
                    ? "Astrophysics & Deep Networks Final" 
                    : topic === "quantum" 
                      ? "Quantum Wave Mechanics Final" 
                      : `AI-Generated: ${customTopicInput}`}
                </h3>
                <span className="text-xs text-indigo-400">Proctored Session ID: {sessionId}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SUPERVISION ACTIVE
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="p-1 px-2 bg-[#0A0A0B] border border-slate-800 rounded text-[10px] font-mono text-indigo-400">
                      Q {qIdx + 1}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 leading-relaxed font-mono">
                      {q.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {q.options.map((option, oIdx) => {
                      const isSelected = answers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerSelect(qIdx, oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all flex items-center gap-3 ${
                            isSelected
                              ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-200 font-medium"
                              : "bg-[#111114]/40 border-slate-850 hover:border-slate-700 text-slate-400"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? "border-indigo-400 text-indigo-400 bg-indigo-500/5" : "border-slate-700 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <div className="text-[10px] text-slate-500 flex items-center gap-1 bg-[#111114]/30 px-3 py-1.5 rounded-lg border border-slate-900 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Copying or pasting text on this screen is disabled by local policy.
              </div>
              <button
                onClick={submitExam}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Submit Proctored Sandbox
              </button>
            </div>
          </div>

          {/* Secure Monitoring Sidebar Panel */}
          <div className="space-y-6">
            {/* Integrity Score HUD */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Integrity Telemetry</h3>
              </div>

              {/* Progress gauge */}
              <div className="relative pt-1">
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-[10px] text-slate-400">Current Integrity:</span>
                  <span className={`text-lg font-bold font-mono ${
                    integrityScore > 85 ? "text-emerald-400" : integrityScore > 65 ? "text-yellow-400" : "text-rose-400"
                  }`}>
                    {integrityScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0A0A0B] rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      integrityScore > 85 ? "bg-emerald-500" : integrityScore > 65 ? "bg-yellow-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${integrityScore}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 leading-relaxed font-sans bg-[#111114]/50 p-3 rounded-lg border border-slate-850">
                ⚠️ <span className="text-slate-300 font-semibold">Proctored Policy:</span> Escaping fullscreen (-12%), right-clicking (-8%), copying (-10%), or switching tabs (-15%) logs active infractions immediately.
              </div>
            </div>

            {/* AI Supervisor Real-Time Events Terminal */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-3 flex flex-col h-[320px]">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <h3 className="font-mono text-[10px] font-semibold text-white uppercase tracking-wider">AI Supervisor Feed</h3>
              </div>

              <div className="flex-1 overflow-y-auto text-[10px] font-mono space-y-2 text-slate-400 pr-1">
                {infractions.length === 0 ? (
                  <div className="text-slate-600 text-center pt-10">Telemetry streams initialized...</div>
                ) : (
                  infractions.map((log, index) => (
                    <div key={index} className={`leading-relaxed ${
                      log.includes("intercepted") || log.includes("Exited") || log.includes("lost") || log.includes("blocked")
                        ? "text-rose-400 font-semibold" 
                        : "text-blue-300"
                    }`}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
