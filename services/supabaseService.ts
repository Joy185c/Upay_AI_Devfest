// Supabase Integration Service Layer for Wallets & Transactions
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Transaction } from '../types';

export class SupabaseService {
  /**
   * Check if Supabase client is connected and configured
   */
  static isConnected(): boolean {
    return isSupabaseConfigured;
  }

  /**
   * Fetch primary wallet balance from Supabase database table `wallets`
   */
  static async getBalance(): Promise<number | null> {
    if (!this.isConnected()) return null;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', 'primary_wallet')
        .single();

      if (error) {
        console.warn('Supabase balance query warning:', error.message);
        return null;
      }

      if (data && typeof data.balance === 'number') {
        return data.balance;
      }
    } catch (err) {
      console.error('Supabase balance error:', err);
    }
    return null;
  }

  /**
   * Save / update primary wallet balance in Supabase `wallets` table
   */
  static async setBalance(balance: number): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      const { error } = await supabase.from('wallets').upsert({
        id: 'primary_wallet',
        balance: Math.round(balance * 100) / 100,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Supabase setBalance warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase setBalance error:', err);
      return false;
    }
  }

  /**
   * Fetch transaction history from Supabase database table `transactions`
   */
  static async getTransactions(): Promise<Transaction[] | null> {
    if (!this.isConnected()) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getTransactions warning:', error.message);
        return null;
      }

      if (Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          type: row.type,
          titleEn: row.title_en,
          titleBn: row.title_bn,
          counterparty: row.counterparty,
          amount: parseFloat(row.amount),
          fee: parseFloat(row.fee || 0),
          total: parseFloat(row.total || row.amount),
          balanceAfter: row.balance_after ? parseFloat(row.balance_after) : undefined,
          timestamp: row.timestamp,
          status: row.status,
          walletType: row.wallet_type || 'primary',
          impactIQSponsored: row.impact_iq_sponsored,
          whyOfferReasonEn: row.why_offer_reason_en,
          whyOfferReasonBn: row.why_offer_reason_bn,
          note: row.note,
        }));
      }
    } catch (err) {
      console.error('Supabase getTransactions error:', err);
    }
    return null;
  }

  /**
   * Insert a new transaction into Supabase `transactions` table
   */
  static async recordTransaction(tx: Transaction): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      const { error } = await supabase.from('transactions').insert({
        id: tx.id,
        type: tx.type,
        title_en: tx.titleEn,
        title_bn: tx.titleBn,
        counterparty: tx.counterparty,
        amount: tx.amount,
        fee: tx.fee || 0,
        total: tx.total || tx.amount + (tx.fee || 0),
        balance_after: tx.balanceAfter,
        timestamp: tx.timestamp,
        status: tx.status,
        wallet_type: tx.walletType || 'primary',
        impact_iq_sponsored: tx.impactIQSponsored || false,
        why_offer_reason_en: tx.whyOfferReasonEn,
        whyOfferReason_bn: tx.whyOfferReasonBn,
        note: tx.note,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Supabase recordTransaction warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase recordTransaction error:', err);
      return false;
    }
  }
}
