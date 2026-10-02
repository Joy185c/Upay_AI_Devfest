-- Production Supabase Database Schema & Atomic RPC Migration
-- Run this migration in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Create `wallets` table
CREATE TABLE IF NOT EXISTS public.wallets (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (primary_balance >= 0.00),
    cash_reward_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (cash_reward_balance >= 0.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create `transactions` table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    counterparty TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0.00),
    fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0.00),
    total NUMERIC(12, 2) NOT NULL,
    balance_after NUMERIC(12, 2) NOT NULL CHECK (balance_after >= 0.00),
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    wallet_type TEXT DEFAULT 'primary',
    impact_iq_sponsored BOOLEAN DEFAULT FALSE,
    why_offer_reason_en TEXT,
    why_offer_reason_bn TEXT,
    idempotency_key TEXT UNIQUE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create `user_pins` table for hashed PIN storage & brute-force lockout
CREATE TABLE IF NOT EXISTS public.user_pins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pin_hash TEXT NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create `audit_logs` append-only table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only READ their own rows
CREATE POLICY "Users can read own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own pin record" ON public.user_pins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Direct client INSERT/UPDATE/DELETE on wallets and transactions is strictly DENIED
-- State mutations must occur through Security Definer RPC functions

-- -----------------------------------------------------------------------------
-- AUTOMATIC WALLET INITIALIZATION TRIGGER
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (user_id, primary_balance)
    VALUES (NEW.id, 0.00)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.audit_logs (user_id, action, details)
    VALUES (NEW.id, 'USER_SIGNUP', jsonb_build_object('email', NEW.email));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- -----------------------------------------------------------------------------
-- ATOMIC TRANSACTION RPC FUNCTION (SECURITY DEFINER WITH ROW LOCKING & IDEMPOTENCY)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.execute_transfer_atomic(
    p_type TEXT,
    p_counterparty TEXT,
    p_amount NUMERIC,
    p_fee NUMERIC DEFAULT 0.00,
    p_title_en TEXT DEFAULT NULL,
    p_title_bn TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL,
    p_pin_hash TEXT DEFAULT NULL,
    p_cashback_bdt NUMERIC DEFAULT 0.00
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_wallet public.wallets%ROWTYPE;
    v_pin_rec public.user_pins%ROWTYPE;
    v_total_deduction NUMERIC;
    v_new_balance NUMERIC;
    v_is_incoming BOOLEAN;
    v_tx_id TEXT;
    v_timestamp_str TEXT;
    v_existing_tx public.transactions%ROWTYPE;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: User authentication required';
    END IF;

    -- 1. Check Idempotency Key (prevent double submits)
    IF p_idempotency_key IS NOT NULL AND p_idempotency_key != '' THEN
        SELECT * INTO v_existing_tx FROM public.transactions WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', true,
                'is_duplicate', true,
                'transaction', row_to_json(v_existing_tx),
                'balance_after', v_existing_tx.balance_after
            );
        END IF;
    END IF;

    -- 2. Verify PIN & Lockout Status
    SELECT * INTO v_pin_rec FROM public.user_pins WHERE user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'PIN not set. Please set a 4-digit PIN first.';
    END IF;

    IF v_pin_rec.locked_until IS NOT NULL AND v_pin_rec.locked_until > NOW() THEN
        RAISE EXCEPTION 'PIN locked due to 5 wrong attempts. Please try again after %', v_pin_rec.locked_until;
    END IF;

    IF p_pin_hash IS NULL OR v_pin_rec.pin_hash != p_pin_hash THEN
        UPDATE public.user_pins
        SET failed_attempts = failed_attempts + 1,
            locked_until = CASE WHEN failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes' ELSE NULL END,
            updated_at = NOW()
        WHERE user_id = v_user_id;

        INSERT INTO public.audit_logs (user_id, action, details)
        VALUES (v_user_id, 'PIN_VERIFICATION_FAILED', jsonb_build_object('type', p_type, 'attempts', v_pin_rec.failed_attempts + 1));

        RAISE EXCEPTION 'Invalid PIN entered. Attempt % of 5.', v_pin_rec.failed_attempts + 1;
    END IF;

    -- Reset failed attempts on correct PIN
    UPDATE public.user_pins SET failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE user_id = v_user_id;

    -- 3. Row Locking: Lock User Wallet Row for Atomic Balance Calculation
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        INSERT INTO public.wallets (user_id, primary_balance) VALUES (v_user_id, 0.00);
        SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    END IF;

    v_is_incoming := (p_type = 'add_money');
    v_total_deduction := CASE WHEN v_is_incoming THEN 0.00 ELSE (p_amount + COALESCE(p_fee, 0.00)) END;

    -- Validate balance for outgoing
    IF NOT v_is_incoming AND v_wallet.primary_balance < v_total_deduction THEN
        RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', v_wallet.primary_balance, v_total_deduction;
    END IF;

    -- 4. Atomic Balance Mutation
    v_new_balance := CASE WHEN v_is_incoming THEN v_wallet.primary_balance + p_amount ELSE v_wallet.primary_balance - v_total_deduction END;

    UPDATE public.wallets
    SET primary_balance = v_new_balance,
        cash_reward_balance = cash_reward_balance + COALESCE(p_cashback_bdt, 0.00),
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- 5. Insert Transaction Record
    v_tx_id := 'UPAY' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));
    v_timestamp_str := to_char(NOW(), 'HH12:MI AM, DD Mon YYYY');

    INSERT INTO public.transactions (
        id, user_id, type, title_en, title_bn, counterparty, amount, fee, total, balance_after,
        timestamp, status, wallet_type, impact_iq_sponsored, why_offer_reason_en, idempotency_key, note
    ) VALUES (
        v_tx_id, v_user_id, p_type, COALESCE(p_title_en, p_type), COALESCE(p_title_bn, p_type),
        p_counterparty, p_amount, COALESCE(p_fee, 0.00), CASE WHEN v_is_incoming THEN p_amount ELSE v_total_deduction END,
        v_new_balance, v_timestamp_str, 'success', 'primary', (p_cashback_bdt > 0),
        CASE WHEN p_cashback_bdt > 0 THEN 'ImpactIQ Cashback' ELSE NULL END,
        p_idempotency_key, p_note
    );

    -- 6. Audit Logging
    INSERT INTO public.audit_logs (user_id, action, details)
    VALUES (v_user_id, 'TRANSACTION_EXECUTED', jsonb_build_object('tx_id', v_tx_id, 'type', p_type, 'amount', p_amount, 'balance_after', v_new_balance));

    RETURN jsonb_build_object(
        'success', true,
        'transaction', jsonb_build_object(
            'id', v_tx_id, 'type', p_type, 'titleEn', COALESCE(p_title_en, p_type), 'titleBn', COALESCE(p_title_bn, p_type),
            'counterparty', p_counterparty, 'amount', p_amount, 'fee', COALESCE(p_fee, 0.00), 'total', CASE WHEN v_is_incoming THEN p_amount ELSE v_total_deduction END,
            'balanceAfter', v_new_balance, 'timestamp', v_timestamp_str, 'status', 'success', 'note', p_note
        ),
        'balance_after', v_new_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
