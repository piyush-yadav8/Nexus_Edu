export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructor: string;
  modules: string[];
  duration: string;
  enrolledCount: number;
}

export interface Doubt {
  id: string;
  studentName: string;
  subject: string;
  query: string;
  status: "pending" | "resolved";
  answer?: string;
  createdAt: string;
}

export interface StudentStats {
  name: string;
  email: string;
  xp: number;
  coins: number;
  streak: number;
  level: number;
  badges: string[];
  achievements: string[];
  integrityScore: number;
  subjectPerformance: { [key: string]: number };
  quizAccuracy: number;
  weeklyGrowth: number;
  studyTimeHistory: { day: string; minutes: number }[];
  examAnalytics: { examName: string; score: number; date: string; integrity: number; infractions?: string[]; feedback?: string; status?: "Approved" | "Flagged" | "Pending Review" }[];
}

export interface PointShopItem {
  id: string;
  name: string;
  cost: number;
  type: "book" | "bag" | "notes" | "avatar" | "theme" | "test" | "badge" | "coupon";
  description: string;
  iconName: string;
  unlocked: boolean;
  code?: string; // For coupons
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  xpReward: number;
  coinsReward: number;
  status: "Pending" | "Completed";
  questionText: string;
  options: string[];
  correctIndex: number;
}

export interface CompetitionParticipant {
  rank: number;
  name: string;
  xpEarned: number;
  coinsEarned: number;
  avatarSeed: string;
}

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Neural Networks & AI",
    description: "Learn the foundational concepts of artificial intelligence, basic neural networks, and how modern generative AI architectures process information.",
    subject: "Computer Science",
    instructor: "Prof. Sarah Jenkins",
    modules: [
      "Welcome & Course Overview",
      "Perceptrons & The Multi-Layer Perceptron (MLP)",
      "Backpropagation & Activation Functions",
      "Hands-on: Training Your First Classifier"
    ],
    duration: "4 hours",
    enrolledCount: 342,
  },
  {
    id: "course-2",
    title: "Advanced Calculus: Limits, Derivatives & Integrals",
    description: "Master the fundamental concepts of calculus, exploring limit properties, derivative formulations, integration techniques, and spatial applications.",
    subject: "Mathematics",
    instructor: "Dr. Alistair Vance",
    modules: [
      "Limits & Continuity Definitions",
      "The Product and Quotient Derivative Rules",
      "Fundamental Theorem of Calculus",
      "Volume of Solids of Revolution"
    ],
    duration: "6 hours",
    enrolledCount: 219,
  },
  {
    id: "course-3",
    title: "Quantum Physics & Wave Mechanics",
    description: "An elegant introduction to wave-particle duality, the Schrodinger equation, quantum superposition, and the principles governing atomic structures.",
    subject: "Physics",
    instructor: "Dr. Elena Rostova",
    modules: [
      "The Photoelectric Effect & Blackbody Radiation",
      "Wavefunctions & Probability Densities",
      "Infinite Square Wells",
      "Quantum Tunneling and Solid State Devices"
    ],
    duration: "8 hours",
    enrolledCount: 154,
  }
];

export const INITIAL_DOUBTS: Doubt[] = [
  {
    id: "doubt-1",
    studentName: "Aarav Sharma",
    subject: "Mathematics",
    query: "How do we derive the integration by parts formula from the product rule of derivatives? I keep getting the signs mixed up.",
    status: "pending",
    createdAt: "2026-07-18T14:30:00-07:00"
  },
  {
    id: "doubt-2",
    studentName: "Aarav Sharma",
    subject: "Physics",
    query: "Why is the wavefunction in quantum mechanics complex-valued rather than purely real? Does the imaginary part represent a physical state?",
    status: "resolved",
    answer: "Excellent question! The wavefunction itself is complex-valued because quantum mechanical phase factor shifts require complex numbers (Euler's formula: e^(iθ)) to describe periodic behaviors and quantum interference patterns mathematically. However, the observable physical quantity is the probability density, which is given by |Ψ|^2 (the wavefunction multiplied by its complex conjugate), which is always a real, non-negative number.",
    createdAt: "2026-07-17T09:15:00-07:00"
  },
  {
    id: "doubt-3",
    studentName: "Priya Patel",
    subject: "Computer Science",
    query: "In backpropagation, why does the choice of activation function (like ReLU vs Sigmoid) affect the speed of gradient descent convergence?",
    status: "pending",
    createdAt: "2026-07-18T18:45:00-07:00"
  }
];

