# Stellar Dashboard v2

A modern, static replacement for [dashboard.stellar.org](https://dashboard.stellar.org) ([stellar/dashboard](https://github.com/stellar/dashboard)). Built with React, TypeScript, and Vite — no backend required.

The original Stellar dashboard relies on a Node.js backend with Redis caching and Google BigQuery for analytics. This project reimagines it as a fully static single-page application that can be deployed anywhere (GitHub Pages, Vercel, Netlify, S3, etc.) while retaining the most useful features: live network monitoring, fee stats, lumen supply tracking, and recent operations.

## Features

- **Live network status** — real-time ledger streaming via Horizon SSE, with health classification (operational / slow / very slow / down) derived from ledger close latency
- **Fee stats** — full percentile breakdown (p10–p99) of fees charged, plus ledger capacity percentage
- **Ledger close time chart** — color-coded bar chart (green/yellow/red) of per-ledger close times for the last 100 ledgers
- **Transaction & operation charts** — per-ledger successful transactions, operations, and failed transactions
- **30-day historical chart** — daily transaction and operation counts (mainnet only)
- **Lumen supply breakdown** — total, non-circulating, and circulating supply with percentage calculations (mainnet only)
- **Recent operations stream** — live table of the latest operations with known-account labeling (exchanges, SDF accounts) and human-readable operation details
- **Incidents & status** — active incidents and scheduled maintenances pulled from Stellar's StatusPage
- **Mainnet / Testnet toggle** — switch between networks with a single click
- **Testnet Friendbot balance** — shows the current XLM balance of the Friendbot faucet account (testnet only)
- **Dark theme** — matches the Stellar Design System dark palette

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 (strict mode) |
| Build | Vite 7 |
| Data fetching | TanStack React Query 5 (polling) + Stellar SDK 14 (SSE streaming) |
| Charts | Recharts 3 |
| Styling | Stellar Design System tokens + custom CSS (no CSS-in-JS) |
| Precision math | BigNumber.js |
| Date formatting | date-fns |

## Getting Started

### Prerequisites

- Node.js v20+ and npm

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

During development, Vite proxies two external APIs to avoid CORS issues:

- `/api/dashboard/*` → `https://dashboard.stellar.org/api/*` (lumen supply, historical ledger data)
- `/api/statuspage/*` → `https://9sl3dhr1twv1.statuspage.io/api/*` (Stellar StatusPage)

All other data comes directly from the public Horizon API (`horizon.stellar.org` / `horizon-testnet.stellar.org`).

### Build for Production

```bash
npm run build
```

This runs the TypeScript compiler followed by a Vite production build. Output goes to `dist/`.

> **Note:** In production, the proxy is not available. The app switches to calling the dashboard and StatusPage APIs directly (see `src/lib/constants.ts` for the URL logic). Make sure your hosting environment allows these cross-origin requests, or configure your own reverse proxy / CDN rules.

### Preview the Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── main.tsx                  # Entry point, QueryClient setup
├── App.tsx                   # Root component, network toggle, section layout
├── index.css                 # All styles (dark theme, 12-col grid, responsive)
├── components/
│   ├── NetworkStatus.tsx     # Live network health indicator
│   ├── FeeStats.tsx          # Fee percentile breakdown + capacity
│   ├── LedgerCloseChart.tsx  # Per-ledger close time bar chart
│   ├── TransactionsChart.tsx # Successful/failed tx + operation charts
│   ├── HistoricalChart.tsx   # 30-day daily transaction chart (mainnet)
│   ├── LumenSupply.tsx       # XLM supply breakdown (mainnet)
│   ├── RecentOperations.tsx  # Live operations table with account labels
│   ├── AccountBalance.tsx    # Generic account balance card + Friendbot card
│   └── Incidents.tsx         # StatusPage incidents & maintenances
├── hooks/
│   └── useHorizon.ts         # All data hooks (SSE streams + React Query polls)
├── lib/
│   ├── constants.ts          # Horizon URLs, known accounts, SDF accounts
│   └── format.ts             # Number/XLM/date/account formatting utilities
├── types/
│   └── index.ts              # TypeScript interfaces for all API responses
└── assets/
    └── react.svg             # (unused default asset)
```

## Data Sources

| Data | Source | Method |
|---|---|---|
| Ledgers (live) | Horizon `/ledgers` | SSE stream via Stellar SDK |
| Operations (live) | Horizon `/operations` | SSE stream via Stellar SDK |
| Fee stats | Horizon `/fee_stats` | Polling (5s) |
| Account balances | Horizon `/accounts/{id}` | Polling (60s) |
| Lumen supply | `dashboard.stellar.org/api/v2/lumens` | Polling (5min) |
| Historical ledgers | `dashboard.stellar.org/api/ledgers/public` | Polling (1hr) |
| Incidents/status | StatusPage `summary.json` | Polling (60s) |

## How It Differs from the Original

The [original dashboard](https://github.com/stellar/dashboard) is a full-stack application requiring Node.js, Redis, and optional BigQuery integration. This project:

- **Eliminates the backend** — all data comes from public APIs (Horizon, dashboard.stellar.org, StatusPage)
- **Builds to static files** — deploy the `dist/` folder to any static hosting provider
- **Uses a modern stack** — React 19, Vite 7, TypeScript 5.9, TanStack Query 5
- **Focuses on monitoring** — network health, fees, supply, and operations rather than account lookup or transaction exploration

### Not yet implemented

- Account search / lookup
- Transaction detail viewer
- Node topology / validator explorer (links to [stellarbeat.io](https://stellarbeat.io) instead)
- URL routing / deep-linkable pages
- Light theme
- DEX / orderbook statistics

## Deployment

Since this builds to static files, you can deploy it anywhere:

**GitHub Pages:**
```bash
npm run build
# Push dist/ to gh-pages branch or configure GitHub Actions
```

**Vercel / Netlify:**
Connect the repo and set the build command to `npm run build` with the output directory as `dist`. You may need to add rewrite rules to proxy the dashboard and StatusPage API calls if CORS is an issue.

**Docker / Nginx:**
Serve the `dist/` folder with any static file server. Add proxy rules for `/api/dashboard/` and `/api/statuspage/` if needed.

## License

See [LICENSE](LICENSE) for details.
