// Pure Helper Functions for Financial Insights & Analytics
import { Transaction } from '../types';

export type TimePeriod = '7d' | '30d' | 'all';

export interface FilterOptions {
  period?: TimePeriod;
  type?: string;
  status?: 'all' | 'success' | 'failed';
  searchQuery?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SummaryMetrics {
  totalSent: number;
  totalReceived: number;
  totalFees: number;
  txCount: number;
  successCount: number;
  failedCount: number;
  netFlow: number;
}

export interface CategoryBreakdown {
  type: string;
  labelEn: string;
  labelBn: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyTrendPoint {
  dateKey: string; // YYYY-MM-DD
  dateLabel: string; // e.g. "28 Sep"
  sentAmount: number;
  receivedAmount: number;
  txCount: number;
}

export interface TopRecipient {
  counterparty: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
}

export interface MonthlyLimitStatus {
  spentAmount: number;
  monthlyLimit: number;
  percentage: number;
  isWarning: boolean; // >= 80%
  isExceeded: boolean; // >= 100%
  remainingBudget: number;
}

/**
 * Filter transactions based on period, type, status, search query, and amount range.
 */
export function filterTransactions(
  transactions: Transaction[],
  options: FilterOptions = {}
): Transaction[] {
  const {
    period = 'all',
    type = 'all',
    status = 'all',
    searchQuery = '',
    minAmount,
    maxAmount,
  } = options;

  const now = new Date();

  return transactions.filter((tx) => {
    // 1. Period Filter
    if (period !== 'all' && tx.timestamp) {
      const txDate = parseTxTimestamp(tx.timestamp);
      if (txDate) {
        const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
        if (period === '7d' && diffDays > 7) return false;
        if (period === '30d' && diffDays > 30) return false;
      }
    }

    // 2. Type Filter
    if (type !== 'all' && tx.type !== type) {
      return false;
    }

    // 3. Status Filter
    if (status !== 'all' && tx.status !== status) {
      return false;
    }

    // 4. Amount Range Filter
    if (minAmount !== undefined && !isNaN(minAmount) && tx.amount < minAmount) {
      return false;
    }
    if (maxAmount !== undefined && !isNaN(maxAmount) && tx.amount > maxAmount) {
      return false;
    }

    // 5. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle =
        (tx.titleEn || '').toLowerCase().includes(query) ||
        (tx.titleBn || '').toLowerCase().includes(query);
      const matchCounterparty = (tx.counterparty || '').toLowerCase().includes(query);
      const matchId = (tx.id || '').toLowerCase().includes(query);
      const matchAmount = tx.amount.toString().includes(query);
      const matchNote = (tx.note || '').toLowerCase().includes(query);

      if (!matchTitle && !matchCounterparty && !matchId && !matchAmount && !matchNote) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate Summary Metrics (Sent, Received, Fees, Counts)
 */
export function calculateSummaryMetrics(transactions: Transaction[]): SummaryMetrics {
  let totalSent = 0;
  let totalReceived = 0;
  let totalFees = 0;
  let successCount = 0;
  let failedCount = 0;

  transactions.forEach((tx) => {
    if (tx.status === 'success') {
      successCount += 1;
      totalFees += tx.fee || 0;

      if (tx.type === 'add_money') {
        totalReceived += tx.amount;
      } else {
        totalSent += tx.amount + (tx.fee || 0);
      }
    } else if (tx.status === 'failed') {
      failedCount += 1;
    }
  });

  return {
    totalSent: Math.round(totalSent * 100) / 100,
    totalReceived: Math.round(totalReceived * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    txCount: transactions.length,
    successCount,
    failedCount,
    netFlow: Math.round((totalReceived - totalSent) * 100) / 100,
  };
}

/**
 * Calculate Spending Breakdown by Category / Type
 */
export function calculateCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const typeMeta: Record<string, { labelEn: string; labelBn: string; color: string }> = {
    send_money: { labelEn: 'Send Money', labelBn: 'সেন্ড মানি', color: '#0B4DA2' },
    recharge: { labelEn: 'Mobile Recharge', labelBn: 'মোবাইল রিচার্জ', color: '#8B5CF6' },
    cash_out: { labelEn: 'Cash Out', labelBn: 'ক্যাশ আউট', color: '#D97706' },
    pay_bill: { labelEn: 'Pay Bill', labelBn: 'পে বিল', color: '#00A859' },
    payment: { labelEn: 'Make Payment', labelBn: 'মেক পেমেন্ট', color: '#EC4899' },
    add_money: { labelEn: 'Add Money', labelBn: 'অ্যাড মানি', color: '#10B981' },
    savings: { labelEn: 'Savings', labelBn: 'সেভিংস', color: '#6366F1' },
  };

  const totals: Record<string, { amount: number; count: number }> = {};
  let grandTotal = 0;

  transactions.forEach((tx) => {
    if (tx.status === 'success' && tx.type !== 'add_money') {
      const type = tx.type || 'other';
      if (!totals[type]) {
        totals[type] = { amount: 0, count: 0 };
      }
      const itemTotal = tx.amount + (tx.fee || 0);
      totals[type].amount += itemTotal;
      totals[type].count += 1;
      grandTotal += itemTotal;
    }
  });

  const categories: CategoryBreakdown[] = Object.keys(totals).map((type) => {
    const meta = typeMeta[type] || { labelEn: type, labelBn: type, color: '#64748B' };
    const amount = Math.round(totals[type].amount * 100) / 100;
    const percentage = grandTotal > 0 ? Math.round((amount / grandTotal) * 1000) / 10 : 0;

    return {
      type,
      labelEn: meta.labelEn,
      labelBn: meta.labelBn,
      amount,
      count: totals[type].count,
      percentage,
      color: meta.color,
    };
  });

  return categories.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate Daily Spending Trend over the last N days
 */
export function calculateDailySpendingTrend(transactions: Transaction[], days = 30): DailyTrendPoint[] {
  const trendMap: Record<string, { sentAmount: number; receivedAmount: number; txCount: number; dateLabel: string }> = {};

  // Initialize last N days map
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    trendMap[key] = { sentAmount: 0, receivedAmount: 0, txCount: 0, dateLabel: label };
  }

  transactions.forEach((tx) => {
    if (tx.status === 'success' && tx.timestamp) {
      const txDate = parseTxTimestamp(tx.timestamp);
      if (txDate) {
        const key = txDate.toISOString().split('T')[0];
        if (trendMap[key]) {
          trendMap[key].txCount += 1;
          if (tx.type === 'add_money') {
            trendMap[key].receivedAmount += tx.amount;
          } else {
            trendMap[key].sentAmount += tx.amount + (tx.fee || 0);
          }
        }
      }
    }
  });

  return Object.entries(trendMap).map(([dateKey, val]) => ({
    dateKey,
    dateLabel: val.dateLabel,
    sentAmount: Math.round(val.sentAmount * 100) / 100,
    receivedAmount: Math.round(val.receivedAmount * 100) / 100,
    txCount: val.txCount,
  }));
}

/**
 * Calculate Top Recipients / Counterparties
 */
export function calculateTopRecipients(transactions: Transaction[], limit = 5): TopRecipient[] {
  const map: Record<string, { count: number; totalAmount: number }> = {};

  transactions.forEach((tx) => {
    if (tx.status === 'success' && tx.counterparty && tx.type !== 'add_money') {
      const cp = tx.counterparty.trim();
      if (!map[cp]) {
        map[cp] = { count: 0, totalAmount: 0 };
      }
      map[cp].count += 1;
      map[cp].totalAmount += tx.amount;
    }
  });

  const list: TopRecipient[] = Object.entries(map).map(([cp, val]) => ({
    counterparty: cp,
    count: val.count,
    totalAmount: Math.round(val.totalAmount * 100) / 100,
    avgAmount: Math.round((val.totalAmount / val.count) * 100) / 100,
  }));

  return list.sort((a, b) => b.count - a.count || b.totalAmount - a.totalAmount).slice(0, limit);
}

/**
 * Calculate Monthly Spending Limit Progress (80% Warning threshold)
 */
export function calculateMonthlySpendingProgress(
  transactions: Transaction[],
  monthlyLimit = 25000
): MonthlyLimitStatus {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let spentAmount = 0;

  transactions.forEach((tx) => {
    if (tx.status === 'success' && tx.type !== 'add_money' && tx.timestamp) {
      const txDate = parseTxTimestamp(tx.timestamp);
      if (txDate && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        spentAmount += tx.amount + (tx.fee || 0);
      }
    }
  });

  spentAmount = Math.round(spentAmount * 100) / 100;
  const percentage = monthlyLimit > 0 ? Math.round((spentAmount / monthlyLimit) * 1000) / 10 : 0;
  const remainingBudget = Math.max(0, Math.round((monthlyLimit - spentAmount) * 100) / 100);

  return {
    spentAmount,
    monthlyLimit,
    percentage,
    isWarning: percentage >= 80,
    isExceeded: percentage >= 100,
    remainingBudget,
  };
}

/**
 * Internal Helper: Parse timestamp strings like "08:45 PM, 01 Oct 2026" or ISO strings
 */
export function parseTxTimestamp(ts: string): Date | null {
  try {
    if (!ts) return null;
    // Check if ISO
    const isoDate = new Date(ts);
    if (!isNaN(isoDate.getTime())) return isoDate;

    // Handle "11:10 PM, 01 Oct 2026"
    const parts = ts.split(',');
    if (parts.length >= 2) {
      const datePart = parts[parts.length - 1].trim(); // "01 Oct 2026"
      const d = new Date(datePart);
      if (!isNaN(d.getTime())) return d;
    }
  } catch (err) {
    // Ignore parse error
  }
  return null;
}
