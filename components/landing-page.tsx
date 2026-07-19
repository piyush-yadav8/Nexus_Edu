'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Brain, Award, Shield, Clock, Flame, ChevronRight, BookOpen, 
  Activity, Search, Users, Video, Target, Star, HelpCircle, ArrowRight,
  TrendingUp, Check, ShieldCheck, Mail, Send, PlayCircle, Zap,
  Sun, Moon, Menu, X
} from 'lucide-react';

interface LandingPageProps {
  onExplore: (role: "student" | "teacher" | "admin") => void;
  onOpenLogin: () => void;
}

// Interactive Canvas Particle Background Component
function NeuralBackground({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw network grid lines
      ctx.strokeStyle = isLight ? 'rgba(124, 92, 255, 0.05)' : 'rgba(124, 92, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < width; i += 80) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let j = 0; j < height; j += 80) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
      }
      ctx.stroke();

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = isLight ? 'rgba(124, 92, 255, 0.22)' : 'rgba(124, 92, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw interactive connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = isLight
              ? `rgba(0, 180, 216, ${0.14 * (1 - dist / 150)})`
              : `rgba(0, 229, 255, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

const AI_MESSAGES = [
  "Hi Aarav! I detected minor knowledge gaps in 'Diffraction Grating convergence'. Shall we spin a tailored practice sandbox?",
  "UPSC CSAT Analytical Reasoning mapped. Your logic accuracy is currently 92%. Focus on spatial geometry next.",
  "Sunday Arena #14 is commencing in 4 hours. Recommended target: Waveguides module review to secure Rank #1."
];

function HeroDashboardPreview({ isLight }: { isLight: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
  const [aiTyping, setAiTyping] = useState("");
  const [liveUsers, setLiveUsers] = useState(4280);

  useEffect(() => {
    let msgIndex = activeStep % AI_MESSAGES.length;
    let text = AI_MESSAGES[msgIndex];
    let charIndex = 0;
    let active = true;
    
    const interval = setInterval(() => {
      if (active) {
        if (charIndex === 0) {
          setAiTyping("");
        }
        if (charIndex <= text.length) {
          setAiTyping(text.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
        }
      }
    }, 25);
    
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [activeStep]);

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setActiveStep(prev => prev + 1);
    }, 6500);

    const userTimer = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 9) - 4);
    }, 4000);

    return () => {
      clearInterval(cycleTimer);
      clearInterval(userTimer);
    };
  }, []);

  return (
    <div className={`w-full relative p-0.5 rounded-3xl transition-all duration-500 border overflow-hidden group ${
      isLight 
        ? "bg-gradient-to-tr from-[#7C5CFF]/10 via-white to-[#00E5FF]/10 border-slate-200/80 shadow-xl" 
        : "bg-gradient-to-tr from-[#7C5CFF]/20 via-slate-900/40 to-[#00E5FF]/20 border-slate-800/80 shadow-2xl backdrop-blur-xl"
    }`}>
      {/* Absolute high-tech scanner lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent animate-pulse" />
      
      {/* Top Header */}
      <div className={`flex items-center justify-between px-5 py-3.5 border-b transition-colors duration-500 ${
        isLight ? "border-slate-100 bg-slate-50/60" : "border-slate-900/80 bg-slate-950/40"
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className={`text-[10px] font-mono tracking-widest font-bold ${isLight ? "text-[#7C5CFF]" : "text-[#00E5FF]"}`}>NEXORA_CORE_LIVE</span>
        </div>
        <div className={`flex items-center gap-4 text-[9px] font-mono transition-colors duration-500 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#7C5CFF]" /> {liveUsers} online</span>
          <span className="text-emerald-500 font-bold">● SECURE GATEWAY</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Row 1: AI Assistant Terminal & Study Streak */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className={`md:col-span-8 p-3 rounded-xl flex flex-col justify-between min-h-[110px] relative overflow-hidden border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono text-[#7C5CFF] font-bold uppercase flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-[#7C5CFF]" /> AI Mentor Core
              </span>
              <span className="text-[8px] font-mono text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/5">Active</span>
            </div>
            <p className={`text-[10px] font-mono leading-normal flex-1 transition-colors duration-500 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {aiTyping}
              <span className="inline-block w-1.5 h-3.5 bg-[#00E5FF] ml-1 animate-pulse" />
            </p>
          </div>

          <div className={`md:col-span-4 p-3 rounded-xl flex flex-col justify-between text-center border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Streak</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
            </div>
            <div className="py-2">
              <div className={`text-2xl font-black font-mono tracking-tight transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>14 Days</div>
              <div className="text-[8px] font-mono text-slate-500 mt-0.5">+450 XP Bonus Active</div>
            </div>
          </div>
        </div>

        {/* Row 2: Analytics & Live Stream Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Progress Ring / Gauge */}
          <div className={`md:col-span-5 p-3 rounded-xl flex flex-col items-center justify-center text-center border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="text-[9px] font-mono text-slate-400 font-bold uppercase mb-2">Subject Mastery</div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke={isLight ? "#e2e8f0" : "#111122"} strokeWidth="4" fill="transparent" />
                <circle cx="32" cy="32" r="26" stroke="url(#gradient)" strokeWidth="4" fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - 0.82)}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C5CFF" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={`absolute text-[11px] font-mono font-bold transition-colors duration-500 ${isLight ? "text-slate-850" : "text-white"}`}>82%</span>
            </div>
            <span className="text-[8px] font-mono text-emerald-500 mt-2">▲ UPSC Paper-2 Mapped</span>
          </div>

          {/* Live class indicators */}
          <div className={`md:col-span-7 p-3 rounded-xl flex flex-col justify-between border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono text-[#00E5FF] font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> Live Classroom
              </span>
              <span className="text-[8px] font-mono text-slate-500">2.1K Active</span>
            </div>
            <div className="space-y-1">
              <div className={`text-[10px] font-bold leading-snug transition-colors duration-500 ${isLight ? "text-slate-850" : "text-white"}`}>{"Quantum Computing & Shor's Algorithm"}</div>
              <div className="text-[9px] font-mono text-[#7C5CFF]">Host: Dr. Elena Rostova (CERN)</div>
            </div>
            <div className={`mt-2 text-[8px] font-mono text-slate-500 p-1.5 rounded border flex items-center justify-between transition-colors duration-500 ${
              isLight ? "bg-slate-100/60 border-slate-200" : "bg-slate-900/50 border-slate-850"
            }`}>
              <span>Next Arena: Sunday 10:00 AM</span>
              <span className="text-[#00E5FF] font-bold cursor-pointer hover:underline">Remind Me</span>
            </div>
          </div>
        </div>

        {/* Row 3: Mock Score, Recommender & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className={`md:col-span-4 p-3 rounded-xl text-center border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="text-[9px] font-mono text-slate-400 font-bold uppercase mb-1">Mock Exam #12</div>
            <div className={`text-xl font-bold font-mono transition-colors duration-500 ${isLight ? "text-[#7C5CFF]" : "text-[#00E5FF]"}`}>88%</div>
            <div className="text-[8px] font-mono text-slate-500 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 98% Integrity
            </div>
          </div>

          <div className={`md:col-span-8 p-3 rounded-xl flex flex-col justify-between text-left border transition-colors duration-500 ${
            isLight ? "bg-slate-50/80 border-slate-100" : "bg-slate-950/80 border-slate-850"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">AI Recommendations</span>
              <Sparkles className="w-3 h-3 text-[#00E5FF]" />
            </div>
            <p className={`text-[9.5px] leading-normal my-1 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Complete wave diffraction sandbox module to elevate Wave Mechanics mastery above 90% and earn <span className="text-yellow-500 font-mono font-bold">+150 Coins</span>.
            </p>
            <div className={`h-1 w-full rounded-full overflow-hidden mt-1 transition-colors duration-500 ${isLight ? "bg-slate-200" : "bg-slate-900"}`}>
              <div className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF]" style={{ width: "72%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onExplore, onOpenLogin }: LandingPageProps) {
  // Theme and UI state
  const [isLight, setIsLight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Course Search & Category states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Simulated Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentPlanName, setPaymentPlanName] = useState("");
  const [paymentPlanPrice, setPaymentPlanPrice] = useState("");

  const categories = [
    "All", "UPSC", "JEE", "NEET", "GATE", "SSC & Railway", "Defence", "College Prep"
  ];

  const coursesData = [
    {
      id: "c-1",
      title: "UPSC General Studies & Cognitive Memory Blueprint",
      category: "UPSC",
      instructor: "Dr. Ramesh Verma (IAS Retd.)",
      rating: 4.9,
      students: "12,400+",
      price: "₹1,499",
      tag: "Trending",
      gradient: "from-violet-600 to-indigo-600"
    },
    {
      id: "c-2",
      title: "Advanced IIT-JEE Physics: Wave Mechanics & Superposition",
      category: "JEE",
      instructor: "Prof. Elena Rostova",
      rating: 4.8,
      students: "8,910+",
      price: "₹999",
      tag: "Best Seller",
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      id: "c-3",
      title: "NEET AI-Guided Organic Chemistry & Synthesis",
      category: "NEET",
      instructor: "Dr. Ananya Ray",
      rating: 4.9,
      students: "14,150+",
      price: "₹1,199",
      tag: "AI Recommended",
      gradient: "from-teal-600 to-emerald-600"
    },
    {
      id: "c-4",
      title: "GATE Computer Science: Deep Networks & Activation Functions",
      category: "GATE",
      instructor: "Prof. Sarah Jenkins",
      rating: 4.7,
      students: "6,800+",
      price: "₹1,299",
      tag: "Structured Path",
      gradient: "from-fuchsia-600 to-purple-600"
    },
    {
      id: "c-5",
      title: "High-Speed Vedic Math & Quantitative Aptitude for SSC",
      category: "SSC & Railway",
      instructor: "Dr. Alistair Vance",
      rating: 4.6,
      students: "18,200+",
      price: "₹499",
      tag: "Highly Rated",
      gradient: "from-orange-600 to-amber-600"
    },
    {
      id: "c-6",
      title: "Fundamentals of Astrobiology & Quantum Computing Concepts",
      category: "College Prep",
      instructor: "Dr. Elena Rostova",
      rating: 4.9,
      students: "3,450+",
      price: "Free",
      tag: "Academic Special",
      gradient: "from-pink-600 to-rose-600"
    }
  ];

  const teachers = [
    { name: "Prof. Sarah Jenkins", role: "AI & Neural Networks Spec.", inst: "Stanford Alumna", rating: 4.9, badge: "DeepTech Lead" },
    { name: "Dr. Elena Rostova", role: "Quantum Physics & Relativity", inst: "CERN Associate", rating: 4.8, badge: "Astro Scholar" },
    { name: "Dr. Ramesh Verma", role: "UPSC GS & Ethics Strategy", inst: "Former IAS Advisor", rating: 4.9, badge: "Master Mentor" },
    { name: "Dr. Ananya Ray", role: "Biochemistry & Organic Master", inst: "PhD IISc Bangalore", rating: 4.7, badge: "Gold Medalist" }
  ];

  const testimonials = [
    { name: "Rohan Singhal", exam: "Cleared IIT-JEE (Rank 142)", text: "The AI Roadmap adjusted my daily schedule automatically whenever I missed a physics module. Sunday Arenas kept me sharp under intense exam pressures!" },
    { name: "Priya Patel", exam: "NEET Score: 710/720", text: "Nexora's AI Doubt Solver provided step-by-step molecular analogies within seconds. Truly felt like having an elite personal coach available 24/7." },
    { name: "Anil Deshmukh", exam: "Cleared UPSC CSE 2025", text: "Proctoring Sandboxes prepared me perfectly for high-pressure writing. The platform's complete focus block is the standard every serious student needs." }
  ];

  const faqs = [
    { q: "How does the AI Study Planner design custom calendars?", a: "Our cognitive engine analyzes your targets, dedicated daily hours, and subject strengths. It maps dynamic learning nodes, inserts periodic spacing reviews, and schedules gamified mini-tests to ensure perfect retention." },
    { q: "Is the Secure Exam proctoring system safe for privacy?", a: "Yes, completely! Nexora respects student privacy. We do not use webcams or video data. Monitoring relies entirely on tab focal events, browser resize telemetry, and Clipboard hooks." },
    { q: "Can I try courses for free before subscribing?", a: "Absolutely! We offer several full-length starter modules, interactive AI-tutor chats, and community Sunday Arenas without charging any subscription fees." },
    { q: "How do Sunday Arenas work?", a: "Every Sunday, a live exam arena opens for 4 hours. Students worldwide compete simultaneously on synchronized questions. Top performers earn multipliers, certified achievement badges, and Nexora Coins." }
  ];

  const filteredCourses = coursesData.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnrollCourse = (courseTitle: string) => {
    setEnrollSuccessMsg(`Secure Sandbox initialized! "${courseTitle}" added to workspace registry.`);
    setTimeout(() => setEnrollSuccessMsg(null), 4000);
  };

  const handleSubscribePlan = (plan: string, price: string) => {
    setPaymentPlanName(plan);
    setPaymentPlanPrice(price);
    setPaymentModalOpen(true);
  };

  const handleSimulatePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setEnrollSuccessMsg(`Nebula Transaction Cleared! ${paymentPlanName} features successfully unlocked.`);
    setTimeout(() => setEnrollSuccessMsg(null), 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden font-sans ${isLight ? "bg-slate-50 text-slate-800" : "bg-[#050816] text-slate-100"}`}>
      <NeuralBackground isLight={isLight} />

      {/* Glow Orbs */}
      <div className={`absolute top-[-200px] left-[10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-500 ${isLight ? "bg-[#7C5CFF]/4" : "bg-[#7C5CFF]/10"}`} />
      <div className={`absolute top-[400px] right-[5%] w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 ${isLight ? "bg-[#00E5FF]/3" : "bg-[#00E5FF]/8"}`} />

      {/* Global Alert Banner */}
      <AnimatePresence>
        {enrollSuccessMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border flex items-center gap-3 shadow-2xl text-sm ${
              isLight 
                ? "bg-white/95 border-[#7C5CFF]/30 text-slate-800 shadow-slate-200" 
                : "glass-panel-heavy border-[#00E5FF]/40 text-slate-100 glow-cyan"
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-[#7C5CFF] animate-bounce" />
            <span>{enrollSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 backdrop-blur-md z-40 w-full transition-colors duration-500 border-b ${
        isLight 
          ? "bg-white/80 border-slate-200/80 shadow-sm" 
          : "bg-[#050816]/80 border-slate-900/60"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo Brand Identity */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`p-2 rounded-xl transition-all ${isLight ? "bg-[#7C5CFF]/10 border border-[#7C5CFF]/20" : "bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 glow-violet"}`}>
              <Brain className="w-5.5 h-5.5 text-[#7C5CFF]" />
            </div>
            <span className={`text-lg font-bold tracking-tight font-mono transition-colors duration-500 bg-gradient-to-r bg-clip-text text-transparent ${
              isLight 
                ? "from-slate-900 via-slate-800 to-[#7C5CFF]" 
                : "from-white via-slate-100 to-[#00E5FF]"
            }`}>
              NEXORA<span className="text-[#7C5CFF] font-sans">_EDU</span>
            </span>
          </div>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`transition-colors cursor-pointer ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`transition-colors cursor-pointer ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('courses')} 
              className={`transition-colors cursor-pointer ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`transition-colors cursor-pointer ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
            >
              Contact
            </button>
          </nav>

          {/* Header Action Buttons (Desktop) & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsLight(!isLight)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" 
                  : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-yellow-400"
              }`}
              title={isLight ? "Switch to Cosmic Mode" : "Switch to Aether Light"}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Login Link */}
            <button
              onClick={onOpenLogin}
              className={`hidden sm:inline-flex text-xs font-mono font-bold tracking-wide px-3.5 py-1.5 rounded-lg transition-all border cursor-pointer ${
                isLight 
                  ? "text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50" 
                  : "text-slate-400 hover:text-white border-slate-850 hover:border-slate-850 bg-slate-900/40"
              }`}
            >
              Login
            </button>

            {/* Sign Up / Join Workspace CTA */}
            <button 
              onClick={onOpenLogin}
              className="px-4.5 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] hover:opacity-95 text-[#050816] transition-all cursor-pointer shadow-md hover:shadow-[#7C5CFF]/15"
            >
              Sign Up
            </button>

            {/* Mobile Navigation Toggle Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 md:hidden rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" 
                  : "bg-slate-900/60 hover:bg-slate-900 border-slate-850 text-slate-300"
              }`}
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden border-t overflow-hidden transition-colors duration-500 ${
                isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#050816] border-slate-900"
              }`}
            >
              <div className="px-6 py-5 flex flex-col gap-4 text-sm font-mono font-bold uppercase tracking-wider">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className={`text-left transition-colors py-2 ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className={`text-left transition-colors py-2 ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('courses')} 
                  className={`text-left transition-colors py-2 ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
                >
                  Courses
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className={`text-left transition-colors py-2 ${isLight ? "text-slate-600 hover:text-[#7C5CFF]" : "text-slate-400 hover:text-white"}`}
                >
                  Contact
                </button>
                <div className="h-px my-1 bg-slate-200 dark:bg-slate-900/60" />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onOpenLogin}
                    className={`flex-1 text-center py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${
                      isLight 
                        ? "text-slate-700 border-slate-200 bg-slate-50" 
                        : "text-slate-300 border-slate-850 bg-slate-900/40"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-[#050816]"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-20 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        {/* Left Column: Copy, CTAs, Search & Badges */}
        <div className="lg:col-span-7 space-y-8">
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C5CFF]/5 border border-[#7C5CFF]/25 text-xs font-mono text-[#7C5CFF]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span>COGNITIVE AI PLATFORM FOR ELITE EXAM PREP</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight font-sans"
          >
            The AI Mentor That <br />
            <span className="bg-gradient-to-r from-[#7C5CFF] via-[#00E5FF] to-cyan-200 bg-clip-text text-transparent">
              Remembers Every Student
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-slate-400 leading-relaxed font-sans max-w-2xl"
          >
            Nexora Edu combines a neural memory engine with rigorous anti-cheating sandbox exam tech to empower serious aspirants preparing for UPSC, IIT-JEE, NEET, GATE, and major competitive gateways.
          </motion.p>

          {/* Dynamic Live Course Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-xl"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, mentors, or disciplines (e.g. UPSC, Wave Mechanics)..."
                className="w-full pl-12 pr-28 py-3.5 bg-[#111122]/60 backdrop-blur-md rounded-2xl border border-[#7C5CFF]/15 text-xs text-slate-200 outline-none focus:border-[#00E5FF]/40 transition-all focus:ring-1 focus:ring-[#00E5FF]/20 placeholder-slate-500"
              />
              <button className="absolute right-2 px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono font-semibold">
                Filter Active
              </button>
            </div>
          </motion.div>

          {/* Interactive CTA Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 max-w-xl"
          >
            <button 
              onClick={() => onExplore("student")}
              className="w-full sm:w-auto px-6 py-3.5 font-semibold text-xs rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-xl shadow-[#7C5CFF]/20 cursor-pointer"
            >
              Start Learning Journey
              <ChevronRight className="w-4 h-4 text-slate-200" />
            </button>
            <button 
              onClick={() => onExplore("teacher")}
              className="w-full sm:w-auto px-6 py-3.5 font-semibold text-xs rounded-xl bg-[#11111e] hover:bg-slate-900 text-slate-300 hover:text-white transition-all transform hover:-translate-y-0.5 border border-[#7C5CFF]/15 flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              Educator Hub
            </button>
          </motion.div>

          {/* Trusted By Banner */}
          <div className="pt-6 border-t border-slate-900/40">
            <p className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold mb-4">
              Trusted by top rankers & elite technical divisions
            </p>
            <div className="grid grid-cols-2 gap-3 text-slate-400 font-mono text-[10px] max-w-md">
              <div className="p-2.5 bg-[#111122]/30 rounded-xl border border-slate-900/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full" />
                MIT Quantum Labs
              </div>
              <div className="p-2.5 bg-[#111122]/30 rounded-xl border border-slate-900/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                CERN Deep Tech
              </div>
              <div className="p-2.5 bg-[#111122]/30 rounded-xl border border-slate-900/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                IIT Delhi Innovation
              </div>
              <div className="p-2.5 bg-[#111122]/30 rounded-xl border border-slate-900/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                AI Stanford Labs
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 relative w-full"
        >
          {/* Subtle gradient glow behind the preview card */}
          <div className={`absolute inset-[-15px] rounded-[40px] blur-2xl opacity-70 pointer-events-none transition-all duration-500 ${isLight ? "bg-gradient-to-tr from-[#7C5CFF]/5 to-[#00E5FF]/5" : "bg-gradient-to-tr from-[#7C5CFF]/10 to-[#00E5FF]/10"}`} />
          <HeroDashboardPreview isLight={isLight} />
        </motion.div>
      </section>

      {/* Live Statistics Section */}
      <section className={`transition-colors duration-500 border-y py-16 text-center relative z-10 ${
        isLight ? "bg-slate-100/50 border-slate-200" : "bg-[#111125]/30 border-slate-900/80"
      }`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className={`text-4xl md:text-5xl font-extrabold font-mono mb-2 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
              isLight ? "from-slate-800 to-slate-600" : "from-white to-slate-400"
            }`}>
              150K+
            </div>
            <div className={`text-[10px] uppercase tracking-wider font-mono font-bold transition-colors ${isLight ? "text-slate-500" : "text-[#00E5FF]"}`}>Active Learners</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold font-mono mb-2 bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] bg-clip-text text-transparent">
              450+
            </div>
            <div className={`text-[10px] uppercase tracking-wider font-mono font-bold transition-colors ${isLight ? "text-slate-500" : "text-slate-400"}`}>Certified Instructors</div>
          </div>
          <div>
            <div className={`text-4xl md:text-5xl font-extrabold font-mono mb-2 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
              isLight ? "from-slate-800 to-slate-600" : "from-white to-slate-400"
            }`}>
              1,200+
            </div>
            <div className="text-[10px] text-[#7C5CFF] uppercase tracking-wider font-mono font-bold">Interactive Courses</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold font-mono mb-2 bg-gradient-to-r from-[#00E5FF] to-emerald-400 bg-clip-text text-transparent">
              94.6%
            </div>
            <div className={`text-[10px] uppercase tracking-wider font-mono font-bold transition-colors ${isLight ? "text-slate-500" : "text-slate-400"}`}>Placement & Rank Rate</div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className={`text-2xl md:text-4xl font-bold mb-3 transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Featured Curriculums</h2>
            <p className={`text-sm transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Master syllabus gateways mapped in real-time by expert cognitive advisors.</p>
          </div>
          
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 max-w-full overflow-x-auto pb-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all border cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-[#7C5CFF]/15 border-[#7C5CFF] text-[#7C5CFF] glow-violet"
                    : isLight 
                      ? "bg-white border-slate-200 text-slate-500 hover:text-slate-800" 
                      : "bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-2xl relative group overflow-hidden border transition-all flex flex-col justify-between min-h-[300px] ${
                    isLight 
                      ? "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-[#7C5CFF]/40" 
                      : "glass-panel border-slate-850 hover:border-[#7C5CFF]/30"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/5 rounded-full blur-3xl group-hover:bg-[#7C5CFF]/10 transition-colors" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        isLight ? "bg-slate-50 border-slate-200 text-[#7C5CFF]" : "bg-[#111122] border-slate-800 text-[#7C5CFF]"
                      }`}>
                        {c.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#00E5FF] font-bold uppercase">
                        {c.tag}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold font-sans leading-snug transition-colors duration-500 ${
                      isLight ? "text-slate-800 group-hover:text-[#7C5CFF]" : "text-slate-100 group-hover:text-white"
                    }`}>
                      {c.title}
                    </h3>

                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Syllabus Director: <span className={`${isLight ? "text-slate-700" : "text-slate-300"} font-mono`}>{c.instructor}</span>
                    </p>
                  </div>

                  <div className={`pt-6 mt-6 flex items-center justify-between text-xs border-t ${
                    isLight ? "border-slate-100" : "border-slate-900/60"
                  }`}>
                    <div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className={`font-bold font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>{c.rating}</span>
                        <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>({c.students})</span>
                      </div>
                      <span className={`font-bold font-mono text-sm block mt-1 ${isLight ? "text-[#7C5CFF]" : "text-slate-400"}`}>{c.price}</span>
                    </div>
                    
                    <button
                      onClick={() => handleEnrollCourse(c.title)}
                      className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer border ${
                        isLight 
                          ? "bg-[#7C5CFF]/10 hover:bg-[#7C5CFF] border-[#7C5CFF]/30 text-[#7C5CFF] hover:text-white" 
                          : "bg-slate-900 border border-[#7C5CFF]/30 text-[#7C5CFF] hover:bg-[#7C5CFF]/15"
                      }`}
                    >
                      Enroll Sandbox
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs">
                No active curriculums found matching your search matrix.
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* AI Features Bento Section */}
      <section id="about" className={`transition-colors duration-500 border-y py-24 relative z-10 ${
        isLight ? "bg-slate-100/50 border-slate-200" : "bg-[#0b0c1e]/40 border-slate-900/60"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[10px] font-mono text-[#00E5FF] mb-4">
              <Zap className="w-3 h-3 text-[#00E5FF]" />
              INTELLIGENT SUITE
            </div>
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>AI Features Ecosystem</h2>
            <p className={`text-sm transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Explore the advanced modules powering Nexora Edu, driven directly by standard multi-modal AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: AI Chat */}
            <div className={`p-6 rounded-2xl relative overflow-hidden group border transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <div className="p-3 w-fit rounded-xl bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/20 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>Cognitive AI Tutor</h3>
              <p className={`text-xs leading-relaxed mb-4 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Converse seamlessly with an AI mentor equipped with multi-disciplinary syllabus databases, asking follow-up questions to secure knowledge transfer.
              </p>
              <span className="text-[10px] font-mono text-[#7C5CFF] font-bold group-hover:underline flex items-center gap-1 cursor-pointer" onClick={() => onExplore("student")}>
                Explore in student dashboard <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Bento 2: AI Quiz */}
            <div className={`p-6 rounded-2xl relative overflow-hidden group border transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <div className="p-3 w-fit rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>Dynamic Quiz Engine</h3>
              <p className={`text-xs leading-relaxed mb-4 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Generate tailored multiple-choice quizzes in absolute real-time based on your target exam topics. Earn coins, track accuracy, and review extensive step-by-step solutions.
              </p>
              <span className="text-[10px] font-mono text-[#00E5FF] font-bold group-hover:underline flex items-center gap-1 cursor-pointer" onClick={() => onExplore("student")}>
                Explore in student dashboard <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Bento 3: AI Code Sandbox */}
            <div className={`p-6 rounded-2xl relative overflow-hidden group border transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>Interactive Code Assistant</h3>
              <p className={`text-xs leading-relaxed mb-4 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Solve coding puzzles directly on an embedded sandbox workspace. Get real-time compilation reviews, optimizations, and syntax diagnostics.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 font-bold group-hover:underline flex items-center gap-1 cursor-pointer" onClick={() => onExplore("student")}>
                Explore in student dashboard <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Bento 4: AI Study Planner */}
            <div className={`p-6 rounded-2xl relative overflow-hidden group border md:col-span-2 transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="p-3 w-fit rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className={`text-lg font-bold font-mono mb-2 transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>AI Roadmap & Study Planner</h3>
                  <p className={`text-xs leading-relaxed transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Map out personalized, day-by-day study calendars targeting competitive exam milestones. Spacing cycles, streak indicators, and memory exercises are auto-compiled.
                  </p>
                </div>
                <div className={`md:w-1/2 border rounded-xl p-4 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[140px] transition-all duration-500 ${
                  isLight 
                    ? "bg-slate-50 border-slate-200 text-slate-600" 
                    : "bg-[#050816] border-slate-850 text-slate-400"
                }`}>
                  <div className="text-[#00E5FF] font-bold">Generated Daily Study Plan:</div>
                  <div>• Day 1: Neural weights initialization & Backprop derivation</div>
                  <div>• Day 2: Activation profiles & gradient descent convergence rate</div>
                  <div>• Day 3: Practical test classifier with PyTorch weights</div>
                  <div>• Day 4: Interactive review cycle & Sunday Arena prep</div>
                </div>
              </div>
            </div>

            {/* Bento 5: AI Interview Prep */}
            <div className={`p-6 rounded-2xl relative overflow-hidden group border transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold font-mono mb-2 transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>AI Interview Mentor</h3>
              <p className={`text-xs leading-relaxed mb-4 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Practice technical interviews with simulated examiners. Type answers and receive exact rubric analyses, custom score cards, and correct answers models.
              </p>
              <span className="text-[10px] font-mono text-rose-500 font-bold group-hover:underline flex items-center gap-1 cursor-pointer" onClick={() => onExplore("student")}>
                Explore in student dashboard <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Teachers Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className={`text-2xl md:text-4xl font-bold mb-3 transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Popular Instructors</h2>
          <p className={`text-sm transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Master hard sciences alongside world-class academic authorities.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((t, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border text-center space-y-3 transition-all relative ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-[#7C5CFF]/30" 
                : "glass-panel border-slate-850 hover:border-[#7C5CFF]/20"
            }`}>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#7C5CFF]/10 text-[#7C5CFF] text-[9px] font-mono font-bold tracking-wide">
                {t.badge}
              </div>
              <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-tr from-[#7C5CFF] to-[#00E5FF] flex items-center justify-center font-bold text-lg font-mono text-[#050816]">
                {t.name.split(" ").slice(-1)[0][0]}
              </div>
              <h4 className={`text-sm font-bold transition-colors duration-500 ${isLight ? "text-slate-800" : "text-white"}`}>{t.name}</h4>
              <p className={`text-[11px] leading-relaxed transition-colors duration-500 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{t.role}</p>
              <div className={`text-[10px] font-mono transition-colors duration-500 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{t.inst}</div>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className={`text-xs font-bold font-mono transition-colors duration-500 ${isLight ? "text-slate-700" : "text-slate-300"}`}>{t.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Classes Preview Node */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className={`p-8 rounded-3xl border flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors duration-500 ${
          isLight 
            ? "bg-white border-slate-200 shadow-md" 
            : "glass-panel-heavy border-slate-800/80"
        }`}>
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-500 font-bold">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              LIVE CLASS IN PROGESS
            </div>
            <h3 className={`text-xl md:text-3xl font-bold leading-snug transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>
              Astrophysics & Deep Networks Gateway lecture
            </h3>
            <p className={`text-xs transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Join Dr. Elena Rostova and over 4,500 students presently mastering the quantum mechanics wavefunction and probability models. Interact live via smart tutor boards!
            </p>
            <div className={`flex items-center gap-4 text-xs font-mono transition-colors duration-500 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
                <Users className="w-4 h-4 text-[#00E5FF]" /> 4.8K Watching
              </span>
              <span>• Host: Dr. Elena Rostova</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onExplore("student")}
              className="px-6 py-3.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#7C5CFF]/15"
            >
              <PlayCircle className="w-4.5 h-4.5 text-white" />
              Launch Live Watchroom
            </button>
          </div>
        </div>
      </section>

      {/* Top Performers Hall */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className={`text-2xl md:text-4xl font-bold mb-3 transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Hall of Performers</h2>
          <p className={`text-sm transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Celebrate Nexora Edu students who dominated recent synchronized mock exams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((test, index) => (
            <div key={index} className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              isLight 
                ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
                : "glass-panel border-slate-850 hover:border-slate-800"
            }`}>
              <p className={`text-xs leading-relaxed italic mb-6 transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                &ldquo;{test.text}&rdquo;
              </p>
              <div>
                <h4 className={`text-sm font-bold font-mono transition-colors duration-500 ${isLight ? "text-slate-850" : "text-white"}`}>{test.name}</h4>
                <p className="text-[10px] text-[#00E5FF] font-mono mt-0.5">{test.exam}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className={`max-w-7xl mx-auto px-6 py-24 relative z-10 border-t transition-colors duration-500 ${isLight ? "border-slate-200" : "border-slate-900/40"}`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className={`text-2xl md:text-4xl font-bold mb-3 transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Unbounded Learning Plans</h2>
          <p className={`text-sm transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Flexible subscriptions equipped with Razorpay simulator triggers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className={`p-8 rounded-2xl text-center space-y-6 flex flex-col justify-between min-h-[440px] border transition-all duration-500 ${
            isLight 
              ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
              : "glass-panel border-slate-850"
          }`}>
            <div className="space-y-3">
              <h3 className={`text-lg font-bold font-mono uppercase tracking-wide transition-colors duration-500 ${isLight ? "text-slate-700" : "text-slate-300"}`}>Nebula Free</h3>
              <div className={`text-3xl font-extrabold font-mono transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>₹0</div>
              <p className="text-xs text-slate-500">Perfect for exploring basics & dynamic timetables.</p>
              <div className={`h-px transition-colors ${isLight ? "bg-slate-100" : "bg-slate-900"}`} />
              <ul className={`text-xs space-y-2.5 text-left pt-2 font-mono transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                <li className="flex items-center gap-2">✔ Standard AI Roadmap</li>
                <li className="flex items-center gap-2">✔ 5 doubts queries daily</li>
                <li className="flex items-center gap-2">✔ Free weekly Sunday Arenas</li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600">✖ Custom LaTeX CV templates</li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600">✖ Infinite Tutor Chats</li>
              </ul>
            </div>
            <button
              onClick={() => onExplore("student")}
              className={`w-full py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isLight 
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-[#7C5CFF]/10 hover:text-[#7C5CFF]" 
                  : "bg-[#111122] border-slate-800 text-slate-300 hover:bg-[#7C5CFF]/10"
              }`}
            >
              Get Free Access
            </button>
          </div>

          {/* Plan 2 */}
          <div className={`p-8 rounded-2xl text-center space-y-6 flex flex-col justify-between relative min-h-[440px] border transition-all duration-500 ${
            isLight 
              ? "bg-white border-[#7C5CFF]/40 shadow-md hover:shadow-[#7C5CFF]/5" 
              : "glass-panel border-[#7C5CFF]/30 glow-violet"
          }`}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-[#050816] text-[10px] font-mono font-bold tracking-widest px-3.5 py-1 rounded-full uppercase">
              Aspirants Choice
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#7C5CFF] font-mono uppercase tracking-wide">Supernova Elite</h3>
              <div className={`text-3xl font-extrabold font-mono transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>₹999<span className="text-xs text-slate-500">/mo</span></div>
              <p className={`text-xs transition-colors duration-500 ${isLight ? "text-slate-550" : "text-slate-400"}`}>Complete AI tutoring suite and certified exam credentials.</p>
              <div className="h-px bg-[#7C5CFF]/20" />
              <ul className={`text-xs space-y-2.5 text-left pt-2 font-mono transition-colors duration-500 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <li className="flex items-center gap-2 text-[#7C5CFF] font-bold">✔ Infinite AI Cognitive Chats</li>
                <li className="flex items-center gap-2 text-[#7C5CFF] font-bold">✔ Unlimited Doubts Solving</li>
                <li className="flex items-center gap-2">✔ Custom AI LaTeX Resumes</li>
                <li className="flex items-center gap-2">✔ Live Code Sandbox Compiler</li>
                <li className="flex items-center gap-2">✔ Mock Behavioral Examiners</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribePlan("Supernova Elite", "₹999/mo")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-[#050816] text-xs font-mono font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              Unlock Elite Suite
            </button>
          </div>

          {/* Plan 3 */}
          <div className={`p-8 rounded-2xl text-center space-y-6 flex flex-col justify-between min-h-[440px] border transition-all duration-500 ${
            isLight 
              ? "bg-white border-slate-200 shadow-sm hover:shadow-md" 
              : "glass-panel border-slate-850"
          }`}>
            <div className="space-y-3">
              <h3 className={`text-lg font-bold font-mono uppercase tracking-wide transition-colors duration-500 ${isLight ? "text-slate-700" : "text-slate-300"}`}>Cosmos Enterprise</h3>
              <div className={`text-3xl font-extrabold font-mono transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>₹4,999<span className="text-xs text-slate-500">/mo</span></div>
              <p className="text-xs text-slate-500">Tailored for departments, schools, & coaching clusters.</p>
              <div className={`h-px transition-colors ${isLight ? "bg-slate-100" : "bg-slate-900"}`} />
              <ul className={`text-xs space-y-2.5 text-left pt-2 font-mono transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                <li className="flex items-center gap-2">✔ Dynamic sitemaps integration</li>
                <li className="flex items-center gap-2">✔ Automated custom proctor profiles</li>
                <li className="flex items-center gap-2">✔ Advanced educator analytics</li>
                <li className="flex items-center gap-2">✔ Custom API Key proxies</li>
                <li className="flex items-center gap-2">✔ Consolidated monthly payment reports</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribePlan("Cosmos Enterprise", "₹4,999/mo")}
              className={`w-full py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isLight 
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-[#7C5CFF]/10 hover:text-[#7C5CFF]" 
                  : "bg-[#111122] border-slate-800 text-slate-300 hover:bg-[#7C5CFF]/10"
              }`}
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className={`max-w-4xl mx-auto px-6 py-24 relative z-10 border-t transition-colors duration-500 ${isLight ? "border-slate-200" : "border-slate-900/40"}`}>
        <h2 className={`text-2xl md:text-4xl font-bold text-center mb-12 font-sans transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div key={index} className={`rounded-2xl overflow-hidden transition-all duration-500 border ${
                isLight 
                  ? "bg-white border-slate-200 shadow-sm" 
                  : "glass-panel border-slate-850"
              }`}>
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className={`w-full text-left p-6 flex items-center justify-between gap-4 text-xs font-bold font-mono tracking-wide cursor-pointer transition-colors ${
                    isLight ? "text-slate-700 hover:text-slate-900" : "text-slate-200 hover:text-white"
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#7C5CFF] transform transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-900/60"
                    >
                      <p className="p-6 text-xs text-slate-400 leading-relaxed font-sans">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-16 relative z-10 mb-16 text-center">
        <div className={`p-10 rounded-3xl border space-y-6 transition-all duration-500 ${
          isLight 
            ? "bg-white border-slate-200 shadow-md" 
            : "glass-panel border-[#7C5CFF]/20 glow-violet"
        }`}>
          <div className="p-3 bg-[#7C5CFF]/10 text-[#7C5CFF] rounded-full w-fit mx-auto border border-[#7C5CFF]/20 animate-pulse">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${isLight ? "text-slate-900" : "text-white"}`}>Subscribe to Nexora Edu Codex</h3>
          <p className={`text-xs max-w-md mx-auto leading-relaxed transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Receive weekly AI-generated study patterns, revision sheets, and priority links to upcoming Sunday live mock arenas.
          </p>

          {!newsletterSubscribed ? (
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter registered student email..."
                className={`flex-1 px-4 py-3 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#7C5CFF]/30 transition-all ${
                  isLight 
                    ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-450 focus:border-[#7C5CFF]" 
                    : "bg-[#050816] border-slate-800 text-slate-200 placeholder-slate-500 focus:border-[#7C5CFF]"
                }`}
              />
              <button
                onClick={() => {
                  if (newsletterEmail) {
                    setNewsletterSubscribed(true);
                  }
                }}
                className="px-6 py-3 bg-[#7C5CFF] text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#684be2] cursor-pointer transition-all"
              >
                Subscribe <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 max-w-sm mx-auto">
              ✔ Welcome to the Nexora Codex registry! Check your inbox soon.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative max-w-7xl mx-auto px-6 py-16 border-t z-10 transition-colors duration-500 ${isLight ? "border-slate-200" : "border-slate-900/60"}`}>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs transition-colors duration-500 ${isLight ? "text-slate-650" : "text-slate-500"}`}>
          <div className="space-y-4">
            <span className={`text-sm font-bold font-mono transition-colors duration-500 ${isLight ? "text-slate-900" : "text-slate-350"}`}>NEXORA_EDU</span>
            <p className={`leading-relaxed text-[11px] transition-colors duration-500 ${isLight ? "text-slate-500" : "text-slate-550"}`}>
              Elite cognitive learning pipelines and proctored sandbox systems. Powered securely by Google Gemini-3.5-Flash.
            </p>
          </div>
          <div className="space-y-2.5">
            <h4 className={`font-mono font-bold uppercase tracking-wider text-[11px] transition-colors duration-500 ${isLight ? "text-slate-800" : "text-slate-400"}`}>Core Verticals</h4>
            <ul className={`space-y-1.5 font-mono text-[11px] transition-colors duration-500 ${isLight ? "text-slate-650" : "text-slate-500"}`}>
              <li><a href="#" className="hover:text-[#7C5CFF]">UPSC Portals</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">IIT-JEE Division</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">NEET Med Gateway</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">GATE Advanced</a></li>
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className={`font-mono font-bold uppercase tracking-wider text-[11px] transition-colors duration-500 ${isLight ? "text-slate-800" : "text-slate-400"}`}>Security</h4>
            <ul className={`space-y-1.5 font-mono text-[11px] transition-colors duration-500 ${isLight ? "text-slate-650" : "text-slate-500"}`}>
              <li><a href="#" className="hover:text-[#7C5CFF]">Telemetry Loggers</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Proctor Sandboxes</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Integrity Scores</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Privacy Standards</a></li>
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className={`font-mono font-bold uppercase tracking-wider text-[11px] transition-colors duration-500 ${isLight ? "text-slate-800" : "text-slate-400"}`}>Legal</h4>
            <ul className={`space-y-1.5 font-mono text-[11px] transition-colors duration-500 ${isLight ? "text-slate-650" : "text-slate-500"}`}>
              <li><a href="#" className="hover:text-[#7C5CFF]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Academic Code</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Sitemap Registry</a></li>
              <li><a href="#" className="hover:text-[#7C5CFF]">Contact Operations</a></li>
            </ul>
          </div>
        </div>
        <div className={`h-px mb-8 transition-colors ${isLight ? "bg-slate-200" : "bg-slate-900/60"}`} />
        <div className={`text-center text-[11px] space-y-1 transition-colors duration-500 ${isLight ? "text-slate-500" : "text-slate-600"}`}>
          <p>&copy; 2026 Nexora Edu Inc. All rights reserved. Registered under ISO-9001 learning standards.</p>
          <p>Powered exclusively by Vercel deployment channels & Google Gemini APIs.</p>
        </div>
      </footer>

      {/* RAZORPAY SIMULATED GATEWAY POPUP MODAL */}
      {paymentModalOpen && (
        <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-colors duration-500 ${isLight ? "bg-slate-900/60" : "bg-[#050816]/95"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl relative transition-all duration-500 ${
              isLight 
                ? "bg-white border-slate-200 text-slate-800" 
                : "bg-[#111122] border-[#7C5CFF]/30 text-slate-100 glow-violet"
            }`}
          >
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-950/10 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              &times;
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="p-3 w-fit mx-auto rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold font-mono tracking-wide">Razorpay Secure Sandbox</h3>
              <p className={`text-[11px] leading-relaxed transition-colors duration-500 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Authorized Simulated Gateway checkout for <span className="text-[#7C5CFF] font-bold">{paymentPlanName}</span>.
              </p>
            </div>

            <div className={`rounded-xl p-4 space-y-3 text-xs mb-6 font-mono border transition-colors duration-500 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[#050816] border-slate-900"
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant Account:</span>
                <span className={`font-bold ${isLight ? "text-slate-800" : "text-slate-300"}`}>Nexora Edu Org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan Item:</span>
                <span className={`font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{paymentPlanName}</span>
              </div>
              <div className={`flex justify-between border-t pt-3 ${isLight ? "border-slate-200" : "border-slate-900"}`}>
                <span className="text-slate-500 font-bold">Total Payable:</span>
                <span className="text-[#00E5FF] font-extrabold">{paymentPlanPrice}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] leading-relaxed">
                ⚠ Simulated checkout mode active. Direct authorization grants immediate lifetime sandbox features.
              </div>
              
              <button
                onClick={handleSimulatePaymentSuccess}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-[#050816] text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-[#7C5CFF]/15 cursor-pointer"
              >
                Pay & Authorize Simulated Licence
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