export const INITIAL_STUDENT_STATS: StudentStats = {
  name: "Aarav Sharma",
  email: "aarav.learn@nexora.edu",
  xp: 1850, // Level 3: Achiever
  coins: 420,
  streak: 12,
  level: 3,
  badges: ["Streak Master", "Quiz Whiz", "Integrity Star"],
  achievements: ["First Quiz Cleared", "Sunday Champ Participant", "Honorable Scholar"],
  integrityScore: 98,
  subjectPerformance: {
    "Computer Science": 92,
    "Mathematics": 84,
    "Physics": 78,
    "Chemistry": 85,
  },
  quizAccuracy: 88,
  weeklyGrowth: 14,
  studyTimeHistory: [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 90 },
    { day: "Thu", minutes: 30 },
    { day: "Fri", minutes: 120 },
    { day: "Sat", minutes: 75 },
    { day: "Sun", minutes: 110 },
  ],
  examAnalytics: [
    { examName: "Midterm Calculus", score: 86, date: "2026-07-10", integrity: 100, infractions: ["[09:05:00] Secure AI supervisor connected."], status: "Approved", feedback: "Pristine attempt. Excellent job!" },
    { examName: "Quantum Mechanics Basics", score: 78, date: "2026-07-14", integrity: 85, infractions: ["[10:14:22] Attempted right-click menu access (-8% Integrity)", "[10:16:45] Ctrl+C copy command intercepted (-10% Integrity)"], status: "Pending Review" },
  ],
};

export const INITIAL_POINT_SHOP: PointShopItem[] = [
  // 1. Books
  {
    id: "shop-1",
    name: "Standard AI & Deep Learning Textbook",
    cost: 150,
    type: "book",
    description: "Full digital access to the comprehensive manual on neural weights, gradient descent, and LLMs.",
    iconName: "BookOpen",
    unlocked: false,
  },
  {
    id: "shop-b2",
    name: "Advanced Quantum Wave Mechanics Codex",
    cost: 220,
    type: "book",
    description: "Explore the Schrodinger equation, quantum entanglement, and wave-particle mechanics in detail.",
    iconName: "Book",
    unlocked: false,
  },

  // 2. Premium Tests
  {
    id: "shop-t1",
    name: "Astrophysics Mastermind Practice Mock",
    cost: 120,
    type: "test",
    description: "A high-intensity premium prep exam featuring random astrophysics and proctoring test simulations.",
    iconName: "ClipboardCheck",
    unlocked: false,
  },
  {
    id: "shop-t2",
    name: "Advanced Backpropagation Calculus Test",
    cost: 140,
    type: "test",
    description: "Test your mathematical fluency in vector Jacobian matrices and deep backpropagation proofs.",
    iconName: "GraduationCap",
    unlocked: false,
  },

  // 3. Premium Notes
  {
    id: "shop-3",
    name: "Premium Physics Formula Sheet Bundle",
    cost: 80,
    type: "notes",
    description: "Quick-reference physics cheatsheets and formula cards compiled by leading research scientists.",
    iconName: "FileSpreadsheet",
    unlocked: true,
  },
  {
    id: "shop-n2",
    name: "Linear Algebra & Gradient Descent Cheat Sheet",
    cost: 60,
    type: "notes",
    description: "Visual roadmap of matrices, eigenvalues, gradients, and optimization pathways for ML.",
    iconName: "FileText",
    unlocked: false,
  },

  // 4. Themes
  {
    id: "shop-5",
    name: "Retro Cyber Terminal Theme preset",
    cost: 250,
    type: "theme",
    description: "Equip a glowing neon amber-green hacker console style across your entire learning dashboard.",
    iconName: "Terminal",
    unlocked: false,
  },
  {
    id: "shop-th2",
    name: "Cosmic Nebula Deep Space Theme preset",
    cost: 280,
    type: "theme",
    description: "Envelop your panels in gorgeous dark interstellar purples and sparkling nebula stardust.",
    iconName: "Sparkles",
    unlocked: false,
  },

  // 5. Badges
  {
    id: "shop-bg1",
    name: "Quantum Sage Mythic Badge",
    cost: 350,
    type: "badge",
    description: "Unlock a rare mythical profile badge marking your deep quantum mechanical fluency.",
    iconName: "Award",
    unlocked: false,
  },
  {
    id: "shop-bg2",
    name: "Backpropagation Guru Gold Badge",
    cost: 300,
    type: "badge",
    description: "Enrich your student card with a radiant gold badge for high-precision neural computing.",
    iconName: "Trophy",
    unlocked: false,
  },

  // 6. Avatars
  {
    id: "shop-4",
    name: "Cosmic Nebula Student Avatar",
    cost: 200,
    type: "avatar",
    description: "A gorgeous glowing starfield frame surrounding your active study profile card.",
    iconName: "User",
    unlocked: false,
  },
  {
    id: "shop-av2",
    name: "Cyber Hunter Holographic Avatar",
    cost: 180,
    type: "avatar",
    description: "Transform your profile image into a premium holographic cybernetically modified avatar.",
    iconName: "Shield",
    unlocked: false,
  },

  // 7. Coupons
  {
    id: "shop-cp1",
    name: "50% Off Nexora Merch Store Coupon",
    cost: 100,
    type: "coupon",
    description: "Redeem for a half-off discount code on Nexora hoodies, caps, and stickers.",
    iconName: "CreditCard",
    unlocked: false,
    code: "NEXORAMERCH50"
  },
  {
    id: "shop-cp2",
    name: "Free Professional Career Mentorship Voucher",
    cost: 180,
    type: "coupon",
    description: "Get a code for a free 1-on-1 resume feedback session with an expert tech lead.",
    iconName: "Flame",
    unlocked: false,
    code: "CAREER100FREE"
  }
];

