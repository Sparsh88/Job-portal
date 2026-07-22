# 🎨 HireHub-AI Frontend Application

An independent React 19 Single Page Application for **HireHub-AI** built with Vite, TypeScript, Tailwind CSS, and Axios.

---

## 🛠️ Tech Stack & Features

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Dark Mode & Glassmorphism UI Design Tokens
- **Icons**: Lucide React Icons
- **HTTP Client**: Axios with JWT Token & Auto Refresh Interceptors
- **Features**:
  - Live Job Search & Multi-criteria Filtering
  - AI Resume Matcher & Skill Gap Visualizer
  - AI Mock Technical Interview Simulator
  - Role-based Candidate, Recruiter & Admin Dashboards
  - Razorpay Payment Gateway Modal Simulator
  - 1-Click Demo Login Shortcuts for candidates, recruiters, and admins

---

## 📂 Folder Structure

```text
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/      # Reusable UI (Navbar, Footer, JobCard, AIMatchBadge, Modal)
│   ├── context/         # AuthContext state provider
│   ├── pages/           # Home, Jobs, JobDetails, Candidate, Recruiter, Admin, AI Scorer, Pricing, Auth
│   ├── services/        # Axios API client setup & interceptors
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Router configuration
│   ├── index.css        # Tailwind directives & glassmorphism classes
│   └── main.tsx         # Entry point
├── .env.example         # VITE_API_URL template
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json          # Deployment rewrite rules for Vercel
└── vite.config.ts
```

---

## 🔑 Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

This repository is pre-configured with `vercel.json` for Vercel deployment:

1. Import your project into [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set Environment Variable: `VITE_API_URL` pointing to your deployed Render backend API URL (e.g., `https://hirehub-backend-api.onrender.com/api`).
4. Click **Deploy**!
