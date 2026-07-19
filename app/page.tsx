'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from '@/components/landing-page';
import StudentDashboard from '@/components/student-dashboard';
import TeacherDashboard from '@/components/teacher-dashboard';
import AdminDashboard from '@/components/admin-dashboard';
import SecureExam from '@/components/secure-exam';
import { LoginModal, AppHeader, RoleSimulatorPanel } from '@/components/shared-ui';
import { getMockDB, saveMockDB, Course, Doubt, StudentStats, PointShopItem, CompetitionParticipant } from '@/lib/mock-db';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [role, setRole] = useState<"student" | "teacher" | "admin" | "landing">("landing");

  // Mock Database State
  const [courses, setCourses] = useState<Course[]>(() => getMockDB().courses);
  const [doubts, setDoubts] = useState<Doubt[]>(() => getMockDB().doubts);
  const [studentStats, setStudentStats] = useState<StudentStats>(() => getMockDB().studentStats);
  const [pointShop, setPointShop] = useState<PointShopItem[]>(() => getMockDB().pointShop);
  const [leaderboard, setLeaderboard] = useState<CompetitionParticipant[]>(() => getMockDB().leaderboard);

  // Modals / Overlays
  const [loginOpen, setLoginOpen] = useState(false);
  const [examActive, setExamActive] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<string | null>(
    "Prepare for Sunday Arena #14! Top 30 students earn exclusive Nebula Avatars."
  );

  // Load database on mount to avoid SSR hydration mismatches
  useEffect(() => {
    Promise.resolve().then(() => {
      setHydrated(true);
      // Retrieve and decode simulated JWT token if present
      const token = localStorage.getItem("nexora_jwt_token");
      if (token) {
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload && payload.role) {
              setRole(payload.role);
            }
          }
        } catch (e) {
          console.error("JWT restore failed:", e);
        }
      }
    });
  }, []);

  if (!hydrated || !studentStats) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs uppercase tracking-wider">Connecting Nexora Databanks...</p>
      </div>
    );
  }

  // State Change & Persistence Hooks
  const handleUpdateStats = (updated: StudentStats) => {
    setStudentStats(updated);
    saveMockDB({ studentStats: updated });
  };

  const handleUpdatePointShop = (updated: PointShopItem[]) => {
    setPointShop(updated);
    saveMockDB({ pointShop: updated });
  };

  const handleAddDoubt = (newDoubt: Doubt) => {
    const updated = [newDoubt, ...doubts];
    setDoubts(updated);
    saveMockDB({ doubts: updated });
  };

  const handleResolveDoubt = (doubtId: string, answer: string) => {
    const updated = doubts.map(d => d.id === doubtId ? { ...d, status: "resolved" as const, answer } : d);
    setDoubts(updated);
    saveMockDB({ doubts: updated });
  };

  const handleAddCourse = (newCourse: Course) => {
    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveMockDB({ courses: updated });
  };

  const handleDeleteCourse = (courseId: string) => {
    const updated = courses.filter(c => c.id !== courseId);
    setCourses(updated);
    saveMockDB({ courses: updated });
  };

  const handleBroadcastNotification = (message: string) => {
    setGlobalNotification(message);
  };

  const handleExamComplete = (score: number, integrity: number, examName: string, infractions: string[] = []) => {
    setExamActive(false);

    // Save exam attempt
    const newAttempt = { 
      examName, 
      score, 
      date: new Date().toISOString().split("T")[0], 
      integrity, 
      infractions: infractions.length > 0 ? infractions : [`[${new Date().toLocaleTimeString()}] Secure AI supervisor completed. No critical anomalies.`], 
      status: "Pending Review" as const 
    };
    const updatedHistory = [newAttempt, ...studentStats.examAnalytics];

    // Compute achievements, XP, and Coins additions
    let xpAdded = score * 4; // 100% score = +400 XP
    let coinsAdded = score * 1.5; // 100% score = +150 Coins

    // Integrity Bonus
    if (integrity >= 95) {
      xpAdded += 100;
      coinsAdded += 50;
    }

    const updatedStats = {
      ...studentStats,
      xp: studentStats.xp + xpAdded,
      coins: studentStats.coins + coinsAdded,
      examAnalytics: updatedHistory,
      integrityScore: Math.round((studentStats.integrityScore + integrity) / 2)
    };

    // Auto level up roadmap calculation
    if (updatedStats.xp >= 3000 && updatedStats.level < 4) {
      updatedStats.level = 4;
      updatedStats.badges.push("Cognitive Expert");
    } else if (updatedStats.xp >= 5000 && updatedStats.level < 5) {
      updatedStats.level = 5;
      updatedStats.badges.push("Master Mentor");
    }

    handleUpdateStats(updatedStats);

    // Dynamic global broadcast confirmation
    setGlobalNotification(`Exam attempt logged successfully! Score: ${score}%, Integrity: ${integrity}%. Rewards compiled.`);
  };

  // Switch role and log in
  const handleLoginSuccess = (selectedRole: "student" | "teacher" | "admin") => {
    setRole(selectedRole);
  };

  const handleAddXPAndCoins = (xp: number, coins: number) => {
    const updatedStats = {
      ...studentStats,
      xp: studentStats.xp + xp,
      coins: studentStats.coins + coins
    };
    handleUpdateStats(updatedStats);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
      {/* Visual background ambient details */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none z-0" />

      {/* Primary Secure Exam Sandbox Overlay takes precedence */}
      <AnimatePresence mode="wait">
        {examActive ? (
          <motion.div
            key="exam-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col bg-slate-950 relative z-20"
          >
            <SecureExam
              onComplete={handleExamComplete}
              onCancel={() => setExamActive(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`dashboard-${role}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex-1 flex flex-col z-10"
          >
            {role === "landing" ? (
              <LandingPage
                onExplore={(r) => setRole(r)}
                onOpenLogin={() => setLoginOpen(true)}
              />
            ) : (
              <div className="flex-1 flex flex-col">
                <AppHeader
                  role={role}
                  studentStats={studentStats}
                  notificationMsg={globalNotification}
                  onSignOut={() => {
                    localStorage.removeItem("nexora_jwt_token");
                    setRole("landing");
                  }}
                  onOpenLogin={() => setLoginOpen(true)}
                />

                <main className="flex-1 pb-16">
                  {role === "student" && (
                    <StudentDashboard
                      courses={courses}
                      doubts={doubts}
                      studentStats={studentStats}
                      pointShop={pointShop}
                      leaderboard={leaderboard}
                      onAddDoubt={handleAddDoubt}
                      onUpdateStats={handleUpdateStats}
                      onUpdatePointShop={handleUpdatePointShop}
                      onLaunchExam={() => setExamActive(true)}
                      onAddXPAndCoins={handleAddXPAndCoins}
                    />
                  )}

                  {role === "teacher" && (
                    <TeacherDashboard
                      courses={courses}
                      doubts={doubts}
                      studentStats={studentStats}
                      onAddCourse={handleAddCourse}
                      onResolveDoubt={handleResolveDoubt}
                    />
                  )}

                  {role === "admin" && (
                    <AdminDashboard
                      courses={courses}
                      onDeleteCourse={handleDeleteCourse}
                      onAddCourse={handleAddCourse}
                      onBroadcastNotification={handleBroadcastNotification}
                    />
                  )}
                </main>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Developer/Evaluator Quick Switch Panel */}
      <RoleSimulatorPanel
        activeRole={role}
        onRoleChange={(r) => {
          if (r === "landing") {
            localStorage.removeItem("nexora_jwt_token");
          } else {
            try {
              const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
              const payload = btoa(JSON.stringify({ 
                email: `${r}@gmail.com`, 
                role: r, 
                name: r === "student" ? "Aarav Sharma" : r === "teacher" ? "Dr. Jenkins" : "Root Operator",
                iat: Date.now() 
              }));
              localStorage.setItem("nexora_jwt_token", `${header}.${payload}.simulated_hash`);
            } catch (err) {
              console.error("Simulator token creation failed", err);
            }
          }
          setRole(r);
          setExamActive(false);
        }}
      />

      {/* Login Credentials Dialog Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