export const INITIAL_COMPETITION_LEADERBOARD: CompetitionParticipant[] = [
  { rank: 1, name: "Jessica Chen", xpEarned: 350, coinsEarned: 100, avatarSeed: "jessica" },
  { rank: 2, name: "Pranav Rao", xpEarned: 310, coinsEarned: 80, avatarSeed: "pranav" },
  { rank: 3, name: "Aarav Sharma (You)", xpEarned: 290, coinsEarned: 70, avatarSeed: "aarav" },
  { rank: 4, name: "Emily Watson", xpEarned: 270, coinsEarned: 60, avatarSeed: "emily" },
  { rank: 5, name: "Tariq Ali", xpEarned: 240, coinsEarned: 50, avatarSeed: "tariq" },
  { rank: 6, name: "Sarah Connor", xpEarned: 210, coinsEarned: 40, avatarSeed: "sarah" },
  { rank: 7, name: "Marcus Aurelius", xpEarned: 180, coinsEarned: 30, avatarSeed: "marcus" },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "assign-1", title: "Backpropagation Matrix Calculus", subject: "Computer Science", deadline: "July 24, 2026", xpReward: 50, coinsReward: 15, status: "Pending", questionText: "In gradient backpropagation, how is the weight correction calculated?", options: ["Product of downstream error gradient and input activation", "Division of error rate by activation threshold", "The exponential log of input weights", "None of the above"], correctIndex: 0 },
  { id: "assign-2", title: "Schrodinger wave normalizations", subject: "Physics", deadline: "July 26, 2026", xpReward: 60, coinsReward: 20, status: "Completed", questionText: "When normalizing a wavefunction, the absolute integral of the probability squared over all space must equal what value?", options: ["0", "Infinity", "1", "0.5"], correctIndex: 2 },
  { id: "assign-3", title: "Euler-Lagrange Equation Proof", subject: "Mathematics", deadline: "July 29, 2026", xpReward: 70, coinsReward: 25, status: "Pending", questionText: "Which principle forms the foundational basis of the Euler-Lagrange equations?", options: ["Hamilton's Principle of Least Action", "Newton's Second Law of Static Friction", "Fourier Harmonic Transformation", "Archimedes Fluid Displacement Theorem"], correctIndex: 0 }
];

export function getMockDB() {
  if (typeof window === "undefined") {
    return {
      courses: INITIAL_COURSES,
      doubts: INITIAL_DOUBTS,
      studentStats: INITIAL_STUDENT_STATS,
      pointShop: INITIAL_POINT_SHOP,
      leaderboard: INITIAL_COMPETITION_LEADERBOARD,
      assignments: INITIAL_ASSIGNMENTS,
    };
  }

  const courses = localStorage.getItem("nexora_courses")
    ? JSON.parse(localStorage.getItem("nexora_courses")!)
    : INITIAL_COURSES;

  const doubts = localStorage.getItem("nexora_doubts")
    ? JSON.parse(localStorage.getItem("nexora_doubts")!)
    : INITIAL_DOUBTS;

  const studentStats = localStorage.getItem("nexora_student_stats")
    ? JSON.parse(localStorage.getItem("nexora_student_stats")!)
    : INITIAL_STUDENT_STATS;

  const pointShop = localStorage.getItem("nexora_point_shop")
    ? JSON.parse(localStorage.getItem("nexora_point_shop")!)
    : INITIAL_POINT_SHOP;

  const leaderboard = localStorage.getItem("nexora_leaderboard")
    ? JSON.parse(localStorage.getItem("nexora_leaderboard")!)
    : INITIAL_COMPETITION_LEADERBOARD;

  const assignments = localStorage.getItem("nexora_assignments")
    ? JSON.parse(localStorage.getItem("nexora_assignments")!)
    : INITIAL_ASSIGNMENTS;

  return { courses, doubts, studentStats, pointShop, leaderboard, assignments };
}

export function saveMockDB(db: {
  courses?: Course[];
  doubts?: Doubt[];
  studentStats?: StudentStats;
  pointShop?: PointShopItem[];
  leaderboard?: CompetitionParticipant[];
  assignments?: Assignment[];
}) {
  if (typeof window === "undefined") return;

  if (db.courses) localStorage.setItem("nexora_courses", JSON.stringify(db.courses));
  if (db.doubts) localStorage.setItem("nexora_doubts", JSON.stringify(db.doubts));
  if (db.studentStats) localStorage.setItem("nexora_student_stats", JSON.stringify(db.studentStats));
  if (db.pointShop) localStorage.setItem("nexora_point_shop", JSON.stringify(db.pointShop));
  if (db.leaderboard) localStorage.setItem("nexora_leaderboard", JSON.stringify(db.leaderboard));
  if (db.assignments) localStorage.setItem("nexora_assignments", JSON.stringify(db.assignments));
}
