# ImpactIQ - UPAY ⚡

> **"Pay for impact, not for noise."**  
> *Universal Causal AI & Uplift Modeling Engine integrated with a pixel-perfect upay Mobile App Replica.*

---

## 📌 Executive Summary

Most MFS marketing campaigns report **gross results**: *"Campaign users spent ৳18.5M"*. This overstates impact because many customers would have transacted anyway.

**ImpactIQ - UPAY** answers the real question: **"What did this campaign actually cause?"**

It measures **true incremental impact** (treatment vs. holdout control) and uses **4-quadrant uplift modeling** to decide **who to target, with what offer, at what budget**.

---

## 🚀 Quick Start (One Command)

### Prerequisites
- Node.js (v18+)
- npm / npx

### Run for Web
```bash
# Clone or navigate to directory
cd ImpactIQ

# Start Expo Web server
npx expo start --web
```
Press `w` in terminal if running `npx expo start`. Open `http://localhost:8081` in your browser.

### Run Unit Tests for Causal AI Math
```bash
npx jest
```
Runs the mathematically verified tests for **Incremental Lift %**, **iROI**, **CPIT**, **Difference-in-Differences (DiD)**, and **4-Quadrant Uplift Classification**.

---

## 🏗️ Universal Codebase Architecture

One codebase runs as a **React Native Mobile App (iOS & Android)** and a **Responsive Web Application** with desktop sidebar layout.

```text
ImpactIQ/
├── app/                      # Expo Router File-Based Routing
│   ├── index.tsx             # 4-Digit PIN Auth Screen (upay Replica)
│   ├── home.tsx              # upay Home Screen Replica (Service Grid, Banners, Floating Tiles)
│   ├── account.tsx           # Account Screen (2x2 Pastel Wallets + Cash Reward)
│   ├── history.tsx           # Transaction Statement & Summary
│   ├── more.tsx              # Settings, Support & ImpactIQ Privacy Consent
│   ├── qr-scan.tsx           # QR Scanner & Payment Confirmation Keypad
│   ├── send-money.tsx        # Send Money Flow
│   ├── topup.tsx             # Mobile Recharge (GP, Robi, BL, Airtel, Teletalk)
│   ├── pay-bill.tsx          # Utility Bill-Pay (DESCO, DPDC, WASA, Titas)
│   ├── add-money.tsx         # Add Money Bank Card Flow
│   ├── cash-out.tsx          # Cash Out Agent Flow
│   ├── offers.tsx            # ImpactIQ Personalized Offers ("Why this offer?")
│   ├── wheel.tsx             # upay Wheel Interactive Spin Game
│   └── console/              # ImpactIQ Marketing Console & Command Center
│       ├── index.tsx         # Executive Overview & Leaderboard
│       ├── campaigns/        # Campaign List & Hero Impact Report ([id].tsx)
│       ├── experiments.tsx   # Holdout RCT & Difference-in-Differences (DiD)
│       ├── uplift.tsx        # 4-Quadrant Uplift Matrix & Feature Drivers
│       ├── simulator.tsx      # What-If Scenario Simulator
│       ├── budget.tsx         # Budget Optimizer & Diminishing Returns Curve
│       ├── abuse.tsx          # Promo Abuse Guard & Leakage Detector
│       ├── ai.tsx             # ImpactIQ AI Conversational Assistant
│       └── command-center.tsx # Visual Causal Graph & Live Simulation Engine
├── components/               # Shared UI Components & SVG Charts
│   ├── charts/               # Custom SVG Counterfactual, Waterfall, Scatter & Curve Charts
│   ├── customer/             # upay Header, Keypad, Service Grid, Wallets, Floating Pills
│   ├── layout/               # Console Sidebar & Header
│   └── ui/                   # BrandMark & Legal Footer
├── services/                 # Causal AI Analytics & Payment Services
│   ├── upliftService.ts      # Math calculations (Lift, iROI, CPIT, Quadrant classifier)
│   ├── experimentService.ts  # DiD & Statistical Significance (p-values)
│   ├── budgetService.ts      # Budget optimization & return curves
│   ├── simulatorService.ts   # Scenario forecasting
│   ├── abuseService.ts       # Fraud ring detection
│   └── aiService.ts          # AI conversational provider
├── theme/
│   └── tokens.ts             # Brand Design Tokens (sampled upay Yellow #FFD500, Blue #0B4DA2)
├── i18n/                     # Bangla (BN) & English (EN) Localization
├── DEMO.md                   # 2-Minute Hackathon Judge Script
└── DECISIONS.md              # Architectural Log
```

---

## 🎨 How to Swap in Official upay Brand Assets

All brand colors, fonts, and assets are centralized in `theme/tokens.ts`:

1. **Colors**: Update hex values in `theme/tokens.ts`:
   - `themeTokens.brand.yellow` (Default `#FFD500`)
   - `themeTokens.brand.primary` (Default `#0B4DA2`)
   - `themeTokens.colors.creamBg` (Default `#FFFDF0`)
2. **Logo Mark**: Replace the placeholder `<BrandMark />` component in `components/ui/BrandMark.tsx` with official SVG/PNG image assets if authorized.

---

## 🔌 Connecting a Real Backend (REST / Supabase)

The codebase uses a clean service abstraction layer (`services/`). To connect a live backend:

1. Open `services/upliftService.ts` or `services/campaignService.ts`.
2. Replace mock data queries with `fetch('/api/v1/campaigns')` or Supabase client:
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## ⚖️ Legal Guardrails & Disclaimer

- This is an **unofficial AI hackathon prototype**, inspired by the upay mobile financial services (MFS) ecosystem. It is **not** an official upay product.
- Replicates the upay app UI structure, yellow/blue branding, and service layout for demonstration purposes only.
- No proprietary source code or official assets were used. All customer and transaction data is synthetic.
