-- Supabase Database Schema for Upay BD App
-- Execute this SQL script in your Supabase Project SQL Editor (https://app.supabase.com)

-- 1. Create `wallets` table
CREATE TABLE IF NOT EXISTS public.wallets (
    id TEXT PRIMARY KEY,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 10000.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for Demo
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on wallets" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on wallets" ON public.wallets FOR ALL USING (true);

-- Insert initial primary wallet record
INSERT INTO public.wallets (id, balance)
VALUES ('primary_wallet', 10000.00)
ON CONFLICT (id) DO NOTHING;

-- 2. Create `transactions` table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title_en TEXT,
    title_bn TEXT,
    counterparty TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    fee NUMERIC(12, 2) DEFAULT 0.00,
    total NUMERIC(12, 2),
    balance_after NUMERIC(12, 2),
    timestamp TEXT,
    status TEXT NOT NULL,
    wallet_type TEXT DEFAULT 'primary',
    impact_iq_sponsored BOOLEAN DEFAULT FALSE,
    why_offer_reason_en TEXT,
    why_offer_reason_bn TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for Demo
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on transactions" ON public.transactions FOR ALL USING (true);
