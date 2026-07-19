'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  Brain, Award, Shield, Clock, Flame, Coins, Sparkles, BookOpen, ChevronRight,
  TrendingUp, Send, FileSpreadsheet, FileText, Compass, Sparkle, Play,
  Maximize2, Terminal, User, BookMarked, HelpCircle, Check, X, Bell,
  Mic, MicOff, Volume2, Settings as SettingsIcon, Trophy, Calendar, CheckSquare,
  ListTodo, ShieldAlert, Award as CertIcon, LogOut, CheckCircle, Info, Activity,
  Layers, ClipboardCheck, CreditCard
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar
} from 'recharts';
import { Course, Doubt, StudentStats, PointShopItem, CompetitionParticipant, getMockDB, saveMockDB } from '@/lib/mock-db';

interface StudentDashboardProps {
  courses: Course[];
  doubts: Doubt[];
  studentStats: StudentStats;
  pointShop: PointShopItem[];
  leaderboard: CompetitionParticipant[];
  onAddDoubt: (newDoubt: Doubt) => void;
  onUpdateStats: (updated: StudentStats) => void;
  onUpdatePointShop: (updated: PointShopItem[]) => void;
  onLaunchExam: () => void;
  onAddXPAndCoins: (xp: number, coins: number) => void;
}

