# VERITAS - COMPREHENSIVE DEPLOYMENT GUIDE

This document provides step-by-step instructions for deploying the **Veritas** cryptocurrency forensics and VASP attribution platform to production environments.

---

## Architecture Overview

```text
                                +---------------------------+
                                |      GitHub Repo          |
                                |  shreyaagraa/veritas      |
                                +-------------+-------------+
                                              |
                                              | Automatic Build & Deploy
                                              v
                                +---------------------------+
                                |      Vercel Platform      |
                                | (Vite Static SPA + CDN)   |
                                +-------------+-------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
      +-----------------------------+                   +-----------------------------+
      |    Browser Client           |                   | Vercel Serverless Functions |
      | (LocalStorage State Engine) |                   |      /api/health.ts         |
      +--------------+--------------+                   +-----------------------------+
                     |
                     v (Public JSON-RPC / REST APIs)
      +-------------------------------------------------+
      | Mempool.space / Llamarpc / Solana / BSC Nodes   |
      +-------------------------------------------------+
```

---

## 1. Vercel Deployment Procedure (Primary Method)

### Step 1: Connect GitHub Repository to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Import the GitHub repository: `https://github.com/shreyaagraa/veritas`.

### Step 2: Configure Build & Project Settings

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Configure Production Environment Variables

Under **Environment Variables** in Vercel settings, configure:

| Key | Example Value | Description |
| --- | --- | --- |
| `VITE_API_URL` | `https://veritas-forensics.vercel.app` | Frontend production base URL |
| `GEMINI_API_KEY` | `AIzaSy...` | Server-side Gemini AI Key |
| `SAHYOG_AGENCY_ID` | `LEA-IND-CYBER-04` | I4C Law Enforcement Agency ID |
| `SAHYOG_API_KEY` | `sahyog_sec_key_...` | SAHYOG LEA authentication key |

### Step 4: Deploy

1. Click **Deploy**.
2. Vercel will run `npm run build` (`vite build`), outputting static assets to `dist/`.
3. Vercel automatically respects `vercel.json` for SPA rewrites (`/(.*) -> /index.html`) and `/api/health` routing.

---

## 2. Standalone Node.js / Docker Deployment (Alternative Method)

If hosting on a dedicated Virtual Private Server (VPS), AWS EC2, Render, or Railway:

### Step 1: Clone & Install

```bash
git clone https://github.com/shreyaagraa/veritas.git
cd veritas
npm install
```

### Step 2: Build Production Bundle

```bash
npm run build
```

### Step 3: Run Production Server

```bash
export PORT=3000
export NODE_ENV=production
npm start
```

This starts Express (`server.ts`) which serves static assets from `dist/` and handles API requests on port 3000.

---

## 3. CORS & API Security Checklist

- Public RPCs (`mempool.space`, `eth.llamarpc.com`) accept standard browser `fetch` requests.
- For private LEA API integrations (e.g., SAHYOG gateway), ensure server-side API endpoints handle mTLS certificates securely without exposing private keys in client bundles.
- Never prefix sensitive keys with `VITE_`.

---

## 4. Production Verification

After deployment, verify system operation:

1. **SPA Routing**: Navigate directly to `https://your-domain.vercel.app/` and refresh. Ensure no 404 errors occur.
2. **Health Endpoint**: Fetch `https://your-domain.vercel.app/api/health`. Confirm HTTP status `200 OK` with JSON response:
   ```json
   {
     "status": "ok",
     "service": "veritas-forensics",
     "timestamp": "2026-09-29T13:22:00.000Z"
   }
   ```
3. **Forensic Workspace**: Enter a target Bitcoin or Ethereum address in **Start New Investigation** screen and run a trace. Verify graph node rendering and VASP attribution calculation.
