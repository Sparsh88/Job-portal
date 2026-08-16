# 🚀 HireHub-AI Deployment Guide

This guide provides step-by-step instructions to deploy your full-stack job portal application. 

### 🏗️ Architecture Overview
* **Frontend**: React + Vite (TypeScript) deployed to **Vercel**.
* **Backend**: Node.js + Express + Prisma ORM (TypeScript) deployed to **Render**.
* **Database**: PostgreSQL hosted on **Neon** (or another PostgreSQL provider).

---

## 📂 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Step 1: Setup PostgreSQL Database (Neon)](#step-1-setup-postgresql-database-neon)
3. [Step 2: Deploy Backend (Render)](#step-2-deploy-backend-render)
4. [Step 3: Deploy Frontend (Vercel)](#step-3-deploy-frontend-vercel)
5. [Step 4: Update CORS & Connect Backend to Frontend](#step-4-update-cors--connect-backend-to-frontend)
6. [🔍 Troubleshooting & Post-Deployment Checklist](#-troubleshooting--post-deployment-checklist)

---

## 📋 Prerequisites
* A [GitHub](https://github.com/) repository containing your project.
* A [Neon](https://neon.tech/) account (for a free PostgreSQL database).
* A [Render](https://render.com/) account (for backend hosting).
* A [Vercel](https://vercel.com/) account (for frontend hosting).

---

## Step 1: Setup PostgreSQL Database (Neon)
Using Neon is recommended because it provides a permanent free-tier PostgreSQL database.

1. Sign up/Log in to [Neon Console](https://neon.tech/).
2. Click **Create Project**.
3. Name your project (e.g., `hirehub-db`) and select the PostgreSQL version (Default is fine).
4. Click **Create Project**.
5. Once created, you will see a connection string screen.
   * Make sure **Connection string** is selected.
   * Select **Prisma** from the connection string dropdown.
   * Copy the connection string. It will look like this:
     ```text
     postgresql://neondb_owner:PASSWORD@ep-proud-hat-auvlppo9-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require
     ```
6. Keep this connection string ready; you will need it for the Render configuration.

---

## Step 2: Deploy Backend (Render)
You can deploy your backend on Render in one of two ways: using the **Blueprint Configuration** (recommended and automated) or **Manually**.

### Option A: Using Render Blueprints (Recommended)
We have added a `render.yaml` file to the root of your project. Render will use this file to configure the backend automatically.

1. Log in to [Render](https://render.com/).
2. Click on the **Blueprints** tab in the top navigation bar.
3. Click **New Blueprint Instance**.
4. Connect your GitHub repository.
5. Provide a Service Group Name (e.g., `hirehub-group`).
6. You will see a list of environment variables to configure:
   * `DATABASE_URL`: Paste the PostgreSQL connection string you copied from Neon in Step 1.
   * `FRONTEND_URL`: Put `*` for now (we will update this with your actual Vercel URL later).
   * `ENABLE_AUTO_SEEDING`: Set to `true` if you want to seed mock data on initial startup (default is `false` in production for safety).
   * `SEED_ADMIN_EMAIL`: Set your custom admin email (defaults to `sparshchauhan050@gmail.com`).
   * `SEED_ADMIN_PASSWORD`: Set a secure custom admin password (defaults to `Sp@080806`).
   * Note: `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` will be **automatically generated** for you securely!
7. Click **Apply**. Render will start building and deploying the backend.
8. Once deployment is complete, Render will provide a service URL (e.g., `https://hirehub-ai-backend.onrender.com`). Copy this URL.

---

### Option B: Manual Web Service Deployment
If you prefer not to use Blueprints, you can configure the service manually on Render:

1. Click **New +** on the Render dashboard and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   * **Name**: `hirehub-backend`
   * **Root Directory**: `backend`
   * **Language**: `Node`
   * **Build Command**: `npm install --production=false && npm run build && npx prisma db push`
   * **Start Command**: `npm run start`
4. Expand the **Advanced** section to add the following **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `5000`
   * `DATABASE_URL`: (Paste your Neon database URL)
   * `JWT_ACCESS_SECRET`: (Generate a long random string, e.g., `openssl rand -hex 32`)
   * `JWT_REFRESH_SECRET`: (Generate a different long random string)
   * `FRONTEND_URL`: `*` (We'll update this once the frontend is deployed)
   * `ENABLE_AUTO_SEEDING`: `false` (Set to `true` to enable auto-seeding on initial deployment)
   * `SEED_ADMIN_EMAIL`: (Your custom admin email address)
   * `SEED_ADMIN_PASSWORD`: (Your secure custom admin password)
5. Click **Create Web Service**.

---

## Step 3: Deploy Frontend (Vercel)
Vercel is optimized for React and Vite applications.

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** and select **Project**.
3. Import your GitHub repository.
4. On the configuration page, update the following **Project Settings**:
   * **Framework Preset**: Detects `Vite` (leave as default).
   * **Root Directory**: Click **Edit** and select the `frontend` folder, then click **Continue**.
5. Expand the **Environment Variables** section and add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://your-backend-name.onrender.com/api` (Replace this with the **Render Web Service URL** you copied in Step 2, appending `/api` at the end).
6. Click **Deploy**.
7. Once finished, Vercel will give you a deployment URL (e.g., `https://hirehub-job-portal.vercel.app`). Copy this URL.

---

## Step 4: Update CORS & Connect Backend to Frontend
To secure your application, you should restrict cross-origin requests (CORS) only to your Vercel domain.

1. Go back to your [Render Dashboard](https://dashboard.render.com/).
2. Select your `hirehub-ai-backend` service.
3. Click on the **Environment** tab on the left sidebar.
4. Locate the `FRONTEND_URL` environment variable.
5. Replace `*` with your actual Vercel deployment URL (e.g., `https://hirehub-job-portal.vercel.app`).
6. Save the changes.
7. Render will automatically redeploy the backend with the updated environment variables.

---

## 🔍 Troubleshooting & Post-Deployment Checklist

### 1. Verification of Backend Health
To verify the backend is online and running correctly, open your browser and navigate to:
```text
https://your-backend-name.onrender.com/api/health
```
You should receive a JSON response showing the status as `"online"`.

### 2. Auto-Seeding Database & Production Security
The backend has an **auto-seed mechanism** built-in! On the first successful startup, if the database is empty and `ENABLE_AUTO_SEEDING=true` is set, it will automatically populate mock jobs, users, companies, and applications.

> [!IMPORTANT]
> To prevent data loss and unauthorized login credentials in production:
> * **Seeding is DISABLED by default in production** (i.e. when `NODE_ENV=production` unless `ENABLE_AUTO_SEEDING=true`).
> * If you enable seeding, you **MUST** specify your own custom credentials via `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` on Render.
> * If you use the defaults, the login credentials will be:
>   * **Admin Login**: `admin@hirehub.ai` / `Password123!` (Warning: Highly Insecure!)
>   * **Recruiter Login**: `recruiter@techcorp.com` / `Password123!`
>   * **Job Seeker Login**: `alex.developer@gmail.com` / `Password123!`

### 3. Check for CORS Block Errors
If you open your web app and cannot log in or fetch jobs, open your browser's Developer Tools Console (F12) to inspect the network.
* **Problem**: Access to XMLHttpRequest has been blocked by CORS policy.
* **Fix**: Double check that `FRONTEND_URL` in the Render environment settings matches your Vercel URL exactly (no trailing slash `/`).

### 4. Prisma Client Compilation Issues
* **Problem**: "Prisma client has not been generated yet."
* **Fix**: In the Render build command, we run `npm run build` which runs `tsc && prisma generate`. If you are manually deploying, ensure your build command is `npm install --production=false && npm run build && npx prisma db push`. The `--production=false` flag ensures Prisma is installed and can generate the client correctly.
