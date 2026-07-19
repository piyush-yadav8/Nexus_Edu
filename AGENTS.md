# Nexora Edu — Software Engineering & Architecture Documentation

Nexora Edu is a premium, full-stack, gamified educational application powered by AI. It features proctored exam sandboxes with anti-cheat telemetry, a robust, filtered Rewards Point Shop, customized interactive roadmap generators, and a comprehensive teacher dashboard.

## 🛠️ Project Architecture

```
├── app/
│   ├── api/
│   │   └── gemini/          # Server-Side Gemini API Proxy Routes
│   ├── globals.css         # Tailwind Configuration & Aesthetic Import
│   ├── layout.tsx          # Font Optimization, Root HTML layout & Global SEO Metadata
│   └── page.tsx            # App hydration, role simulators, and primary state engines
├── components/
│   ├── landing-page.tsx    # High-converting feature showcase with demo login triggers
│   ├── student-dashboard.tsx # Student Roadmaps, Flashcards, Voice Study & Point Shop
│   ├── teacher-dashboard.tsx # Live review of proctored sandboxes, Doubt resolvers & Gradebooks
│   ├── secure-exam.tsx     # Fully sandboxed exam screen with copy protection, visibility blurred sensor
│   └── shared-ui.tsx       # Auth overlays, App headers, OTP inputs, Role simulation panels
├── lib/
│   └── mock-db.ts          # Key-Value LocalStorage-synced Database
```

---

## 🚀 Key Functional Modules

### 1. **Proctored Testing Sandbox (`components/secure-exam.tsx`)**
A highly immersive testing playground containing randomized questions and secure proctoring telemetry logs.
- **Copy Protection**: Full `select-none` styling, right-click context menu interceptors, and clipboard controls block `copy`, `cut`, and `paste` actions.
- **Tab Detection**: Active event listeners watch browser blur, visibility state, and print shortcut keys. Focus losses trigger real-time telemetry log lines with custom penalty weights.
- **Interactive Fullscreen**: Demands and locks document fullscreen, warning users or blocking access with recovery triggers if they escape.

### 2. **Teacher Review Terminal (`components/teacher-dashboard.tsx`)**
Instructors have immediate transparency into simulated proctored sessions.
- **Review Drawer**: Shows student names, final test grades, overall integrity factors, and chronological supervisor events.
- **Grading & Flagging**: Allows teachers to append pedagogical diagnostic feedback and transition session status (`Approved`, `Flagged`). Updates actual student mock-database records.
- **Analytics Charts**: Custom charts using `recharts` plot score-to-integrity correlation lines alongside infraction frequency bars.

### 3. **Points & Rewards Shop (`components/student-dashboard.tsx`)**
A cohesive Point Shop displaying digital books, formula sheets, custom themes, mythic cosmetic profile badges, and real-world coupons.
- **Category Filter Tabs**: Interactive, horizontally scrollable tabs sort reward categories instantly.
- **Theme Equippers**: Redeeming custom dashboard themes enables an automatic toggle that immediately applies neon console or cosmic space theme stylesheets across the workspace.
- **Voucher Copying**: Unlocked coupons display safe one-click promotional code copiers.

---

## 🔒 Security & Environment Configuration

- **API Security**: Any integrations with AI models must reside in server-side API endpoints (e.g., `/app/api/*`). The API secret key must always be accessed server-side via `process.env.GEMINI_API_KEY`.
- **Private Variables**: Do not prefix private, secure credentials with `NEXT_PUBLIC_` to avoid compile-time exposure to client-side browsers.
- **Suppressed Hydration Warnings**: Standard React layout nodes leverage client-side storage states; suppress mismatching hydration warnings safely.

---

## 🎨 Visual System & Aesthetic Principles

- **Primary Colors**: Dark interstellar base (`#020617`, `slate-950`) accented by glowing cyber indigo gradients, laser teal outlines, and warning rose blocks.
- **Font Pairing**: Optimized "Inter" Sans for high-density reading paired with "JetBrains Mono" code fonts for telemetry feeds, stats tables, and system alerts.
- **Purposeful Motion**: Every route transition, tab toggle, and proctor warning utilizes `motion/react` to fade-in or slide smoothly, eliminating jumpy rendering layout shifts.
