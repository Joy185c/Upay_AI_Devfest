import { describe, test, expect } from '@jest/globals';
import { Transaction } from '../../types';
import {
  calculateSummaryMetrics,
  calculateCategoryBreakdown,
  calculateMonthlySpendingProgress,
  calculateTopRecipients,
  filterTransactions,
} from '../insightUtils';

describe('Financial Insights Calculation Unit Tests', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'TX-001',
      type: 'send_money',
      titleEn: 'Send Money',
      titleBn: 'সেন্ড মানি',
      counterparty: '01819283746',
      amount: 1000.0,
      fee: 0.0,
      timestamp: '11:00 AM, 01 Oct 2026',
      status: 'success',
      walletType: 'primary',
    },
    {
      id: 'TX-002',
      type: 'cash_out',
      titleEn: 'Cash Out',
      titleBn: 'ক্যাশ আউট',
      counterparty: 'Agent 01711223344',
      amount: 2000.0,
      fee: 37.0, // 1.85%
      timestamp: '02:30 PM, 01 Oct 2026',
      status: 'success',
      walletType: 'primary',
    },
    {
      id: 'TX-003',
      type: 'add_money',
      titleEn: 'Add Money',
      titleBn: 'অ্যাড মানি',
      counterparty: 'City Bank Card **** 8362',
      amount: 5000.0,
      fee: 0.0,
      timestamp: '09:15 AM, 30 Sep 2026',
      status: 'success',
      walletType: 'primary',
    },
    {
      id: 'TX-004',
      type: 'send_money',
      titleEn: 'Send Money (Failed)',
      titleBn: 'সেন্ড মানি (ব্যর্থ)',
      counterparty: '01819283746',
      amount: 500.0,
      fee: 0.0,
      timestamp: '08:00 PM, 29 Sep 2026',
      status: 'failed',
      walletType: 'primary',
    },
    {
      id: 'TX-005',
      type: 'pay_bill',
      titleEn: 'Pay Bill - DESCO',
      titleBn: 'পে বিল - DESCO',
      counterparty: 'DESCO Electricity',
      amount: 1450.0,
      fee: 0.0,
      timestamp: '04:20 PM, 28 Sep 2026',
      status: 'success',
      walletType: 'primary',
    },
  ];

  describe('calculateSummaryMetrics', () => {
    test('computes correct total sent, received, fees, and net flow', () => {
      const summary = calculateSummaryMetrics(sampleTransactions);

      // Sent = Send (1000) + CashOut (2000 + 37) + PayBill (1450) = 4487.00
      expect(summary.totalSent).toBe(4487.0);
      // Received = AddMoney (5000.00)
      expect(summary.totalReceived).toBe(5000.0);
      // Fees = 37.00
      expect(summary.totalFees).toBe(37.0);
      // Total count = 5, success = 4, failed = 1
      expect(summary.txCount).toBe(5);
      expect(summary.successCount).toBe(4);
      expect(summary.failedCount).toBe(1);
      // Net flow = 5000 - 4487 = +513.00
      expect(summary.netFlow).toBe(513.0);
    });

    test('handles empty transaction list safely', () => {
      const summary = calculateSummaryMetrics([]);
      expect(summary.totalSent).toBe(0);
      expect(summary.totalReceived).toBe(0);
      expect(summary.totalFees).toBe(0);
      expect(summary.txCount).toBe(0);
      expect(summary.netFlow).toBe(0);
    });
  });

  describe('calculateCategoryBreakdown', () => {
    test('aggregates spending by transaction category type correctly', () => {
      const breakdown = calculateCategoryBreakdown(sampleTransactions);

      // Cash Out: 2037 BDT (highest outgoing category)
      expect(breakdown[0].type).toBe('cash_out');
      expect(breakdown[0].amount).toBe(2037.0);

      // Send Money & Pay Bill categories present in outgoing spending
      const sendMoneyCat = breakdown.find((c) => c.type === 'send_money');
      expect(sendMoneyCat).toBeDefined();
      expect(sendMoneyCat?.amount).toBe(1000.0);
    });
  });

  describe('calculateMonthlySpendingProgress', () => {
    test('detects when monthly budget limit passes 80% warning threshold', () => {
      // Oct 2026 transactions sum = SendMoney (1000) + CashOut (2037) = 3037 BDT
      // With limit 3500 BDT: percentage = (3037 / 3500) * 100 = 86.77% (warning active)
      const warningResult = calculateMonthlySpendingProgress(sampleTransactions, 3500);
      expect(warningResult.percentage).toBeGreaterThanOrEqual(80);
      expect(warningResult.isWarning).toBe(true);
      expect(warningResult.isExceeded).toBe(false);

      // With limit 10000: percentage = 30.37% (no warning)
      const normalResult = calculateMonthlySpendingProgress(sampleTransactions, 10000);
      expect(normalResult.isWarning).toBe(false);
    });
  });

  describe('calculateTopRecipients', () => {
    test('ranks counterparties by transaction count and amount', () => {
      const top = calculateTopRecipients(sampleTransactions, 3);
      expect(top.length).toBeGreaterThan(0);

      // 01819283746 has 1 successful transaction in successful outgoing
      const topNumbers = top.map((t) => t.counterparty);
      expect(topNumbers).toContain('01819283746');
    });
  });

  describe('filterTransactions', () => {
    test('filters by search query', () => {
      const filtered = filterTransactions(sampleTransactions, { searchQuery: 'DESCO' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('TX-005');
    });

    test('filters by status', () => {
      const failedList = filterTransactions(sampleTransactions, { status: 'failed' });
      expect(failedList.length).toBe(1);
      expect(failedList[0].status).toBe('failed');
    });

    test('filters by amount range', () => {
      const rangeList = filterTransactions(sampleTransactions, { minAmount: 1200, maxAmount: 3000 });
      expect(rangeList.every((tx) => tx.amount >= 1200 && tx.amount <= 3000)).toBe(true);
    });
  });
});
