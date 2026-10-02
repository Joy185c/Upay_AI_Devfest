# Upay BD ⚡ — Production-Grade Mobile Wallet Application

> **Production-grade simulated mobile financial wallet with real Supabase Auth, Row-Level Security, atomic Postgres RPCs, hashed PIN authentication, Zod form validation, and automated CI/CD.**

---

## 📌 Production Architecture Overview

Upay BD is structured as a **Mode A** production-grade simulated mobile payment application. While no real fiat money gateway keys are required, the entire backend enforcement, atomic transaction engine, user authentication, and data isolation adhere to strict production security standards.

### 🛡️ Core Security Architecture & Enforcements
- **Atomic Balance & Transfers**: All money transfers and wallet mutations execute via a single, atomic PostgreSQL stored procedure (`execute_transfer_atomic`).
- **Row Locking**: Postgres `SELECT ... FOR UPDATE` locks wallet rows during transfers to prevent double-spending and race conditions.
- **Strict RLS Policies**: Direct `INSERT`/`UPDATE` operations on `wallets` and `transactions` tables are prohibited for clients. Mutative operations are strictly executed via `SECURITY DEFINER` RPC functions.
- **Idempotency Keys**: Every financial transfer accepts a unique `idempotency_key` ensuring duplicate requests (network retry / double-click) cannot cause duplicate debits.
- **Hashed Transaction PIN**: 4-digit PINs are salted and hashed with SHA-256 before storage (`user_pins` table). Plain-text PINs are never stored or logged.
- **Audit Logging**: Every mutation, login attempt, or transfer writes an immutable entry to an append-only `audit_logs` table.
- **Environment Gating**: Development tools and JSON import routes (`/demo-admin`) are gated behind `ENABLE_DEMO_TOOLS=false`.
- **Global Error Boundary**: Client-side unhandled errors are trapped gracefully with retry fallbacks (`ErrorBoundary.tsx`).

---

## 🛠️ Environment Configuration (`.env`)

Copy `.env.example` to `.env` and populate your Supabase production credentials:

```env
# Production Mode Gating
ENABLE_DEMO_TOOLS=false

# Supabase Production Project Configuration
EXPO_PUBLIC_SUPABASE_URL=https://izlhovwbtvappyqtvnww.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_vyqdYxzft0e7v57X3U3DIA_DKl_BZAG

# Optional Service Role Key (SERVER-SIDE ONLY - NEVER EXPOSE IN FRONTEND)
SUPABASE_SECRET_KEY=your_supabase_secret_key_here
```

---

## 🗄️ Database Migrations

Database migrations are managed as versioned SQL scripts inside the `migrations/` directory:

1. **`migrations/001_production_schema.sql`**:
   - Creates `wallets`, `transactions`, `user_pins`, and `audit_logs` tables.
   - Enforces Foreign Key constraints, non-negative balance checks (`balance >= 0`), positive transfer checks (`amount > 0`).
   - Configures strict Row Level Security (RLS) policies.
   - Creates `handle_new_user_signup()` trigger for automatic wallet allocation.
   - Installs `execute_transfer_atomic` RPC function with `FOR UPDATE` row locking.

2. **`migrations/002_wipe_test_data.sql`**:
   - Creates backup tables (`backup_wallets`, `backup_transactions`).
   - Safely truncates test/demo transactions and resets wallet balances.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Type Check & Unit Tests
```bash
# TypeScript compilation check
cmd /c npx tsc --noEmit

# Jest unit test suite (14 passing tests)
npm test
```

### 3. Start Local Web Application
```bash
npx expo start --web
```
Open `http://localhost:8081` in your browser.

---

## 📋 Production Go-Live Checklist

- [x] **Strict RLS Verification**: Verify direct `INSERT`/`UPDATE` access to `wallets` & `transactions` is disabled for `authenticated` and `anon` roles.
- [x] **Atomic RPC Function**: Verify `execute_transfer_atomic` utilizes `SELECT ... FOR UPDATE` and checks `idempotency_key`.
- [x] **Auth Configuration**: Enable Email + Password and Google OAuth in Supabase Auth settings.
- [x] **Demo Gate**: Ensure `ENABLE_DEMO_TOOLS=false` in production environment variables.
- [x] **PIN Security**: Ensure transaction PINs are stored as SHA-256 hashes and gated behind 5-attempt lockout policy.
- [x] **Zod Input Validation**: Validate BD mobile numbers (`/^01[3-9]\d{8}$/`) and positive transfer amounts client-side and server-side.
- [x] **Error Handling**: Verify root layout is wrapped with `ErrorBoundary`.
- [x] **Legal & Compliance Notices**: Add Privacy Policy (`/privacy`), Terms of Service (`/terms`), Support (`/contact`), and Simulation Banner.
- [x] **CI/CD Integration**: Verify GitHub Actions workflow (`.github/workflows/ci.yml`) passes on pull requests.
- [x] **SEO & Web Manifest**: Configure `robots.txt` and `manifest.json`.

---

## 🔄 Rollback Plan

In case of a production defect post-deployment:

1. **Vercel Rollback**:
   - Open Vercel Dashboard -> Deployments.
   - Select previous healthy deployment and click **Promote to Production**.
2. **Database State Recovery**:
   - If data corruption occurs, restore table state using `backup_wallets` and `backup_transactions` created by `migrations/002_wipe_test_data.sql`.
   - Restore query:
     ```sql
     INSERT INTO public.wallets SELECT * FROM backup_wallets ON CONFLICT (user_id) DO UPDATE SET balance = EXCLUDED.balance;
     ```

---

## ⚠️ Remaining Manual Risks & Administrative Items

1. **Supabase Secret Key Security**:
   - `SUPABASE_SECRET_KEY` (service role) must **NEVER** be embedded in web frontend builds or Expo client bundles. It is reserved exclusively for server-side administrative jobs.
2. **Google OAuth Client Credentials**:
   - Set up production Google OAuth Client ID & Secret in Supabase Auth -> Providers -> Google.
3. **Regulatory Licensing (If transitioning to Mode B)**:
   - Mode B (real fiat transactions) requires Bangladesh Bank PSP/PSO license, PCI-DSS compliance, and gateway merchant agreements (SSLCommerz, bKash Merchant API).

---

## ⚖️ Legal Disclaimer

Upay BD is an application prototype inspired by Bangladesh mobile financial services (MFS) interface patterns for technical simulation, demonstration, and research purposes.
