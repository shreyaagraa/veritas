# Veritas

### Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs

---

## Overview

**Veritas** is an enterprise-grade cryptocurrency forensics and blockchain intelligence platform developed for Smart India Hackathon (SIH). It addresses the critical challenge faced by financial crime compliance officers, law enforcement agencies (LEAs), and cyber intelligence units: **attributing unknown cryptocurrency wallet addresses to nearest regulated Virtual Asset Service Providers (VASPs)**.

When illicit funds move through pseudo-anonymous blockchain networks, tracing peeling chains and multi-hop transactions across multiple UTXO and EVM chains manually is time-consuming and error-prone. Veritas automates multi-hop transaction graph traversal, calculates mathematical attribution confidence scores, identifies terminal custodial ingestion points (exchanges, OTC desks, payment gateways), and generates standardized law enforcement requisition packets (such as Section 91 Cr.P.C. / I4C SAHYOG notices).

---

## Key Features

- **Multi-Chain Graph Traversal & Fund Tracing**: Traverses transactions across Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Binance Smart Chain (BSC), Polygon (MATIC), and Tron (TRX).
- **Automated Nearest VASP Attribution**: Identifies terminal custodial deposit addresses and calculates network hop distance from origin wallets.
- **Dual-Engine Operation (Demo & Live Modes)**:
  - **Live Mode**: Direct integration with on-chain JSON-RPC node endpoints and public UTXO indexers (e.g. Mempool.space REST API, Llamarpc EVM RPC).
  - **Demo Mode**: High-speed offline forensic graph simulator with realistic multi-hop transactional dataset for air-gapped demo environments.
- **Heuristic Confidence & Risk Scoring**: Multi-dimensional risk engine calculating entity exposure, mixer/tumbler interaction penalty, cluster corroboration, and confidence percentages (HIGH, MEDIUM, LOW).
- **SAHYOG LEA Integration Adapter**: Automated generation of formal Cyber Requisition Notices (Information Disclosure & Asset Freezing Injunctions) compliant with Indian Cyber Crime Coordination Centre (I4C) and Section 91 Cr.P.C. standards.
- **Attribution Database Management**: Persistent local database storage for verified VASP entity clusters, proof-of-reserves wallet tags, and agency notes.
- **Court-Ready Forensic Reports**: One-click generation and print/export of complete evidence chains with SHA-256 digital digests and transaction hash validation.

---

## System Workflow

```text
User Input: Unknown Target Wallet Address + Blockchain Network Selection
 ↓
Provider Registry Routing (Mempool.space REST API / EVM JSON-RPC Nodes)
 ↓
Multi-Hop Transaction Graph Expansion & Balance Retrieval
 ↓
Risk & Confidence Scoring Engine (Cluster Corroboration & Peeling Chain Analysis)
 ↓
Nearest VASP Attribution Identification (Custodial Deposit Ingestion Point)
 ↓
Interactive Forensic Workspace & SAHYOG Lawful Requisition Package Generation
```

---

## Technology Stack

- **Frontend Framework**: React 19 (TypeScript)
- **Styling & Visual Design**: Tailwind CSS v4, Lucide React Icons, Motion (Framer Motion)
- **Build Tooling**: Vite 8, `tsx` Node execution runtime
- **Server Runtime**: Express 4 Node.js HTTP Server (Static SPA host + Dev middleware)
- **API & Data Access**: Fetch API, LocalStorage persistence engine
- **Deployments Supported**: Vercel (Static SPA + Edge Serverless Functions), Docker / Render / Railway (Node.js runtime)

---

## Project Structure

```text
veritas/
├── api/
│   └── health.ts            # Vercel Serverless health check endpoint
├── src/
│   ├── components/          # UI Component modules
│   │   ├── attribution/     # Attribution database views
│   │   ├── common/          # Reusable UI primitives
│   │   ├── dashboard/       # System metrics and overview dashboards
│   │   ├── datasources/     # API & SAHYOG credentials configuration
│   │   ├── history/         # Audit log & case history
│   │   ├── investigation-setup/ # New investigation workflow
│   │   ├── reports/         # Court-ready report generator
│   │   └── workspace/       # Interactive graph analysis & graph visualization
│   ├── data/
│   │   └── seedData.ts      # Seed forensic datasets & pre-built investigation cases
│   ├── services/
│   │   ├── intelligence/    # Risk, confidence, nearest VASP, and classification engines
│   │   ├── providers/       # Bitcoin, Ethereum, Solana, BSC, Polygon, Tron RPC adapters
│   │   ├── sahyog/          # I4C LEA Requisition package generator
│   │   ├── api.ts           # Unified frontend API client interface
│   │   └── storage.ts       # Forensic storage and state engine
│   ├── types/
│   │   └── investigation.ts # Core TypeScript models and interfaces
│   ├── App.tsx              # Main Application router & layout controller
│   ├── index.css            # Global Tailwind CSS entry
│   └── main.tsx             # React DOM entry point
├── .env.example             # Environment variable template
├── .gitignore               # Git untracked pattern rules
├── index.html               # Single Page Application HTML host
├── package.json             # NPM dependencies & scripts manifest
├── server.ts                # Express development & production Node server
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment & SPA routing rules
├── vite.config.ts           # Vite build pipeline setup
└── README.md                # Project documentation
```

