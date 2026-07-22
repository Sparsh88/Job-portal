# 🚀 HireHub-AI Backend API

An independent, enterprise-ready Express & TypeScript REST API service for **HireHub-AI**, powered by **Prisma ORM** and **Neon PostgreSQL**.

---

## 🛠️ Tech Stack & Features

- **Runtime**: Node.js & Express.js with TypeScript
- **Database**: PostgreSQL (Neon Serverless DB) via Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with Refresh Tokens & Role-Based Access Control (`JOB_SEEKER`, `RECRUITER`, `ADMIN`)
- **Validation & Security**: Zod schemas, Helmet security headers, CORS, bcrypt password hashing
- **Services**:
  - AI Resume Matcher & Skill Gap Analysis Service
  - AI Mock Interview Question & Feedback Evaluator
  - Cloudinary File Upload Integration
  - Razorpay Payment Gateway Order & Signature Verification
  - Nodemailer Email Notification Dispatcher

---

## 📂 Folder Structure

```text
backend/
├── prisma/
│   ├── schema.prisma   # PostgreSQL Schema with relations and indexes
│   └── seed.ts         # Database seed script for test data
├── src/
│   ├── config/         # Database connection setup
│   ├── controllers/    # Route controllers (Auth, Jobs, Applications, etc.)
│   ├── middlewares/    # Auth, RBAC, and Global Error Handlers
│   ├── routes/         # Modular REST API routes
│   ├── services/       # AI Engine, Cloudinary, Razorpay, Email
│   ├── types/          # Custom TypeScript declarations
│   ├── utils/          # AppError, AsyncHandler, JWT helpers
│   ├── app.ts          # Express App configuration
│   └── server.ts       # Server entry point
├── .env.example        # Environment variables template
├── package.json
├── render.yaml         # Direct deployment blueprint for Render
└── tsconfig.json
```

---

## 🔑 Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `PORT` | Server Port (Default: `5000`) |
| `DATABASE_URL` | Neon PostgreSQL Connection String |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `CLOUDINARY_*` | Cloudinary API keys for resume upload |
| `RAZORPAY_*` | Razorpay Key ID and Key Secret |
| `SMTP_*` | Nodemailer SMTP Email settings |
| `FRONTEND_URL` | Allowed origin for CORS (e.g. `http://localhost:5173`) |

---

## 🚀 Getting Started Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client & Seed Database**:
   ```bash
   npx prisma generate
   npm run db:seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   API Server will start at `http://localhost:5000/api/health`.

---

## 📡 API Reference Overview

| Endpoint Prefix | Description | Access |
| :--- | :--- | :--- |
| `/api/auth` | Register, Login, Refresh Token, Get Current Profile | Public / Authenticated |
| `/api/users` | Profile Update, Resume Upload, Saved Jobs | Candidate / Recruiter |
| `/api/jobs` | Public Job Search, Create Job, Delete Job, AI Skill Match | Public / Recruiter / Admin |
| `/api/applications` | Apply for Job, Track Status, Applicant Pipeline | Candidate / Recruiter |
| `/api/recruiters` | Company Profile, Recruiter Dashboard Metrics | Recruiter / Admin |
| `/api/admin` | Global Platform Metrics, User Management | Admin Only |
| `/api/payments` | Razorpay Checkout Order Creation & Signature Verification | Authenticated Users |
| `/api/notifications` | Get Alerts, Mark Read | Authenticated Users |
| `/api/analytics` | Skill demand trends, hiring distribution | Public / Authenticated |
| `/api/interviews` | Schedule Interviews, AI Mock Interview Simulator | Candidate / Recruiter |

---

## 🌐 Deploying to Render

1. Connect your repository to [Render](https://render.com).
2. Create a new **Web Service** pointing to the `backend/` root directory.
3. Select **Node** runtime.
4. Set Build Command: `npm install && npm run build`
5. Set Start Command: `npm run start`
6. Add Environment Variables (`DATABASE_URL`, `JWT_ACCESS_SECRET`, etc.) in Render Dashboard.
