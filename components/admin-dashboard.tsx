'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Bell,
  Terminal,
  Trash2,
  Heart,
  Award,
  Cpu,
  ShieldCheck,
  Users,
  BookOpen,
  FileText,
  Ban,
  Settings,
  CheckCircle,
  AlertTriangle,
  Play,
  RefreshCw,
  Plus,
  ShieldAlert,
  DollarSign,
  Download,
  Zap,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight,
  Database,
  Sliders,
  Server
} from 'lucide-react';
import { Course, getMockDB, saveMockDB } from '@/lib/mock-db';

// Helper to generate unique ids outside render scope to satisfy pure-render constraints
function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

interface AdminDashboardProps {
  courses: Course[];
  onDeleteCourse: (courseId: string) => void;
  onAddCourse?: (newCourse: Course) => void;
  onBroadcastNotification: (message: string) => void;
}

export default function AdminDashboard({
  courses,
  onDeleteCourse,
  onAddCourse,
  onBroadcastNotification,
}: AdminDashboardProps) {
  // Active primary tab
  const [activeTab, setActiveTab] = useState<
    "telemetry" | "users" | "courses" | "reports" | "moderation" | "settings"
  >("telemetry");

  // Success / Error banner triggers
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const showFeedback = (text: string, type: "success" | "info" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // 1. DYNAMIC SYSTEM OPERATIONS TERMINAL LOGS
  const [systemLogs, setSystemLogs] = useState<string[]>(() => [
    `[${new Date().toLocaleTimeString()}] Nexora Operations Engine: Online [v1.4.0-production]`,
    `[${new Date().toLocaleTimeString()}] Google GenAI endpoint verification initialized...`,
    `[${new Date().toLocaleTimeString()}] Connected to gemini-3.5-flash for real-time tutoring proxy`,
    `[${new Date().toLocaleTimeString()}] AI Sandbox proctoring telemetry channel established successfully`,
    `[${new Date().toLocaleTimeString()}] Database integrity scan: 100% compliant. Sync active.`,
    `[${new Date().toLocaleTimeString()}] Multi-user simulation: synced 148 active mock connections`,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        "Google GenAI: 1,840 tokens consumed by student@gmail.com on doubt-node",
        "Integrity watchdog: Aarav Sharma exam sandbox proctor trace verified",
        "Database health factor: 99.99% optimal index alignment",
        "Platform billing transaction sync: Approved recurring sandbox node credit",
        "UTC synchronized with Cloud Run cluster container",
        "Database snapshot committed successfully",
        "API Heartbeat verified: 9ms ping response from endpoint",
        "Proctor scanner: Flagged 0 face orientation anomalies",
        "Weekly arena leaderboard compiled"
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${randomAction}`, ...prev.slice(0, 12)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // 2. TEACHERS MANAGEMENT STATE
  const [teachers, setTeachers] = useState<any[]>([
    { id: "teach-1", name: "Prof. Sarah Jenkins", email: "teacher@gmail.com", subject: "Computer Science", activeCourses: 3, resolvedDoubts: 28, status: "Active" },
    { id: "teach-2", name: "Dr. Alan Turing", email: "turing@gmail.com", subject: "Theoretical Algorithms", activeCourses: 1, resolvedDoubts: 42, status: "Active" },
    { id: "teach-3", name: "Prof. Marie Curie", email: "curie@gmail.com", subject: "Atomic Physics", activeCourses: 2, resolvedDoubts: 19, status: "Suspended" },
  ]);
  const [newTeachName, setNewTeachName] = useState("");
  const [newTeachEmail, setNewTeachEmail] = useState("");
  const [newTeachSubject, setNewTeachSubject] = useState("Computer Science");

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeachName || !newTeachEmail) return;

    const added = {
      id: generateUniqueId("teach"),
      name: newTeachName,
      email: newTeachEmail,
      subject: newTeachSubject,
      activeCourses: 0,
      resolvedDoubts: 0,
      status: "Active"
    };

    setTeachers(prev => [added, ...prev]);
    showFeedback(`Teacher registration successful: ${newTeachName}`);
    setNewTeachName("");
    setNewTeachEmail("");
    
    // Add to system log
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Registered new teacher account: ${newTeachName}`, ...prev]);
  };

  const handleToggleTeacherStatus = (id: string) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "Active" ? "Suspended" : "Active";
        showFeedback(`${t.name} state set to: ${nextStatus}`, "info");
        setSystemLogs(logPrev => [`[${new Date().toLocaleTimeString()}] ADMIN: Toggled status of teacher ${t.name} to ${nextStatus}`, ...logPrev]);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showFeedback(`Archived teacher profile: ${name}`, "info");
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Deleted teacher profile ${name}`, ...prev]);
  };

  // 3. STUDENTS MANAGEMENT STATE
  const [students, setStudents] = useState<any[]>([
    { id: "stud-1", name: "Aarav Sharma", email: "student@gmail.com", subject: "Computer Science", xp: 1450, level: 3, attendance: 78, status: "Active" },
    { id: "stud-2", name: "Priya Patel", email: "priya@gmail.com", subject: "Quantum Physics", xp: 3400, level: 4, attendance: 98, status: "Active" },
    { id: "stud-3", name: "Tariq Ali", email: "tariq@gmail.com", subject: "Mathematics", xp: 950, level: 2, attendance: 82, status: "Active" },
    { id: "stud-4", name: "Emily Watson", email: "emily@gmail.com", subject: "Organic Chemistry", xp: 1850, level: 3, attendance: 91, status: "Suspended" },
  ]);
  const [newStudName, setNewStudName] = useState("");
  const [newStudEmail, setNewStudEmail] = useState("");
  const [newStudSubject, setNewStudSubject] = useState("Computer Science");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudName || !newStudEmail) return;

    const added = {
      id: generateUniqueId("stud"),
      name: newStudName,
      email: newStudEmail,
      subject: newStudSubject,
      xp: 100,
      level: 1,
      attendance: 100,
      status: "Active"
    };

    setStudents(prev => [added, ...prev]);
    showFeedback(`Student profile compiled successfully: ${newStudName}`);
    setNewStudName("");
    setNewStudEmail("");

    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Enrolled student account: ${newStudName}`, ...prev]);
  };

  const handleToggleStudentStatus = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === "Active" ? "Suspended" : "Active";
        showFeedback(`${s.name} account status flipped to: ${nextStatus}`, "info");
        setSystemLogs(logPrev => [`[${new Date().toLocaleTimeString()}] ADMIN: Toggled student ${s.name} to ${nextStatus}`, ...logPrev]);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleDeleteStudent = (id: string, name: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showFeedback(`Deleted student registration: ${name}`, "info");
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Purged student profile: ${name}`, ...prev]);
  };

  // 4. PENDING COURSE APPROVALS STATE
  const [pendingCourses, setPendingCourses] = useState<any[]>([
    { id: "pc-1", title: "Stochastic Deep Learning Foundations", instructor: "Dr. Alan Turing", subject: "Computer Science", duration: "8 hours", modules: ["Syllabus Overview", "Stochastic Nodes", "Markov Chains", "Final Exam Exam"], submissionDate: "Today, 04:12 AM" },
    { id: "pc-2", title: "Intro to Polymerization Synthesis", instructor: "Prof. Marie Curie", subject: "Chemistry", duration: "6 hours", modules: ["Chain Foundations", "Heat metrics", "Catalytic Rates"], submissionDate: "Yesterday, 06:45 PM" }
  ]);

  const handleApproveCourse = (pc: any) => {
    if (onAddCourse) {
      const approvedCourse: Course = {
        id: generateUniqueId("course"),
        title: pc.title,
        description: `Master standard university concepts in ${pc.subject}. Guided by ${pc.instructor}. Includes active quizzes and sandbox evaluation.`,
        subject: pc.subject,
        duration: pc.duration,
        instructor: pc.instructor,
        modules: pc.modules,
        enrolledCount: 0
      };
      onAddCourse(approvedCourse);
      setPendingCourses(prev => prev.filter(item => item.id !== pc.id));
      showFeedback(`Course node approved & published globally: ${pc.title}`);
      setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Approved and deployed course: ${pc.title}`, ...prev]);
    } else {
      showFeedback("Course dispatcher callback missing from props, simulation updated", "info");
    }
  };

  const handleRejectCourse = (id: string, title: string) => {
    setPendingCourses(prev => prev.filter(item => item.id !== id));
    showFeedback(`Course proposal archived as rejected: ${title}`, "info");
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Rejected course proposal: ${title}`, ...prev]);
  };

  // 5. GLOBAL BROADCAST NOTIFICATIONS BANNER FORM
  const [broadcastInput, setBroadcastInput] = useState("");
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput) return;

    onBroadcastNotification(broadcastInput);
    showFeedback(`System-wide announcement dispatched successfully!`);
    setBroadcastInput("");
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Dispatched global announcement: "${broadcastInput}"`, ...prev]);
  };

  // 6. MODERATION HUB STATE
  const [flaggedItems, setFlaggedItems] = useState<any[]>([
    { id: "flag-1", type: "Doubt Content", author: "Aarav Sharma", content: "Is there a browser plugin to bypass the webcam proctor lockdown?", flaggedBy: "AI Regex Scanner", reason: "Attempted proctor evasion keyword", date: "Today, 09:24 AM", status: "Review Required" },
    { id: "flag-2", type: "Forum Comment", author: "Anonymous User", content: "Go to nexora-cheats.net to get all final exam questions leaked by teachers", flaggedBy: "Blacklist URL Filter", reason: "Potential academic integrity bypass link", date: "Yesterday, 11:15 PM", status: "Review Required" },
    { id: "flag-3", type: "Certificate Request", author: "Pranav Rao", content: "Claiming Master certificate in 0.4 seconds", flaggedBy: "Telemetry Watchdog", reason: "Suspiciously fast progress audit score", date: "July 16, 2026", status: "Dismissed" }
  ]);

  const handleResolveFlag = (id: string, action: "approve" | "delete") => {
    setFlaggedItems(prev => prev.map(item => {
      if (item.id === id) {
        showFeedback(action === "approve" ? "Content cleared of flags." : "Flagged content purged from database.", "info");
        setSystemLogs(logPrev => [`[${new Date().toLocaleTimeString()}] ADMIN: Moderation action on #${id} -> set status to: ${action === "approve" ? "Cleared" : "Purged"}`, ...logPrev]);
        return { ...item, status: action === "approve" ? "Cleared / Allowed" : "Purged / Deleted" };
      }
      return item;
    }));
  };

  // 7. SYSTEM REPORTS COMPILE ENGINE
  const [selectedReportType, setSelectedReportType] = useState<"grades" | "tokens" | "revenue" | "proctor">("grades");
  const [isCompilingReport, setIsCompilingReport] = useState(false);
  const [compiledPreview, setCompiledPreview] = useState<any | null>(null);

  const handleCompileReport = () => {
    setIsCompilingReport(true);
    setCompiledPreview(null);
    setTimeout(() => {
      setIsCompilingReport(false);
      if (selectedReportType === "grades") {
        setCompiledPreview({
          title: "Student Grade & Performance Audit Summary",
          date: new Date().toLocaleDateString(),
          headers: ["Student Name", "Completed Modules", "Exam Score Avg", "Integrity Coefficient"],
          rows: [
            ["Aarav Sharma", "4 Modules", "88%", "94% - Clear"],
            ["Priya Patel", "12 Modules", "97%", "99% - High Integrity"],
            ["Tariq Ali", "3 Modules", "71%", "85% - Minor Alt-Tab Alert"],
            ["Jessica Chen", "9 Modules", "94%", "98% - High Integrity"],
          ],
          summary: "Mean Grade: A- (87.5%), System Integrity Coefficient: 94.0%. Zero severe exam isolation bypasses detected."
        });
      } else if (selectedReportType === "tokens") {
        setCompiledPreview({
          title: "Google GenAI Token Consumption & Allocation Audit",
          date: new Date().toLocaleDateString(),
          headers: ["Proxy Route", "Requests Served", "Estimated Tokens", "Simulated Cost Index"],
          rows: [
            ["/api/gemini/doubt-resolve", "4,241 queries", "18.4M tokens", "$18.40 (Equivalent)"],
            ["/api/gemini/voice-tutor", "1,820 queries", "12.1M tokens", "$12.10 (Equivalent)"],
            ["/api/gemini/weak-student-report", "45 audits", "4.2M tokens", "$4.20 (Equivalent)"],
            ["/api/gemini/syllabus-planner", "148 plans", "6.5M tokens", "$6.50 (Equivalent)"],
          ],
          summary: "Total Monthly Token Footprint: 41.2M tokens. Daily Peak rate: 1.4M (Sunday live arena cycle)."
        });
      } else if (selectedReportType === "revenue") {
        setCompiledPreview({
          title: "Platform Revenue & Billing Ledger Summary",
          date: new Date().toLocaleDateString(),
          headers: ["Tier", "Subscribers", "Monthly Inflow", "Stripe Compliance"],
          rows: [
            ["Student Pro Access", "420 premium", "$12,600", "Verified"],
            ["Institution Licenses", "4 active schools", "$4,800", "Verified"],
            ["Individual Teacher payout", "2 payouts", "-$1,200", "Cleared"],
            ["Operational micro-tips", "142 transactions", "$1,020", "Verified"],
          ],
          summary: "Platform Net Monthly Balance: +$17,220. Projected annual recurring value: $206.6K."
        });
      } else if (selectedReportType === "proctor") {
        setCompiledPreview({
          title: "Secure Exam Sandbox & Proctoring Integrity Ledger",
          date: new Date().toLocaleDateString(),
          headers: ["User Email", "Active Session", "Webcam Status", "Integrity State"],
          rows: [
            ["student@gmail.com", "CS101 Final Quiz", "Connected / Validated", "94% - 1 tab blur detected"],
            ["priya@gmail.com", "Quantum Physics Exam", "Connected / Validated", "99% - Excellent posture"],
            ["tariq@gmail.com", "Linear Algebra Lab", "Webcam Unstable", "82% - Repeated hardware disconnects"],
          ],
          summary: "Total active exam locks: 4. Critical integrity violations compiled: 0. Offline container sandbox active."
        });
      }
      showFeedback("Report compilation completed. Document cached in admin buffer.");
    }, 1500);
  };

  const handleDownloadCSV = () => {
    if (!compiledPreview) return;
    
    // Construct real CSV text
    const headersLine = compiledPreview.headers.join(",");
    const rowsLines = compiledPreview.rows.map((r: string[]) => r.join(",")).join("\n");
    const csvContent = `${compiledPreview.title}\nDate: ${compiledPreview.date}\n\n${headersLine}\n${rowsLines}\n\nSummary,${compiledPreview.summary}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Nexora_Admin_${selectedReportType}_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback("CSV document dispatch successful!");
  };

  // 8. SYSTEM CONFIGURATION VARIABLES
  const [geminiModel, setGeminiModel] = useState("gemini-3.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [quotaCap, setQuotaCap] = useState(100);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback("Platform telemetry constants updated.");
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: System settings configured. Model set to: ${geminiModel}, Temp: ${temperature}`, ...prev]);
  };

  const handleBackupDB = () => {
    const db = getMockDB();
    const dbString = JSON.stringify(db, null, 2);
    const blob = new Blob([dbString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Nexora_Platform_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback("Database JSON backup compiled and dispatched!");
  };

  const handleResetDB = () => {
    if (confirm("WARNING: Are you sure you want to reset the platform local storage? All custom lessons and assignments will be reverted to factory presets.")) {
      localStorage.removeItem("nexora_mock_db");
      showFeedback("Mock Database wiped. Reloading platform...", "info");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8" id="admin-main-container">
      {/* Dynamic Feedback Banner */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              feedbackMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-300"
            }`}
            id="admin-alert-banner"
          >
            <Bell className="w-4 h-4" />
            <span>{feedbackMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Welcome Title & Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A0B10]/60 p-6 rounded-3xl border border-slate-900 shadow-xl shadow-black/20" id="admin-welcome-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[9px] uppercase font-mono font-bold tracking-wider">ROOT ACCESS</span>
            <span className="text-[10px] text-slate-500 font-mono font-semibold">UTC NODE ACTIVE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight">Nexora Admin Operations Console</h2>
          <p className="text-slate-400 text-xs">
            System status monitoring, user compliance registers, course node moderation, and GenAI telemetry metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wide">SYSTEM: HEALTHY</span>
          </div>

          <button
            onClick={() => {
              showFeedback("Triggering global system state synchronized check...", "info");
              setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Manual telemetry verification sync completed. Ping 8ms.`, ...prev]);
            }}
            className="p-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-900 rounded-xl transition-all cursor-pointer"
            id="admin-refresh-telemetry-btn"
            title="Force Diagnostics Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Telemetry Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="admin-telemetry-bento-grid">
        <div className="p-5 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 flex flex-col justify-between h-32" id="admin-card-uptime">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">CONTAINER UPTIME</span>
            <Heart className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">99.99%</div>
            <p className="text-[10px] text-slate-500 mt-1">Uptime: 14 days, 12 hours active</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 flex flex-col justify-between h-32" id="admin-card-tokens">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">AI TOKENS (MONTHLY)</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">41.2M <span className="text-xs text-slate-500">/ 100M</span></div>
            <div className="w-full h-1 bg-slate-950 rounded-full mt-1 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '41.2%' }}></div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 flex flex-col justify-between h-32" id="admin-card-integrity">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">SECURITY INTEGRITY</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400">CONTAINED</div>
            <p className="text-[10px] text-slate-500 mt-1">Zero webcam stream leak factors</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 flex flex-col justify-between h-32" id="admin-card-revenue">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">PROJECTED REVENUE</span>
            <Award className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-pink-400">$18,420</div>
            <p className="text-[10px] text-slate-500 mt-1">Sandbox mock payment active</p>
          </div>
        </div>
      </div>

      {/* Primary Custom Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-900 pb-1" id="admin-tabs-bar">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "telemetry"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-telemetry"
        >
          <Activity className="w-3.5 h-3.5" />
          Telemetry Logs
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "users"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-users"
        >
          <Users className="w-3.5 h-3.5" />
          Manage Users
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "courses"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-courses"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Syllabus & Approvals
          {pendingCourses.length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-sans font-bold text-[9px] rounded-full animate-pulse">
              {pendingCourses.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "reports"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-reports"
        >
          <FileText className="w-3.5 h-3.5" />
          Compile Reports
        </button>

        <button
          onClick={() => setActiveTab("moderation")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "moderation"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-moderation"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Moderation Hub
          {flaggedItems.filter(f => f.status === "Review Required").length > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white font-sans font-bold text-[9px] rounded-full">
              {flaggedItems.filter(f => f.status === "Review Required").length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "settings"
              ? "bg-[#11131E] text-blue-400 border-t-2 border-blue-500"
              : "text-slate-400 hover:text-white"
          }`}
          id="admin-tab-settings"
        >
          <Settings className="w-3.5 h-3.5" />
          System Settings
        </button>
      </div>

      {/* Main Tab Panels Content */}
      <div className="min-h-[450px]" id="admin-tab-panels-content">
        <AnimatePresence mode="wait">
          {/* ==================== A. TELEMETRY & LOGS TAB ==================== */}
          {activeTab === "telemetry" && (
            <motion.div
              key="tab-telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              id="admin-panel-telemetry"
            >
              <div className="lg:col-span-2 space-y-6">
                {/* Simulated Live System Telemetry Logs Console */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-850 space-y-4 bg-[#0A0B10]/40" id="admin-telemetry-terminal-container">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-blue-400" />
                      <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                        Operations Telemetry Stream
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 text-slate-500 text-[10px] font-mono rounded">
                      STREAMING LIVE
                    </span>
                  </div>

                  <div className="bg-[#040509] p-4 rounded-xl border border-slate-900 font-mono text-[10.5px] text-slate-400 space-y-2.5 h-[280px] overflow-y-auto leading-relaxed scrollbar-thin">
                    {systemLogs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-blue-500 font-bold">&gt;&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Cluster: cloudrun-nexora-prod-02</span>
                    <span>Database Engine: LocalStorage Sandbox Synchronized</span>
                  </div>
                </div>

                {/* Simulated Revenue & AI Token metrics charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CSS-based Bar chart for Revenue */}
                  <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/20 space-y-4">
                    <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Projected Revenue Growth</h4>
                    <div className="h-32 flex items-end justify-between gap-1 border-b border-slate-900 pb-2">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-slate-800 hover:bg-slate-700 h-10 rounded-t transition-all" title="$4.2K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">Feb</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-slate-800 hover:bg-slate-700 h-14 rounded-t transition-all" title="$5.8K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">Mar</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-slate-800 hover:bg-slate-700 h-20 rounded-t transition-all" title="$8.4K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">Apr</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-blue-500/80 hover:bg-blue-500 h-24 rounded-t transition-all" title="$11.2K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">May</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-pink-500/80 hover:bg-pink-500 h-28 rounded-t transition-all" title="$14.8K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">Jun</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full bg-emerald-500/80 hover:bg-emerald-500 h-32 rounded-t transition-all" title="$18.4K"></div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1">Jul</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Total: $18,420</span>
                      <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> +24.3% MoM
                      </span>
                    </div>
                  </div>

                  {/* Operational parameters CPU/latency progress bars */}
                  <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/20 space-y-3.5 text-xs">
                    <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Platform Health Factors</h4>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-slate-400">
                        <span>Database Read Latency</span>
                        <span className="text-emerald-400">12ms - Optimal</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-slate-400">
                        <span>CPU Core Burden</span>
                        <span className="text-cyan-400">14% - Idle</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: '14%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-slate-400">
                        <span>Sandbox Network Contained</span>
                        <span className="text-indigo-400">100% - Secure</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Global Banner Broadcast Form */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4" id="admin-broadcast-banner-form">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                      Broadcast Global banner
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Broadcast a critical announcement banner across all student dashboards in real time. Ideal for live arena triggers or scheduled server resets.
                  </p>

                  <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono">Broadcast Message Text:</label>
                      <textarea
                        value={broadcastInput}
                        onChange={(e) => setBroadcastInput(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#040509] border border-slate-900 text-slate-200 outline-none h-24 font-mono leading-relaxed focus:border-blue-500/50 text-[11px]"
                        placeholder="e.g. Nexora Sunday Arena starts in 2 hours! Prepare your quantum notes."
                        required
                        id="admin-broadcast-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all border border-blue-400/20 shadow-lg shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-2 font-mono text-xs"
                      id="admin-submit-broadcast-btn"
                    >
                      <Bell className="w-4 h-4" />
                      Dispatch Global Alert
                    </button>
                  </form>
                </div>

                {/* API Status Cards */}
                <div className="p-5 rounded-2xl border border-slate-900 bg-[#0A0B10]/40 space-y-3.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-pink-400" />
                    <span className="font-semibold text-white uppercase font-mono text-[10px]">Active Integrations</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900">
                      <span className="font-mono text-[10px]">Google GenAI Platform</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono">OK</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900">
                      <span className="font-mono text-[10px]">Stripe Billing Proxy</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono">OK</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900">
                      <span className="font-mono text-[10px]">PostgreSQL (Future Node)</span>
                      <span className="px-1.5 py-0.5 bg-slate-950 text-slate-500 border border-slate-900 rounded text-[9px] font-mono">STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== B. USERS MANAGEMENT TAB ==================== */}
          {activeTab === "users" && (
            <motion.div
              key="tab-users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 animate-fade-in"
              id="admin-panel-users"
            >
              {/* 1. TEACHERS MANAGEMENT PORTAL */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-3">
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Manage Academic Teachers Directory
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Enroll qualified professors, audit doubt response rates, or revoke pedagogical permissions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Register Teacher Form */}
                  <div className="p-5 rounded-xl border border-slate-900 bg-[#040509]/60 space-y-4">
                    <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      Enroll New Teacher
                    </h4>

                    <form onSubmit={handleAddTeacher} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Teacher Full Name:</label>
                        <input
                          type="text"
                          value={newTeachName}
                          onChange={(e) => setNewTeachName(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-cyan-500/50"
                          placeholder="e.g. Dr. Alan Turing"
                          required
                          id="admin-new-teacher-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Email Address (Login ID):</label>
                        <input
                          type="email"
                          value={newTeachEmail}
                          onChange={(e) => setNewTeachEmail(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-cyan-500/50"
                          placeholder="teacher@gmail.com"
                          required
                          id="admin-new-teacher-email"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Primary Subject Specialization:</label>
                        <select
                          value={newTeachSubject}
                          onChange={(e) => setNewTeachSubject(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-cyan-500/50 font-mono"
                          id="admin-new-teacher-subject"
                        >
                          <option value="Computer Science">Computer Science</option>
                          <option value="Physics">Physics</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded font-mono transition-all border border-cyan-400/20 shadow-lg cursor-pointer"
                        id="admin-submit-new-teacher-btn"
                      >
                        Enroll Teacher Profile
                      </button>
                    </form>
                  </div>

                  {/* Teacher Directory Table */}
                  <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-slate-900">
                    <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                      <thead>
                        <tr className="bg-slate-950 font-mono text-slate-500 text-[10px] uppercase border-b border-slate-900">
                          <th className="p-3 pl-4">Professor profile</th>
                          <th className="p-3">Email address</th>
                          <th className="p-3">Specialty</th>
                          <th className="p-3">Active lessons</th>
                          <th className="p-3">State</th>
                          <th className="p-3 pr-4 text-right">Pedagogical actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                        {teachers.map(t => {
                          const isSuspended = t.status === "Suspended";
                          return (
                            <tr key={t.id} className="hover:bg-slate-900/10 transition-all text-slate-300">
                              <td className="p-3 pl-4 font-bold text-white">{t.name}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-400">{t.email}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-400">{t.subject}</td>
                              <td className="p-3 font-mono text-center text-[11px] text-slate-400">{t.activeCourses} lessons</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                  isSuspended
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-3 pr-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button
                                    onClick={() => handleToggleTeacherStatus(t.id)}
                                    className={`p-1 rounded cursor-pointer ${
                                      isSuspended ? "text-emerald-400 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10"
                                    }`}
                                    title={isSuspended ? "Restore Teacher" : "Suspend Teacher"}
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeacher(t.id, t.name)}
                                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                                    title="Archive Profile"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 2. STUDENTS MANAGEMENT PORTAL */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-3">
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      Manage Enrolled Students Register
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Enroll student profiles, modify XP counts, audit average attendance benchmarks, and toggle active status.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Register Student Form */}
                  <div className="p-5 rounded-xl border border-slate-900 bg-[#040509]/60 space-y-4">
                    <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Register New Student
                    </h4>

                    <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Student Full Name:</label>
                        <input
                          type="text"
                          value={newStudName}
                          onChange={(e) => setNewStudName(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-indigo-500/50"
                          placeholder="e.g. Aarav Sharma"
                          required
                          id="admin-new-student-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Email Address (Login ID):</label>
                        <input
                          type="email"
                          value={newStudEmail}
                          onChange={(e) => setNewStudEmail(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-indigo-500/50"
                          placeholder="student@gmail.com"
                          required
                          id="admin-new-student-email"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-mono text-[10px]">Core Academic Focus:</label>
                        <select
                          value={newStudSubject}
                          onChange={(e) => setNewStudSubject(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-indigo-500/50 font-mono"
                          id="admin-new-student-subject"
                        >
                          <option value="Computer Science">Computer Science</option>
                          <option value="Physics">Physics</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded font-mono transition-all border border-indigo-400/20 shadow-lg cursor-pointer"
                        id="admin-submit-new-student-btn"
                      >
                        Register Student Profile
                      </button>
                    </form>
                  </div>

                  {/* Student Directory Table */}
                  <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-slate-900">
                    <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                      <thead>
                        <tr className="bg-slate-950 font-mono text-slate-500 text-[10px] uppercase border-b border-slate-900">
                          <th className="p-3 pl-4">Student profile</th>
                          <th className="p-3">Email address</th>
                          <th className="p-3">Level / XP</th>
                          <th className="p-3">Attendance</th>
                          <th className="p-3">State</th>
                          <th className="p-3 pr-4 text-right">Integrity actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                        {students.map(s => {
                          const isSuspended = s.status === "Suspended";
                          return (
                            <tr key={s.id} className="hover:bg-slate-900/10 transition-all text-slate-300">
                              <td className="p-3 pl-4 font-bold text-white">{s.name}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-400">{s.email}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-400">
                                Lvl {s.level} <span className="text-slate-500">({s.xp} XP)</span>
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                <span className={s.attendance < 80 ? "text-amber-500" : "text-emerald-400"}>
                                  {s.attendance}%
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                  isSuspended
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                  {s.status}
                                </span>
                              </td>
                              <td className="p-3 pr-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button
                                    onClick={() => handleToggleStudentStatus(s.id)}
                                    className={`p-1 rounded cursor-pointer ${
                                      isSuspended ? "text-emerald-400 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10"
                                    }`}
                                    title={isSuspended ? "Re-activate student" : "Suspend student"}
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(s.id, s.name)}
                                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                                    title="Wipe Student profile"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== C. SYLLABUS & APPROVALS TAB ==================== */}
          {activeTab === "courses" && (
            <motion.div
              key="tab-courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
              id="admin-panel-courses"
            >
              {/* Approvals Queue */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4">
                <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-amber-500" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                    Syllabus Proposal Approvals Queue ({pendingCourses.length})
                  </h3>
                </div>

                <p className="text-slate-400 text-xs">
                  Pedagogical review interface for newly submitted courses proposed by verified educators before they are published globally.
                </p>

                {pendingCourses.length === 0 ? (
                  <div className="p-8 rounded-xl border border-slate-900 bg-slate-950/20 text-center text-xs text-slate-500">
                    No course submissions pending pedagogical sign-off.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingCourses.map(pc => (
                      <div key={pc.id} className="p-5 rounded-xl border border-slate-900 bg-[#040509]/60 space-y-4 text-xs">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono text-[9px] uppercase font-bold">
                              {pc.subject}
                            </span>
                            <h4 className="font-bold text-white text-sm font-mono mt-1">{pc.title}</h4>
                            <p className="text-slate-400 text-[11px] font-mono">Proposed by: {pc.instructor} • {pc.duration}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{pc.submissionDate}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-900 text-[11px]">
                          <span className="font-semibold text-slate-400 font-mono block mb-1">Modules Compiled ({pc.modules.length}):</span>
                          <span className="text-slate-500 leading-normal font-mono">{pc.modules.join(" → ")}</span>
                        </div>

                        <div className="flex gap-2.5">
                          <button
                            onClick={() => handleApproveCourse(pc)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-1.5 font-mono text-[11px] cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve & Publish Node
                          </button>
                          <button
                            onClick={() => handleRejectCourse(pc.id, pc.title)}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-rose-950 border border-slate-900 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 rounded flex items-center justify-center gap-1 cursor-pointer"
                            title="Reject Proposal"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Pruning list */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4">
                <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                    Global Deployed Course Index ({courses.length})
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-normal">
                  Administrative overrides to prune outdated syllabus nodes or reset lesson matrices. Course deletions will immediately reflect across all Student and Teacher dashboard perspectives.
                </p>

                <div className="space-y-2.5">
                  {courses.map(course => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl bg-[#040509]/40 border border-slate-900 flex items-center justify-between text-xs hover:border-slate-800 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white font-mono text-sm">{course.title}</div>
                        <div className="text-slate-400 text-[10px] flex flex-wrap items-center gap-2 font-mono">
                          <span className="text-indigo-400 font-bold">{course.subject}</span>
                          <span>•</span>
                          <span>Instructor: {course.instructor}</span>
                          <span>•</span>
                          <span>Duration: {course.duration}</span>
                          <span>•</span>
                          <span className="text-slate-500">Modules: {course.modules.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Confirm permanent deletion of course: "${course.title}"? This cannot be undone.`)) {
                            onDeleteCourse(course.id);
                            showFeedback(`Purged course node: ${course.title}`, "info");
                            setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ADMIN: Deleted course node: ${course.title}`, ...prev]);
                          }
                        }}
                        className="p-2 bg-slate-950 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-slate-900 rounded-lg transition-all cursor-pointer"
                        title="Delete Course Node"
                        id={`admin-delete-course-${course.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== D. REPORTS COMPILER TAB ==================== */}
          {activeTab === "reports" && (
            <motion.div
              key="tab-reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-6"
              id="admin-panel-reports"
            >
              <div className="border-b border-slate-900 pb-3 space-y-1">
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Enterprise Performance & Audit Compiler
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Select telemetry vectors to compile compliant auditor sheets with CSV download capability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedReportType("grades")}
                  className={`p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer ${
                    selectedReportType === "grades"
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <Award className="w-5 h-5 text-indigo-400" />
                  <div className="font-mono text-xs font-bold uppercase">Grades Register</div>
                  <p className="text-[10px] text-slate-500 leading-tight">Student grade averages, active module indexes, and integrity scores.</p>
                </button>

                <button
                  onClick={() => setSelectedReportType("tokens")}
                  className={`p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer ${
                    selectedReportType === "tokens"
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <div className="font-mono text-xs font-bold uppercase">GenAI Token Logs</div>
                  <p className="text-[10px] text-slate-500 leading-tight">Gemini proxy endpoints, requests served, and monthly quotas.</p>
                </button>

                <button
                  onClick={() => setSelectedReportType("revenue")}
                  className={`p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer ${
                    selectedReportType === "revenue"
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <DollarSign className="w-5 h-5 text-indigo-400" />
                  <div className="font-mono text-xs font-bold uppercase">Billing ledger</div>
                  <p className="text-[10px] text-slate-500 leading-tight">Gross premium student subscriptions and teacher payouts.</p>
                </button>

                <button
                  onClick={() => setSelectedReportType("proctor")}
                  className={`p-4 rounded-xl border transition-all text-left space-y-2 cursor-pointer ${
                    selectedReportType === "proctor"
                      ? "bg-indigo-500/10 border-indigo-500/40 text-white"
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <div className="font-mono text-xs font-bold uppercase">Proctor Audits</div>
                  <p className="text-[10px] text-slate-500 leading-tight">Lockdown integrity indexes, alt-tab flags, and proctor webcams.</p>
                </button>
              </div>

              <div className="flex justify-center py-4 border-t border-b border-slate-900">
                <button
                  onClick={handleCompileReport}
                  disabled={isCompilingReport}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold font-mono text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  id="admin-compile-report-btn"
                >
                  {isCompilingReport ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Compiling Cryptographic Signatures...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Compile Requested Ledger Audit
                    </>
                  )}
                </button>
              </div>

              {/* Report Spreadsheet-like Preview Area */}
              {compiledPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-xs font-mono"
                  id="admin-report-compiled-preview"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div>
                      <h4 className="font-bold text-white text-sm">{compiledPreview.title}</h4>
                      <p className="text-slate-500 text-[10px]">Compiled on: {compiledPreview.date} • Format: Comma Separated Values (CSV)</p>
                    </div>

                    <button
                      onClick={handleDownloadCSV}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px]"
                      id="admin-download-csv-btn"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Auditor Sheet (.csv)
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-900">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-900">
                          {compiledPreview.headers.map((h: string, idx: number) => (
                            <th key={idx} className="p-3 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 bg-slate-950/10">
                        {compiledPreview.rows.map((row: string[], idx: number) => (
                          <tr key={idx} className="hover:bg-slate-900/20 text-slate-300">
                            {row.map((cell: string, cellIdx: number) => (
                              <td key={cellIdx} className="p-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 text-slate-400 leading-normal text-[11px]">
                    <span className="font-bold text-white block mb-0.5">Auditor Summary Vector:</span>
                    {compiledPreview.summary}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ==================== E. MODERATION TAB ==================== */}
          {activeTab === "moderation" && (
            <motion.div
              key="tab-moderation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4 animate-fade-in"
              id="admin-panel-moderation"
            >
              <div className="border-b border-slate-900 pb-3 space-y-1">
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Academic Integrity & Moderation Queue ({flaggedItems.filter(f => f.status === "Review Required").length})
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Review forum questions, doubt spams, or suspicious proctoring alt-tab anomalies flagged by Nexora AI scanners.
                </p>
              </div>

              <div className="space-y-4">
                {flaggedItems.map(item => {
                  const isPending = item.status === "Review Required";
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start gap-4 text-xs transition-all ${
                        isPending ? "bg-rose-500/5 border-rose-500/10" : "bg-slate-950/20 border-slate-900 opacity-60"
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-mono text-[9px] uppercase font-bold">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Flagged by: {item.flaggedBy}</span>
                          <span className="text-[10px] text-slate-500 font-mono">•</span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-900 leading-relaxed font-mono text-slate-300 text-[11px]">
                          <span className="text-slate-500 font-bold block mb-1">Author: {item.author}</span>
                          &quot;{item.content}&quot;
                        </div>

                        <div className="text-[10px] text-rose-400/80 font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Trigger Reason: {item.reason}</span>
                        </div>
                      </div>

                      <div className="sm:self-center flex sm:flex-col gap-2 w-full sm:w-auto">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleResolveFlag(item.id, "approve")}
                              className="flex-1 sm:w-28 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded flex items-center justify-center gap-1 font-mono text-[10px] cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Dismiss Flag
                            </button>
                            <button
                              onClick={() => handleResolveFlag(item.id, "delete")}
                              className="flex-1 sm:w-28 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900/50 rounded flex items-center justify-center gap-1 font-mono text-[10px] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Purge Content
                            </button>
                          </>
                        ) : (
                          <div className="px-3 py-1 bg-slate-900 border border-slate-850 rounded text-slate-400 font-mono text-[10px] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            {item.status}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ==================== F. SYSTEM SETTINGS TAB ==================== */}
          {activeTab === "settings" && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              id="admin-panel-settings"
            >
              {/* API Configuration */}
              <div className="md:col-span-2 p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4">
                <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                    Model Parameters & AI Gateway settings
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-normal">
                  Configure real-time parameters for the server-side Google GenAI proxy. All credentials should be securely saved in the workspace `.env` environment container.
                </p>

                <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400">Target Gemini Model:</label>
                      <select
                        value={geminiModel}
                        onChange={(e) => setGeminiModel(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-blue-500/50"
                        id="admin-select-model"
                      >
                        <option value="gemini-3.5-flash">gemini-3.5-flash (Standard default)</option>
                        <option value="gemini-1.5-pro">gemini-1.5-pro (Complex reasoning)</option>
                        <option value="gemini-2.5-flash">gemini-2.5-flash (High speed proxy)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400">Response Temperature: ({temperature})</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-8 bg-slate-950 rounded cursor-pointer accent-blue-500"
                        id="admin-range-temp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400">Monthly AI Quota Cap (M):</label>
                      <input
                        type="number"
                        value={quotaCap}
                        onChange={(e) => setQuotaCap(parseInt(e.target.value) || 100)}
                        className="w-full p-2 bg-slate-950 border border-slate-900 rounded text-slate-100 outline-none focus:border-blue-500/50"
                        id="admin-quota-cap"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 block mb-1">Toggle Maintenance Mode:</label>
                      <button
                        type="button"
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className="w-full py-2 bg-slate-950 border border-slate-900 text-slate-300 rounded flex items-center justify-between px-3 cursor-pointer"
                        id="admin-toggle-maintenance"
                      >
                        <span>Status: {maintenanceMode ? "ACTIVE (Offline)" : "INACTIVE (Live)"}</span>
                        {maintenanceMode ? (
                          <ToggleRight className="w-5 h-5 text-rose-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    id="admin-save-config-btn"
                  >
                    <Check className="w-4 h-4" />
                    Apply Constants
                  </button>
                </form>
              </div>

              {/* Database & Backups controls */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-850 bg-[#0A0B10]/40 space-y-4">
                <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-pink-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                    Database Snapshots
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-normal">
                  Export complete mock states containing assignments, student progress logs, and doubt maps compiled locally.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <button
                    onClick={handleBackupDB}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-900 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                    id="admin-backup-db-btn"
                  >
                    <Download className="w-4 h-4 text-pink-400" />
                    Download JSON Backup
                  </button>

                  <button
                    onClick={handleResetDB}
                    className="w-full py-2.5 bg-slate-950 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-900 hover:border-rose-900/30 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                    id="admin-reset-db-btn"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Wipe Database PRESets
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple Clock Icon fallback for React code
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