---

## Environment Variables

Configure environment variables in a `.env` file at project root (see `.env.example`):

| Variable Name | Description | Environment | Required? | Type |
| --- | --- | --- | --- | --- |
| `VITE_API_URL` | Base URL for API client requests | Frontend | Optional | Public |
| `APP_URL` | Application public host URL | Frontend / Backend | Optional | Public |
| `PORT` | Server HTTP listening port (Default: 3000) | Backend | Optional | Private |
| `GEMINI_API_KEY` | Gemini AI API key for intelligence analysis | Backend | Optional | Secret |
| `ETHERSCAN_API_KEY` | Etherscan API key for EVM transaction indexing | Backend / Provider | Optional | Secret |
| `SAHYOG_AGENCY_ID` | Law Enforcement Agency ID for I4C SAHYOG | Backend / LEA | Optional | Public |
| `SAHYOG_API_KEY` | SAHYOG API authentication key | Backend / LEA | Optional | Secret |
| `SAHYOG_MTLS_CERT` | Base64-encoded mTLS Certificate for SAHYOG gateway | Backend / LEA | Optional | Secret |

---

## Local Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shreyaagraa/veritas.git
   cd veritas
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the local web application at `http://localhost:3000`.

---

## Build Commands

To test or build the production assets:

```bash
# Type check TypeScript files
npm run lint

# Build production bundle to dist/
npm run build

# Preview built production bundle locally
npm run preview

# Run production Express server locally
npm start
```

---

## Deployment Architecture

Veritas supports two primary deployment models based on operational requirements:

### 1. Vercel Deployment (Recommended for Cloud Hosting)

Veritas is fully configured for zero-friction Vercel deployment as a high-performance Single Page Application with Edge Serverless API support.

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Routing**: `vercel.json` automatically handles SPA fallback to `index.html` and routes `/api/health` to `api/health.ts`.
- **Environment Variables**: Add `GEMINI_API_KEY`, `SAHYOG_API_KEY`, and `VITE_API_URL` directly in Vercel Project Settings → Environment Variables.

### 2. Standalone Node.js / Docker Deployment (Render, Railway, VPS)

For air-gapped LEA deployments or self-hosted servers:

- Run `npm run build` to output static bundle to `dist/`.
- Execute `npm start` (`node server.ts`) which launches the production Express HTTP server on `PORT` (default `3000`) serving `dist/` and API endpoints.

---

## API & Backend Endpoints

- `GET /api/health`
  - Returns service status, system name, and current UTC ISO timestamp.
  - Payload: `{ "status": "ok", "service": "veritas-forensics", "timestamp": "..." }`

---

## Security Guidelines

- **Environment File Protection**: Never commit `.env` or `.env.local` files to Git. Verify `.gitignore` enforces exclusion.
- **Client-Side Secret Isolation**: Never prefix private backend secrets (e.g. `GEMINI_API_KEY`, `SAHYOG_API_KEY`) with `VITE_`.
- **Credential Revocation**: If any API key is accidentally exposed in commits, immediately revoke and re-issue the credential.

---

## Troubleshooting

- **Dependency conflicts during `npm install`**: Run `npm install` with updated `esbuild` (^0.28.0) or use `npm install --legacy-peer-deps`.
- **API Connection Timeout**: Ensure network connection is open to public blockchain RPCs (`mempool.space`, `eth.llamarpc.com`). If restricted, switch the investigation mode to `DEMO` in the UI setup screen.
- **404 on page refresh on Vercel**: Ensure `vercel.json` is present at root to route all requests to `index.html`.

---

## Smart India Hackathon (SIH) Context

Veritas is developed as a solution for the Smart India Hackathon (SIH) statement focusing on **Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs)**.

---

## License

This repository does not currently specify an open-source license. All rights reserved by the Veritas development team.
