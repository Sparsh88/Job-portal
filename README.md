# 💼 HireHub AI - AI-Powered Job & Career Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-000000?logo=express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/JWT-Authentication-green" />
</p>

<p align="center">
An AI-powered full-stack job portal that connects candidates and recruiters through intelligent skill matching, interview preparation, and streamlined recruitment workflows.
</p>

---

# 📖 Overview

HireHub AI is a full-stack job portal built using modern web technologies. It provides separate dashboards for candidates and recruiters, allowing users to search jobs, manage applications, conduct AI-assisted interview practice, and track recruitment progress.

The project follows a scalable client-server architecture with separate frontend and backend folders for easy deployment on **Vercel** and **Render**, while using **Neon PostgreSQL** as the cloud database.

---

# 🚀 Live Demo

### 🌐 Frontend (Vercel)

**Live Website**

https://job-portal-six-psi-20.vercel.app/

### ⚡ Backend API (Render)

**API Base URL**

https://job-portal-pp7n.onrender.com/api

---

# ✨ Features

## 👨‍💻 Candidate Features

- User Registration & Login
- Secure JWT Authentication
- Browse Engineering Jobs
- Search Jobs by Title
- Filter Jobs by Domain
- Apply for Jobs
- Application Status Tracking
- Candidate Dashboard
- Profile Management

---

## 🤖 AI Features

- AI Skill Match Score
- Missing Skill Analysis
- AI Technical Mock Interview
- Automated Interview Feedback
- Resume & Skill Evaluation

---

## 🏢 Recruiter Features

- Recruiter Dashboard
- Post New Jobs
- Edit Existing Jobs
- Delete Job Listings
- View Applicants
- Manage Application Status
- Schedule Interviews

---

## 🎨 UI/UX Features

- Fully Responsive Design
- Dark / Light Theme
- Glassmorphism UI
- Smooth Animations
- Loading Skeletons
- Modern Dashboard Layout
- Mobile Friendly Interface

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- REST API

---

## Database

- Neon PostgreSQL

---

## Deployment

- Vercel (Frontend)
- Render (Backend)

---

# 📂 Project Structure

```text
HireHub-AI
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🔑 Key Modules

### Authentication

- JWT Authentication
- Protected Routes
- Role-Based Access

### Job Management

- Create Jobs
- Update Jobs
- Delete Jobs
- Search Jobs
- Filter Jobs

### Applications

- Apply to Jobs
- Track Status
- Recruiter Review
- Interview Scheduling

### AI

- Skill Matching
- Interview Simulation
- Feedback Generation

---

# 🗄 Database

The application uses **Neon PostgreSQL** with **Prisma ORM**.

Main models include:

- Users
- Recruiters
- Jobs
- Applications
- Interviews
- Skills

---

# ⚙ Environment Variables

## Backend (.env)

```env
DATABASE_URL=your_neon_database_url

JWT_SECRET=your_jwt_secret

PORT=5000

FRONTEND_URL=http://localhost:5173

# Seeding & Security Settings (Recommended for Production)
ENABLE_AUTO_SEEDING=false           # Set to true only on first deploy to seed mock data
SEED_ADMIN_EMAIL=your_admin_email   # Custom Admin email (default: admin@hirehub.ai)
SEED_ADMIN_PASSWORD=your_secure_pwd # Custom Admin password (default: Password123!)
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 💻 Local Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/HireHub-AI.git

cd HireHub-AI
```

---

## Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🚀 Deployment

## Frontend

Deploy the **frontend** folder to **Vercel**

Framework:

```
Vite
```

Build Command

```
npm run build
```

Output Directory

```
dist
```

---

## Backend

Deploy the **backend** folder to **Render**

Build Command

```
npm install && npm run build
```

Start Command

```
npm start
```

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Job Listing
- Job Details
- Candidate Dashboard
- Recruiter Dashboard
- AI Skill Matcher
- AI Mock Interview
- Dark Mode

---

# 🎯 Future Improvements

- Resume Parsing
- AI Resume Builder
- Video Interview Integration
- Email Notifications
- Real-time Chat
- Company Verification
- Saved Jobs
- Job Recommendations
- Analytics Dashboard

---

# 👨‍💻 Author

**Sparsh Chauhan**

Full Stack Web Developer

LinkedIn: https://linkedin.com/in/sparshchauhan08

GitHub: https://github.com/Sparsh88

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

# 📄 License

This project is licensed under the **MIT License**.