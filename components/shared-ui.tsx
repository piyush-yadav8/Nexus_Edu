'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Flame, Coins, ShieldAlert, Sparkles, Key, User, Activity, Globe, 
  RefreshCw, GraduationCap, Users, Lock, Mail, ArrowLeft, CheckCircle2, 
  Eye, EyeOff, ClipboardCheck, ArrowRight 
} from 'lucide-react';
import { StudentStats } from '@/lib/mock-db';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: "student" | "teacher" | "admin") => void;
}

type AuthMode = "login" | "signup" | "forgot" | "otp" | "verify" | "reset-password";

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">("student");
  const [targetExam, setTargetExam] = useState("UPSC Civil Services");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP State
  const [otpVal, setOtpVal] = useState<string[]>(["", "", "", ""]);
  const [otpFlow, setOtpFlow] = useState<"register" | "reset">("register");
  const [countdown, setCountdown] = useState(59);
  const [tempSignupUser, setTempSignupUser] = useState<any>(null);
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Timer for OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && (mode === "otp" || mode === "verify") && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, mode, countdown]);

  // Handle autofilling standard demo accounts
  const handleAutofill = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === "student") {
      setEmail("student@gmail.com");
      setPassword("Pass123");
    } else if (role === "teacher") {
      setEmail("teacher@gmail.com");
      setPassword("Pass123");
    } else {
      setEmail("admin@gmail.com");
      setPassword("Pass123");
    }
  };

  // Build a secure base64 simulated JWT token
  const createSimulatedJWT = (userEmail: string, userRole: "student" | "teacher" | "admin", userName: string) => {
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({ 
        email: userEmail, 
        role: userRole, 
        name: userName, 
        exp: Date.now() + 86400 * 1000 // 24 Hours
      }));
      const signature = "nexora_secure_signature_hash";
      const jwt = `${header}.${payload}.${signature}`;
      localStorage.setItem("nexora_jwt_token", jwt);
    } catch (err) {
      console.error("JWT forging failed", err);
    }
  };

  // Submit Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate credentials
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    let authenticatedRole: "student" | "teacher" | "admin" | null = null;
    let displayName = "User";

    if (cleanEmail === "student@gmail.com" && cleanPassword === "Pass123") {
      authenticatedRole = "student";
      displayName = "Aarav Sharma";
    } else if (cleanEmail === "teacher@gmail.com" && cleanPassword === "Pass123") {
      authenticatedRole = "teacher";
      displayName = "Dr. Jenkins";
    } else if (cleanEmail === "admin@gmail.com" && cleanPassword === "Pass123") {
      authenticatedRole = "admin";
      displayName = "Root Operator";
    } else if (cleanEmail === "aarav.learn@nexora.edu" && cleanPassword === "Pass123") {
      authenticatedRole = "student";
      displayName = "Aarav Sharma";
    } else if (cleanEmail === "jenkins.teach@nexora.edu" && cleanPassword === "Pass123") {
      authenticatedRole = "teacher";
      displayName = "Dr. Jenkins";
    } else if (cleanEmail === "root.admin@nexora.edu" && cleanPassword === "Pass123") {
      authenticatedRole = "admin";
      displayName = "Root Operator";
    } else {
      // Dynamic fallback for newly registered accounts
      const localUsers = localStorage.getItem("nexora_registered_users");
      const usersList = localUsers ? JSON.parse(localUsers) : [];
      const matched = usersList.find((u: any) => u.email.trim().toLowerCase() === cleanEmail && u.password === cleanPassword);
      
      if (matched) {
        authenticatedRole = matched.role;
        displayName = matched.name;
      }
    }

    if (authenticatedRole) {
      // Save JWT token
      createSimulatedJWT(cleanEmail, authenticatedRole, displayName);
      
      setSuccessMessage(`Welcome back, ${displayName}! Role: ${authenticatedRole.toUpperCase()}`);
      setTimeout(() => {
        onLoginSuccess(authenticatedRole!);
        onClose();
        // Clear forms
        setEmail("");
        setPassword("");
        setSuccessMessage(null);
      }, 900);
    } else {
      setErrorMessage("Access Denied: Invalid email address or security key. Please check standard demo presets.");
    }
  };

  // Submit Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full academic name.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Please supply a valid communication email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Security password must consist of at least 6 characters.");
      return;
    }

    // Capture temporary registration state
    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: selectedRole,
      exam: targetExam
    };

    setTempSignupUser(newUser);
    setCountdown(59);
    setMode("verify");
  };

  // Transition from Verification Info Screen to OTP entering screen
  const proceedToOTP = () => {
    setOtpFlow("register");
    setOtpVal(["", "", "", ""]);
    setMode("otp");
  };

  // Handle OTP digit box entries
  const handleOtpChange = (index: number, val: string) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otpVal];
      newOtp[index] = val;
      setOtpVal(newOtp);
      // Focus next input automatically if text is keyed
      if (val !== "" && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otpVal[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Submit OTP Validation
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const enteredCode = otpVal.join("");

    if (enteredCode !== "7829") {
      setErrorMessage("Incorrect OTP security code. Please check code or enter standard fallback '7829'.");
      return;
    }

    if (otpFlow === "register" && tempSignupUser) {
      // Save newly registered user to local lists
      const localUsers = localStorage.getItem("nexora_registered_users");
      const currentList = localUsers ? JSON.parse(localUsers) : [];
      currentList.push(tempSignupUser);
      localStorage.setItem("nexora_registered_users", JSON.stringify(currentList));

      // Forge JWT and log in immediately
      createSimulatedJWT(tempSignupUser.email, tempSignupUser.role, tempSignupUser.name);
      
      setSuccessMessage("Security Verification Cleared! Creating JWT token profile...");
      setTimeout(() => {
        onLoginSuccess(tempSignupUser.role);
        onClose();
        // Clear
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setTempSignupUser(null);
        setSuccessMessage(null);
      }, 1200);
    } else if (otpFlow === "reset") {
      // Switch to create a new password
      setMode("reset-password");
    }
  };

  // Submit Password Forgot Link request
  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email.trim().includes("@")) {
      setErrorMessage("Please specify your registered account email.");
      return;
    }

    setOtpFlow("reset");
    setOtpVal(["", "", "", ""]);
    setCountdown(59);
    setMode("otp");
  };

  // Submit Password Change
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Your new password must contain at least 6 characters.");
      return;
    }

    // Update the password in our lists if they were registered dynamically
    const localUsers = localStorage.getItem("nexora_registered_users");
    const currentList = localUsers ? JSON.parse(localUsers) : [];
    
    const matchedIdx = currentList.findIndex((u: any) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (matchedIdx !== -1) {
      currentList[matchedIdx].password = password;
      localStorage.setItem("nexora_registered_users", JSON.stringify(currentList));
    } else {
      // If reset on demo student@gmail.com, allow simulator override
      // Just simulate success
    }

    setSuccessMessage("Password credentials revised successfully! Redirecting to login...");
    setTimeout(() => {
      setMode("login");
      setPassword("");
      setSuccessMessage(null);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#111122] border border-[#7C5CFF]/20 rounded-3xl p-6 text-slate-100 shadow-2xl relative glow-violet"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-slate-500 hover:text-white transition-colors cursor-pointer text-xl font-mono leading-none"
        >
          &times;
        </button>

        {/* Dynamic header display */}
        <div className="text-center space-y-2 mb-6">
          <div className="p-3 w-fit mx-auto rounded-2xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] animate-pulse-slow">
            <Brain className="w-8 h-8" />
          </div>
          
          {mode === "login" && (
            <>
              <h3 className="text-xl font-bold font-mono">Sign In to Nexora Edu</h3>
              <p className="text-xs text-slate-400">Autofill a profile preset or log in with credentials.</p>
            </>
          )}

          {mode === "signup" && (
            <>
              <h3 className="text-xl font-bold font-mono">Join Nexora Edu</h3>
              <p className="text-xs text-slate-400">Initiate your personalized cognitive training ecosystem.</p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h3 className="text-xl font-bold font-mono">Forgot Security Key</h3>
              <p className="text-xs text-slate-400">Enter email to transmit a verification OTP sequence.</p>
            </>
          )}

          {mode === "verify" && (
            <>
              <h3 className="text-xl font-bold font-mono">Verify Communication</h3>
              <p className="text-xs text-slate-400">Security checkpoint to confirm digital inbox ownership.</p>
            </>
          )}

          {mode === "otp" && (
            <>
              <h3 className="text-xl font-bold font-mono">OTP Verification</h3>
              <p className="text-xs text-slate-400">Input security code transmitted to {email}.</p>
            </>
          )}

          {mode === "reset-password" && (
            <>
              <h3 className="text-xl font-bold font-mono">Reset Password</h3>
              <p className="text-xs text-slate-400">Select a secure new credential for future authorizations.</p>
            </>
          )}
        </div>

        {/* Global Notifications Panel inside Modal */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 flex items-start gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-start gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* VIEW 1: SIGN IN FORM */}
        {mode === "login" && (
          <div>
            {/* Standard Preset Quick Autofills */}
            <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-wide">Select Demo Preset:</div>
            <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-mono">
              <button
                onClick={() => handleAutofill("student")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  email === "student@gmail.com" ? "bg-[#7C5CFF]/15 border-[#7C5CFF] text-white" : "bg-[#050816] border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#7C5CFF]" />
                <span className="font-bold text-[10px]">Student</span>
                <span className="text-[8px] text-slate-500">student@gmail</span>
              </button>
              
              <button
                onClick={() => handleAutofill("teacher")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  email === "teacher@gmail.com" ? "bg-[#00E5FF]/15 border-[#00E5FF] text-white" : "bg-[#050816] border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <Users className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-bold text-[10px]">Teacher</span>
                <span className="text-[8px] text-slate-500">teacher@gmail</span>
              </button>

              <button
                onClick={() => handleAutofill("admin")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  email === "admin@gmail.com" ? "bg-pink-500/15 border-pink-500 text-white" : "bg-[#050816] border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <Lock className="w-4 h-4 text-pink-400" />
                <span className="font-bold text-[10px]">Admin</span>
                <span className="text-[8px] text-slate-500">admin@gmail</span>
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Registered Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50 text-xs"
                  placeholder="student@gmail.com or aarav.learn@nexora.edu"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400">Security Access Key:</label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[10px] text-[#7C5CFF] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50 text-xs"
                    placeholder="Enter security key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-semibold transition-all border border-blue-400/20 shadow-lg shadow-[#7C5CFF]/15 cursor-pointer flex items-center justify-center gap-1"
              >
                <ClipboardCheck className="w-4 h-4" /> Secure Sign In
              </button>
            </form>

            <div className="mt-5 text-center text-[11px] text-slate-400 font-mono">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-[#00E5FF] font-bold hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SIGN UP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">Full Academic Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                placeholder="e.g. Aarav Sharma"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Preferred Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                placeholder="e.g. candidate@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                placeholder="••••••"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-slate-400">Role Classification:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-300 outline-none focus:border-[#7C5CFF]"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Target Core Exam:</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#050816] border border-slate-800 text-slate-300 outline-none focus:border-[#7C5CFF]"
                >
                  <option value="UPSC Civil Services">UPSC CSE</option>
                  <option value="IIT-JEE Engineering">IIT-JEE</option>
                  <option value="NEET Medical">NEET Gateway</option>
                  <option value="Physics Academics">Physics Scholars</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold transition-all hover:bg-cyan-400 mt-4 cursor-pointer"
            >
              Request Registration OTP
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full py-2 text-center text-slate-500 hover:text-slate-300 text-[10px] mt-1"
            >
              ◀ Return to Login Form
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form onSubmit={handleRequestReset} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Enter Registered Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                placeholder="name@gmail.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#684be2] text-white font-bold transition-all cursor-pointer"
            >
              Request Verification OTP
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full py-1 text-center text-slate-500 hover:text-slate-300 text-[10px]"
            >
              ◀ Cancel & Return to Login
            </button>
          </form>
        )}

        {/* VIEW 4: EMAIL VERIFICATION NOTICE */}
        {mode === "verify" && (
          <div className="text-center space-y-5 font-mono">
            <div className="p-4 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] w-fit mx-auto animate-pulse">
              <Mail className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                A secure communication channel was initiated with <span className="text-[#00E5FF] font-bold">{email}</span>. We have successfully transmitted an encrypted verification sequence.
              </p>
              <p className="text-[10px] text-slate-500">
                Please check your simulated inbox or spam folders. Codes expire in 10 minutes.
              </p>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={proceedToOTP}
                className="w-full py-2.5 rounded-xl bg-[#7C5CFF] text-white font-bold hover:bg-[#684be2] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                Proceed to Enter OTP <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMode("signup")}
                className="w-full py-1.5 text-slate-500 hover:text-slate-300 text-[10px] cursor-pointer"
              >
                ◀ Change Email Address
              </button>
            </div>
          </div>
        )}

        {/* VIEW 5: SECURITY OTP VERIFICATION INPUT */}
        {mode === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-5 font-mono">
            <div className="flex justify-center gap-3 py-2">
              {otpVal.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el as HTMLInputElement; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#050816] border border-slate-800 text-[#00E5FF] outline-none focus:border-[#00E5FF]"
                />
              ))}
            </div>

            <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-center space-y-1">
              <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wide">Preview Authorization Key:</div>
              <div className="text-xs text-yellow-400 font-bold tracking-widest">7 8 2 9</div>
              <div className="text-[9px] text-slate-500">Input this simulated code above to authorize security check.</div>
            </div>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-between px-2">
              <span>Security Channel: Secure SHA-256</span>
              <span>
                {countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { setCountdown(59); }}
                    className="text-[#00E5FF] hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </span>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setMode(otpFlow === "register" ? "signup" : "forgot")}
                className="py-2.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-850 hover:bg-slate-850 transition-colors cursor-pointer text-center"
              >
                ◀ Go Back
              </button>
              
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-extrabold hover:bg-cyan-400 transition-colors cursor-pointer text-center"
              >
                Confirm OTP
              </button>
            </div>
          </form>
        )}

        {/* VIEW 6: RESET NEW PASSWORD */}
        {mode === "reset-password" && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Establish New Password Key:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#050816] border border-slate-800 text-slate-200 outline-none focus:border-[#7C5CFF]/50"
                placeholder="Enter new password (min 6 chars)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold transition-all hover:bg-cyan-400"
            >
              Update Password & Return to Sign In
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

interface AppHeaderProps {
  role: "student" | "teacher" | "admin" | "landing";
  studentStats: StudentStats;
  notificationMsg?: string | null;
  onSignOut: () => void;
  onOpenLogin: () => void;
}

export function AppHeader({ role, studentStats, notificationMsg, onSignOut, onOpenLogin }: AppHeaderProps) {
  return (
    <header className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-900/60 z-30">
      
      {/* Platform Branding */}
      <div className="flex items-center gap-3">
        <div className="p-2 w-fit rounded-xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 glow-violet">
          <Brain className="w-5.5 h-5.5 text-[#7C5CFF]" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-mono">
            NEXORA<span className="text-[#7C5CFF] font-sans">_EDU</span>
          </span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 text-[#7C5CFF] uppercase tracking-wider">
            {role}
          </span>
        </div>
      </div>

      {/* Dynamic Notification Ticker */}
      {notificationMsg && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C5CFF]/5 border border-[#7C5CFF]/20 text-[11px] font-mono text-[#7C5CFF] animate-pulse-slow">
          <ShieldAlert className="w-3.5 h-3.5 text-[#7C5CFF]" />
          <span>BROADCAST: {notificationMsg}</span>
        </div>
      )}

      {/* Profile HUD metrics */}
      <div className="flex items-center gap-6 text-xs">
        {role === "student" && (
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5" title="Daily study streak">
              <Flame className="w-4.5 h-4.5 text-orange-500" />
              <span className="font-bold text-white">{studentStats.streak} Days</span>
            </div>
            <div className="flex items-center gap-1.5" title="Roadmap experience points">
              <Sparkles className="w-4.5 h-4.5 text-[#7C5CFF]" />
              <span className="font-bold text-white">{studentStats.xp} XP</span>
            </div>
            <div className="flex items-center gap-1.5" title="Point Shop coins">
              <Coins className="w-4.5 h-4.5 text-yellow-400" />
              <span className="font-bold text-white">{studentStats.coins} Coins</span>
            </div>
          </div>
        )}

        {role !== "landing" ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:block">UTC: 22:38</span>
            <button
              onClick={onSignOut}
              className="px-3.5 py-1.5 rounded bg-[#111122] border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#684be2] transition-all font-medium border border-blue-400/20 glow-violet"
          >
            Enter App
          </button>
        )}
      </div>
    </header>
  );
}

interface RoleSimulatorPanelProps {
  activeRole: "student" | "teacher" | "admin" | "landing";
  onRoleChange: (newRole: "student" | "teacher" | "admin" | "landing") => void;
}

export function RoleSimulatorPanel({ activeRole, onRoleChange }: RoleSimulatorPanelProps) {
  const [minimized, setMinimized] = useState(false);

  const rolesConfig = [
    {
      id: "student",
      label: "Student Hub",
      user: "Aarav Sharma",
      detail: "UPSC CSE Air-14",
      icon: GraduationCap,
      color: "#7C5CFF",
      glowClass: "shadow-[#7C5CFF]/10 hover:border-[#7C5CFF]/40",
      activeBorder: "border-[#7C5CFF]/60 bg-[#7C5CFF]/5 text-white",
      badge: "LVL 12"
    },
    {
      id: "teacher",
      label: "Educator Terminal",
      user: "Dr. R. Jenkins",
      detail: "Quantum Mechanics",
      icon: Users,
      color: "#00E5FF",
      glowClass: "shadow-[#00E5FF]/10 hover:border-[#00E5FF]/40",
      activeBorder: "border-[#00E5FF]/60 bg-[#00E5FF]/5 text-white",
      badge: "SENIOR"
    },
    {
      id: "admin",
      label: "SysAdmin Console",
      user: "Root Operator",
      detail: "System Integrity",
      icon: Lock,
      color: "#10B981",
      glowClass: "shadow-[#10B981]/10 hover:border-[#10B981]/40",
      activeBorder: "border-[#10B981]/60 bg-[#10B981]/5 text-white",
      badge: "ROOT"
    }
  ] as const;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-slate-950/90 border border-slate-800 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className="w-4.5 h-4.5 text-[#00E5FF] animate-spin-slow" />
        <span className="text-[9px] font-mono font-bold tracking-widest text-[#00E5FF] pr-1">OPEN CONTROLLER</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 bg-slate-950/95 backdrop-blur-2xl border border-slate-800/80 p-4 rounded-2xl shadow-3xl max-w-sm w-[330px] space-y-3.5 glow-blue">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#00E5FF]">ENV_WORKSPACE_SIM</span>
        </div>
        <button 
          onClick={() => setMinimized(true)}
          className="text-[9px] font-mono text-slate-500 hover:text-slate-300 bg-slate-900/50 px-1.5 py-0.5 rounded cursor-pointer"
        >
          Minimize
        </button>
      </div>

      {/* Role Card Grid */}
      <div className="grid grid-cols-1 gap-2">
        {rolesConfig.map((item) => {
          const isActive = activeRole === item.id;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onRoleChange(item.id)}
              className={`p-2.5 rounded-xl border border-slate-900 bg-slate-950/40 cursor-pointer transition-all flex items-center justify-between group/card relative ${item.glowClass} ${isActive ? item.activeBorder : "hover:bg-slate-900/20 text-slate-400"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? "bg-white/10" : "bg-slate-900"} group-hover/card:scale-105 transition-transform`}>
                  <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 font-bold tracking-tight uppercase">{item.label}</div>
                  <div className="text-[11px] font-bold mt-0.5 text-slate-200">{item.user}</div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.2">{item.detail}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">{item.badge}</span>
                {isActive && (
                  <div className="flex items-center justify-end gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[8px] font-mono uppercase tracking-widest font-bold" style={{ color: item.color }}>ACTIVE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reset to Landing option */}
      {activeRole !== "landing" && (
        <button
          onClick={() => onRoleChange("landing")}
          className="w-full py-1.5 text-center text-[9px] font-mono font-bold tracking-widest text-slate-500 hover:text-slate-300 bg-slate-900/20 hover:bg-slate-900/40 rounded-lg border border-slate-900 transition-all cursor-pointer"
        >
          ▲ RESET TO PUBLIC LANDING PAGE
        </button>
      )}
    </div>
  );
}