export default function StudentDashboard({
  courses,
  doubts,
  studentStats,
  pointShop,
  leaderboard,
  onAddDoubt,
  onUpdateStats,
  onUpdatePointShop,
  onLaunchExam,
  onAddXPAndCoins,
}: StudentDashboardProps) {
  // Navigation tabs - fully expanded to meet exact user requirements
  const [activeTab, setActiveTab] = useState<
    "roadmap" | "courses" | "ai-hub" | "arena" | "shop" | "analytics" | "profile" | "settings"
  >("roadmap");

  const [shopCategory, setShopCategory] = useState<"all" | "book" | "notes" | "test" | "theme" | "badge" | "avatar" | "coupon">("all");

  // AI Smart Sub-tabs including the new Voice Learning
  const [activeAiTab, setActiveAiTab] = useState<
    "chat" | "doubt" | "summary" | "planner" | "career" | "quiz" | "coding" | "interview" | "resume" | "voice" | "flashcards" | "revision" | "weakness" | "memory"
  >("chat");

  // --- NEW INTEGRATED STATE ---
  // A. Notifications List & Popup state
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: "Weekly Competition Arena is active! Claim up to +150 XP.", time: "4 hours ago", unread: true, category: "Arena" },
    { id: 2, text: "New Calculus assignment published: 'Limits & Quotient Rules'.", time: "1 day ago", unread: true, category: "Assignment" },
    { id: 3, text: "AI Tutor has synthesized your customized daily study plan.", time: "2 days ago", unread: false, category: "Planner" },
    { id: 4, text: "Your peer ranking increased to #3 in Neural Science.", time: "3 days ago", unread: false, category: "Leaderboard" }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // B. Voice Learning Interactive State
  const [voiceMicActive, setVoiceMicActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("Say or type something to start your spoken session. Click a prompt below to listen to standard topics.");
  const [voiceResponseText, setVoiceResponseText] = useState("");
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceWaveform, setVoiceWaveform] = useState<number[]>([15, 8, 20, 12, 6, 25, 14, 18, 9, 22, 10, 5, 16, 24, 7]);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // C. Interactive Assignments State
  const [assignments, setAssignments] = useState<any[]>(() => {
    return getMockDB().assignments;
  });

  useEffect(() => {
    saveMockDB({ assignments });
  }, [assignments]);
  const [solvingAssignment, setSolvingAssignment] = useState<any>(null);
  const [solvingAnswerIndex, setSolvingAnswerIndex] = useState<number | null>(null);

  // D. Settings & Custom Preferences State
  const [settingsGoals, setSettingsGoals] = useState({
    dailyGoalHours: "3",
    focusedTopic: "Computer Science",
    notifyOnDue: true,
    autoEnrolledQuiz: false,
    proctorSensitivity: "High"
  });

  // E. Selected Theme/Background preset
  const [activeThemeName, setActiveThemeName] = useState<string>("Calm Twilight");

  // 1. Tutor Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "ai", text: "Welcome Aarav! I am your AI Mentor on Nexora. What subject are we mastering together today? I can help with Calculus, Quantum Physics, or Neural Networks." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 2. Doubt Solver State
  const [doubtSubject, setDoubtSubject] = useState("Mathematics");
  const [doubtQuery, setDoubtQuery] = useState("");
  const [doubtResponse, setDoubtResponse] = useState("");
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);

  // 3. PDF Summarizer State
  const [selectedDocText, setSelectedDocText] = useState("The Standard Model of particle physics is the theory describing three of the four known fundamental forces (the electromagnetic, weak, and strong forces, and not including gravitational force) in the universe, as well as classifying all known elementary particles.");
  const [customDocName, setCustomDocName] = useState("Quantum Mechanics Overview");
  const [summaryResponse, setSummaryResponse] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // 4. Study Planner State
  const [planSubject, setPlanSubject] = useState("Artificial Intelligence");
  const [planGoal, setPlanGoal] = useState("Build a self-learning Chess engine using neural network weights");
  const [planTimeline, setPlanTimeline] = useState("4 Weeks");
  const [planHours, setPlanHours] = useState("2");
  const [plannerResponse, setPlannerResponse] = useState("");
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  // 5. Career Advisor State
  const [careerInterests, setCareerInterests] = useState("Machine Learning, Astrophysics");
  const [careerStrengths, setCareerStrengths] = useState("Math modeling, Python development");
  const [careerIndustry, setCareerIndustry] = useState("Quantum Computing & Aerospace");
  const [careerResponse, setCareerResponse] = useState("");
  const [isCareerLoading, setIsCareerLoading] = useState(false);

  // 6. AI Quiz Generator State
  const [quizTopic, setQuizTopic] = useState("Quantum Superposition & Wave Mechanics");
  const [quizDifficulty, setQuizDifficulty] = useState("Intermediate");
  const [quizCount, setQuizCount] = useState(3);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // 7. AI Coding Assistant State
  const [codingTopic, setCodingTopic] = useState("Binary Search Tree Node Deletion");
  const [codingInput, setCodingInput] = useState(`class Node:\n    def __init__(self, key):\n        self.left = None\n        self.right = None\n        self.val = key\n\ndef deleteNode(root, key):\n    # Write your optimized BST deletion algorithm\n    return root`);
  const [codingOutput, setCodingOutput] = useState("");
  const [isCodingLoading, setIsCodingLoading] = useState(false);

  // 8. AI Interview Assistant State
  const [interviewRole, setInterviewRole] = useState("Machine Learning Researcher");
  const [interviewQuestion, setInterviewQuestion] = useState("Explain the difference between L1 and L2 regularization mathematically and their impact on weights sparsity.");
  const [interviewInput, setInterviewInput] = useState("");
  const [interviewOutput, setInterviewOutput] = useState("");
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  // 9. AI Resume Builder State
  const [resumeName, setResumeName] = useState("Aarav Sharma");
  const [resumeGoal, setResumeGoal] = useState("Research Internship in Deep Neural Architectures");
  const [resumeEducation, setResumeEducation] = useState("B.Tech in Computer Science - IIT Delhi (CGPA: 9.4)");
  const [resumeSkills, setResumeSkills] = useState("PyTorch, TypeScript, Quantum Mechanics, Analytical Modeling");
  const [resumeOutput, setResumeOutput] = useState("");
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  // 10. AI Flashcards State
  const [flashcardsTopic, setFlashcardsTopic] = useState("Neural Networks Backpropagation");
  const [flashcards, setFlashcards] = useState<any[]>([
    { question: "What is Backpropagation primarily used for?", answer: "To calculate the gradient of the loss function with respect to the weights in a neural network, enabling optimization via gradient descent." },
    { question: "What is the key mathematical rule used in Backpropagation?", answer: "The Chain Rule of calculus, which allows compounding partial derivatives layer-by-layer." },
    { question: "How does Sigmoid activation function saturation affect weights updates?", answer: "It leads to vanishing gradients, as the derivative of Sigmoid approaches zero when the input is highly positive or negative." }
  ]);
  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // 11. AI Revision Engine State
  const [revisionTopic, setRevisionTopic] = useState("Sigmoid Saturation & Vanishing Gradients");
  const [revisionGuide, setRevisionGuide] = useState("");
  const [isRevisionLoading, setIsRevisionLoading] = useState(false);

  // 12. Cognitive Memory State
  const [memoryTopic, setMemoryTopic] = useState("Euler-Lagrange Principles of Action");
  const [memoryHooks, setMemoryHooks] = useState("");
  const [isMemoryLoading, setIsMemoryLoading] = useState(false);

  // 13. Weak Topic Detection State
  const [detectedWeaknessReport, setDetectedWeaknessReport] = useState("");
  const [isWeaknessLoading, setIsWeaknessLoading] = useState(false);

  // 14. Arena Dynamic Generation State
  const [arenaSubject, setArenaSubject] = useState("Quantum Mechanics & Neural Computing");
  const [arenaQuestions, setArenaQuestions] = useState<any[]>([]);
  const [isArenaGenerating, setIsArenaGenerating] = useState(false);
  const [arenaTimer, setArenaTimer] = useState(3600); // 60 minutes
  const [arenaTimerActive, setArenaTimerActive] = useState(false);

  // Arena states
  const [arenaActive, setArenaActive] = useState(false);
  const [arenaStep, setArenaStep] = useState<"start" | "quiz" | "finished">("start");
  const [arenaAnswers, setArenaAnswers] = useState<{ [key: number]: number }>({});
  const [arenaScore, setArenaScore] = useState(0);

  // Notification Banners
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // Focus Mode
  const [focusActive, setFocusActive] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25 * 60);
  const [focusIntervalId, setFocusIntervalId] = useState<any>(null);

  // Point Shop Buy
  const handleBuyItem = (item: PointShopItem) => {
    if (studentStats.coins < item.cost) {
      setBannerMsg("Insufficient Nexora Coins! Clear more quizzes or take Sunday Arenas to accumulate coins.");
      setTimeout(() => setBannerMsg(null), 3000);
      return;
    }

    // Deduct coins and award rewards
    const updatedStats = { 
      ...studentStats, 
      coins: studentStats.coins - item.cost,
      badges: [...studentStats.badges]
    };

    if (!updatedStats.achievements.includes(`Unlocked ${item.name}`)) {
      updatedStats.achievements.push(`Unlocked ${item.name}`);
    }

    // If a badge, add it to their actual badges
    if (item.type === "badge" && !updatedStats.badges.includes(item.name)) {
      updatedStats.badges.push(item.name);
    }

    // If an avatar, add to badges or achievements as well
    if (item.type === "avatar" && !updatedStats.badges.includes(item.name)) {
      updatedStats.badges.push(item.name);
    }

    onUpdateStats(updatedStats);

    // Mark point shop item as unlocked
    const updatedShop = pointShop.map(i => i.id === item.id ? { ...i, unlocked: true } : i);
    onUpdatePointShop(updatedShop);

    // Auto-equip theme if it is a theme!
    if (item.type === "theme") {
      setActiveThemeName(item.name);
      setBannerMsg(`Purchased & Equipped Theme: "${item.name}"! +30 XP gained.`);
    } else if (item.type === "coupon") {
      setBannerMsg(`Coupon Redeemed! Copy code "${item.code || 'NEXORAFREE'}" below to redeem. +30 XP gained.`);
    } else if (item.type === "badge") {
      setBannerMsg(`Mythic Badge Unlocked: "${item.name}" is now displayed in your profile! +30 XP gained.`);
    } else {
      setBannerMsg(`Purchased unlocked item: "${item.name}"! +30 XP gained.`);
    }

    onAddXPAndCoins(30, 0);
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // --- NEW HANDLERS FOR INTEGRATED FEATURES ---
  
  // Speech Synthesis Engine
  const voiceSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop any active speech first
    window.speechSynthesis.cancel();
    
    // Clean up text for clearer pronunciation
    const cleanedText = text.replace(/[*#`_\-]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    speechUtteranceRef.current = utterance;
    
    utterance.onstart = () => {
      setIsVoiceSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsVoiceSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsVoiceSpeaking(false);
    };
    
    // Select an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice wave height simulation
  useEffect(() => {
    if (!isVoiceSpeaking && !voiceMicActive) return;

    const interval = setInterval(() => {
      setVoiceWaveform(prev => prev.map(() => Math.floor(Math.random() * 25) + 5));
    }, 100);

    return () => {
      clearInterval(interval);
      setVoiceWaveform([15, 8, 20, 12, 6, 25, 14, 18, 9, 22, 10, 5, 16, 24, 7]);
    };
  }, [isVoiceSpeaking, voiceMicActive]);

  // Handle preset Voice Learning topics
  const handleVoiceSpeakPrompt = (title: string, content: string) => {
    setVoiceTranscript(`Reviewing Concept: "${title}"...\n\nAI Tutor says: "${content}"`);
    setVoiceResponseText(content);
    voiceSpeakText(content);
  };

  // Simulated Voice Mic Input
  const handleToggleVoiceMic = () => {
    if (voiceMicActive) {
      setVoiceMicActive(false);
      return;
    }
    
    setVoiceMicActive(true);
    setVoiceTranscript("Listening to your voice input... (Speak now!)");
    
    setTimeout(() => {
      setVoiceMicActive(false);
      const randomResponses = [
        "Great question! In calculus, the derivative measures the instantaneous rate of change. It corresponds to the slope of the tangent line at any given point on a curve.",
        "To optimize Neural Networks efficiently, we backpropagate gradients using the chain rule. We calculate the derivative of the error function with respect to each individual weight.",
        "Under quantum mechanics, a wave function describes the quantum probability state of a system. Normalizing it ensures the integral of its probability squared over all space is exactly one."
      ];
      const selected = randomResponses[Math.floor(Math.random() * randomResponses.length)];
      setVoiceTranscript(`I heard your query! Here is your verbal lesson:\n\n"${selected}"`);
      setVoiceResponseText(selected);
      voiceSpeakText(selected);
    }, 2500);
  };

  // Clear or dismiss notifications
  const handleClearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Select an assignment to solve
  const handleStartSolveAssignment = (assign: any) => {
    if (assign.status === "Completed") return;
    setSolvingAssignment(assign);
    setSolvingAnswerIndex(null);
  };

  // Submit interactive homework assignment answer
  const handleSubmitAssignmentAnswer = () => {
    if (solvingAnswerIndex === null || !solvingAssignment) return;
    
    const isCorrect = solvingAnswerIndex === solvingAssignment.correctIndex;
    
    if (isCorrect) {
      // Award XP & Coins
      onAddXPAndCoins(solvingAssignment.xpReward, solvingAssignment.coinsReward);
      
      // Update local assignment list status
      setAssignments(prev => prev.map(a => 
        a.id === solvingAssignment.id ? { ...a, status: "Completed" } : a
      ));
      
      // Show success notification
      setBannerMsg(`Assignment Correct! Verified: +${solvingAssignment.xpReward} XP & +${solvingAssignment.coinsReward} Coins added!`);
      
      // Add achievement if not already earned
      const updatedStats = { ...studentStats };
      if (!updatedStats.achievements.includes(`Mastered ${solvingAssignment.title}`)) {
        updatedStats.achievements.push(`Mastered ${solvingAssignment.title}`);
        onUpdateStats(updatedStats);
      }
    } else {
      setBannerMsg("Incorrect Answer! Review the syllabus formulas and attempt again.");
    }
    
    setSolvingAssignment(null);
    setSolvingAnswerIndex(null);
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // Chat Trigger
  const handleSendChat = async () => {
    if (!chatInput) return;
    const userMsg = { sender: "user", text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          payload: { messages: [...chatMessages, userMsg], topic: "general studies" }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Doubt Trigger
  const handleSendDoubt = async () => {
    if (!doubtQuery) return;
    setIsDoubtLoading(true);
    setDoubtResponse("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "doubt",
          payload: { subject: doubtSubject, query: doubtQuery }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setDoubtResponse(data.text);
        // Add to local doubts list
        const d: Doubt = {
          id: `doubt-${Date.now()}`,
          studentName: studentStats.name,
          subject: doubtSubject,
          query: doubtQuery,
          status: "pending",
          createdAt: new Date().toISOString()
        };
        onAddDoubt(d);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDoubtLoading(false);
    }
  };

  // PDF Summarize Trigger
  const handleSendSummary = async () => {
    setIsSummaryLoading(true);
    setSummaryResponse("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize",
          payload: { fileName: customDocName, textContent: selectedDocText }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setSummaryResponse(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Study Planner Trigger
  const handleSendPlanner = async () => {
    setIsPlannerLoading(true);
    setPlannerResponse("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "study-plan",
          payload: { subject: planSubject, timeline: planTimeline, dailyHours: planHours, targetGoal: planGoal }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setPlannerResponse(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlannerLoading(false);
    }
  };

  // Career Advisor Trigger
  const handleSendCareer = async () => {
    setIsCareerLoading(true);
    setCareerResponse("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "career-guide",
          payload: { interests: careerInterests, strengths: careerStrengths, targetIndustry: careerIndustry }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setCareerResponse(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCareerLoading(false);
    }
  };

  // AI Quiz Generator Trigger
  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCurrentQuizIndex(0);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quiz",
          payload: { topic: quizTopic, difficulty: quizDifficulty, count: quizCount }
        }),
      });
      const data = await response.json();
      if (data.text) {
        // Parse the JSON array of questions
        const cleanedText = data.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);
        setQuizQuestions(parsed);
      }
    } catch (err) {
      console.error("Quiz Parse Error:", err);
      // Fallback
      setQuizQuestions([
        {
          question: `Theoretical check on: ${quizTopic}`,
          options: ["Primary Hypothesis Option A", "Saturated Neural Response Option B", "Spatial Integration Matrix C", "Euler-Lagrange Vector D"],
          answerIndex: 1,
          explanation: "The saturated limits of neurons prevent weights updates during standard gradient descent cycles."
        }
      ]);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // AI Coding Review Trigger
  const handleCodeReview = async () => {
    if (!codingInput) return;
    setIsCodingLoading(true);
    setCodingOutput("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "coding-review",
          payload: { topic: codingTopic, code: codingInput }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setCodingOutput(data.text);
        onAddXPAndCoins(40, 15);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCodingLoading(false);
    }
  };

  // AI Interview Evaluator Trigger
  const handleInterviewEvaluate = async () => {
    if (!interviewInput) return;
    setIsInterviewLoading(true);
    setInterviewOutput("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "interview-evaluation",
          payload: { role: interviewRole, question: interviewQuestion, answer: interviewInput }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setInterviewOutput(data.text);
        onAddXPAndCoins(50, 20);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  // AI Resume Builder Trigger
  const handleBuildResume = async () => {
    setIsResumeLoading(true);
    setResumeOutput("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume-build",
          payload: { name: resumeName, goal: resumeGoal, education: resumeEducation, skills: resumeSkills }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setResumeOutput(data.text);
        onAddXPAndCoins(30, 10);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResumeLoading(false);
    }
  };

  // Focus mode control
  const startFocusTimer = () => {
    setFocusActive(true);
    const id = setInterval(() => {
      setFocusTimer(prev => {
        if (prev <= 1) {
          clearInterval(id);
          onAddXPAndCoins(100, 20); // Award for focus
          setBannerMsg("Focus Session complete! +100 XP, +20 Coins added to database!");
          setTimeout(() => setBannerMsg(null), 4000);
          setFocusActive(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    setFocusIntervalId(id);
  };

  const cancelFocusTimer = () => {
    if (focusIntervalId) {
      clearInterval(focusIntervalId);
    }
    setFocusActive(false);
    setFocusTimer(25 * 60);
  };

  // AI Flashcards Generator
  const handleGenerateFlashcards = async () => {
    setIsFlashcardsLoading(true);
    setFlashcards([]);
    setCurrentFlashcardIndex(0);
    setIsCardFlipped(false);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "flashcards",
          payload: { topic: flashcardsTopic, count: 5 }
        }),
      });
      const data = await response.json();
      if (data.text) {
        const cleanedText = data.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);
        setFlashcards(parsed);
        onAddXPAndCoins(15, 5);
      }
    } catch (err) {
      console.error("Flashcards Parse Error:", err);
      // Fallback
      setFlashcards([
        { question: `Front of card: ${flashcardsTopic}`, answer: "This is the core conceptual answer compiled by Nexora AI. Click this card to flip it back." },
        { question: `Key Term: Active Recall`, answer: "The cognitive practice of retrieving facts directly from memory rather than passively reviewing them, which optimizes synaptic retention." }
      ]);
    } finally {
      setIsFlashcardsLoading(false);
    }
  };

  // AI Revision Engine
  const handleGenerateRevision = async () => {
    setIsRevisionLoading(true);
    setRevisionGuide("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revision",
          payload: { topic: revisionTopic }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setRevisionGuide(data.text);
        onAddXPAndCoins(20, 10);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRevisionLoading(false);
    }
  };

  // Cognitive Memory Coach
  const handleGenerateMemory = async () => {
    setIsMemoryLoading(true);
    setMemoryHooks("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "memory",
          payload: { topic: memoryTopic }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setMemoryHooks(data.text);
        onAddXPAndCoins(20, 10);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMemoryLoading(false);
    }
  };

  // Weak Topic Detection Analyzer
  const handleWeaknessDetect = async () => {
    setIsWeaknessLoading(true);
    setDetectedWeaknessReport("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "weakness-detection",
          payload: {
            performanceData: {
              subjectAccuracy: studentStats.subjectPerformance,
              quizAccuracyPercent: studentStats.quizAccuracy,
              weeklyGrowthMinutes: studentStats.weeklyGrowth,
              lastExamScores: studentStats.examAnalytics.map(e => ({ name: e.examName, score: e.score }))
            }
          }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setDetectedWeaknessReport(data.text);
        onAddXPAndCoins(35, 15);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeaknessLoading(false);
    }
  };

  // Arena Live Dynamic Question Generator
  const handleArenaGenerate = async () => {
    setIsArenaGenerating(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "arena-generate",
          payload: { subject: arenaSubject }
        }),
      });
      const data = await response.json();
      if (data.text) {
        const cleanedText = data.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);
        setArenaQuestions(parsed);
        setArenaAnswers({});
        setArenaStep("quiz");
        setArenaTimer(3600); // Reset to 60 mins
        setArenaTimerActive(true);
      }
    } catch (err) {
      console.error("Arena Generate Error:", err);
      // Fallback
      setArenaQuestions([
        { q: `Explain the effect of quantum tunnel probabilities on alpha decay models?`, options: ["Highly increases the penetration of particles through classical barrier thresholds", "Sets the wave potential precisely to infinite negative boundary limits", "Forces decay half-life factors to remain constant globally", "Causes wave equations to diverge at saturation"], ans: 0 },
        { q: `Which gradient optimizer maintains separate learning rates per weights variable using average square gradients?`, options: ["RMSprop", "Standard Stochastic Gradient Descent (SGD)", "Linear Momentum decay", "Nesterov accelerated projection"], ans: 0 },
        { q: `State the continuous integration bounds for a normalized gaussian density function?`, options: ["Exactly 1 over the bounds negative to positive infinity", "Zero across all real coordinates", "Directly proportional to the variance vector squared", "Always converges to pi divided by lambda"], ans: 0 }
      ]);
      setArenaAnswers({});
      setArenaStep("quiz");
      setArenaTimer(3600);
      setArenaTimerActive(true);
    } finally {
      setIsArenaGenerating(false);
    }
  };

  // Arena game questions
  const ARENA_Q = [
    { q: "What limits Backpropagation convergence speed in sigmoidal neural networks?", options: ["The dying ReLU problem", "Vanishing Gradients at saturation limits", "Overfitting on test partitions", "Excessive learning multipliers"], ans: 1 },
    { q: "In wavefunctions, how do we normalize Ψ such that the particle must exist somewhere?", options: ["Set integration over spatial bounds equal to 1", "Set the average wavefunction phase to zero", "Set Ψ equal to its real Fourier conjugate", "Divide Ψ by Planck's constant"], ans: 0 },
    { q: "Calculate derivative: f(x) = x * ln(x). What is f'(x)?", options: ["ln(x) + 1", "x * ln(x) + x", "1/x", "ln(x) + x"], ans: 0 }
  ];

  const handleArenaAnswer = (qIdx: number, oIdx: number) => {
    setArenaAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitArenaQuiz = () => {
    let score = 0;
    const currentQuestions = arenaQuestions.length > 0 ? arenaQuestions : ARENA_Q;
    currentQuestions.forEach((q, idx) => {
      if (arenaAnswers[idx] === q.ans) score += 1;
    });

    setArenaScore(score);
    setArenaStep("finished");

    // Award rewards
    const xp = score * 50;
    const coins = score * 15;
    onAddXPAndCoins(xp, coins);
  };

  // Arena countdown timer ticking
  useEffect(() => {
    let tId: any = null;
    if (arenaTimerActive && arenaTimer > 0 && arenaStep === "quiz") {
      tId = setInterval(() => {
        setArenaTimer(prev => {
          if (prev <= 1) {
            clearInterval(tId);
            setArenaTimerActive(false);
            submitArenaQuiz(); // Auto submit when time expires!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (tId) clearInterval(tId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arenaTimerActive, arenaTimer, arenaStep]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 font-sans space-y-6">
      
      {/* 1. TOP STATS STATUS BAR & NOTIFICATIONS TRAY */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0A0C]/90 backdrop-blur-md relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center font-extrabold text-white text-lg">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{studentStats.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{studentStats.email}</p>
          </div>
        </div>

        {/* Dynamic XP Progress, Streak, Coins and Attendance tracker */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          
          {/* Level & XP */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 min-w-[120px]">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Lv. {studentStats.level} (Achiever)</span>
              <span>{studentStats.xp} / 3000 XP</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#7C5CFF] to-blue-500 transition-all duration-500" 
                style={{ width: `${(studentStats.xp / 3000) * 100}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 font-mono text-amber-400">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>{studentStats.streak} Days</span>
          </div>

          {/* Coins */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 font-mono text-yellow-400">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span>{studentStats.coins} Coins</span>
          </div>

          {/* Attendance */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 font-mono text-cyan-400">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>94% Attendance</span>
          </div>

          {/* Integrity */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1.5 font-mono text-purple-400">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>{studentStats.integrityScore}% Focus</span>
          </div>

          {/* Interactive Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#7C5CFF]/40 text-slate-300 hover:text-white transition-all cursor-pointer relative"
              id="notifications-bell-btn"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-2 w-80 bg-[#0E0E12] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-900 font-sans"
                >
                  <div className="p-3 px-4 bg-[#14141A] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Alert Notifications</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] text-[#7C5CFF] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-900/80">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-[11px] font-mono">
                        No active study alerts.
                      </div>
                    ) : (
                      notifications.map(noti => (
                        <div 
                          key={noti.id} 
                          className={`p-3 px-4 text-[11px] transition-all flex items-start justify-between gap-3 ${
                            noti.unread ? "bg-blue-950/10 border-l-2 border-[#7C5CFF]" : "bg-transparent"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[8px] font-mono text-slate-400 uppercase">
                              {noti.category}
                            </span>
                            <p className="text-slate-200 leading-normal">{noti.text}</p>
                            <span className="text-[9px] text-slate-500 block font-mono">{noti.time}</span>
                          </div>
                          <button 
                            onClick={() => handleClearNotification(noti.id)}
                            className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 2. THE MAIN TWO-COLUMN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Visual Banner Alert */}
        <AnimatePresence>
          {bannerMsg && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 px-5 py-3.5 rounded-xl bg-[#111114] border border-blue-500/30 text-blue-200 text-xs font-mono flex items-center gap-2.5 shadow-2xl z-50 glow-blue"
            >
              <Bell className="w-4 h-4 text-blue-400 animate-bounce" />
              <span>{bannerMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus Mode Overlay */}
        {focusActive && (
          <div className="fixed inset-0 bg-[#0A0A0B]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6">
            <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse-slow">
              <Brain className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold text-white font-mono uppercase tracking-widest">NEXORA FOCUS DEPTH</h2>
            <p className="text-sm text-slate-400 max-w-sm text-center">
              All notifications, banners, and sidebar options are temporarily suppressed. Focus on your physical studies.
            </p>
            <div className="text-6xl font-extrabold font-mono text-white tracking-wider glow-blue bg-[#111114]/40 p-6 px-12 rounded-3xl border border-slate-800">
              {Math.floor(focusTimer / 60)}:{(focusTimer % 60).toString().padStart(2, "0")}
            </div>
            <button
              onClick={cancelFocusTimer}
              className="px-6 py-2.5 rounded-xl bg-[#111114] border border-slate-800 text-xs text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
            >
              Exit Focus Chamber
            </button>
          </div>
        )}

        {/* Left Sidebar Menu (Client Side Glassmorphism Tabs) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <User className="w-4 h-4 text-[#7C5CFF]" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold">Study Deck</span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-sans">
              
              {/* Learning Tree */}
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "roadmap"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#7C5CFF]" />
                  <span>Learning Tree</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* My Courses & Homework Assignments */}
              <button
                onClick={() => setActiveTab("courses")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "courses"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-[#7C5CFF]" />
                  <span>Continue Learning</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* AI Smart Hub */}
              <button
                onClick={() => setActiveTab("ai-hub")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "ai-hub"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#7C5CFF]" />
                  <span>AI Smart Hub</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Sunday Live Arena */}
              <button
                onClick={() => setActiveTab("arena")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "arena"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#7C5CFF]" />
                  <span>Sunday Live Arena</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Point Shop */}
              <button
                onClick={() => setActiveTab("shop")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "shop"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#7C5CFF]" />
                  <span>Point Shop</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Progress Charts */}
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#7C5CFF]" />
                  <span>Progress Charts</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* My Profile */}
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7C5CFF]" />
                  <span>My Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* System Settings */}
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold"
                    : "border-transparent text-slate-400 hover:bg-[#111114]/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-[#7C5CFF]" />
                  <span>System Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

            </div>
          </div>

        {/* Quick Launch Focus Button */}
        <div className="p-5 rounded-2xl glass-panel space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono">Silent Study Space</h4>
          <button
            onClick={startFocusTimer}
            className="w-full py-2.5 rounded-xl bg-[#0A0A0B] border border-slate-800 hover:border-blue-500/30 text-slate-300 hover:text-blue-400 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            Enter Focus Chamber
          </button>
        </div>
      </div>

      {/* Main Study Deck Workspace */}
      <div className="lg:col-span-3 space-y-6">

        {/* 1. LEARNING TREE ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">AI Learning Journey</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Progress sequentially through cognitive tiers. Clearing quizzes, completing Sunday Arenas, and scoring in Secure Exam terminals triggers road expansion.
              </p>
            </div>

            {/* Visual Roadmap (Duolingo Style Connecting nodes) */}
            <div className="relative glass-panel rounded-2xl p-8 border border-slate-850 flex flex-col items-center">
              
              {/* Node 1 */}
              <div className="flex flex-col items-center text-center space-y-2 z-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 glow-blue flex items-center justify-center text-lg font-bold text-white shadow-xl">
                  🌱
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Level 1: Beginner</h4>
                  <p className="text-[10px] text-slate-400">UNLOCKED • 100% Completed</p>
                </div>
              </div>

              {/* Connector */}
              <div className="w-1 h-12 bg-blue-500 my-2" />

              {/* Node 2 */}
              <div className="flex flex-col items-center text-center space-y-2 z-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 glow-blue flex items-center justify-center text-lg font-bold text-white shadow-xl animate-pulse-slow">
                  📘
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">Level 2: Explorer</h4>
                  <p className="text-[10px] text-blue-400">UNLOCKED • 100% Completed</p>
                </div>
              </div>

              {/* Connector */}
              <div className="w-1 h-12 bg-blue-500 my-2" />

              {/* Node 3 (Active) */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 relative">
                <div className="absolute -top-1.5 -right-1.5 p-1 bg-blue-500 rounded-full text-[10px] text-white font-mono animate-bounce">
                  Active
                </div>
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border-4 border-blue-400 glow-blue flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                  🚀
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-blue-300">Level 3: Achiever (Current)</h4>
                  <p className="text-[10px] text-slate-400">Active Node • 1,850 XP</p>
                </div>
              </div>

              {/* Connector */}
              <div className="w-1 h-12 bg-slate-800 my-2" />

              {/* Node 4 (Locked) */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 opacity-60">
                <div className="w-16 h-16 rounded-full bg-[#0A0A0B] border-2 border-slate-800 flex items-center justify-center text-lg font-bold text-slate-600">
                  🧠
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400">Level 4: Expert</h4>
                  <p className="text-[10px] text-slate-500">LOCKED • Requires 3,000 XP</p>
                </div>
              </div>

              {/* Connector */}
              <div className="w-1 h-12 bg-slate-800 my-2" />

              {/* Node 5 (Locked) */}
              <div className="flex flex-col items-center text-center space-y-2 z-10 opacity-60">
                <div className="w-16 h-16 rounded-full bg-[#0A0A0B] border-2 border-slate-800 flex items-center justify-center text-lg font-bold text-slate-600">
                  👑
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400">Level 5: Master</h4>
                  <p className="text-[10px] text-slate-500">LOCKED • Requires 5,000 XP</p>
                </div>
              </div>

            </div>

            {/* Call to Launch Secure Exam Terminal */}
            <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-blue-400 font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  ACADEMIC INTEGRITY SECURE SANDBOX
                </div>
                <h4 className="text-sm font-semibold text-white">Ready for Final Course Terminals?</h4>
                <p className="text-[11px] text-slate-400 max-w-md">
                  Secure exam sandbox locks copying/pasting and tracks focal changes to compile an Integrity rating for instructors.
                </p>
              </div>
              <button
                onClick={onLaunchExam}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all border border-blue-400/20 shadow-lg cursor-pointer"
              >
                Launch Secure Exam
              </button>
            </div>
          </div>
        )}

        {/* 1.5 NEW INTEGRATED CONTINUE LEARNING & TASK ASSIGNMENTS TAB */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">Continue Learning & Tasks</h3>
              <p className="text-xs text-slate-400">
                Track your active courses, analyze live classroom attendance indices, and complete syllabus homework tasks.
              </p>
            </div>

            {/* A. Live Enrolled Courses & Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: "Intro to Neural Networks", code: "CS-402", completed: 65, color: "from-blue-600 to-indigo-500", lectures: "14 of 20 cleared" },
                { name: "Advanced Calculus & Limits", code: "MATH-201", completed: 42, color: "from-[#7C5CFF] to-purple-500", lectures: "8 of 18 cleared" },
                { name: "Quantum Wave Mechanics", code: "PHY-305", completed: 18, color: "from-cyan-500 to-blue-500", lectures: "3 of 16 cleared" },
              ].map((crs, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0A0A0C] border border-slate-850 space-y-3 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">{crs.code}</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{crs.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {crs.completed}%
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${crs.color}`} style={{ width: `${crs.completed}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{crs.lectures}</p>
                  </div>

                  <button className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:text-[#7C5CFF] text-[10px] font-mono transition-all cursor-pointer">
                    Resume Lecture Video
                  </button>
                </div>
              ))}
            </div>

            {/* B. Attendance Metrics & Requirements */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-[#07070A] border border-slate-900 text-center space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Overall Classroom Presence</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">94.1%</div>
                <p className="text-[10px] text-slate-400">32 out of 34 live lectures attended</p>
              </div>

              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">University Compliance Dashboard</h4>
                <div className="text-[11px] text-slate-400 leading-relaxed font-sans space-y-1">
                  <p>✓ Minimum mandatory requirement (75.00%) surpassed comfortably.</p>
                  <p>✓ All medical clearance vouchers registered and approved by the academic dean.</p>
                  <p>✓ Consistent streak factor: Earned +15% extra coin boost multipliers for complete week attendance.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-[#0A0A0C] border border-slate-900 text-[9px] font-mono text-cyan-400">
                    STATUS: SECURE
                  </span>
                  <span className="px-2 py-1 rounded bg-[#0A0A0C] border border-slate-900 text-[9px] font-mono text-yellow-400">
                    EXTRA REWARDS: ELIGIBLE
                  </span>
                </div>
              </div>
            </div>

            {/* C. Dynamic Assignments List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Syllabus Homework & Assignments</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {assignments.map((assign) => (
                  <div key={assign.id} className="p-4 rounded-xl bg-[#0A0A0C] border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{assign.title}</span>
                        <span className={`text-[9px] px-2 py-0.2 rounded font-mono ${
                          assign.status === "Completed" 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        }`}>
                          {assign.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Discipline: <span className="text-slate-300 font-mono">{assign.subject}</span> • Deadline: <span className="text-slate-300 font-mono">{assign.deadline}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-[10px] font-mono hidden sm:block">
                        <div className="text-[#7C5CFF]">+{assign.xpReward} XP</div>
                        <div className="text-yellow-400">+{assign.coinsReward} Coins</div>
                      </div>
                      
                      {assign.status === "Pending" ? (
                        <button
                          onClick={() => handleStartSolveAssignment(assign)}
                          className="px-4 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold text-[10px] font-mono transition-all cursor-pointer"
                        >
                          Solve Assignment
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-850 text-slate-500 text-[10px] font-mono cursor-not-allowed"
                        >
                          Complete ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. AI SMART HUB TAB */}
        {activeTab === "ai-hub" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">AI Smart Cognitive Center</h3>
              <p className="text-xs text-slate-400">
                Execute deep logic tasks powered directly by server-side Gemini: draft doubts, digest lecture materials, or build schedules.
              </p>
            </div>

            {/* AI Menu selector subtabs */}
            <div className="flex border-b border-slate-900/60 overflow-x-auto text-xs font-mono gap-3.5 whitespace-nowrap scrollbar-none pb-2.5">
              {[
                { id: "chat", label: "AI Mentor 🤖" },
                { id: "voice", label: "Voice Tutor 🎙️" },
                { id: "doubt", label: "Doubt Solver ❓" },
                { id: "summary", label: "PDF Summary 📄" },
                { id: "flashcards", label: "Flashcards 🎴" },
                { id: "revision", label: "Revision Engine ⚡" },
                { id: "weakness", label: "Weak Topic Detection 🔍" },
                { id: "planner", label: "Study Planner 📅" },
                { id: "memory", label: "Memory Coach 🧠" },
                { id: "career", label: "Career Guidance 🎯" },
                { id: "quiz", label: "Quiz Generator 📝" },
                { id: "coding", label: "Coding Hub 💻" },
                { id: "interview", label: "Mock Interview 🗣️" },
                { id: "resume", label: "Resume Builder 💼" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAiTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 transition-all cursor-pointer ${
                    activeAiTab === tab.id ? "border-[#7C5CFF] text-[#7C5CFF] font-bold" : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[460px] glass-panel rounded-2xl p-6 border border-slate-900/60">
              {/* CHAT TAB */}
              {activeAiTab === "chat" && (
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-[#7C5CFF] text-white font-sans"
                            : "bg-[#050816] border border-slate-900 text-slate-200"
                        }`}>
                          <div className="markdown-body">
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 rounded-2xl bg-[#050816] border border-slate-900 text-slate-400 animate-pulse font-mono">
                          Nexora AI is processing weights...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-slate-900/60 pt-4 mt-4">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      placeholder="Ask any syllabus concept (e.g. Derive Backpropagation formula)..."
                      className="flex-1 p-3.5 rounded-xl bg-[#050816] border border-slate-850 text-slate-100 outline-none text-xs focus:border-[#7C5CFF]/50"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={isChatLoading}
                      className="p-3.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white transition-all cursor-pointer shadow-lg shadow-[#7C5CFF]/15"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* DOUBT SOLVER TAB */}
              {activeAiTab === "doubt" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Select Core Discipline:</label>
                      <select
                        value={doubtSubject}
                        onChange={(e) => setDoubtSubject(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 outline-none focus:border-[#7C5CFF]/50"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-400 font-mono">Doubt Details:</label>
                    <textarea
                      value={doubtQuery}
                      onChange={(e) => setDoubtQuery(e.target.value)}
                      placeholder="Paste your exact theoretical or mathematical doubt query..."
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-24 font-mono focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <button
                    onClick={handleSendDoubt}
                    disabled={isDoubtLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold text-xs transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isDoubtLoading ? "Sourcing Solutions..." : "Resolve with Gemini AI Model"}
                  </button>

                  {doubtResponse && (
                    <div className="mt-4 p-4 rounded-xl bg-[#050816] border border-slate-850 text-xs text-slate-200 h-[220px] overflow-y-auto leading-relaxed font-sans">
                      <div className="markdown-body">
                        <Markdown>{doubtResponse}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PDF SUMMARIZER */}
              {activeAiTab === "summary" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono">Simulated Document Name:</label>
                    <input
                      type="text"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono">Paste Document Text Segment:</label>
                    <textarea
                      value={selectedDocText}
                      onChange={(e) => setSelectedDocText(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-28 font-sans leading-relaxed focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <button
                    onClick={handleSendSummary}
                    disabled={isSummaryLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isSummaryLoading ? "Deducing Summaries..." : "Synthesize PDF Executive Summary"}
                  </button>

                  {summaryResponse && (
                    <div className="mt-4 p-4 rounded-xl bg-[#050816] border border-slate-850 text-xs text-slate-200 h-[200px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{summaryResponse}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FLASHCARDS TAB */}
              {activeAiTab === "flashcards" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 space-y-3">
                        <label className="text-slate-400 font-mono text-[11px] block">Flashcard Topic / Concept:</label>
                        <input
                          type="text"
                          value={flashcardsTopic}
                          onChange={(e) => setFlashcardsTopic(e.target.value)}
                          placeholder="e.g. Backpropagation Chain Rule, Mitochondria ATP..."
                          className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 text-xs outline-none focus:border-[#7C5CFF]/50"
                        />
                        <button
                          onClick={handleGenerateFlashcards}
                          disabled={isFlashcardsLoading}
                          className="w-full py-2 px-4 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isFlashcardsLoading ? (
                            <span className="animate-pulse">Compiling Deck...</span>
                          ) : (
                            <>
                              <Sparkle className="w-3.5 h-3.5" />
                              <span>Generate Deck</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-blue-400 font-bold block mb-1">💡 Spaced Repetition Practice</span>
                        Active recall via physical or digital flashcards is mathematically proven to increase neural retrieval velocity by up to 150%. Review these before your Sunday competitions!
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4">
                      {flashcards && flashcards.length > 0 ? (
                        <div className="w-full max-w-md space-y-4">
                          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                            <span>NEXORA ACTIVE RECALL MODULE</span>
                            <span>{currentFlashcardIndex + 1} of {flashcards.length}</span>
                          </div>

                          {/* 3D Flippable Card */}
                          <div
                            onClick={() => setIsCardFlipped(!isCardFlipped)}
                            className="w-full h-56 cursor-pointer relative"
                            style={{ perspective: "1000px" }}
                          >
                            <div 
                              className="w-full h-full duration-500 relative"
                              style={{ 
                                transformStyle: "preserve-3d", 
                                transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)" 
                              }}
                            >
                              {/* Front of Card */}
                              <div 
                                className="absolute inset-0 rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 flex flex-col justify-between shadow-2xl"
                                style={{ backfaceVisibility: "hidden" }}
                              >
                                <span className="text-[9px] font-mono font-bold text-[#7C5CFF] uppercase tracking-widest">FRONT OF CARD</span>
                                <div className="text-sm font-semibold text-white text-center font-sans my-auto">
                                  {flashcards[currentFlashcardIndex]?.question}
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest animate-pulse">Click card to reveal answer</span>
                              </div>

                              {/* Back of Card */}
                              <div 
                                className="absolute inset-0 rounded-2xl border border-[#7C5CFF]/30 bg-[#120B24] p-6 flex flex-col justify-between shadow-2xl"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                              >
                                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">BACK (ANSWER COGNITION)</span>
                                <div className="text-xs leading-relaxed text-slate-200 text-center font-sans my-auto">
                                  {flashcards[currentFlashcardIndex]?.answer}
                                </div>
                                <span className="text-[9px] font-mono text-slate-500 text-center uppercase tracking-widest">Click card to return to front</span>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex justify-between gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCardFlipped(false);
                                setCurrentFlashcardIndex(prev => Math.max(0, prev - 1));
                              }}
                              disabled={currentFlashcardIndex === 0}
                              className="flex-1 py-2 px-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              Previous Card
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCardFlipped(false);
                                setCurrentFlashcardIndex(prev => Math.min(flashcards.length - 1, prev + 1));
                              }}
                              disabled={currentFlashcardIndex === flashcards.length - 1}
                              className="flex-1 py-2 px-4 rounded-xl border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 text-xs text-[#7C5CFF] hover:text-white hover:bg-[#7C5CFF]/20 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              Next Card
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 font-mono">
                          No cards loaded. Enter a topic and trigger compilation above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* REVISION ENGINE TAB */}
              {activeAiTab === "revision" && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-slate-400 font-mono text-[11px]">Specify Topic for Revision Sheet:</label>
                      <input
                        type="text"
                        value={revisionTopic}
                        onChange={(e) => setRevisionTopic(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50 text-xs"
                      />
                    </div>
                    <button
                      onClick={handleGenerateRevision}
                      disabled={isRevisionLoading}
                      className="py-2.5 px-6 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all cursor-pointer text-xs"
                    >
                      {isRevisionLoading ? "Assembling Guides..." : "Run AI Revision Engine"}
                    </button>
                  </div>

                  {revisionGuide ? (
                    <div className="p-5 rounded-2xl bg-[#050816] border border-slate-900 text-slate-200 max-h-[420px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{revisionGuide}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 font-mono">
                      {isRevisionLoading ? "Mining formulas and compressing key concepts with Gemini..." : "Provide a subject and click 'Run AI Revision Engine' to map summary cards and formulas."}
                    </div>
                  )}
                </div>
              )}

              {/* WEAK TOPIC DETECTION TAB */}
              {activeAiTab === "weakness" && (
                <div className="space-y-6 text-xs">
                  <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-xl">
                      <h4 className="text-sm font-bold text-white font-mono">Nexora Automated Performance Diagnostic</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        This model scans your local quiz records, subject accuracy trends, global competitive streak values, and last simulated proctor exam files to compute a detailed Weak Topic Analysis.
                      </p>
                    </div>
                    <button
                      onClick={handleWeaknessDetect}
                      disabled={isWeaknessLoading}
                      className="py-3 px-6 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-semibold transition-all cursor-pointer font-mono whitespace-nowrap"
                    >
                      {isWeaknessLoading ? "Performing Audits..." : "Diagnose Weak Topics"}
                    </button>
                  </div>

                  {detectedWeaknessReport ? (
                    <div className="p-5 rounded-2xl bg-[#050816] border border-slate-900 text-slate-200 max-h-[400px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{detectedWeaknessReport}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-950 text-center space-y-2">
                        <span className="text-lg">📉</span>
                        <div className="text-slate-400 font-semibold font-mono text-[11px]">Astrophysics Accuracy</div>
                        <div className="text-red-400 font-bold text-sm">34% (Alert state)</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-950 text-center space-y-2">
                        <span className="text-lg">📈</span>
                        <div className="text-slate-400 font-semibold font-mono text-[11px]">Computer Science</div>
                        <div className="text-emerald-400 font-bold text-sm">82% (High competence)</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-950 text-center space-y-2">
                        <span className="text-lg">⏳</span>
                        <div className="text-slate-400 font-semibold font-mono text-[11px]">Unanswered doubts</div>
                        <div className="text-yellow-500 font-bold text-sm">3 Active Solvers</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* COGNITIVE MEMORY COACH TAB */}
              {activeAiTab === "memory" && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-slate-400 font-mono text-[11px]">Complex concept to commit to memory:</label>
                      <input
                        type="text"
                        value={memoryTopic}
                        onChange={(e) => setMemoryTopic(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50 text-xs"
                      />
                    </div>
                    <button
                      onClick={handleGenerateMemory}
                      disabled={isMemoryLoading}
                      className="py-2.5 px-6 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all cursor-pointer text-xs"
                    >
                      {isMemoryLoading ? "Synthesizing Hooks..." : "Generate Memory Aids"}
                    </button>
                  </div>

                  {memoryHooks ? (
                    <div className="p-5 rounded-2xl bg-[#050816] border border-slate-900 text-slate-200 max-h-[420px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{memoryHooks}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 font-mono">
                      {isMemoryLoading ? "Compiling mnemonics and mind palace descriptors with Gemini..." : "Input a formula or complex taxonomy, and our memory engine will construct acronyms and cognitive anchors."}
                    </div>
                  )}
                </div>
              )}

              {/* STUDY PLANNER */}
              {activeAiTab === "planner" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Syllabus Topic:</label>
                      <input
                        type="text"
                        value={planSubject}
                        onChange={(e) => setPlanSubject(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Dedicated Hours (Daily):</label>
                      <input
                        type="text"
                        value={planHours}
                        onChange={(e) => setPlanHours(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none font-mono focus:border-[#7C5CFF]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono">Primary Target / Learning Goal:</label>
                    <input
                      type="text"
                      value={planGoal}
                      onChange={(e) => setPlanGoal(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <button
                    onClick={handleSendPlanner}
                    disabled={isPlannerLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isPlannerLoading ? "Compiling Roadmap..." : "Generate AI Daily Study Plan"}
                  </button>

                  {plannerResponse && (
                    <div className="mt-4 p-4 rounded-xl bg-[#050816] border border-slate-850 text-xs text-slate-200 h-[200px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{plannerResponse}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CAREER ADVISOR */}
              {activeAiTab === "career" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Interests:</label>
                      <input
                        type="text"
                        value={careerInterests}
                        onChange={(e) => setCareerInterests(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">My Strengths:</label>
                      <input
                        type="text"
                        value={careerStrengths}
                        onChange={(e) => setCareerStrengths(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono">Target Industries & Companies:</label>
                    <input
                      type="text"
                      value={careerIndustry}
                      onChange={(e) => setCareerIndustry(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <button
                    onClick={handleSendCareer}
                    disabled={isCareerLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isCareerLoading ? "Deducing Milestones..." : "Consult AI Career Mentor"}
                  </button>

                  {careerResponse && (
                    <div className="mt-4 p-4 rounded-xl bg-[#050816] border border-slate-850 text-xs text-slate-200 h-[200px] overflow-y-auto leading-relaxed">
                      <div className="markdown-body">
                        <Markdown>{careerResponse}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI QUIZ GENERATOR */}
              {activeAiTab === "quiz" && (
                <div className="space-y-4 text-xs">
                  {!quizSubmitted && quizQuestions.length === 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-mono">Topic / Subject Matter:</label>
                          <input
                            type="text"
                            value={quizTopic}
                            onChange={(e) => setQuizTopic(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-mono">Difficulty Tier:</label>
                          <select
                            value={quizDifficulty}
                            onChange={(e) => setQuizDifficulty(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-855 text-slate-300 outline-none"
                          >
                            <option value="Beginner">Beginner (Concept Check)</option>
                            <option value="Intermediate">Intermediate (Deep Thinker)</option>
                            <option value="Elite Graduate">Elite Graduate (Advanced Mathematics)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-mono">Question Count:</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={quizCount}
                            onChange={(e) => setQuizCount(parseInt(e.target.value) || 3)}
                            className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateQuiz}
                        disabled={isQuizLoading}
                        className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                      >
                        {isQuizLoading ? "Assembling Deep Cognitive MCQs..." : "Generate Custom AI Quiz"}
                      </button>
                    </div>
                  ) : quizQuestions.length > 0 && !quizSubmitted ? (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <span className="font-mono text-[10px] text-slate-500">QUESTION {currentQuizIndex + 1} OF {quizQuestions.length}</span>
                        <span className="text-slate-400 font-mono">Topic: {quizTopic}</span>
                      </div>

                      <div className="text-slate-100 font-medium text-sm leading-relaxed p-4 bg-[#050816] border border-slate-900 rounded-xl">
                        {quizQuestions[currentQuizIndex].question}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {quizQuestions[currentQuizIndex].options.map((option: string, idx: number) => {
                          const isSelected = quizAnswers[currentQuizIndex] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [currentQuizIndex]: idx })}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#7C5CFF]/10 border-[#7C5CFF] text-[#7C5CFF] font-semibold"
                                  : "bg-[#050816]/40 border-slate-900 text-slate-300 hover:border-slate-800"
                              }`}
                            >
                              <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between pt-4 border-t border-slate-900">
                        <button
                          disabled={currentQuizIndex === 0}
                          onClick={() => setCurrentQuizIndex(prev => prev - 1)}
                          className="px-4 py-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                        >
                          Previous
                        </button>
                        {currentQuizIndex < quizQuestions.length - 1 ? (
                          <button
                            disabled={quizAnswers[currentQuizIndex] === undefined}
                            onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                            className="px-5 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-medium cursor-pointer"
                          >
                            Next Question
                          </button>
                        ) : (
                          <button
                            disabled={quizAnswers[currentQuizIndex] === undefined}
                            onClick={() => {
                              let score = 0;
                              quizQuestions.forEach((q, index) => {
                                if (quizAnswers[index] === q.answerIndex) score++;
                              });
                              setQuizScore(score);
                              setQuizSubmitted(true);
                              onAddXPAndCoins(score * 40, score * 10);
                            }}
                            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer glow-emerald"
                          >
                            Submit Assessment
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-6">
                      <div className="p-3.5 w-fit mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Check className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white font-mono">Quiz Completed!</h4>
                        <p className="text-xs text-slate-400">You scored <span className="font-bold text-emerald-400">{quizScore} / {quizQuestions.length}</span> correct answers.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#050816] border border-slate-850 text-slate-300 max-w-md mx-auto space-y-3 font-mono text-[11px] text-left">
                        <div className="text-[#7C5CFF] font-bold border-b border-slate-900 pb-1">AI SYLLABUS EVALUATION</div>
                        <div>XP Granted: <span className="text-white">+{quizScore * 40} XP</span></div>
                        <div>Point Shop Coins: <span className="text-white">+{quizScore * 10} Coins</span></div>
                        <div>Cognitive Accuracy: <span className="text-white">{Math.round((quizScore / quizQuestions.length) * 100)}%</span></div>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setQuizQuestions([]);
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                          }}
                          className="px-5 py-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-400 cursor-pointer"
                        >
                          Try Another Topic
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI CODING WORKSPACE */}
              {activeAiTab === "coding" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono">Coding Problem / Goal:</label>
                        <input
                          type="text"
                          value={codingTopic}
                          onChange={(e) => setCodingTopic(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono flex items-center justify-between">
                          <span>Interactive Editor (Python/TypeScript):</span>
                          <span className="text-[10px] text-slate-500">Auto-formatted</span>
                        </label>
                        <textarea
                          value={codingInput}
                          onChange={(e) => setCodingInput(e.target.value)}
                          className="w-full p-3 rounded-lg bg-[#050816] border border-slate-850 text-[#00E5FF] outline-none h-56 font-mono leading-relaxed"
                        />
                      </div>

                      <button
                        onClick={handleCodeReview}
                        disabled={isCodingLoading}
                        className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                      >
                        {isCodingLoading ? "Verifying Time/Space Complexities..." : "Run AI Review Engine"}
                      </button>
                    </div>

                    <div className="flex flex-col h-[356px] rounded-xl bg-[#050816] border border-slate-850 p-4 overflow-y-auto">
                      <div className="text-[10px] font-mono text-[#7C5CFF] border-b border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
                        <span>AI FEEDBACK TERMINAL</span>
                        <span>STATUS: READY</span>
                      </div>
                      {codingOutput ? (
                        <div className="markdown-body text-slate-200 leading-relaxed font-sans select-text">
                          <Markdown>{codingOutput}</Markdown>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-[11px] text-center p-4">
                          Write code and tap Review to execute automated unit review and get big-O ratings.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AI MOCK INTERVIEW EVALUATOR */}
              {activeAiTab === "interview" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Target Professional Role:</label>
                      <input
                        type="text"
                        value={interviewRole}
                        onChange={(e) => setInterviewRole(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Core Interview Challenge Question:</label>
                      <input
                        type="text"
                        value={interviewQuestion}
                        onChange={(e) => setInterviewQuestion(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono">Your Technical Answer Response:</label>
                    <textarea
                      value={interviewInput}
                      onChange={(e) => setInterviewInput(e.target.value)}
                      placeholder="Type your technical response in full depth..."
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-28 font-sans focus:border-[#7C5CFF]/50"
                    />
                  </div>

                  <button
                    onClick={handleInterviewEvaluate}
                    disabled={isInterviewLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isInterviewLoading ? "Scoring Answer Rubric..." : "Submit to AI Board"}
                  </button>

                  {interviewOutput && (
                    <div className="p-4 rounded-xl bg-[#050816] border border-slate-850 text-xs text-slate-200 h-[220px] overflow-y-auto leading-relaxed select-text">
                      <div className="markdown-body">
                        <Markdown>{interviewOutput}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI RESUME BUILDER */}
              {activeAiTab === "resume" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Full Legal Name:</label>
                      <input
                        type="text"
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Professional/Academic Goal:</label>
                      <input
                        type="text"
                        value={resumeGoal}
                        onChange={(e) => setResumeGoal(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Education Details:</label>
                      <input
                        type="text"
                        value={resumeEducation}
                        onChange={(e) => setResumeEducation(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Core Skills (separated by commas):</label>
                      <input
                        type="text"
                        value={resumeSkills}
                        onChange={(e) => setResumeSkills(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBuildResume}
                    disabled={isResumeLoading}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer disabled:opacity-50"
                  >
                    {isResumeLoading ? "Formatting LaTeX ATS parameters..." : "Draft ATS-Friendly AI Resume"}
                  </button>

                  {resumeOutput && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span>GENERATED DOCK RATING: ATS 98/100</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(resumeOutput);
                            alert("Copied to clipboard!");
                          }}
                          className="px-2 py-1 rounded bg-[#111122] border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          Copy Markdown
                        </button>
                      </div>
                      <div className="p-5 rounded-xl bg-white text-slate-900 h-[220px] overflow-y-auto leading-relaxed font-serif select-text shadow-inner">
                        <div className="markdown-body">
                          <Markdown>{resumeOutput}</Markdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VOICE LEARNING & VOICE CHAT TAB */}
              {activeAiTab === "voice" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-[#07070A] border border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center md:text-left">
                      <span className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-500/20 text-[9px] font-mono text-blue-400 uppercase tracking-widest">
                        Audio Assist Suite
                      </span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Bilingual Cognitive Voice Transceiver</h4>
                      <p className="text-[10px] text-slate-400 leading-normal max-w-md">
                        Review syllabus topics vocally, query the tutor verbally, or tap preset study notes to trigger real-time Speech Synthesis.
                      </p>
                    </div>

                    {/* Speech synthesis cancellation button */}
                    {isVoiceSpeaking && (
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined" && window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                            setIsVoiceSpeaking(false);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/20 text-[10px] font-mono transition-all cursor-pointer"
                      >
                        Stop Playback ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Visual Mic Transceiver Card (Col 2) */}
                    <div className="md:col-span-2 p-5 rounded-xl bg-[#06060A] border border-slate-900 flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Voice Control Unit</span>
                      
                      {/* Animated circular transceiver button */}
                      <button
                        onClick={handleToggleVoiceMic}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                          voiceMicActive 
                            ? "bg-rose-500/10 border-4 border-rose-500 glow-rose animate-pulse" 
                            : isVoiceSpeaking 
                              ? "bg-cyan-500/10 border-4 border-cyan-400 glow-blue animate-pulse-slow" 
                              : "bg-[#7C5CFF]/10 border-4 border-[#7C5CFF]/30 hover:border-[#7C5CFF] hover:bg-[#7C5CFF]/15"
                        }`}
                        title="Toggle Voice Input"
                      >
                        {voiceMicActive ? (
                          <Mic className="w-8 h-8 text-rose-500 animate-bounce" />
                        ) : isVoiceSpeaking ? (
                          <Volume2 className="w-8 h-8 text-cyan-400" />
                        ) : (
                          <Mic className="w-8 h-8 text-[#7C5CFF]" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <span className="text-xs font-bold font-mono text-white">
                          {voiceMicActive ? "Listening..." : isVoiceSpeaking ? "AI Tutor Speaking..." : "Microphone Idle"}
                        </span>
                        <p className="text-[9px] text-slate-500 leading-normal max-w-[180px]">
                          {voiceMicActive 
                            ? "We're processing your vocal notes." 
                            : isVoiceSpeaking 
                              ? "Listening to synthesis stream." 
                              : "Tap to ask a verbal query or hear presets."
                          }
                        </p>
                      </div>

                      {/* Custom fluctuating audio wave visualizer */}
                      <div className="flex items-end justify-center gap-1 h-10 w-44 px-3 bg-[#0A0A0E] rounded-lg border border-slate-900 overflow-hidden">
                        {voiceWaveform.map((h, i) => (
                          <div 
                            key={i} 
                            className={`w-1 rounded-t transition-all duration-100 ${
                              voiceMicActive 
                                ? "bg-rose-500" 
                                : isVoiceSpeaking 
                                  ? "bg-cyan-400" 
                                  : "bg-slate-800"
                            }`} 
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* presets & transcript card (Col 3) */}
                    <div className="md:col-span-3 space-y-4">
                      {/* Preset verbal triggers */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Quick Lesson presets</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            {
                              title: "Neural Backprop",
                              desc: "Gradients backpropagate backwards from error nodes to update model weights using calculus chain-rules.",
                              icon: Brain
                            },
                            {
                              title: "Calculus Limits",
                              desc: "In calculus, the derivative tracks the instantaneous rate of change and forms slopes of tangent lines.",
                              icon: TrendingUp
                            },
                            {
                              title: "Wavefunctions",
                              desc: "Wavefunctions track the statistical quantum probability distribution of subatomic system states over space.",
                              icon: Activity
                            }
                          ].map((preset, idx) => {
                            const Icon = preset.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleVoiceSpeakPrompt(preset.title, preset.desc)}
                                className="p-2.5 rounded-lg bg-[#0A0A0C] border border-slate-850 hover:border-[#7C5CFF]/40 text-left transition-all cursor-pointer space-y-1 flex flex-col justify-between group"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{preset.title}</span>
                                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#7C5CFF]" />
                                </div>
                                <span className="text-[8px] text-slate-500 leading-tight group-hover:text-slate-300">
                                  Trigger vocal review.
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lesson transcript bubble display */}
                      <div className="space-y-1.5 flex flex-col flex-1 h-[200px]">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Tutor Audio Logs & Transcripts</span>
                        <div className="p-4 rounded-xl bg-[#06060A]/80 border border-slate-900 text-[11px] font-mono text-slate-300 flex-1 overflow-y-auto leading-relaxed select-text space-y-2">
                          {voiceTranscript ? (
                            <p className="whitespace-pre-wrap">{voiceTranscript}</p>
                          ) : (
                            <span className="text-slate-600 block text-center mt-12">
                              No vocal transcript loaded. Click a quick preset or toggle mic to hear voice responses.
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. SUNDAY LIVE ARENA TAB */}
        {activeTab === "arena" && (() => {
          // Helper to generate exactly 30 participants sorted by XP
          const top30 = (() => {
            const list = [
              { name: "Jessica Chen 🥇", xp: 3250, coins: 640, active: true },
              { name: "Pranav Rao 🥈", xp: 3120, coins: 590, active: true },
              { name: `${studentStats.name} 🥉 (You)`, xp: studentStats.xp + 450, coins: studentStats.coins + 120, active: true },
              { name: "Emily Watson", xp: 2840, coins: 490, active: false },
              { name: "Tariq Ali", xp: 2610, coins: 410, active: true },
              { name: "Sarah Connor", xp: 2450, coins: 380, active: false },
              { name: "Yuki Tanaka", xp: 2310, coins: 340, active: true },
              { name: "Liam O'Connor", xp: 2190, coins: 300, active: false },
              { name: "Sofia Rodriguez", xp: 1980, coins: 250, active: true },
              { name: "David Kim", xp: 1820, coins: 210, active: true },
            ];
            const names = ["James", "Emma", "Oliver", "Charlotte", "Amelia", "Lucas", "Henry", "Evelyn", "Alexander", "Mila"];
            const lastNames = ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Miller", "Davis", "Garcia", "Rodriguez", "Williams"];
            for (let i = list.length + 1; i <= 30; i++) {
              const fName = names[(i * 3) % names.length];
              const lName = lastNames[(i * 7) % lastNames.length];
              list.push({
                name: `${fName} ${lName}`,
                xp: Math.max(100, 1800 - (i * 45)),
                coins: Math.max(10, 200 - (i * 5)),
                active: i % 3 !== 0
              });
            }
            return list.sort((a, b) => b.xp - a.xp);
          })();

          const currentQuestions = arenaQuestions.length > 0 ? arenaQuestions : ARENA_Q;

          return (
            <div className="space-y-6">
              {/* Header section with live indicator */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <h3 className="text-xl font-bold font-mono text-white">Sunday Live Arena Sprint</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enter our weekly high-octane 60-minute academic marathon. Test raw retention, gain multiplier XP boost, and claim global honors.
                  </p>
                </div>
                {arenaStep === "quiz" && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-red-400 font-mono text-xs">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>TIMER: {Math.floor(arenaTimer / 60)}:{(arenaTimer % 60).toString().padStart(2, "0")}</span>
                  </div>
                )}
              </div>

              {/* Three-column layouts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN: ACTIVE INTERFACE (Takes 2/3 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-panel rounded-2xl p-6 border border-slate-850 min-h-[420px] flex flex-col justify-between">
                    
                    {arenaStep === "start" && (
                      <div className="text-center space-y-6 py-6 my-auto">
                        <div className="p-4 w-fit mx-auto rounded-full bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] animate-bounce">
                          <Trophy className="w-12 h-12" />
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold text-white font-mono">Sunday AI-Generated Arena #14</h4>
                          <div className="flex justify-center items-center gap-4 text-xs font-mono">
                            <span className="text-emerald-400 font-semibold">⚡ ONLINE</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-blue-400 font-semibold">⏱️ 60 MIN SPRINT LIMIT</span>
                          </div>
                        </div>

                        <div className="max-w-md mx-auto p-4 rounded-xl bg-[#050816] border border-slate-900 space-y-3.5">
                          <span className="text-[11px] font-mono font-bold text-[#7C5CFF] block">CONFIG COGNITIVE PARAMETERS</span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={arenaSubject}
                              onChange={(e) => setArenaSubject(e.target.value)}
                              placeholder="Input target scientific discipline..."
                              className="flex-1 p-2 bg-[#0A0A0B]/60 border border-slate-850 rounded-lg text-xs text-slate-200 outline-none focus:border-[#7C5CFF]/50 font-mono"
                            />
                            <button
                              onClick={handleArenaGenerate}
                              disabled={isArenaGenerating}
                              className="px-4 py-2 rounded-lg bg-[#7C5CFF]/15 hover:bg-[#7C5CFF]/25 text-[#7C5CFF] border border-[#7C5CFF]/30 font-semibold text-xs transition-all cursor-pointer font-mono whitespace-nowrap"
                            >
                              {isArenaGenerating ? "Generating..." : "Generate AI Sprint"}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                            Alternatively, enter with our default astrophysics set. Score correctly to claim up to +150 XP, +45 Coins, and an honor diploma.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setArenaStep("quiz");
                            setArenaAnswers({});
                            setArenaTimer(3600);
                            setArenaTimerActive(true);
                          }}
                          className="px-8 py-3 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold text-xs border border-blue-400/20 shadow-lg cursor-pointer transition-all"
                        >
                          Enter Live Arena (Standard Mode)
                        </button>
                      </div>
                    )}

                    {arenaStep === "quiz" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3 text-[10px] font-mono text-slate-500">
                          <span>NEXORA LIVE SUPERVISED PROCTOR ENGINE</span>
                          <span className="text-emerald-400 animate-pulse">● LIVE SECURE SESSION</span>
                        </div>

                        <div className="space-y-6">
                          {currentQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="space-y-3 p-4 rounded-xl bg-[#050816]/30 border border-slate-900/60">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-mono text-slate-200 font-bold">
                                  Q{qIdx + 1}: {q.q}
                                </h4>
                                <span className="text-[9px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                  AI-Generated Concept
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                {q.options.map((opt: string, oIdx: number) => {
                                  const isSelected = arenaAnswers[qIdx] === oIdx;
                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleArenaAnswer(qIdx, oIdx)}
                                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                        isSelected 
                                          ? "bg-[#7C5CFF]/15 border-[#7C5CFF] text-[#7C5CFF] font-medium" 
                                          : "bg-[#0A0A0B]/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-900">
                          <button
                            onClick={submitArenaQuiz}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-lg transition-all"
                          >
                            Submit Arena Sprint
                          </button>
                        </div>
                      </div>
                    )}

                    {arenaStep === "finished" && (
                      <div className="text-center space-y-6 py-6 my-auto">
                        <div className="p-4 w-fit mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
                          <Check className="w-12 h-12" />
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white font-mono">Arena Quest Completed!</h4>
                          <p className="text-xs text-slate-400">
                            You scored <span className="font-bold text-blue-400">{arenaScore} / {currentQuestions.length}</span> questions correctly.
                          </p>
                        </div>

                        <div className="p-4 max-w-sm mx-auto rounded-xl bg-blue-950/10 border border-blue-500/20 flex justify-around text-xs font-mono">
                          <div>
                            <div className="text-blue-400 font-bold">+{arenaScore * 50} XP</div>
                            <span className="text-slate-500 text-[10px]">ROADMAP EXP</span>
                          </div>
                          <div className="w-px bg-blue-500/20" />
                          <div>
                            <div className="text-yellow-400 font-bold">+{arenaScore * 15} COINS</div>
                            <span className="text-slate-500 text-[10px]">POINT SHOP</span>
                          </div>
                        </div>

                        {/* Printable visual Certificate of Honor block */}
                        <div className="p-6 rounded-xl border border-dashed border-[#7C5CFF]/30 bg-[#0A0A0B] max-w-md mx-auto text-center space-y-4 shadow-xl relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#120B24] border border-[#7C5CFF]/30 text-[#7C5CFF] rounded-full text-[9px] font-mono tracking-widest uppercase">
                            Nexora Academic Credentials
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 tracking-widest pt-2">NEXORA REGIONAL EDUCATION BOARD</div>
                          <h3 className="text-lg font-serif font-bold text-slate-100 italic">Certificate of Honor</h3>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
                            This diploma is awarded to <span className="text-white font-bold">{studentStats.name}</span> for outstanding cognitive speed and accuracy under supervised Sunday Live Arenas on <span className="text-blue-400 font-medium">{arenaQuestions.length > 0 ? arenaSubject : "Computational Astrophysics"}</span>.
                          </p>
                          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 pt-3 border-t border-slate-900/60">
                            <span>REPRESENTATIVE: DR. LIAM CORTEZ</span>
                            <span>HASH: NX-749-{arenaSubject.substring(0,3).toUpperCase()}</span>
                          </div>
                          
                          <button
                            onClick={() => window.print()}
                            className="mt-2 w-full py-1.5 px-3 rounded bg-slate-900 hover:bg-slate-850 text-[10px] text-slate-300 font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Print Certificate of Honor 🖨️
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setArenaStep("start");
                            setArenaQuestions([]);
                          }}
                          className="px-5 py-2.5 rounded-lg bg-[#111114] border border-slate-800 text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          Unlock Next Dynamic Challenge
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* RIGHT COLUMN: COMPETITION SIDEBAR (Takes 1/3 cols) */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* LIVE RANKING (TOP 30) */}
                  <div className="glass-panel rounded-2xl p-4 border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <h4 className="text-xs font-bold font-mono text-white">Top 30 Live Leaderboard</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">Week #14</span>
                    </div>

                    <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 text-xs scrollbar-none">
                      {top30.map((p, idx) => {
                        const isUser = p.name.includes("You");
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                              isUser 
                                ? "bg-[#7C5CFF]/15 border border-[#7C5CFF]/40 text-white font-semibold" 
                                : "bg-[#0A0A0B]/40 border border-slate-900/60 hover:border-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 font-mono text-[10px] text-center font-bold ${idx < 3 ? "text-yellow-400" : "text-slate-500"}`}>
                                #{idx + 1}
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ opacity: p.active ? 1 : 0.2 }} title={p.active ? "Online" : "Offline"} />
                              <span className="text-slate-200 truncate max-w-[110px]">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-3 font-mono text-[10px]">
                              <span className="text-[#7C5CFF]">{p.xp} XP</span>
                              <span className="text-yellow-500 text-[9px]">{p.coins} 🪙</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* HALL OF FAME */}
                  <div className="glass-panel rounded-2xl p-4 border border-slate-850 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <h4 className="font-bold font-mono text-white flex items-center gap-1.5">
                        🏆 Hall of Fame
                      </h4>
                      <span className="text-[9px] font-mono text-slate-500">Overall Champions</span>
                    </div>
                    
                    <div className="space-y-2.5 text-[11px] font-mono">
                      <div className="flex items-center justify-between p-1">
                        <span className="text-slate-300">👑 Season 1 Champion</span>
                        <span className="text-[#7C5CFF] font-bold">Jessica Chen</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-slate-300">👑 Season 2 Champion</span>
                        <span className="text-[#7C5CFF] font-bold">Marcus Aurelius</span>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <span className="text-slate-300">👑 Season 3 Champion</span>
                        <span className="text-[#7C5CFF] font-bold">Aarav Sharma</span>
                      </div>
                    </div>
                  </div>

                  {/* REWARDS QUICK REDEMPTION */}
                  <div className="glass-panel rounded-2xl p-4 border border-slate-850 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <h4 className="font-bold font-mono text-white flex items-center gap-1.5">
                        🎁 Point Rewards Shop
                      </h4>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/30 border border-slate-950 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-300">Weekly XP Boost Card</div>
                        <span className="text-[9px] font-mono text-yellow-500">250 Coins</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (studentStats.coins >= 250) {
                            onAddXPAndCoins(100, -250);
                            setBannerMsg("XP Boost Card redeemed! +100 XP awarded.");
                            setTimeout(() => setBannerMsg(null), 3000);
                          } else {
                            alert("Insufficient Coins to redeem!");
                          }
                        }}
                        className="py-1 px-3 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 rounded text-[10px] font-semibold transition-all cursor-pointer"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })()}

        {/* 4. POINT SHOP TAB */}
        {activeTab === "shop" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    Nexora Phase 9 Reward Shop
                  </h3>
                  <p className="text-xs text-slate-400">
                    Redeem earned coins for exclusive textbooks, mock exams, formula cheatsheets, badges, avatars, and real-world coupon discounts.
                  </p>
                </div>
                <div className="p-3 bg-[#0A0A0B]/80 border border-slate-850 rounded-xl text-center md:text-right min-w-[140px]">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold">Your Balance</span>
                  <div className="flex items-center justify-center md:justify-end gap-1.5 text-yellow-400 font-mono text-sm font-bold mt-0.5">
                    <Coins className="w-4 h-4 text-yellow-500 animate-bounce" />
                    <span>{studentStats.coins.toFixed(0)} Coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-900">
              {[
                { id: "all", label: "All Items", icon: Layers },
                { id: "book", label: "Books", icon: BookOpen },
                { id: "notes", label: "Premium Notes", icon: FileText },
                { id: "test", label: "Premium Tests", icon: ClipboardCheck },
                { id: "badge", label: "Cosmetic Badges", icon: Award },
                { id: "avatar", label: "Avatars & Borders", icon: User },
                { id: "theme", label: "Aesthetic Themes", icon: Terminal },
                { id: "coupon", label: "Discounts & Coupons", icon: CreditCard }
              ].map((cat) => {
                const isActive = shopCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setShopCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300"
                        : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pointShop
                .filter((item) => {
                  if (shopCategory !== "all" && item.type !== shopCategory) return false;
                  return true;
                })
                .map((item) => {
                  const isTheme = item.type === "theme";
                  const isCoupon = item.type === "coupon";
                  const isBadge = item.type === "badge";
                  const isAvatar = item.type === "avatar";
                  const isActiveTheme = activeThemeName === item.name;

                  return (
                    <div 
                      key={item.id} 
                      className={`p-5 rounded-2xl glass-panel border space-y-4 relative group overflow-hidden transition-all ${
                        item.unlocked 
                          ? "border-slate-850 bg-[#111114]/25" 
                          : "border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex items-start justify-between">
                        <div className={`p-2.5 rounded-xl border ${
                          item.unlocked 
                            ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-400" 
                            : "bg-slate-900/40 border-slate-850 text-slate-400"
                        }`}>
                          {isTheme ? (
                            <Terminal className="w-4 h-4" />
                          ) : isCoupon ? (
                            <CreditCard className="w-4 h-4" />
                          ) : isBadge ? (
                            <Award className="w-4 h-4" />
                          ) : isAvatar ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-slate-900 text-slate-400 uppercase tracking-wider">
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white text-xs font-mono">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{item.description}</p>
                      </div>

                      {/* Purchased Coupon Code Viewer */}
                      {item.unlocked && isCoupon && item.code && (
                        <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between font-mono text-[10px]">
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px]">Promo Code</span>
                            <span className="text-indigo-300 font-bold tracking-wider">{item.code}</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.code || "");
                              setBannerMsg(`Coupon code "${item.code}" copied to clipboard!`);
                              setTimeout(() => setBannerMsg(null), 3000);
                            }}
                            className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded text-[9px] font-bold cursor-pointer transition-colors"
                          >
                            Copy Code
                          </button>
                        </div>
                      )}

                      {/* Themes Equip / Switcher */}
                      {item.unlocked && isTheme && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#050816]/60 border border-slate-900 font-mono text-[10px]">
                          <span className="text-slate-400">Appearance status:</span>
                          <button
                            onClick={() => {
                              setActiveThemeName(item.name);
                              setBannerMsg(`Equipped theme: "${item.name}" successfully!`);
                              setTimeout(() => setBannerMsg(null), 3000);
                            }}
                            disabled={isActiveTheme}
                            className={`px-3 py-1 rounded text-[9px] font-bold cursor-pointer transition-all ${
                              isActiveTheme 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/20"
                            }`}
                          >
                            {isActiveTheme ? "✓ Equipped Active" : "Equip Theme"}
                          </button>
                        </div>
                      )}

                      {/* Badges Equipped indicator */}
                      {item.unlocked && isBadge && (
                        <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded-lg text-center flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Equipped profile badge. Visible on student card.</span>
                        </div>
                      )}

                      {/* Avatars equipped status */}
                      {item.unlocked && isAvatar && (
                        <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded-lg text-center flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked profile background asset.</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#0A0A0B]">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-mono text-xs font-bold">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span>{item.cost} Coins</span>
                        </div>

                        {!item.unlocked ? (
                          <button
                            onClick={() => handleBuyItem(item)}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] font-mono transition-all cursor-pointer shadow-lg shadow-blue-600/15"
                          >
                            Purchase Item
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1 px-3 py-1.5 bg-[#0A0A0C] border border-slate-850 rounded-lg">
                            <Check className="w-3.5 h-3.5 text-slate-500" />
                            Owned & Unlocked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

              {pointShop.filter((item) => {
                if (shopCategory !== "all" && item.type !== shopCategory) return false;
                return true;
              }).length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500 font-mono">
                  No reward assets cataloged in this filter tier.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. PERFORMANCE ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">Progress Analytics</h3>
              <p className="text-xs text-slate-400">
                Uncompromising, high-fidelity metrics detailing subject proficiency indices and daily study commitment trends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily commitment AreaChart */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">Daily Study Commitment (Minutes)</h4>
                <div className="h-48 text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentStats.studyTimeHistory}>
                      <defs>
                        <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#475569" />
                      <YAxis stroke="#475569" />
                      <Tooltip contentStyle={{ background: '#111114', borderColor: '#334155', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="minutes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMin)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Proficiency BarChart */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">Subject Proficiency Index (%)</h4>
                <div className="h-48 text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(studentStats.subjectPerformance).map(([key, val]) => ({ subject: key, percentage: val }))}>
                      <XAxis dataKey="subject" stroke="#475569" />
                      <YAxis stroke="#475569" />
                      <Tooltip contentStyle={{ background: '#111114', borderColor: '#334155', borderRadius: '8px' }} />
                      <Bar dataKey="percentage" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Github Style Study Heatmap */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">Annual Cognitive Heatmap</h4>
              <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto scrollbar-none py-1">
                {Array.from({ length: 42 }).map((_, idx) => {
                  const level = Math.floor(Math.sin(idx / 3) * 2) + Math.floor(idx / 10) % 3;
                  const intensityClass = level <= 0
                    ? "bg-[#0A0A0B] border border-slate-950"
                    : level === 1
                      ? "bg-blue-950/40 border border-slate-900"
                      : level === 2
                        ? "bg-blue-900/40 border border-blue-900"
                        : "bg-blue-500 border border-blue-400 glow-blue";
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-110 cursor-pointer ${intensityClass}`}
                      title={`Active learning logs: ${idx * 4} minutes`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 text-[10px] font-mono text-slate-500">
                <span>Less</span>
                <div className="w-2.5 h-2.5 bg-[#0A0A0B]" />
                <div className="w-2.5 h-2.5 bg-blue-950/40" />
                <div className="w-2.5 h-2.5 bg-blue-900/40" />
                <div className="w-2.5 h-2.5 bg-blue-500" />
                <span>More</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. MY PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">Student Academic Dossier</h3>
              <p className="text-xs text-slate-400">
                Manage your credentials, explore unlocked milestone badges, and review honor certificates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ID Card Display */}
              <div className="md:col-span-1 p-5 rounded-2xl border border-slate-800 bg-[#060608]/90 text-center space-y-4 shadow-xl">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Nexora Academic ID Card</span>
                
                <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-[#7C5CFF] to-blue-500 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#0E0E12] flex items-center justify-center text-white text-xl font-black">
                    AS
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono">{studentStats.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">ID: NX-2026-90412</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-950 text-[11px] font-mono text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Syllabus Goal:</span>
                    <span className="text-slate-200">IIT JEE Advanced</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Global Rank:</span>
                    <span className="text-yellow-400 font-bold">#4 on Leaderboard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Study Logs:</span>
                    <span className="text-slate-200">1,480 total mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integrity Scale:</span>
                    <span className="text-emerald-400 font-bold">100.0% Perfect</span>
                  </div>
                </div>
              </div>

              {/* Achievements cabinet */}
              <div className="md:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Unlocked Milestone Badges</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {[
                    { title: "Flame Master", desc: "Maintained a consistent study streak above 10 days.", icon: Flame, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                    { title: "Quiz Whiz", desc: "Cleared any AI Syllabus Quiz with a perfect 100% score.", icon: Trophy, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                    { title: "Sandbox Star", desc: "Completed the Sunday live arena with absolute focus.", icon: Shield, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                    { title: "Vocal Learner", desc: "Utilized voice transceivers to speak questions to the AI.", icon: Mic, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
                  ].map((ach, idx) => {
                    const Icon = ach.icon;
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-[#07070A] border border-slate-900 flex items-start gap-3">
                        <div className={`p-2 rounded-lg border ${ach.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-200">{ach.title}</h5>
                          <p className="text-[10px] text-slate-500 leading-normal">{ach.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Earned Honors Certificates list */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Earned Honor Certificates Cabinet</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Astrophysics Calculus Mastery", id: "NX-CERT-8904", date: "July 12, 2026", grade: "98% Score" },
                  { name: "Quantum Probability Foundations", id: "NX-CERT-1123", date: "June 28, 2026", grade: "94% Score" },
                ].map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 flex flex-col justify-between h-40 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <Award className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-slate-500">HONOR CERTIFICATE OF ACADEMIC ACHIEVEMENT</span>
                      <h5 className="text-xs font-bold text-white group-hover:text-[#7C5CFF] transition-all">{cert.name}</h5>
                    </div>

                    <div className="space-y-2 border-t border-slate-900/60 pt-2 text-[10px] font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Issued Date: {cert.date}</span>
                        <span className="text-emerald-400">{cert.grade}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setBannerMsg(`Initiating secure verification for Certificate ${cert.id}... downloaded successfully!`);
                          setTimeout(() => setBannerMsg(null), 3000);
                        }}
                        className="w-full py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-[9px] cursor-pointer"
                      >
                        Download verified PDF Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. SYSTEM SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-2">
              <h3 className="text-xl font-bold font-mono text-white">System Settings</h3>
              <p className="text-xs text-slate-400">
                Personalize learning goal weights, adjust academic proctor sensitivities, and customize interface palettes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Learning parameters setting card */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Learning & Proctor Configurations</h4>
                
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono block">Daily Study Target Goal:</label>
                    <select className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none">
                      <option>3 Hours per day (Recommended)</option>
                      <option>4 Hours per day (Aggressive)</option>
                      <option>5 Hours per day (Expert Olympiad)</option>
                      <option>2 Hours per day (Moderate)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono block">Core Syllabus Focus Topic:</label>
                    <input
                      type="text"
                      defaultValue="Astrophysical Calculus & Quantum Limits"
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-mono block">Sandbox Proctored Camera Sensitivity:</label>
                    <select className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none">
                      <option>Medium (Tracks blur events & active focus triggers)</option>
                      <option>High (Strict gaze-tracking analytics simulation)</option>
                      <option>Low (Allows tab shifting with manual alerts)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interface palette settings */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Aesthetic Theme Templates</h4>
                
                <div className="space-y-4 leading-relaxed text-slate-400 font-sans text-[11px]">
                  <p>Customize the color accent profile to suit your late-night study routines. Changes update the visual deck canvas instantly.</p>
                  
                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {[
                      { id: "twilight", label: "Midnight Twilight (Standard)", color: "border-[#7C5CFF] text-[#7C5CFF] bg-[#7C5CFF]/10" },
                      { id: "cosmic", label: "Deep Space Obsidian", color: "border-blue-500 text-blue-400 bg-blue-500/10" },
                      { id: "emerald", label: "High-contrast Scholar Emerald", color: "border-emerald-500 text-emerald-400 bg-emerald-500/10" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setBannerMsg(`Theme adjusted successfully! Accent changed to: ${theme.label}`);
                          setTimeout(() => setBannerMsg(null), 3000);
                        }}
                        className={`w-full py-2.5 rounded-xl border text-left px-4 font-semibold font-mono transition-all cursor-pointer ${theme.color}`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setBannerMsg("Preferences committed to local database!");
                  setTimeout(() => setBannerMsg(null), 3000);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. INTERACTIVE HOMEWORK SOLVER DIALOG OVERLAY */}
      <AnimatePresence>
        {solvingAssignment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#0E0E12] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl divide-y divide-slate-900"
            >
              <div className="p-4 px-5 bg-[#14141A] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-[#7C5CFF] uppercase tracking-wider">{solvingAssignment.subject} ASSIGNMENT</span>
                  <h4 className="text-xs font-bold text-white font-sans mt-0.5">{solvingAssignment.title}</h4>
                </div>
                <button
                  onClick={() => setSolvingAssignment(null)}
                  className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 text-[11px] leading-relaxed text-slate-300">
                  <span className="text-[9px] font-mono font-bold text-slate-500 block mb-1">AI HOMEWORK PROBLEM DIRECTIVE</span>
                  {solvingAssignment.questionText}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Verify correct theoretical hypothesis:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {solvingAssignment.options.map((option: string, idx: number) => {
                      const isSelected = solvingAnswerIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSolvingAnswerIndex(idx)}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-[11px] cursor-pointer ${
                            isSelected 
                              ? "bg-[#7C5CFF]/15 border-[#7C5CFF] text-[#7C5CFF]" 
                              : "bg-[#050816]/60 border-slate-900 text-slate-400 hover:border-slate-800"
                          }`}
                        >
                          <span className="font-mono font-bold mr-2 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 px-5 bg-[#111115] flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  Grants: <span className="text-[#7C5CFF]">+{solvingAssignment.xpReward} XP</span> • <span className="text-yellow-400 font-bold">+{solvingAssignment.coinsReward} Coins</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSolvingAssignment(null)}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={solvingAnswerIndex === null}
                    onClick={handleSubmitAssignmentAnswer}
                    className="px-5 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold text-[11px] font-mono transition-all cursor-pointer disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
