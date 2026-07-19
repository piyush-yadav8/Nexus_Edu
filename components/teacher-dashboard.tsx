'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Users, AlertTriangle, MessageSquare, Plus, Check, Sparkles, Send,
  GraduationCap, Video, FileText, ClipboardCheck, Trophy, ShieldAlert, Award,
  Search, Trash2, HelpCircle, Save, Download, DollarSign, Calendar, ArrowRight,
  Flame, CreditCard, Lock, Bell, Activity, RefreshCw, Layers, Shield, Eye, CheckCircle,
  TrendingUp, BarChart2, XCircle
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line
} from 'recharts';
import { Course, Doubt, StudentStats, getMockDB, saveMockDB, Assignment } from '@/lib/mock-db';

interface TeacherDashboardProps {
  courses: Course[];
  doubts: Doubt[];
  studentStats: StudentStats;
  onAddCourse: (newCourse: Course) => void;
  onResolveDoubt: (doubtId: string, answer: string) => void;
}

export default function TeacherDashboard({
  courses: initialCourses,
  doubts: initialDoubts,
  studentStats: initialStudentStats,
  onAddCourse,
  onResolveDoubt,
}: TeacherDashboardProps) {
  // Navigation tabs for the Teacher Dashboard (matches Phase 4 features)
  const [activeTab, setActiveTab] = useState<
    "overview" | "uploader" | "assignments" | "analytics" | "attendance" | "competition" | "finance" | "exams"
  >("overview");

  // Dynamic state loaded from mock-db / localStorage
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats>(initialStudentStats);

  // Sync state with props or local storage on change asynchronously
  useEffect(() => {
    Promise.resolve().then(() => {
      setCourses(initialCourses);
    });
  }, [initialCourses]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setDoubts(initialDoubts);
    });
  }, [initialDoubts]);

  useEffect(() => {
    const db = getMockDB();
    if (db.assignments) {
      Promise.resolve().then(() => {
        setAssignments(db.assignments);
      });
    }
  }, []);

  // Broadcast banner messaging
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);
  const triggerBanner = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // 1. COURSE CREATION STATE
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSubject, setNewSubject] = useState("Computer Science");
  const [newDuration, setNewDuration] = useState("4 hours");
  const [newModules, setNewModules] = useState("");

  // 2. VIDEO UPLOAD STATE
  const [videoCourseId, setVideoCourseId] = useState(() => initialCourses[0]?.id || "");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 3. PDF UPLOAD STATE
  const [pdfCourseId, setPdfCourseId] = useState(() => initialCourses[0]?.id || "");
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // 4. ASSIGNMENT CREATION STATE
  const [assignCourse, setAssignCourse] = useState("Computer Science");
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDeadline, setAssignDeadline] = useState("July 28, 2026");
  const [assignQuestion, setAssignQuestion] = useState("");
  const [assignOptionA, setAssignOptionA] = useState("");
  const [assignOptionB, setAssignOptionB] = useState("");
  const [assignOptionC, setAssignOptionC] = useState("");
  const [assignOptionD, setAssignOptionD] = useState("");
  const [assignCorrectIdx, setAssignCorrectIdx] = useState(0);
  const [assignXp, setAssignXp] = useState(50);
  const [assignCoins, setAssignCoins] = useState(15);

  // 5. QUESTION BANK STATE
  const [qbSearch, setQbSearch] = useState("");
  const [qbSubject, setQbSubject] = useState("All");
  const [qbQuestions, setQbQuestions] = useState<any[]>([
    { id: "q-1", subject: "Computer Science", difficulty: "Hard", question: "What is the computational complexity of Training an SVM with a Gaussian Kernel?", answer: "O(n^2) to O(n^3) depending on sample spacing", useCount: 14 },
    { id: "q-2", subject: "Physics", difficulty: "Medium", question: "Explain the Heisenberg Uncertainty Principle concerning position and momentum vector bounds.", answer: "Δx * Δp >= h-bar / 2", useCount: 22 },
    { id: "q-3", subject: "Mathematics", difficulty: "Expert", question: "State the convergence criterion for Newton-Raphson approximation iteration sequences.", answer: "Function must be double-differentiable and initial point must be sufficiently close.", useCount: 9 },
    { id: "q-4", subject: "Chemistry", difficulty: "Easy", question: "Describe the structural state of hybrid sp3 molecular orbitals in methane.", answer: "Tetrahedral spatial configuration with 109.5 degree angular offsets.", useCount: 31 }
  ]);
  const [newQbQuestion, setNewQbQuestion] = useState("");
  const [newQbSubject, setNewQbSubject] = useState("Computer Science");
  const [newQbDiff, setNewQbDiff] = useState("Medium");
  const [newQbAnswer, setNewQbAnswer] = useState("");

  // 6. DOUBTS STATE
  const [activeDoubtId, setActiveDoubtId] = useState<string | null>(null);
  const [manualResponse, setManualResponse] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // 7. WEAK STUDENT DETECTION & AI SUGGESTIONS STATE
  const [selectedAtRiskStudent, setSelectedAtRiskStudent] = useState<any | null>(null);
  const [aiSuggestionOutput, setAiSuggestionOutput] = useState("");
  const [isComputingAiSuggestion, setIsComputingAiSuggestion] = useState(false);
  const [atRiskStudents, setAtRiskStudents] = useState<any[]>([
    { name: "Aarav Sharma", id: "stud-1", attendance: 78, accuracy: 64, email: "student@gmail.com", problemTopic: "Quantum wave equations", riskLevel: "High", streak: 12, level: 3 },
    { name: "Tariq Ali", id: "stud-3", attendance: 82, accuracy: 71, email: "tariq@gmail.com", problemTopic: "Schrodinger normalization proofs", riskLevel: "Medium", streak: 5, level: 2 },
    { name: "Emily Watson", id: "stud-4", attendance: 91, accuracy: 84, email: "emily@gmail.com", problemTopic: "None", riskLevel: "Low", streak: 9, level: 4 }
  ]);

  // 8. ATTENDANCE MANAGEMENT STATE
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([
    { id: "stud-1", name: "Aarav Sharma", email: "student@gmail.com", index: 78, status: "Present", lastLogged: "Today, 09:12 AM" },
    { id: "stud-2", name: "Priya Patel", email: "priya@gmail.com", index: 98, status: "Present", lastLogged: "Today, 08:55 AM" },
    { id: "stud-3", name: "Tariq Ali", email: "tariq@gmail.com", index: 82, status: "Absent", lastLogged: "Yesterday, 10:15 AM" },
    { id: "stud-4", name: "Emily Watson", email: "emily@gmail.com", index: 91, status: "Present", lastLogged: "Today, 09:02 AM" },
    { id: "stud-5", name: "Jessica Chen", email: "jessica@gmail.com", index: 95, status: "Present", lastLogged: "Today, 08:45 AM" },
    { id: "stud-6", name: "Pranav Rao", email: "pranav@gmail.com", index: 88, status: "Present", lastLogged: "Today, 09:15 AM" }
  ]);

  // 9. COMPETITION MANAGEMENT STATE
  const [arenaName, setArenaName] = useState("Quantum Speedrun Duel #18");
  const [arenaDate, setArenaDate] = useState("2026-07-26T10:00");
  const [arenaPrize, setArenaPrize] = useState("500 XP, 100 Coins, and Golden Halo Frame");
  const [competitions, setCompetitions] = useState<any[]>([
    { id: "comp-1", name: "Quantum Speedrun Duel #18", date: "July 26, 2026", prizePool: "500 XP, 100 Coins", activeParticipants: 45, status: "Scheduled" },
    { id: "comp-2", name: "Algorithm Deathmatch Arena", date: "July 19, 2026", prizePool: "300 XP, 50 Coins", activeParticipants: 72, status: "Ongoing" }
  ]);

  // 10. CERTIFICATES STATE
  const [certificates, setCertificates] = useState<any[]>([
    { id: "cert-1", studentName: "Priya Patel", title: "Honorary Quantum Architect", date: "July 12, 2026", status: "Pending Signature", grade: "A+" },
    { id: "cert-2", studentName: "Jessica Chen", title: "Master of Backpropagation Calculus", date: "July 18, 2026", status: "Digitally Signed", grade: "A" },
    { id: "cert-3", studentName: "Aarav Sharma", title: "Dynamic Vector Geometry Pro", date: "July 15, 2026", status: "Pending Signature", grade: "B" }
  ]);

  // 11. FINANCE & REVENUE DATA
  const [teacherEarnings, setTeacherEarnings] = useState<any[]>([
    { month: "Feb", courses: 1400, individual: 800 },
    { month: "Mar", courses: 1900, individual: 1200 },
    { month: "Apr", courses: 2300, individual: 1500 },
    { month: "May", courses: 3100, individual: 1800 },
    { month: "Jun", courses: 4100, individual: 2100 },
    { month: "Jul", courses: 4850, individual: 2450 }
  ]);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // 12. PROCTORED SECURE EXAMS STATE
  const [classroomExams, setClassroomExams] = useState<any[]>([
    { id: "e-1", studentName: "Aarav Sharma", examName: "Astrophysics & Deep Networks Final", score: 86, integrity: 85, date: "2026-07-18", status: "Pending Review", infractions: ["[10:14:22] Attempted right-click menu access (-8% Integrity)", "[10:16:45] Ctrl+C copy command intercepted (-10% Integrity)"], feedback: "" },
    { id: "e-2", studentName: "Priya Patel", examName: "Quantum Wave Mechanics Final", score: 92, integrity: 100, date: "2026-07-17", status: "Approved", infractions: ["[11:02:15] Secure AI supervisor connected. No critical anomalies."], feedback: "Outstanding job, perfect integrity!" },
    { id: "e-3", studentName: "Tariq Ali", examName: "Astrophysics & Deep Networks Final", score: 64, integrity: 55, date: "2026-07-16", status: "Flagged", infractions: ["[14:01:10] Window focus lost / Tab switched (-15% Integrity)", "[14:03:45] Window focus lost / Tab switched (-15% Integrity)", "[14:06:12] Exited Fullscreen Proctored Sandbox (-12% Integrity)"], feedback: "Multiple severe tab switches detected. Please repeat this assessment under supervised conditions." },
    { id: "e-4", studentName: "Emily Watson", examName: "Quantum Wave Mechanics Final", score: 88, integrity: 95, date: "2026-07-15", status: "Approved", infractions: ["[09:12:00] Attempted right-click menu access (-8% Integrity)"], feedback: "Excellent performance." }
  ]);

  // Sync student stats live exam histories with classroomExams
  useEffect(() => {
    if (studentStats && studentStats.examAnalytics) {
      const aaravAttempts = studentStats.examAnalytics.map((attempt, idx) => ({
        id: `aarav-exam-${idx}`,
        studentName: "Aarav Sharma",
        examName: attempt.examName,
        score: attempt.score,
        integrity: attempt.integrity,
        date: attempt.date,
        status: attempt.status || "Pending Review",
        infractions: attempt.infractions || [`[${new Date().toLocaleTimeString()}] Secure AI supervisor connected. No critical anomalies.`],
        feedback: attempt.feedback || ""
      }));

      Promise.resolve().then(() => {
        setClassroomExams(prev => {
          const others = prev.filter(e => e.studentName !== "Aarav Sharma");
          // Maintain non-duplicate items
          return [...aaravAttempts, ...others];
        });
      });
    }
  }, [studentStats]);

  const [selectedExamId, setSelectedExamId] = useState<string | null>("e-1");
  const [examFeedbackInput, setExamFeedbackInput] = useState("");
  const [examFilterStudent, setExamFilterStudent] = useState("All");
  const [examFilterTopic, setExamFilterTopic] = useState("All");
  const [examFilterStatus, setExamFilterStatus] = useState("All");

  useEffect(() => {
    const selected = classroomExams.find(e => e.id === selectedExamId);
    if (selected) {
      Promise.resolve().then(() => {
        setExamFeedbackInput(selected.feedback || "");
      });
    }
  }, [selectedExamId, classroomExams]);

  // Initialize selected course dropdowns when courses load
  // Handlers
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const modulesList = newModules
      ? newModules.split(",").map(m => m.trim())
      : ["Syllabus Overview", "Core Lecture Node", "Quiz Assessment"];

    const added: Course = {
      id: `course-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      subject: newSubject,
      instructor: "Prof. Sarah Jenkins (You)",
      modules: modulesList,
      duration: newDuration,
      enrolledCount: 0,
    };

    onAddCourse(added);
    // update local state too
    setCourses(prev => [added, ...prev]);

    setNewTitle("");
    setNewDesc("");
    setNewModules("");
    triggerBanner("Course module published and cataloged in Nexora learning tree!");
  };

  // Handler: Resolve doubt using manual input
  const handleManualResolve = (dId: string) => {
    if (!manualResponse) return;
    onResolveDoubt(dId, manualResponse);
    setManualResponse("");
    setActiveDoubtId(null);
    triggerBanner("Solution delivered successfully to student's notification system.");
  };

  // Handler: Generate AI solution suggestion via Gemini
  const handleAiSuggestDoubt = async (dId: string, query: string, subject: string) => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "doubt",
          payload: { subject, query }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setManualResponse(data.text);
        setActiveDoubtId(dId);
      }
    } catch (err) {
      console.error(err);
      setManualResponse(`AI Assistant Suggested solution fallback:\nRegarding "${query}" in ${subject}, we formulate this through localized iterative step calculus limits.`);
      setActiveDoubtId(dId);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Drag & drop / mock file uploaders
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUploadVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || (!videoUrl && !videoFile) || !videoCourseId) {
      triggerBanner("Please provide a title, a selected course, and a video URL or file.");
      return;
    }

    setVideoProgress(10);
    const interval = setInterval(() => {
      setVideoProgress((prev: any) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Append as a module to selected course
            const targetCourse = courses.find(c => c.id === videoCourseId);
            if (targetCourse) {
              const updatedModules = [...targetCourse.modules, `[Video Lecture] ${videoTitle}`];
              const updatedCourse = { ...targetCourse, modules: updatedModules };
              
              // Sync state
              setCourses(prevCourses => prevCourses.map(c => c.id === videoCourseId ? updatedCourse : c));
              // Save to Mock DB
              const db = getMockDB();
              const updatedCourses = db.courses.map((c: any) => c.id === videoCourseId ? updatedCourse : c);
              saveMockDB({ courses: updatedCourses });
            }

            setVideoTitle("");
            setVideoUrl("");
            setVideoFile(null);
            setVideoProgress(null);
            triggerBanner(`Video lecture "${videoTitle}" uploaded & appended to course syllabus modules!`);
          }, 800);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUploadPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle || !pdfFile || !pdfCourseId) {
      triggerBanner("Please provide a PDF title, choose a target course, and select a PDF document.");
      return;
    }

    setPdfProgress(15);
    const interval = setInterval(() => {
      setPdfProgress((prev: any) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Append as module
            const targetCourse = courses.find(c => c.id === pdfCourseId);
            if (targetCourse) {
              const updatedModules = [...targetCourse.modules, `[Reference PDF] ${pdfTitle}`];
              const updatedCourse = { ...targetCourse, modules: updatedModules };
              
              setCourses(prevCourses => prevCourses.map(c => c.id === pdfCourseId ? updatedCourse : c));
              const db = getMockDB();
              const updatedCourses = db.courses.map((c: any) => c.id === pdfCourseId ? updatedCourse : c);
              saveMockDB({ courses: updatedCourses });
            }

            setPdfTitle("");
            setPdfFile(null);
            setPdfProgress(null);
            triggerBanner(`Reference PDF "${pdfTitle}" parsed and appended to syllabus!`);
          }, 800);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  // Deploy Homework Assignment to database (shared with student!)
  const handleDeployAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle || !assignQuestion || !assignOptionA || !assignOptionB) {
      triggerBanner("Please complete all required fields for the homework assignment.");
      return;
    }

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: assignTitle,
      subject: assignCourse,
      deadline: assignDeadline,
      xpReward: assignXp,
      coinsReward: assignCoins,
      status: "Pending",
      questionText: assignQuestion,
      options: [assignOptionA, assignOptionB, assignOptionC || "None of the above", assignOptionD || "All of the above"],
      correctIndex: assignCorrectIdx
    };

    const updatedAssignments = [newAssignment, ...assignments];
    setAssignments(updatedAssignments);
    saveMockDB({ assignments: updatedAssignments });

    // Clean form
    setAssignTitle("");
    setAssignQuestion("");
    setAssignOptionA("");
    setAssignOptionB("");
    setAssignOptionC("");
    setAssignOptionD("");
    setAssignCorrectIdx(0);

    triggerBanner(`New Dynamic Homework deployed! Student dashboard has been synchronized immediately.`);
  };

  // Add question to bank
  const handleAddQuestionToBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQbQuestion || !newQbAnswer) return;

    const newQ = {
      id: `q-${Date.now()}`,
      subject: newQbSubject,
      difficulty: newQbDiff,
      question: newQbQuestion,
      answer: newQbAnswer,
      useCount: 0
    };

    setQbQuestions([newQ, ...qbQuestions]);
    setNewQbQuestion("");
    setNewQbAnswer("");
    triggerBanner("Question successfully committed to global proctored Question Bank!");
  };

  // Delete question from bank
  const handleDeleteQbQuestion = (id: string) => {
    setQbQuestions(qbQuestions.filter(q => q.id !== id));
    triggerBanner("Question removed from active library bank.");
  };

  // Toggle dynamic attendance status
  const handleToggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.id === studentId) {
        const isAbsentNow = rec.status === "Present";
        const newStatus = isAbsentNow ? "Absent" : "Present";
        // Recalculate attendance percentage slightly
        const delta = isAbsentNow ? -2 : 1;
        const newIndex = Math.min(100, Math.max(0, rec.index + delta));
        return {
          ...rec,
          status: newStatus,
          index: newIndex,
          lastLogged: isAbsentNow ? "Marked Absent today" : "Marked Present today"
        };
      }
      return rec;
    }));
    triggerBanner("Attendance updated and synchronized with student report sheets.");
  };

  // Export Attendance CSV
  const handleExportAttendance = () => {
    const headers = "Student Name,Email,Attendance Index,Today Status,Last Checked\n";
    const rows = attendanceRecords.map(r => `"${r.name}","${r.email}",${r.index}%,${r.status},"${r.lastLogged}"`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Nexora_Classroom_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerBanner("Generated and downloaded classroom attendance CSV register successfully.");
  };

  // Compute AI suggestions for weak student
  const handleComputeStudentAiSuggestion = async (student: any) => {
    setSelectedAtRiskStudent(student);
    setIsComputingAiSuggestion(true);
    setAiSuggestionOutput("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "doubt",
          payload: {
            subject: "Academic Advising",
            query: `Analyze student performance: Name ${student.name}, average quiz accuracy ${student.accuracy}%, attendance rate ${student.attendance}%, core struggle area is "${student.problemTopic}". Draft 3 highly targeted pedagogical recovery interventions and a custom study track using spaced repetition models.`
          }
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiSuggestionOutput(data.text);
      }
    } catch (err) {
      console.error(err);
      setAiSuggestionOutput(`**Pedagogical Recovery Recommendations for ${student.name}:**\n\n1. **Spaced Repetition Review**: Lock active study reminders focusing on *${student.problemTopic}* every 48 hours.\n2. **Micro-Syllabus Focus**: Automatically queue 5 custom vector assignments in their next learning trees.\n3. **Proactive Tutoring**: Trigger a simulated doubt resolution invite regarding wave particle calculations.`);
    } finally {
      setIsComputingAiSuggestion(false);
    }
  };

  // Sign off certificate
  const handleSignCertificate = (id: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: "Digitally Signed" } : c));
    triggerBanner("Certificate validated and cryptographically signed on Nexora blockchain.");
  };

  // Create Sunday Arena Duel
  const handleScheduleArena = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arenaName) return;

    const newComp = {
      id: `comp-${Date.now()}`,
      name: arenaName,
      date: new Date(arenaDate).toLocaleString(),
      prizePool: arenaPrize,
      activeParticipants: 0,
      status: "Scheduled"
    };

    setCompetitions([newComp, ...competitions]);
    triggerBanner("New Sunday Arena Duel is live and published to student dashboards.");
  };

  // Broadcast high priority course alerts
  const [alertText, setAlertText] = useState("");
  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText) return;

    // Simulate sending alert
    triggerBanner(`ALERT SENT: "${alertText}" broadcasted to all course classrooms.`);
    setAlertText("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 1. BROADCAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {bannerMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl bg-[#111115] border border-blue-500/40 text-blue-200 text-xs font-mono flex items-center gap-3 shadow-2xl z-50"
          >
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
            <span>{bannerMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TOP TEACHER HERO PROFILE */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a0f26] to-slate-950 border border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center font-extrabold text-white text-xl">
            SJ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-mono text-white">Prof. Sarah Jenkins</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono">
                Verified Faculty
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Faculty Lead, Quantum Computing & Mathematical Sciences</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-850 space-y-0.5 font-mono text-xs">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Faculty Status</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Lecture
            </span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-850 space-y-0.5 font-mono text-xs">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Dynamic Node Access</span>
            <span className="text-blue-400 flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              14 Modules
            </span>
          </div>
        </div>
      </div>

      {/* 3. CORE SUB-DASHBOARD NAVIGATION CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-900">
        {[
          { id: "overview", label: "Overview & Doubts", icon: Activity },
          { id: "uploader", label: "Content Uploader", icon: Video },
          { id: "assignments", label: "Homework & Question Bank", icon: ClipboardCheck },
          { id: "analytics", label: "Weak Student Analysis", icon: ShieldAlert },
          { id: "exams", label: "Proctored Exam Reviews", icon: Shield },
          { id: "attendance", label: "Classroom Attendance", icon: Calendar },
          { id: "competition", label: "Sunday Arena & Certificates", icon: Trophy },
          { id: "finance", label: "Payouts & Earnings", icon: DollarSign }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-mono flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#1d265a]/45 border-[#7C5CFF] text-[#7C5CFF] glow-blue"
                  : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#7C5CFF]" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. MAIN DYNAMIC PANELS CONTENT */}
      <div className="space-y-6">

        {/* ==================== A. OVERVIEW & DOUBTS TAB ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Classroom Enrolled", value: attendanceRecords.length, desc: "Active learning profiles", color: "text-blue-400", icon: Users },
                { label: "Average Accuracy", value: "83.6%", desc: "Cross-syllabus score index", color: "text-cyan-400", icon: GraduationCap },
                { label: "Active Doubts", value: doubts.filter(d => d.status === "pending").length, desc: "Awaiting teacher solution", color: "text-rose-400", icon: MessageSquare },
                { label: "At-Risk Students", value: atRiskStudents.filter(s => s.riskLevel === "High").length, desc: "Quiz accuracy drop-off", color: "text-amber-500", icon: AlertTriangle }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{stat.label}</span>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">{stat.value}</div>
                    <p className="text-[10px] text-slate-400 font-mono">{stat.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Doubts Resolution Inbox */}
              <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h2 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Student Doubts Resolution Desk</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono font-bold">
                    {doubts.filter(d => d.status === "pending").length} Pending
                  </span>
                </div>

                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                  {doubts.filter(d => d.status === "pending").map((doubt) => (
                    <div key={doubt.id} className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#7C5CFF] font-bold">[{doubt.subject}] Ask by {doubt.studentName}</span>
                        <span className="text-slate-500 text-[9px]">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        &quot;{doubt.query}&quot;
                      </p>

                      {activeDoubtId === doubt.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={manualResponse}
                            onChange={(e) => setManualResponse(e.target.value)}
                            className="w-full p-3 rounded-lg text-xs bg-[#050816] border border-blue-500/50 text-slate-200 outline-none h-28 font-mono leading-relaxed"
                            placeholder="Type markdown supported theoretical proof..."
                          />
                          <div className="flex justify-end gap-2 text-xs font-mono">
                            <button
                              onClick={() => setActiveDoubtId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleManualResolve(doubt.id)}
                              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" /> Send Response
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAiSuggestDoubt(doubt.id, doubt.query, doubt.subject)}
                            disabled={isGeneratingAi}
                            className="px-3.5 py-1.5 rounded-lg bg-[#0e1635] hover:bg-blue-900/30 border border-blue-500/30 text-blue-300 text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                            {isGeneratingAi ? "Thinking..." : "Draft Solution via Gemini AI"}
                          </button>
                          <button
                            onClick={() => {
                              setManualResponse("");
                              setActiveDoubtId(doubt.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-mono"
                          >
                            Resolve Manually
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {doubts.filter(d => d.status === "pending").length === 0 && (
                    <div className="text-center py-12 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-500 font-mono">Zero Student doubts pending! Excellent job professor.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Classroom Notification Broadcast & Feed */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4 text-xs">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <h3 className="font-mono font-bold text-white uppercase tracking-wider">Course alerts broadcaster</h3>
                  </div>

                  <form onSubmit={handleBroadcastAlert} className="space-y-3.5">
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Dispatch instant notifications, course update flags, or micro syllabus alerts directly to enrolled classrooms.
                    </p>
                    <textarea
                      value={alertText}
                      onChange={(e) => setAlertText(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-20 font-sans"
                      placeholder="e.g. Please review the Quantum Waveproof matrix ahead of Sunday's arena duel..."
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer font-mono"
                    >
                      Broadcast High Alert
                    </button>
                  </form>
                </div>

                {/* Simulated Activity Stream */}
                <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-3.5 text-xs">
                  <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-900 pb-2">Active Classroom Stream</h4>
                  <div className="space-y-3">
                    {[
                      { user: "Priya Patel", action: "Completed backpropagation assignment", time: "10 mins ago", color: "text-emerald-400" },
                      { user: "Aarav Sharma", action: "Submitted a doubt query in CS theory", time: "1 hour ago", color: "text-blue-400" },
                      { user: "Jessica Chen", action: "Achieved Quantum Superposition badge", time: "2 hours ago", color: "text-purple-400" }
                    ].map((act, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2.5 leading-relaxed text-[11px]">
                        <div>
                          <span className="font-semibold text-slate-200">{act.user}</span>
                          <span className="text-slate-400 text-[10px] block font-sans">{act.action}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== B. CONTENT UPLOADER TAB ==================== */}
        {activeTab === "uploader" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="lg:col-span-2 space-y-6">
              
              {/* Upload Course Section */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <BookOpen className="w-5 h-5 text-[#7C5CFF]" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Publish New Syllabus Course</h3>
                </div>

                <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Course Title Name:</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="e.g. Advanced Neural Topography"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Core Subject:</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-slate-400 font-mono">Pedagogical Description Details:</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-16"
                      placeholder="Unlock core mathematical foundations behind gradient limits and vector maps."
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Chapters / Lectures (comma separated):</label>
                    <input
                      type="text"
                      value={newModules}
                      onChange={(e) => setNewModules(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="Graph Vectors, Jacobian Bounds, Loss Minimization"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Estimated Course Duration:</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="6 hours"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono transition-all border border-blue-500/20 shadow-lg cursor-pointer"
                    >
                      Publish Course Syllabus
                    </button>
                  </div>
                </form>
              </div>

              {/* Published Course Syllabus Inspector */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-900 pb-2">Published Curriculum Inventory</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {courses.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-mono text-blue-400 font-bold uppercase">
                          {c.subject}
                        </span>
                        <h4 className="font-semibold text-slate-200 text-xs">{c.title}</h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {c.modules.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#050816] border border-slate-950 text-[9px] text-slate-400 font-mono">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{c.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar with Video & PDF Upload Forms */}
            <div className="space-y-6">
              
              {/* Upload Video Lecture Component */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Video className="w-4 h-4 text-[#7C5CFF]" />
                  <h3 className="font-mono font-bold text-white uppercase tracking-wider">Publish Video Lecture</h3>
                </div>

                <form onSubmit={handleUploadVideoSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Choose Course Catalog:</label>
                    <select
                      value={videoCourseId}
                      onChange={(e) => setVideoCourseId(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Video Title:</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="e.g. Hilbert Spaces & Multi-dimensional State"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono font-bold">YouTube URL or Stream Link:</label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  {/* Drag & drop mock container */}
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="p-4 border border-dashed border-slate-800 rounded-lg text-center bg-slate-900/10 cursor-pointer hover:bg-slate-900/30 transition-all space-y-1.5"
                  >
                    <input 
                      type="file" 
                      ref={videoInputRef} 
                      className="hidden" 
                      accept="video/*" 
                      onChange={handleVideoFileChange} 
                    />
                    <Video className="w-6 h-6 text-slate-600 mx-auto" />
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {videoFile ? `File: ${videoFile.name}` : "Or select mock physical MP4 file"}
                    </p>
                  </div>

                  {videoProgress !== null && (
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] text-slate-500">
                        <span>Uploading Lecture</span>
                        <span>{videoProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#050816] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#7C5CFF] hover:bg-[#684be2] text-white rounded-xl font-bold font-mono transition-all cursor-pointer"
                  >
                    Deploy Video Node
                  </button>
                </form>
              </div>

              {/* Upload PDF Lecture Component */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <FileText className="w-4 h-4 text-[#7C5CFF]" />
                  <h3 className="font-mono font-bold text-white uppercase tracking-wider">Publish Reference PDF</h3>
                </div>

                <form onSubmit={handleUploadPdfSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Choose Course Catalog:</label>
                    <select
                      value={pdfCourseId}
                      onChange={(e) => setPdfCourseId(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">PDF Reference Title:</label>
                    <input
                      type="text"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                      placeholder="e.g. Backpropagation Math Foundations"
                    />
                  </div>

                  {/* Drag & drop PDF uploader */}
                  <div 
                    onClick={() => pdfInputRef.current?.click()}
                    className="p-4.5 border border-dashed border-slate-800 rounded-lg text-center bg-slate-900/10 cursor-pointer hover:bg-slate-900/30 transition-all space-y-1.5"
                  >
                    <input 
                      type="file" 
                      ref={pdfInputRef} 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={handlePdfFileChange} 
                    />
                    <FileText className="w-6 h-6 text-slate-600 mx-auto" />
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {pdfFile ? `File: ${pdfFile.name}` : "Click to select reference PDF file"}
                    </p>
                  </div>

                  {pdfProgress !== null && (
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] text-slate-500">
                        <span>Uploading PDF</span>
                        <span>{pdfProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#050816] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pdfProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold font-mono transition-all cursor-pointer"
                  >
                    Deploy Reference Material
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ==================== C. ASSIGNMENTS & QUESTION BANK TAB ==================== */}
        {activeTab === "assignments" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Deploy Homework Form */}
            <div className="lg:col-span-1 p-5 rounded-2xl glass-panel border border-[#7C5CFF]/20 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <ClipboardCheck className="w-5 h-5 text-[#7C5CFF]" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Deploy Micro-Homework</h3>
              </div>

              <form onSubmit={handleDeployAssignment} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Course Syllabus Category:</label>
                  <select
                    value={assignCourse}
                    onChange={(e) => setAssignCourse(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 outline-none font-sans"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Homework Topic Name:</label>
                  <input
                    type="text"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none font-sans"
                    placeholder="e.g. Eigenvalues of Quantum Operators"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono font-bold">Proctored AI Question Text:</label>
                  <textarea
                    value={assignQuestion}
                    onChange={(e) => setAssignQuestion(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none h-16 font-sans"
                    placeholder="In Hilbert Space matrices, how is the trace computed?"
                    required
                  />
                </div>

                {/* Multiple choice options */}
                <div className="space-y-2">
                  <label className="text-slate-400 font-mono block">Provide Hypothesis Options (A-D):</label>
                  <input
                    type="text"
                    value={assignOptionA}
                    onChange={(e) => setAssignOptionA(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-sans"
                    placeholder="Option A (Correct)"
                    required
                  />
                  <input
                    type="text"
                    value={assignOptionB}
                    onChange={(e) => setAssignOptionB(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-sans"
                    placeholder="Option B"
                    required
                  />
                  <input
                    type="text"
                    value={assignOptionC}
                    onChange={(e) => setAssignOptionC(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-sans"
                    placeholder="Option C"
                  />
                  <input
                    type="text"
                    value={assignOptionD}
                    onChange={(e) => setAssignOptionD(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-sans"
                    placeholder="Option D"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Correct Index:</label>
                    <select
                      value={assignCorrectIdx}
                      onChange={(e) => setAssignCorrectIdx(parseInt(e.target.value))}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Syllabus Deadline:</label>
                    <input
                      type="text"
                      value={assignDeadline}
                      onChange={(e) => setAssignDeadline(e.target.value)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">XP Award:</label>
                    <input
                      type="number"
                      value={assignXp}
                      onChange={(e) => setAssignXp(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[9px] uppercase font-bold">Coins Award:</label>
                    <input
                      type="number"
                      value={assignCoins}
                      onChange={(e) => setAssignCoins(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-bold font-mono transition-all cursor-pointer"
                >
                  Deploy Dynamic Homework
                </button>
              </form>
            </div>

            {/* Question Bank Manager */}
            <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Nexora Proctored Question Bank</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{qbQuestions.length} Active Items</span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={qbSearch}
                    onChange={(e) => setQbSearch(e.target.value)}
                    className="w-full p-2 pl-8.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none font-mono text-xs"
                    placeholder="Search quantum equations..."
                  />
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                </div>

                <select
                  value={qbSubject}
                  onChange={(e) => setQbSubject(e.target.value)}
                  className="p-2 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                >
                  <option value="All">All Subjects</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              {/* Add New Question to Bank Form */}
              <form onSubmit={handleAddQuestionToBank} className="p-3.5 rounded-xl bg-slate-900/10 border border-slate-900 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono">Insert Question Statement:</label>
                  <input
                    type="text"
                    value={newQbQuestion}
                    onChange={(e) => setNewQbQuestion(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    placeholder="e.g. State thermodynamic entropy logarithmic formulation"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono">Correct Hypothesis Answer:</label>
                  <input
                    type="text"
                    value={newQbAnswer}
                    onChange={(e) => setNewQbAnswer(e.target.value)}
                    className="w-full p-2 rounded bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    placeholder="S = k * ln(W)"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold font-mono transition-all cursor-pointer"
                  >
                    Add to Bank
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono">Category:</label>
                    <select
                      value={newQbSubject}
                      onChange={(e) => setNewQbSubject(e.target.value)}
                      className="w-full p-1.5 rounded bg-[#050816] border border-slate-850 text-slate-300 text-[10px]"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono">Difficulty Node:</label>
                    <select
                      value={newQbDiff}
                      onChange={(e) => setNewQbDiff(e.target.value)}
                      className="w-full p-1.5 rounded bg-[#050816] border border-slate-850 text-slate-300 text-[10px]"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </form>

              {/* Questions List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {qbQuestions
                  .filter(q => qbSubject === "All" || q.subject === qbSubject)
                  .filter(q => q.question.toLowerCase().includes(qbSearch.toLowerCase()))
                  .map((q) => (
                    <div key={q.id} className="p-3 rounded-xl bg-[#050816]/40 border border-slate-900 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 text-[9px] font-mono uppercase font-bold">{q.subject}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                            q.difficulty === "Expert" ? "bg-purple-950 text-purple-400 border border-purple-900" :
                            q.difficulty === "Hard" ? "bg-rose-950 text-rose-400 border border-rose-900" : "bg-slate-900 text-slate-400"
                          }`}>{q.difficulty}</span>
                        </div>
                        <p className="text-slate-200 font-semibold leading-relaxed font-sans">{q.question}</p>
                        <p className="text-slate-400 text-[11px] font-mono">Answer: <span className="text-slate-300 italic">{q.answer}</span></p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">Used {q.useCount}x</span>
                        <button
                          onClick={() => handleDeleteQbQuestion(q.id)}
                          className="p-1 rounded hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          </div>
        )}

        {/* ==================== D. WEAK STUDENT DETECTION & AI SUGGESTIONS TAB ==================== */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Cognitive Weakness & Risk Detection Matrix</h3>
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                Nexora AI telemetry compares student quiz precision, proctored exam focus values, and daily study durations. Below are students flagged with cognitive risk levels.
              </p>

              <div className="border border-slate-900 rounded-xl overflow-hidden divide-y divide-slate-900">
                {atRiskStudents.map((student) => (
                  <div key={student.id} className="p-4 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Level {student.level} Achiever • Active {student.streak} Day Streak
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                          Attendance: {student.attendance}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                          Quiz Accuracy: {student.accuracy}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[9px] uppercase text-slate-500 font-mono block">Identified Struggle</span>
                        <span className="px-2 py-0.5 rounded bg-rose-950/20 text-rose-400 text-[10px] font-semibold">
                          {student.problemTopic}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase text-slate-500 font-mono block">Telemetry Risk</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.riskLevel === "High" ? "bg-rose-500/10 text-rose-400 animate-pulse" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {student.riskLevel} Risk
                        </span>
                      </div>

                      <button
                        onClick={() => handleComputeStudentAiSuggestion(student)}
                        className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/20 rounded-xl font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        AI Recovery Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Panel */}
            <div className="p-5 rounded-2xl glass-panel border border-[#7C5CFF]/20 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">AI Pedagogical Suggestions</h3>
              </div>

              {selectedAtRiskStudent ? (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
                    <span className="text-slate-500 uppercase text-[9px]">Target Student profile</span>
                    <div className="text-white font-bold">{selectedAtRiskStudent.name}</div>
                    <div className="text-slate-400">Quiz precision index: {selectedAtRiskStudent.accuracy}%</div>
                    <div className="text-slate-400">Core barrier struggle: {selectedAtRiskStudent.problemTopic}</div>
                  </div>

                  {isComputingAiSuggestion ? (
                    <div className="py-12 text-center space-y-3 font-mono text-slate-500">
                      <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                      <span>Gemini Computing Neural Remediation Plan...</span>
                    </div>
                  ) : (
                    <div className="space-y-4 font-sans leading-relaxed text-slate-300 text-[11px]">
                      <div className="p-4 bg-[#050816] rounded-xl border border-blue-500/20">
                        <span className="text-[9px] font-mono font-bold text-blue-400 block mb-2 uppercase tracking-wider">⚡ COMPUTED REVISION PATH</span>
                        <div className="whitespace-pre-line leading-relaxed">{aiSuggestionOutput}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            triggerBanner(`Recovery track dispatch sent to ${selectedAtRiskStudent.name}'s Dashboard.`);
                            setAiSuggestionOutput("");
                            setSelectedAtRiskStudent(null);
                          }}
                          className="w-full py-2 bg-[#7C5CFF] hover:bg-[#684be2] text-white font-bold font-mono rounded-xl cursor-pointer"
                        >
                          Dispatch Recovery Track
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-2 font-mono text-slate-500">
                  <HelpCircle className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>Select any student to generate custom AI intervention & recovery strategies.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== E. CLASSROOM ATTENDANCE TAB ==================== */}
        {activeTab === "attendance" && (
          <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Classroom Attendance Register</h3>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={handleExportAttendance}
                  className="px-3 py-1.5 bg-[#050816] hover:bg-slate-900 text-slate-200 border border-slate-850 rounded-xl font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export CSV Register
                </button>
              </div>
            </div>

            <p className="text-slate-400 leading-normal text-[11px]">
              Review the current semester&apos;s classroom attendance percentages. Toggling today&apos;s status will update the student&apos;s cumulative index automatically.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-900">
              <table className="w-full text-left border-collapse font-sans text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-slate-950 font-mono text-slate-500 text-[10px] uppercase border-b border-slate-900">
                    <th className="p-3.5 pl-5">Student profile</th>
                    <th className="p-3.5">Email address</th>
                    <th className="p-3.5">Attendance Percentage</th>
                    <th className="p-3.5">Today Status</th>
                    <th className="p-3.5">Telemetry log</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-slate-900/10">
                  {attendanceRecords.map((stud) => {
                    const isPresent = stud.status === "Present";
                    return (
                      <tr key={stud.id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                        <td className="p-3.5 pl-5 font-bold text-white">{stud.name}</td>
                        <td className="p-3.5 font-mono text-slate-400 text-[11px]">{stud.email}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2 font-mono">
                            <span className={`font-semibold ${stud.index < 80 ? "text-amber-500" : "text-emerald-400"}`}>{stud.index}%</span>
                            <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div className={`h-full ${stud.index < 80 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${stud.index}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            isPresent ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          }`}>
                            {stud.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-400 font-mono">{stud.lastLogged}</td>
                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={() => handleToggleAttendance(stud.id)}
                            className={`px-3 py-1 rounded font-mono text-[10px] transition-all cursor-pointer font-bold ${
                              isPresent 
                                ? "bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 border border-rose-900/20" 
                                : "bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 border border-emerald-900/20"
                            }`}
                          >
                            Mark {isPresent ? "Absent" : "Present"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== F. ARENA COMPETITION & CERTIFICATES TAB ==================== */}
        {activeTab === "competition" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Sunday Arena Builder */}
            <div className="lg:col-span-1 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Sunday Arena scheduler</h3>
              </div>

              <form onSubmit={handleScheduleArena} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Arena Duel Title:</label>
                  <input
                    type="text"
                    value={arenaName}
                    onChange={(e) => setArenaName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    placeholder="e.g. Backpropagation Speedrun #14"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono font-bold">Start Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={arenaDate}
                    onChange={(e) => setArenaDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono">Reward XP / Medal Prize Pool:</label>
                  <input
                    type="text"
                    value={arenaPrize}
                    onChange={(e) => setArenaPrize(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-slate-200 outline-none"
                    placeholder="400 XP, 50 Coins, Gold Emblem Frame"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold font-mono cursor-pointer"
                >
                  Publish Sunday Arena Duel
                </button>
              </form>
            </div>

            {/* Competitions and Certificate approvals cabinet */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Active Arenas */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-900 pb-2">Published Arena Duels</h3>
                <div className="space-y-3">
                  {competitions.map((comp) => (
                    <div key={comp.id} className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-200">{comp.name}</h4>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                          <span>Starts: {comp.date}</span>
                          <span>Pool: <span className="text-amber-500">{comp.prizePool}</span></span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        comp.status === "Ongoing" ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Claim Sign-off */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Student Certificate Sign-off Closet</h3>
                </div>

                <div className="space-y-3">
                  {certificates.map((cert) => {
                    const isSigned = cert.status === "Digitally Signed";
                    return (
                      <div key={cert.id} className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200 text-xs">{cert.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Claimant student: <span className="text-white font-bold">{cert.studentName}</span> • Evaluated grade: <span className="text-emerald-400">{cert.grade}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            isSigned ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {cert.status}
                          </span>
                          {!isSigned && (
                            <button
                              onClick={() => handleSignCertificate(cert.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-[10px] font-bold cursor-pointer"
                            >
                              Digitally Sign
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== G. REVENUE READY & PAYOUTS TAB ==================== */}
        {activeTab === "finance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Teacher Cumulative Payout Index</h3>
              </div>

              <div className="h-64 text-[10px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={teacherEarnings}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ background: '#111114', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="courses" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} name="Syllabus Revenue ($)" />
                    <Area type="monotone" dataKey="individual" stroke="#3b82f6" fillOpacity={0} strokeWidth={1} name="Tutoring Revenue ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { label: "Net Unlocked Earnings", value: "$4,850.00", desc: "For period July 2026", color: "text-emerald-400" },
                  { label: "Individual Micro-Tutoring", value: "$2,450.00", desc: "Direct AI question resolutions", color: "text-blue-400" },
                  { label: "Commission Payout Factor", value: "85%", desc: "Premium educator rate tier", color: "text-slate-400" }
                ].map((fee, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">{fee.label}</span>
                    <div className={`text-lg font-bold font-mono mt-0.5 ${fee.color}`}>{fee.value}</div>
                    <span className="text-[9px] text-slate-500 font-mono block">{fee.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout portal card */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Revenue Payout Port</h3>
              </div>

              <div className="space-y-4 leading-normal text-slate-400 text-[11px] font-sans">
                <p>Transfer accumulated educational student royalties and doubt response commission directly to your designated bank account.</p>
                
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 font-mono space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Gateway:</span>
                    <span className="text-slate-300 font-semibold">Stripe Direct Connect</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination Account:</span>
                    <span className="text-slate-300 font-semibold">**** **** 1290 (Sarah)</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2 text-white font-bold text-sm">
                    <span>Available Balance:</span>
                    <span className="text-emerald-400 font-mono">$4,850.00</span>
                  </div>
                </div>

                {payoutRequested ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-mono text-center text-[10px]">
                    ✓ Payout Request dispatched! Transfer processing in Stripe escrow (24-48 hours).
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPayoutRequested(true);
                      triggerBanner("Payout request compiled! Checking security node compliance...");
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono transition-all cursor-pointer shadow-lg shadow-blue-600/15"
                  >
                    Initiate Transfer gateway
                  </button>
                )}

                <div className="flex items-center gap-1.5 justify-center text-[9px] text-slate-500 font-mono">
                  <Lock className="w-3 h-3 text-slate-600" />
                  <span>Encrypted security handshake active</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== H. SECURE EXAM REVIEWS & ANALYTICS TAB ==================== */}
        {activeTab === "exams" && (
          <div className="space-y-6 text-xs">
            
            {/* 1. KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Classroom Avg Integrity", value: "91.25%", desc: "Proctored sandbox index", color: "text-emerald-400", icon: Shield },
                { label: "Classroom Avg Score", value: "82.5%", desc: "Across all active sessions", color: "text-[#00E5FF]", icon: GraduationCap },
                { label: "Total Proctored Exams", value: classroomExams.length, desc: "Attempted sessions", color: "text-blue-400", icon: Layers },
                { label: "Flagged Policy Breaches", value: classroomExams.filter(e => e.status === "Flagged").length, desc: "Pending disciplinary review", color: "text-rose-400", icon: AlertTriangle }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{stat.label}</span>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">{stat.value}</div>
                    <p className="text-[10px] text-slate-400 font-mono">{stat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* 2. Interactive Filters */}
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3.5 items-center">
                <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Filters Desk:</span>
                
                {/* Filter by Student */}
                <select
                  value={examFilterStudent}
                  onChange={(e) => setExamFilterStudent(e.target.value)}
                  className="p-2 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 font-mono text-[10px]"
                >
                  <option value="All">All Students</option>
                  <option value="Aarav Sharma">Aarav Sharma</option>
                  <option value="Priya Patel">Priya Patel</option>
                  <option value="Tariq Ali">Tariq Ali</option>
                  <option value="Emily Watson">Emily Watson</option>
                </select>

                {/* Filter by Topic */}
                <select
                  value={examFilterTopic}
                  onChange={(e) => setExamFilterTopic(e.target.value)}
                  className="p-2 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 font-mono text-[10px]"
                >
                  <option value="All">All Topics</option>
                  <option value="Astrophysics & Deep Networks Final">Astrophysics</option>
                  <option value="Quantum Wave Mechanics Final">Quantum Physics</option>
                </select>

                {/* Filter by Status */}
                <select
                  value={examFilterStatus}
                  onChange={(e) => setExamFilterStatus(e.target.value)}
                  className="p-2 rounded-lg bg-[#050816] border border-slate-850 text-slate-300 font-mono text-[10px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>

              <div className="text-slate-500 font-mono text-[10px]">
                Showing {classroomExams.filter(e => {
                  if (examFilterStudent !== "All" && e.studentName !== examFilterStudent) return false;
                  if (examFilterTopic !== "All" && e.examName !== examFilterTopic) return false;
                  if (examFilterStatus !== "All" && e.status !== examFilterStatus) return false;
                  return true;
                }).length} sessions
              </div>
            </div>

            {/* 3. Main Review Arena */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Exam Attempts List */}
              <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Telemetry Attempt Registries</h3>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {classroomExams.filter(e => {
                    if (examFilterStudent !== "All" && e.studentName !== examFilterStudent) return false;
                    if (examFilterTopic !== "All" && e.examName !== examFilterTopic) return false;
                    if (examFilterStatus !== "All" && e.status !== examFilterStatus) return false;
                    return true;
                  }).map((exam) => {
                    const isSelected = selectedExamId === exam.id;
                    const integrityColor = exam.integrity > 85 
                      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" 
                      : exam.integrity > 65 
                        ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/5" 
                        : "text-rose-400 border-rose-500/20 bg-rose-500/5";

                    const statusBadge = exam.status === "Approved"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : exam.status === "Flagged"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20";

                    return (
                      <div
                        key={exam.id}
                        onClick={() => setSelectedExamId(exam.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isSelected 
                            ? "bg-indigo-500/10 border-indigo-500/40 text-white" 
                            : "bg-[#111114]/30 border-slate-900 text-slate-300 hover:border-slate-800"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{exam.studentName}</span>
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${statusBadge}`}>
                              {exam.status}
                            </span>
                          </div>
                          <p className="text-slate-400 font-mono text-[10px]">{exam.examName}</p>
                          <span className="text-[9px] text-slate-500 font-mono">{exam.date}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 font-mono block uppercase">Exam Score</span>
                            <span className="font-mono font-bold text-slate-200 text-md">{exam.score}%</span>
                          </div>

                          <div className={`p-2 px-3 rounded-lg border text-center font-mono ${integrityColor}`}>
                            <span className="text-[8px] block uppercase opacity-80 font-bold">Integrity</span>
                            <span className="font-bold text-xs">{exam.integrity}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {classroomExams.filter(e => {
                    if (examFilterStudent !== "All" && e.studentName !== examFilterStudent) return false;
                    if (examFilterTopic !== "All" && e.examName !== examFilterTopic) return false;
                    if (examFilterStatus !== "All" && e.status !== examFilterStatus) return false;
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-mono">
                      No matching exam proctored records cataloged.
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Exam Review Drawer */}
              <div className="space-y-6">
                {(() => {
                  const selectedExam = classroomExams.find(e => e.id === selectedExamId);
                  if (!selectedExam) {
                    return (
                      <div className="p-6 rounded-2xl glass-panel border border-slate-850 text-center text-slate-500 font-mono py-16">
                        Select a proctored record on the left to initiate telemetry reviews.
                      </div>
                    );
                  }

                  const selectedStatusBadge = selectedExam.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : selectedExam.status === "Flagged"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20";

                  return (
                    <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                      <div className="border-b border-slate-900 pb-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white font-mono">{selectedExam.studentName}</h4>
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${selectedStatusBadge}`}>
                            {selectedExam.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{selectedExam.examName}</p>
                      </div>

                      {/* Score metrics */}
                      <div className="grid grid-cols-2 gap-3 font-mono text-center">
                        <div className="p-3 bg-[#0a0f26]/40 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 block uppercase">Test Grade</span>
                          <span className="text-md font-bold text-[#00E5FF]">{selectedExam.score}%</span>
                        </div>
                        <div className="p-3 bg-[#0a0f26]/40 border border-slate-900 rounded-xl">
                          <span className="text-[8px] text-slate-500 block uppercase">Integrity Factor</span>
                          <span className={`text-md font-bold ${
                            selectedExam.integrity > 85 ? "text-emerald-400" : selectedExam.integrity > 65 ? "text-yellow-400" : "text-rose-400"
                          }`}>{selectedExam.integrity}%</span>
                        </div>
                      </div>

                      {/* Infractions Timeline Terminal */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Supervisor Logs:</span>
                        <div className="p-3 rounded-lg bg-black/60 border border-slate-900 font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto space-y-2 text-slate-400">
                          {selectedExam.infractions && selectedExam.infractions.length > 0 ? (
                            selectedExam.infractions.map((log: string, idx: number) => {
                              const isInfraction = log.includes("intercepted") || log.includes("Exited") || log.includes("lost") || log.includes("blocked");
                              return (
                                <div key={idx} className={isInfraction ? "text-rose-400" : "text-slate-400"}>
                                  {log}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-slate-600 text-center py-6">No supervisor logs reported.</div>
                          )}
                        </div>
                      </div>

                      {/* Instructor Feedback and Decisions */}
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Pedagogical Review Feedback:</label>
                          <textarea
                            value={examFeedbackInput}
                            onChange={(e) => setExamFeedbackInput(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-850 text-xs text-slate-200 outline-none h-20 font-sans"
                            placeholder="Type diagnostic recommendations, study schedule warnings, or commendations here..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 font-mono">
                          <button
                            onClick={() => {
                              // Save state & mock DB
                              const updated = classroomExams.map(e => e.id === selectedExam.id ? { ...e, status: "Approved", feedback: examFeedbackInput } : e);
                              setClassroomExams(updated);
                              triggerBanner(`Exam attempt approved for ${selectedExam.studentName}. Grade committed!`);
                              
                              // If this was Aarav's exam, update the actual studentStats object!
                              if (selectedExam.studentName === "Aarav Sharma") {
                                const indexInAnalytics = studentStats.examAnalytics.findIndex(hist => hist.examName === selectedExam.examName && hist.date === selectedExam.date);
                                if (indexInAnalytics !== -1) {
                                  const updatedHistory = [...studentStats.examAnalytics];
                                  updatedHistory[indexInAnalytics] = {
                                    ...updatedHistory[indexInAnalytics],
                                    status: "Approved",
                                    feedback: examFeedbackInput
                                  };
                                  const updatedStats = { ...studentStats, examAnalytics: updatedHistory };
                                  setStudentStats(updatedStats);
                                  saveMockDB({ studentStats: updatedStats });
                                }
                              }
                            }}
                            className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/20 rounded-lg transition-all cursor-pointer font-bold font-mono text-center"
                          >
                            ✓ Approve Session
                          </button>

                          <button
                            onClick={() => {
                              const updated = classroomExams.map(e => e.id === selectedExam.id ? { ...e, status: "Flagged", feedback: examFeedbackInput } : e);
                              setClassroomExams(updated);
                              triggerBanner(`Disciplinary warning flag appended to ${selectedExam.studentName}'s record.`);
                              
                              // If this was Aarav's exam, update the actual studentStats object!
                              if (selectedExam.studentName === "Aarav Sharma") {
                                const indexInAnalytics = studentStats.examAnalytics.findIndex(hist => hist.examName === selectedExam.examName && hist.date === selectedExam.date);
                                if (indexInAnalytics !== -1) {
                                  const updatedHistory = [...studentStats.examAnalytics];
                                  updatedHistory[indexInAnalytics] = {
                                    ...updatedHistory[indexInAnalytics],
                                    status: "Flagged",
                                    feedback: examFeedbackInput
                                  };
                                  const updatedStats = { ...studentStats, examAnalytics: updatedHistory };
                                  setStudentStats(updatedStats);
                                  saveMockDB({ studentStats: updatedStats });
                                }
                              }
                            }}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/20 rounded-lg transition-all cursor-pointer font-bold font-mono text-center"
                          >
                            ⚠️ Flag Violation
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* 4. EXAM ANALYTICS CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Analytics Card 1: Score & Integrity Dispersion */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Integrity vs. Score Correlation</h3>
                </div>

                <div className="h-64 font-mono text-[10px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={classroomExams}>
                      <XAxis dataKey="studentName" stroke="#475569" />
                      <YAxis stroke="#475569" />
                      <Tooltip contentStyle={{ background: '#111114', borderColor: '#334155' }} />
                      <Line type="monotone" dataKey="score" stroke="#00E5FF" strokeWidth={2} name="Exam Score (%)" />
                      <Line type="monotone" dataKey="integrity" stroke="#10b981" strokeWidth={2} name="Integrity Score (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] font-mono text-slate-500 text-center leading-normal">
                  Correlation plot maps academic outcome directly alongside student telemetry focus percentage. High convergence shows pristine compliance.
                </p>
              </div>

              {/* Analytics Card 2: Violation Frequencies */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-850 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <BarChart2 className="w-4 h-4 text-[#7C5CFF]" />
                  <h3 className="font-mono text-sm font-semibold text-white uppercase tracking-wider">Telemetry Violations Frequency</h3>
                </div>

                <div className="h-64 font-mono text-[10px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { violation: "Tab Switch", count: 14, fill: "#f43f5e" },
                      { violation: "Clipboard Copy", count: 6, fill: "#ef4444" },
                      { violation: "Context Menu", count: 5, fill: "#f59e0b" },
                      { violation: "Fullscreen Exit", count: 4, fill: "#ec4899" }
                    ]}>
                      <XAxis dataKey="violation" stroke="#475569" />
                      <YAxis stroke="#475569" />
                      <Tooltip contentStyle={{ background: '#111114', borderColor: '#334155' }} />
                      <Bar dataKey="count" name="Intercepted Counts" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] font-mono text-slate-500 text-center leading-normal">
                  Frequency count shows which copy protection hooks and detection mechanisms were triggered most often.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
