# ImpactIQ - UPAY Development Plan

## Product Goal
Build **ImpactIQ - UPAY**, a universal fintech product (React Native iOS/Android + Responsive Web) with an exact replica of the upay customer app UI (Bangla-first) integrated with the ImpactIQ Causal AI & Uplift Modeling Engine for marketing campaign impact optimization.

## Implementation Checklist

### Stage 1: Core Setup & Architecture
- [x] Project initialization with Expo & TypeScript
- [x] Theme design system (`theme/tokens.ts`) with upay yellow & blue branding
- [x] i18n localization engine (Bangla `bn` & English `en`)
- [x] Architecture documentation (`DECISIONS.md`, `BLOCKERS.md`)

### Stage 2: Data Models & Causal AI Services
- [x] Synthetic data generator (50k customer dataset representation, transactions, merchants, agents)
- [x] `upliftService`: Treatment vs control holdout, incremental revenue, lift %, iROI, CPIT, 4-quadrant uplift segmentation (Persuadables, Sure Things, Lost Causes, Sleeping Dogs), top drivers
- [x] `experimentService`: DiD calculations, p-value statistical confidence, A/B holdout builder
- [x] `budgetService`: Optimization algorithm (broad blast vs targeted allocation), marginal returns
- [x] `simulatorService`: What-if campaign scenario modeler with side-by-side comparison
- [x] `abuseService`: Promo leakage, fraud ring detection, harvester clustering
- [x] `aiService`: ImpactIQ AI conversational assistant with context explainability & mini-chart payloads
- [x] `paymentService`: Mock wallet balances, transactions, and payment flows
- [x] `merchantService`: Merchant campaign impact metrics
- [x] Automated Jest unit tests for Causal AI math functions (6/6 tests passing)

### Stage 3: Shared UI System
- [x] UI Components: Buttons, Cards, Inputs, Modals, BottomSheets, Badges, Tabs, Keypad
- [x] Custom SVG Charts: Counterfactual time series, Waterfall chart, Uplift quadrant scatter plot, Heatmaps, Marginal return curves
- [x] Customer Brand components: `<BrandMark />`, upay header, navigation bar, language switcher, notification bell

### Stage 4: Customer App (upay Replica Screens)
- [x] Auth / Splash & 4-Digit PIN screen with dot fill, keypad, and biometric login prompt (`/app/index.tsx`)
- [x] Home Screen: Yellow header, balance toggle pill, 4-column main service grid, promo banner carousel, upay Payments grid, floating upay Card / upay Offer / Wheel triggers, bottom tab bar (`/app/home.tsx`)
- [x] Account Screen: 2x2 pastel wallets (Primary, Disbursement, Secondary, Remittance), Cash Reward soft yellow card with ImpactIQ "Why did I get this?" link (`/app/account.tsx`)
- [x] History Screen: Statement & Summary tabs, horizontal scroll filter chips, transaction rows with details sheet (`/app/history.tsx`)
- [x] More Screen: Settings, Support, Account Services, ImpactIQ Offer & Privacy settings (`/app/more.tsx`)
- [x] Service Flows: Send Money, Mobile Recharge, Cash Out, Make Payment (QR), Pay Bill, Add Money, Savings, Fund Transfer, Request Money, Refer & Earn, NPSB (with confirmation keypad & animated success receipt)
- [x] upay Offer screen: Personalized AI campaign offers with explainer (`/app/offers.tsx`)
- [x] upay Wheel screen: Interactive reward spin wheel (`/app/wheel.tsx`)
- [x] Service Locator: Map simulation and nearby agents/merchants (`/app/service-locator.tsx`)

### Stage 5: ImpactIQ Marketing Console & Dashboards
- [x] Console Layout: Responsive desktop sidebar, header bar, mode selector (`/components/layout/`)
- [x] Executive Overview (`/console`): Portfolio KPIs, incremental ROI, campaign leaderboard
- [x] Campaign List (`/console/campaigns`): Filterable campaign table, status badges
- [x] **Campaign Impact Report - Hero Screen** (`/console/campaigns/[id]`): Gross vs Incremental contrast, KPI strip, counterfactual chart, waterfall chart, 4-quadrant breakdown, regional heatmap, AI summary, budget action buttons
- [x] Experiments Page (`/console/experiments`): Holdout & DiD setup, statistical confidence visualizer
- [x] Uplift Explorer (`/console/uplift`): 4-quadrant scatter matrix, customer segment deep dive, top feature drivers panel
- [x] What-If Simulator (`/console/simulator`): Parameter sliders, live forecast, 3-way scenario comparison
- [x] Budget Optimizer (`/console/budget`): Broad blast vs ImpactIQ targeted comparison, diminishing returns curve, 1-click reallocate
- [x] Promo Abuse Guard (`/console/abuse`): Flagged fraud clusters, estimated BDT leakage, block/investigate actions
- [x] ImpactIQ AI Assistant (`/console/ai`): Chat interface with typing animation, sample prompts, inline mini-charts
- [x] Visual Command Center (`/console/command-center`): Interactive Causal Engine node diagram, 4 live panels, real-time insight stream, 6-step animated simulation sequence
- [x] Merchant Portal (`/merchant`): Merchant campaign performance & incremental customer lift
- [x] Admin & Finance Dashboard (`/admin`): Executive portfolio summary & leakage prevention metrics

### Stage 6: Demo Mode & Polish
- [x] Hackathon 2-Minute Demo Mode with auto-play walkthrough controller
- [x] Keyboard shortcuts and quick navigation overlay
- [x] Complete `README.md` and `DEMO.md` walkthrough script
- [x] Web production build validation & type check
