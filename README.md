# HireHub AI

> A full-stack AI-assisted job portal and hiring management platform featuring role-based workflows, automated skill-match scoring, and technical mock interview evaluations.

---

## 🌐 Live Demo & Repository

- **Frontend Application (Vercel):** [https://job-portal-six-psi-20.vercel.app/](https://job-portal-six-psi-20.vercel.app/)
- **Backend REST API (Render):** [https://job-portal-pp7n.onrender.com/api](https://job-portal-pp7n.onrender.com/api)
- **GitHub Repository:** [https://github.com/Sparsh88/Job-portal](https://github.com/Sparsh88/Job-portal)

---

## 📖 Overview

**HireHub AI** is a production-oriented web application designed to bridge the gap between candidates and hiring managers. It streamlines the recruitment lifecycle by providing tailored interfaces for job seekers, recruiters, and platform administrators.

Job seekers can explore curated engineering and tech roles, calculate skill alignment against job requirements, practice with category-specific technical mock interview questions, and track application progress in real time. Recruiters can post vacancies, evaluate applicant profiles, update recruitment stages, and schedule structured interviews.

The project is architected as a decoupled client-server system, utilizing a TypeScript/React frontend powered by Vite and Tailwind CSS, coupled with an Express and Prisma ORM backend connected to a serverless Neon PostgreSQL database.

---

## 🎯 Problem Statement

Traditional job boards and hiring workflows suffer from several recurring friction points:
- **Skill Mismatch & Lack of Feedback:** Candidates often apply to listings without knowing how well their skillset matches specific job requirements or which gaps to address.
- **Fragmented Interview Preparation:** Job seekers lack integrated tools to test their domain knowledge against specific role categories before facing real interviews.
- **Recruiter Overhead:** Hiring teams face cluttered applicant tracking and struggle to filter candidates and manage hiring stages efficiently.
- **Disconnected Candidate Tracking:** Job applicants frequently face opaque application processes without clear status updates on review, shortlisting, or interview scheduling.

---

## ✨ Key Features

### 👨‍💻 Candidate Features
- **Job Discovery & Multi-Filter Search:** Filter job postings by category, location, job type (Full-Time, Remote, Internship, Contract), and experience level with debounced search queries.
- **AI Skill Match Scorer:** Compares candidate skills against job requirements to calculate compatibility percentages, list missing skills, and provide actionable resume enhancement suggestions.
- **Interactive Mock Interview:** Practice domain-specific technical interview questions with instant feedback and score evaluations.
- **Application Tracking Dashboard:** Real-time visibility into applied jobs, current status (Applied, In Review, Shortlisted, Interview Scheduled, Accepted, Rejected), and interview invites.
- **Saved Jobs & Profile Management:** Bookmark job listings for later and manage profiles with target roles, experience years, skills, and portfolio links.

### 🏢 Recruiter & Admin Features
- **Job Lifecycle Management:** Create, edit, feature, activate/deactivate, and delete detailed job listings with custom skill requirements and salary ranges.
- **Applicant Review Pipeline:** Review applicant profiles, resumes, cover letters, and calculated match scores; transition applicant stages with feedback notes.
- **Interview Scheduling:** Organize video/in-person interviews with meeting links, scheduled timestamps, and post-interview notes.
- **Administrative Overview:** System-wide metrics tracking total users, active listings, submitted applications, and platform activity.

### 🛡️ Core Infrastructure & UX
- **Secure Authentication & RBAC:** Access control via JWT access/refresh token pairs, bcrypt password hashing, and role-based middleware (`JOB_SEEKER`, `RECRUITER`, `ADMIN`).
- **In-Memory Caching & Performance:** Client-side Axios cache deduplication and backend memory caching for high-traffic job searches.
- **Responsive Dark/Light Mode UI:** Fully responsive interface built with Tailwind CSS, Lucide icons, and theme persistence.

---

## 🛠️ Tech Stack

| Layer | Technology | Usage in Project |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Single-page application, typed UI components, fast build tooling |
| **Styling & UI** | Tailwind CSS, Lucide Icons | Responsive layout, dark/light theme styling, modern icon set |
| **State & Routing** | Context API, React Router v6 | Global auth and theme state management, client-side protected routing |
| **HTTP Client** | Axios | REST communication, JWT interceptors, auto token refresh, in-memory caching |
| **Backend Runtime** | Node.js, Express.js, TypeScript | Typed REST API architecture, routing, error handling, and middleware |
| **Database & ORM** | PostgreSQL (Neon), Prisma ORM | Relational data modeling, migrations, indexing, and type-safe queries |
| **Security & Auth** | JWT, bcryptjs, Helmet, CORS | Token-based stateless authentication, password hashing, and HTTP headers |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud continuous deployment for client and containerized API service |

---

## 🏗️ Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
│    React 18 + TypeScript + Vite + Tailwind CSS         │
│    (State: Context API | Network: Axios with Cache)    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST API
                           ▼
┌────────────────────────────────────────────────────────┐
│               Backend (Node.js / Express)              │
│    ├── Middleware: JWT Auth, RBAC, Helmet, CORS        │
│    ├── Controllers: Auth, Jobs, Apps, Interviews, etc. │
│    └── Services: AI Skill Matcher, Caching, Token Auth │
└──────────────────────────┬─────────────────────────────┘
                           │ Prisma ORM
                           ▼
┌────────────────────────────────────────────────────────┐
│            Database: Neon PostgreSQL Cloud             │
│   (Users, Profiles, Companies, Jobs, Applications,     │
│    Interviews, SavedJobs, Notifications, Payments)     │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flow

1. **Authentication:** User registers or logs in; backend validates credentials with bcrypt, generates JWT access/refresh tokens, and returns user role data.
2. **Profile & Job Discovery:** Job seekers update their skill profiles and browse active jobs with multi-parameter filtering and cached query results.
3. **Skill Match Scoring:** When viewing a role, the built-in skill matching engine analyzes overlapping keywords and missing competencies to display a readiness score and improvement tips.
4. **Application Submission:** Candidate submits an application with resume URL and cover letter, linking candidate data directly to the recruiter's posting.
5. **Recruiter Review:** Recruiters access their dedicated dashboard to inspect applicants, filter candidates by match scores, and update candidate progress.
6. **Interview Scheduling & Practice:** Recruiters schedule interviews with meeting links, while candidates practice with the AI technical mock interview module.

---

## 📁 Project Structure

```text
Job-portal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema and relational models
│   │   └── seed.ts                # Database seeder script with mock data
│   ├── src/
│   │   ├── config/                # Database and environment configurations
│   │   ├── controllers/           # Route handler controllers (Auth, Jobs, etc.)
│   │   ├── middlewares/           # Auth verification, RBAC, error handling
│   │   ├── routes/                # Express API route declarations
│   │   ├── services/              # AI skill matching, cache, tokens
│   │   ├── types/                 # TypeScript interfaces and request definitions
│   │   ├── app.ts                 # Express application setup
│   │   └── server.ts              # Server bootstrap and database connection
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Footer, Modals)
│   │   ├── context/               # AuthContext and ThemeContext providers
│   │   ├── pages/                 # Home, Jobs, JobDetails, Dashboards, AI Scorer
│   │   ├── services/              # Axios instance, interceptors, and caching
│   │   ├── types/                 # Frontend interfaces and data models
│   │   ├── App.tsx                # App routing with protected role gates
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── DEPLOYMENT_GUIDE.md
├── render.yaml                    # Render blueprint deployment specification
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
JWT_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database instance or Neon connection string
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Sparsh88/Job-portal.git
cd Job-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
> The backend server runs at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> The frontend development server runs at `http://localhost:5173`.

---

## 📡 Key API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new job seeker or recruiter |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT tokens |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/jobs` | Public | Search and filter active job postings |
| `GET` | `/api/jobs/:id` | Public / Auth | Get job details and automated skill compatibility |
| `POST` | `/api/jobs` | Recruiter / Admin | Create a new job listing |
| `POST` | `/api/applications` | Job Seeker | Submit job application |
| `GET` | `/api/applications/my-applications` | Job Seeker | View candidate application history |
| `PATCH` | `/api/applications/:id/status` | Recruiter / Admin | Update application recruitment status |
| `POST` | `/api/interviews` | Recruiter / Admin | Schedule an interview for an applicant |
| `GET` | `/api/admin/stats` | Admin | Get administrative dashboard platform metrics |

---

## 👨‍💻 Author

**Sparsh Chauhan**
- GitHub: [@Sparsh88](https://github.com/Sparsh88)
- LinkedIn: [sparshchauhan08](https://linkedin.com/in/sparshchauhan08)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).