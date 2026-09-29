# VERITAS DEPLOYMENT CHECKLIST

Use this checklist prior to pushing changes to production or deploying to Vercel/Cloud infrastructure.

---

## Pre-Deployment Verification

- [x] `.env` and sensitive local files are strictly excluded in `.gitignore`
- [x] `.env.example` is updated with complete variable descriptions and safe placeholders
- [x] No private API keys or credentials are hardcoded in source code
- [x] `package.json` dependencies and devDependencies resolve cleanly (`npm install`)
- [x] TypeScript compilation passes cleanly (`npm run lint` / `tsc --noEmit`)
- [x] Production build succeeds (`npm run build`)
- [x] `vercel.json` exists with SPA catch-all rewrite rules
- [x] `/api/health` serverless function endpoint is present in `api/health.ts`

---

## Vercel Deployment Checklist

- [ ] GitHub repository connected to Vercel
- [ ] Root Directory set to `./`
- [ ] Framework preset selected: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment variables configured in Vercel settings (`GEMINI_API_KEY`, `VITE_API_URL`, etc.)
- [ ] Production build succeeds on Vercel
- [ ] `/api/health` URL returns `{ "status": "ok" }`

---

## Post-Deployment Verification

- [ ] Web application loads without console errors
- [ ] Deep links / browser page refreshes work without 404 errors
- [ ] Investigation workflow (DEMO and LIVE tracing) executes as expected
- [ ] SAHYOG Requisition packet generation formats correctly
- [ ] Evidence PDF/Print report rendering operates without layout breakdown
