# HireHub AI — Intelligent Job Portal & Recruitment Platform

A full-stack hiring management platform featuring role-based workflows, automated skill-match scoring, technical mock interview evaluations, and application pipeline tracking.

---

## Live Demo & Repository

- **Frontend Application:** [https://job-portal-six-psi-20.vercel.app/](https://job-portal-six-psi-20.vercel.app/)
- **Backend REST API:** [https://job-portal-pp7n.onrender.com/api](https://job-portal-pp7n.onrender.com/api)
- **GitHub Repository:** [https://github.com/Sparsh88/Job-portal](https://github.com/Sparsh88/Job-portal)

---

## Overview

HireHub AI is a production-oriented web application designed to bridge the gap between candidates and hiring managers. It streamlines the recruitment lifecycle by providing tailored interfaces for job seekers, recruiters, and platform administrators.

Job seekers can explore curated engineering roles, calculate skill alignment against job requirements, practice with category-specific technical mock interview questions, and track application progress in real time. Recruiters can post vacancies, evaluate applicant profiles, update recruitment stages, and schedule structured interviews.

The project is architected as a decoupled client-server system, utilizing a TypeScript/React frontend powered by Vite and Tailwind CSS, coupled with an Express and Prisma ORM backend connected to a serverless Neon PostgreSQL database.

---

## Problem Statement

- **Skill Mismatch & Lack of Feedback:** Candidates often apply to listings without knowing how well their skillset matches specific job requirements or which gaps to address.
- **Fragmented Interview Preparation:** Job seekers lack integrated tools to test their domain knowledge against specific role categories before facing real interviews.
- **Recruiter Overhead:** Hiring teams face cluttered applicant tracking and struggle to filter candidates and manage hiring stages efficiently.
- **Disconnected Candidate Tracking:** Job applicants frequently face opaque application processes without clear status updates on review, shortlisting, or interview scheduling.

---

## Key Features

- **Job Discovery & Multi-Filter Search:** Filter job postings by category, location, job type (Full-Time, Remote, Internship, Contract), and experience level with debounced search queries.
- **AI Skill Match Scorer:** Compares candidate skills against job requirements to calculate compatibility percentages, list missing skills, and provide actionable resume enhancement suggestions.
- **Interactive Mock Interview:** Practice domain-specific technical interview questions with instant feedback and score evaluations.
- **Application Tracking Dashboard:** Real-time visibility into applied jobs, current status (Applied, In Review, Shortlisted, Interview Scheduled, Accepted, Rejected), and interview invites.
- **Saved Jobs & Profile Management:** Bookmark job listings for later and manage profiles with target roles, experience years, skills, and portfolio links.
- **Recruiter Job Lifecycle Management:** Create, edit, feature, activate/deactivate, and delete detailed job listings with custom skill requirements and salary ranges.
- **Applicant Review Pipeline:** Review applicant profiles, resumes, cover letters, and calculated match scores; transition applicant stages with feedback notes.
- **Interview Scheduling:** Organize video/in-person interviews with meeting links, scheduled timestamps, and post-interview notes.
- **Secure Authentication & RBAC:** Access control via JWT access/refresh token pairs, bcrypt password hashing, and role-based middleware (`JOB_SEEKER`, `RECRUITER`, `ADMIN`).

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 18, TypeScript, Vite | Single-page application with typed UI components and fast build tooling |
| Styling & UI | Tailwind CSS, Lucide React | Modern responsive design, dark/light theme, and iconography |
| State & Networking | Axios, Context API | Client state management and HTTP communication with caching |
| Backend Runtime | Node.js, Express.js, TypeScript | Typed RESTful API routing, controllers, and authentication middleware |
| Database & ORM | PostgreSQL (Neon Cloud), Prisma ORM | Relational schema, migrations, foreign key constraints, and indexing |
| Authentication | JWT, bcrypt | Stateless token authentication, refresh rotation, and password hashing |
| Deployment | Vercel (Frontend), Render (Backend) | Production hosting and automated CI/CD deployment |

---

## Architecture

```text
Client Browser (React 18 + TypeScript + Tailwind)
       │
       │ HTTPS / REST API
       ▼
Express.js API Server (Node.js + TypeScript)
  ├── Auth Middleware (JWT Verification & Role Checking)
  ├── Role Guards (JOB_SEEKER vs RECRUITER vs ADMIN)
  ├── Controllers (Auth, Jobs, Applications, Interviews, Admin)
  └── Prisma ORM Client (Connection Pooling & Relational Queries)
               │
               ▼
       PostgreSQL Database (Neon Cloud)
```

---

## Application Flow

1. **Authentication & Profile:** User registers as Job Seeker or Recruiter; sets up profile with skills, experience, and resume.
2. **Job Search:** Job seeker filters active listings by category, type, and location; views dynamic match score percentage.
3. **Application Submission:** Candidate submits job application with cover letter and custom portfolio links.
4. **Applicant Review:** Recruiter reviews candidate submissions, checks skill match breakdown, and updates application status.
5. **Interview Scheduling:** Recruiter schedules an interview; candidate receives date, time, and meeting link in their dashboard.
6. **Mock Practice:** Candidate practices with interactive category-specific technical interview questions before real interviews.

---

## Project Structure

```text
Job-portal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Models: User, Profile, Job, Application, Interview
│   │   └── seed.ts            # Initial seed script
│   ├── src/
│   │   ├── controllers/       # Auth, Job, Application, Interview, Admin controllers
│   │   ├── middleware/        # Auth, role check, and validation middleware
│   │   ├── routes/            # REST API endpoints
│   │   └── server.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/        # JobCard, FilterSidebar, Navbar, Footer, ApplicationModal
│   │   ├── pages/             # Home, Jobs, JobDetail, Applications, RecruiterDashboard, MockInterview
│   │   ├── context/           # AuthContext and JobContext
│   │   ├── types/             # TypeScript definitions
│   │   ├── App.tsx            # Route setup
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Cloud database URL (e.g. Neon Cloud) or local instance

### 1. Clone the Repository

```bash
git clone https://github.com/Sparsh88/Job-portal.git
cd Job-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="your_jwt_secret_key"
CLIENT_URL="http://localhost:5173"
```

Run Prisma migration and start server:

```bash
npx prisma db push
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## Author

**Sparsh Chauhan**  
*Computer Science & Engineering Student | Full Stack Developer*

- **Portfolio:** [portfolio-flame-rho-29.vercel.app](https://portfolio-flame-rho-29.vercel.app/)
- **GitHub:** [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn:** [linkedin.com/in/sparshchauhan08](https://linkedin.com/in/sparshchauhan08)
- **Email:** [sparshchauhan050@gmail.com](mailto:sparshchauhan050@gmail.com)
