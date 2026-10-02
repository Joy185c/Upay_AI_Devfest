# ImpactIQ - UPAY ⚡

> **"Pay for impact, not for noise."**  
> *Universal Causal AI & Uplift Modeling Engine integrated with a fully functional upay Mobile Banking Simulation & Live Supabase Backend.*

---

## 📌 Executive Summary

Most MFS marketing campaigns report **gross results**: *"Campaign users spent ৳18.5M"*. This overstates impact because many customers would have transacted anyway.

**ImpactIQ - UPAY** answers the real question: **"What did this campaign actually cause?"**

It measures **true incremental impact** (treatment vs. holdout control), predicts customer uplift using **4-quadrant causal modeling**, and provides a **full-featured simulated upay payment app** with live Supabase database sync, persistent wallet balance, transaction receipts, analytics insights, and PDF/CSV statement exports.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm / npx

### 2. Run Local Web Server
```bash
# Clone repository
git clone https://github.com/Joy185c/Upay_AI_Devfest.git
cd Upay_AI_Devfest

# Start Expo Web dev server
npx expo start --web
```
Open `http://localhost:8081` in your browser.

### 3. Run Unit Tests
```bash
# Run Jest unit tests for Causal AI Math & Financial Insights
npx jest
```
Runs the mathematically verified tests for **Incremental Lift %**, **iROI**, **CPIT**, **Difference-in-Differences (DiD)**, **4-Quadrant Uplift Classification**, **Summary Metrics**, **Monthly Budget Warning**, and **Category Breakdown**.

---

## ✨ Key Features

### 📲 1. Simulated Payment Operations & Wallet Engine
- **Send Money**: Real-time BD phone validation (`01XXXXXXXXX`), reference notes, free transfer charge.
- **Mobile Recharge**: Telecom operator selection (GP, Robi, Banglalink, Airtel, Teletalk).
- **Cash Out**: Agent cash out with standard **1.85% fee calculation** (e.g. ৳18.50 fee per ৳1,000).
- **Add Money**: Instant wallet top-up from bank cards & apps with ৳50 ImpactIQ bonus offer.
- **Pay Bill**: Utility bill payments (DESCO, DPDC, TITAS, WASA, Carnival) with 10% instant cashback integration.
- **4-Step Workflow**: Input Form -> Review Screen -> Demo PIN Verification (`1234`) -> Receipt Screen.

### 📊 2. Financial Insights & Analytics (`/insights`)
- **Summary Metrics**: Real-time calculation of Total Sent, Total Received, Total Fees, and Net Flow for 7d, 30d, or All Time.
- **Spending Charts**: Interactive category breakdown chart & daily spending trend SVG chart (`react-native-svg`).
- **Top Transacted Recipients**: Ranking list of top counterparties by transaction count and amount.
- **Monthly Budget Limit**: Configurable monthly budget limit with real-time progress bar and **80% budget limit warning banner**.
- **90-Day Seed Generator**: One-click generator (`SeedService`) that seeds 100+ realistic transactions spanning the past 90 days.

### 📄 3. Account Statement Exports
- **CSV Export**: Instant download of complete transaction ledger formatted as `.csv`.
- **PDF Export**: Official print-styled Upay BD bank statement document complete with header logo, customer metrics, and itemized transaction ledger.

### 🗄️ 4. Live Supabase Backend & Database Sync
- **Supabase Integration**: Native connection to Supabase database (`@supabase/supabase-js`) for real-time wallet balance and transaction persistence.
- **Database Schema**: SQL initialization script (`supabase_schema.sql`) for `public.wallets` and `public.transactions` tables with RLS policies enabled.
- **Offline Fallback**: Seamless fallback to browser local storage if database is offline or unconfigured.

---

## 🏗️ Codebase Architecture

```text
Upay_AI_Devfest/
├── app/                      # Expo Router File-Based Routing
│   ├── index.tsx             # 4-Digit PIN Auth Screen (upay Replica)
│   ├── home.tsx              # upay Home Screen Replica (Service Grid, Banners, Floating Tiles)
│   ├── account.tsx           # Account Screen (2x2 Pastel Wallets + Cash Reward)
│   ├── history.tsx           # Transaction History (Grouping, Search, Receipt Modal)
│   ├── insights.tsx          # Financial Insights, SVG Charts, Budget Warning & Exports
│   ├── send-money.tsx        # Send Money Flow (Validation, Review, PIN 1234, Receipt)
│   ├── topup.tsx             # Mobile Recharge Flow
│   ├── cash-out.tsx          # Cash Out Agent Flow (1.85% Fee Calculation)
│   ├── add-money.tsx         # Add Money Bank Card Flow
│   ├── pay-bill.tsx          # Utility Bill-Pay Flow (10% Cashback)
│   ├── offers.tsx            # ImpactIQ Personalized Offers ("Why this offer?")
│   └── console/              # ImpactIQ Causal AI Marketing Console
├── components/               # Shared UI Components & SVG Charts
│   ├── charts/               # Custom SVG Counterfactual, Waterfall & Trend Charts
│   ├── customer/             # upay Header, Keypad, Service Grid, Wallets, Banners
│   └── ui/                   # BrandMark & Legal Footer
├── lib/                      # Core Libraries
│   ├── store.ts              # Zustand Global State Store (Balance & Transactions)
│   └── supabase.ts           # Supabase JS SDK Client Configuration
├── services/                 # Business Logic & Backend Services
│   ├── transactionService.ts # Wallet Balance & Transaction Execution Engine
│   ├── supabaseService.ts    # Supabase Database Sync Layer (wallets & transactions)
│   ├── exportService.ts      # CSV and PDF Statement Generator
│   ├── seedService.ts        # 90-Day Demo Transaction Seed Generator
│   ├── paymentService.ts     # Backward-compatible payment wrapper
│   └── upliftService.ts      # Causal AI Math & Quadrant Classifier
├── utils/                    # Pure Calculation Helpers & Selectors
│   ├── insightUtils.ts       # Filter, summary, trend, & monthly budget helpers
│   └── __tests__/            # Jest Unit Tests (100% Passing)
├── supabase_schema.sql       # Supabase Database SQL Table Creation Script
├── .env.example              # Environment Configuration Template
└── README.md
```

---

## 🗄️ Setting Up Supabase Database

1. Open your project on [Supabase Dashboard](https://app.supabase.com).
2. Go to **SQL Editor** (`>_`).
3. Paste and run the SQL code from [`supabase_schema.sql`](file:///d:/Ai%20Hackathon/ImpactIQ/supabase_schema.sql).
4. Configure your `.env` file with your project URL and keys:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚖️ Legal Disclaimer

- This is an **unofficial AI hackathon prototype**, inspired by the upay mobile financial services (MFS) ecosystem for educational and demonstration purposes.
- Replicates the upay app UI structure, color palette, and layout. No proprietary code or assets were used.
