// Upay Transaction Service - Persistent Wallet & History Service Layer
import { Transaction } from '../types';
import { mockTransactions } from '../data/seededData';

export const DEFAULT_BALANCE = 10000.00;
export const DEMO_PIN = '1234';

const STORAGE_BALANCE_KEY = 'upay_bd_balance_v1';
const STORAGE_TRANSACTIONS_KEY = 'upay_bd_transactions_v1';

// Internal memory fallback if localStorage is restricted or unavailable
let memoryBalance: number = DEFAULT_BALANCE;
let memoryTransactions: Transaction[] = [...mockTransactions];

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function getStorageItem(key: string): string | null {
  try {
    if (isBrowser) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn('Storage read warning:', err);
  }
  return null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (isBrowser) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    console.warn('Storage write warning:', err);
  }
}

function removeStorageItem(key: string): void {
  try {
    if (isBrowser) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('Storage remove warning:', err);
  }
}

export class TransactionService {
  /**
   * Helper: Calculates standard fee rules
   * - Cash Out: 1.85% fee (rounded to 2 decimals)
   * - Send Money / Recharge / Add Money / Pay Bill: Free (0 BDT)
   */
  calculateFee(type: Transaction['type'], amount: number): number {
    if (type === 'cash_out') {
      return Math.round(amount * 0.0185 * 100) / 100;
    }
    return 0;
  }

