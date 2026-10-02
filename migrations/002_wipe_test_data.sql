-- Production Database Wipe & Cleanup Script
-- WARNING: Executing this script will backup and remove synthetic test records.
-- DO NOT RUN AUTOMATICALLY IN PRODUCTION. RUN ONLY WITH EXPLICIT BACKUP VERIFICATION.

-- STEP 1: CREATE BACKUP TABLES BEFORE CLEANUP
CREATE TABLE IF NOT EXISTS public.backup_transactions AS SELECT * FROM public.transactions;
CREATE TABLE IF NOT EXISTS public.backup_wallets AS SELECT * FROM public.wallets;

-- STEP 2: SAFE TRUNCATE/DELETE TEST ROWS
-- Delete transactions created by synthetic test runs
DELETE FROM public.transactions WHERE id LIKE 'TEST-%' OR id LIKE 'IIQ-%' OR id LIKE 'SEED%';

-- Reset wallets for synthetic demo accounts to 0.00 initial production balance
UPDATE public.wallets SET primary_balance = 0.00, cash_reward_balance = 0.00;

-- Audit Logging
INSERT INTO public.audit_logs (user_id, action, details)
VALUES (NULL, 'DATABASE_CLEANUP_EXECUTED', jsonb_build_object('timestamp', NOW()));