  /**
   * Helper: Validates Bangladeshi mobile phone numbers (11 digits starting with 013-019)
   */
  validateBdPhone(phone: string): { valid: boolean; error?: string } {
    const clean = phone.replace(/\s+/g, '');
    if (!clean) {
      return { valid: false, error: 'Phone number is required.' };
    }
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(clean)) {
      return { valid: false, error: 'Enter a valid 11-digit BD number (01XXXXXXXXX).' };
    }
    return { valid: true };
  }

  /**
   * Fetch current primary wallet balance
   */
  async getBalance(): Promise<number> {
    const saved = getStorageItem(STORAGE_BALANCE_KEY);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0) {
        memoryBalance = parsed;
        return parsed;
      }
    }
    // Initialize default if absent
    this.setBalance(DEFAULT_BALANCE);
    return DEFAULT_BALANCE;
  }

  /**
   * Set primary wallet balance
   */
  async setBalance(balance: number): Promise<void> {
    const rounded = Math.round(balance * 100) / 100;
    memoryBalance = rounded;
    setStorageItem(STORAGE_BALANCE_KEY, rounded.toString());
  }

  /**
   * Fetch list of transactions, newest first
   */
  async getTransactions(): Promise<Transaction[]> {
    const saved = getStorageItem(STORAGE_TRANSACTIONS_KEY);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          memoryTransactions = parsed;
          return [...parsed];
        }
      } catch (err) {
        console.error('Failed to parse stored transactions:', err);
      }
    }
    // Seed default mock transactions if missing or corrupted
    await this.saveTransactions(mockTransactions);
    return [...mockTransactions];
  }

  /**
   * Save transaction array
   */
  private async saveTransactions(txs: Transaction[]): Promise<void> {
    memoryTransactions = txs;
    setStorageItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(txs));
  }

  /**
   * Execute a new transaction with validation, PIN check, balance update, and persistence
   */
  async executeTransaction(params: {
    type: Transaction['type'];
    counterparty: string;
    amount: number;
    titleEn?: string;
    titleBn?: string;
    note?: string;
    pin: string;
    impactIQSponsored?: boolean;
    cashbackBDT?: number;
  }): Promise<{
    success: boolean;
    transaction: Transaction;
    errorMessage?: string;
    balanceAfter: number;
  }> {
    const currentBalance = await this.getBalance();
    const amount = Math.round((params.amount || 0) * 100) / 100;
    const fee = this.calculateFee(params.type, amount);
    const isIncoming = params.type === 'add_money';
    const totalDeduction = isIncoming ? 0 : amount + fee;

    // Create timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const timestampStr = `${timeStr}, ${dateStr}`;

    const txId = `UPAY${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Titles
    const titles: Record<Transaction['type'], { en: string; bn: string }> = {
      send_money: { en: 'Send Money', bn: 'সেন্ড মানি' },
      recharge: { en: 'Mobile Recharge', bn: 'মোবাইল রিচার্জ' },
      cash_out: { en: 'Cash Out', bn: 'ক্যাশ আউট' },
      add_money: { en: 'Add Money', bn: 'অ্যাড মানি' },
      pay_bill: { en: 'Pay Bill', bn: 'পে বিল' },
      payment: { en: 'Make Payment', bn: 'মেক পেমেন্ট' },
      savings: { en: 'Savings', bn: 'সেভিংস' },
      transfer: { en: 'Fund Transfer', bn: 'ফান্ড ট্র্যান্সফার' },
      request: { en: 'Request Money', bn: 'রিকোয়েস্ট মানি' },
      referral: { en: 'Referral Bonus', bn: 'রেফারেল বোনাস' },
      npsb: { en: 'NPSB Transfer', bn: 'এনপিএসবি ট্র্যান্সফার' },
    };

    const titleEn = params.titleEn || titles[params.type]?.en || 'Transaction';
    const titleBn = params.titleBn || titles[params.type]?.bn || 'লেনদেন';

    // Validation 1: Amount check
    if (isNaN(amount) || amount <= 0) {
      const failedTx: Transaction = {
        id: txId,
        type: params.type,
        titleEn: `${titleEn} (Failed)`,
        titleBn: `${titleBn} (ব্যর্থ)`,
        counterparty: params.counterparty || 'N/A',
        amount,
        fee,
        total: totalDeduction,
        balanceAfter: currentBalance,
        timestamp: timestampStr,
        status: 'failed',
        walletType: 'primary',
        note: 'Invalid amount entered',
      };
      await this.recordTransaction(failedTx);
      return { success: false, transaction: failedTx, errorMessage: 'Amount must be greater than 0.', balanceAfter: currentBalance };
    }

    // Validation 2: Balance check for outgoing
    if (!isIncoming && totalDeduction > currentBalance) {
      const failedTx: Transaction = {
        id: txId,
        type: params.type,
        titleEn: `${titleEn} (Failed)`,
        titleBn: `${titleBn} (ব্যর্থ)`,
        counterparty: params.counterparty || 'N/A',
        amount,
        fee,
        total: totalDeduction,
        balanceAfter: currentBalance,
        timestamp: timestampStr,
        status: 'failed',
        walletType: 'primary',
        note: 'Insufficient wallet balance',
      };
      await this.recordTransaction(failedTx);
      return { success: false, transaction: failedTx, errorMessage: `Insufficient balance. Required ৳${totalDeduction.toFixed(2)}, Available ৳${currentBalance.toFixed(2)}.`, balanceAfter: currentBalance };
    }

    // Validation 3: PIN Check (Demo PIN is 1234)
    if (params.pin !== DEMO_PIN) {
      const failedTx: Transaction = {
        id: txId,
        type: params.type,
        titleEn: `${titleEn} (Failed)`,
        titleBn: `${titleBn} (ব্যর্থ)`,
        counterparty: params.counterparty || 'N/A',
        amount,
        fee,
        total: totalDeduction,
        balanceAfter: currentBalance,
        timestamp: timestampStr,
        status: 'failed',
        walletType: 'primary',
        note: 'Incorrect PIN entered',
      };
      await this.recordTransaction(failedTx);
      return { success: false, transaction: failedTx, errorMessage: 'Invalid PIN. (Demo PIN is 1234)', balanceAfter: currentBalance };
    }

    // Calculate new balance
    const newBalance = isIncoming ? currentBalance + amount : currentBalance - totalDeduction;
    await this.setBalance(newBalance);

    const successfulTx: Transaction = {
      id: txId,
      type: params.type,
      titleEn,
      titleBn,
      counterparty: params.counterparty,
      amount,
      fee,
      total: isIncoming ? amount : totalDeduction,
      balanceAfter: newBalance,
      timestamp: timestampStr,
      status: 'success',
      walletType: 'primary',
      impactIQSponsored: params.impactIQSponsored,
      whyOfferReasonBn: params.cashbackBDT ? `ইমপ্যাক্টআইকিউ ক্যাশব্যাক ৳${params.cashbackBDT} ক্যাশ রিওয়ার্ড ওয়ালেটে জমা হয়েছে!` : undefined,
      whyOfferReasonEn: params.cashbackBDT ? `ImpactIQ Cashback ৳${params.cashbackBDT} credited to Cash Reward!` : undefined,
      note: params.note,
    };

    await this.recordTransaction(successfulTx);
    return { success: true, transaction: successfulTx, balanceAfter: newBalance };
  }

  private async recordTransaction(tx: Transaction): Promise<void> {
    const list = await this.getTransactions();
    list.unshift(tx);
    await this.saveTransactions(list);
  }

  /**
   * Reset balance and transactions to default demo state
   */
  async resetDemoData(): Promise<{ balance: number; transactions: Transaction[] }> {
    removeStorageItem(STORAGE_BALANCE_KEY);
    removeStorageItem(STORAGE_TRANSACTIONS_KEY);
    await this.setBalance(DEFAULT_BALANCE);
    await this.saveTransactions(mockTransactions);
    return { balance: DEFAULT_BALANCE, transactions: [...mockTransactions] };
  }
}

export const transactionService = new TransactionService();
