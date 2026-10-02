// Seed Service - Generates 100+ Realistic Demo Transactions spanning the last 90 days
import { Transaction } from '../types';
import { transactionService } from './transactionService';

export class SeedService {
  /**
   * Generates 100+ realistic transactions spanning the past 90 days
   */
  static generate90DayDemoData(count = 105): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();

    const counterparties = {
      send: ['01819283746', '01711223344', '01912883310', '01309887766', '01678123456', '01552345678'],
      recharge: ['Grameenphone (01712345678)', 'Robi (01819283746)', 'Banglalink (01911223344)', 'Airtel (01678123456)'],
      cashout: ['Agent 01711223344', 'Agent 01819998877', 'Agent 01911002233', 'Agent 01309112233'],
      addmoney: ['City Bank Card **** 8362', 'BRAC Bank App **** 1094', 'Islami Bank CellFin', 'DBBL Nexus **** 4491'],
      bill: ['DESCO Electricity', 'DPDC Electricity', 'TITAS Gas', 'WASA Water', 'Carnival Internet'],
      payment: ['Dhaka Fresh Mart', 'Shwapno Superstore', 'Aarong', 'Star Cineplex', 'Unimart'],
    };

    const types: Transaction['type'][] = ['send_money', 'recharge', 'cash_out', 'add_money', 'pay_bill', 'payment'];

    let runningBalance = 10000.00;

    for (let i = 0; i < count; i++) {
      // Pick random date within past 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const hour = Math.floor(Math.random() * 14) + 8; // 8 AM to 10 PM
      const minute = Math.floor(Math.random() * 60);

      const txDate = new Date(now);
      txDate.setDate(txDate.getDate() - daysAgo);
      txDate.setHours(hour, minute);

      const type = types[Math.floor(Math.random() * types.length)];
      const isFailed = Math.random() < 0.05; // ~5% failure rate
      const status: Transaction['status'] = isFailed ? 'failed' : 'success';

      let amount = 0;
      let counterparty = '';
      let titleEn = '';
      let titleBn = '';
      let fee = 0;

      switch (type) {
        case 'send_money':
          amount = Math.floor(Math.random() * 45 + 1) * 100; // 100 to 4500
          counterparty = counterparties.send[Math.floor(Math.random() * counterparties.send.length)];
          titleEn = 'Send Money';
          titleBn = 'সেন্ড মানি';
          fee = 0;
          break;
        case 'recharge':
          amount = [50, 100, 200, 300, 500, 1000][Math.floor(Math.random() * 6)];
          counterparty = counterparties.recharge[Math.floor(Math.random() * counterparties.recharge.length)];
          titleEn = 'Mobile Recharge';
          titleBn = 'মোবাইল রিচার্জ';
          fee = 0;
          break;
        case 'cash_out':
          amount = Math.floor(Math.random() * 30 + 5) * 100; // 500 to 3500
          counterparty = counterparties.cashout[Math.floor(Math.random() * counterparties.cashout.length)];
          titleEn = 'Cash Out - Agent';
          titleBn = 'ক্যাশ আউট - এজেন্ট';
          fee = Math.round(amount * 0.0185 * 100) / 100; // 1.85%
          break;
        case 'add_money':
          amount = [2000, 5000, 8000, 10000, 15000][Math.floor(Math.random() * 5)];
          counterparty = counterparties.addmoney[Math.floor(Math.random() * counterparties.addmoney.length)];
          titleEn = 'Add Money';
          titleBn = 'অ্যাড মানি';
          fee = 0;
          break;
        case 'pay_bill':
          amount = Math.floor(Math.random() * 20 + 5) * 100; // 500 to 2500
          counterparty = counterparties.bill[Math.floor(Math.random() * counterparties.bill.length)];
          titleEn = `Pay Bill - ${counterparty}`;
          titleBn = `পে বিল - ${counterparty}`;
          fee = 0;
          break;
        case 'payment':
          amount = Math.floor(Math.random() * 15 + 2) * 100; // 200 to 1700
          counterparty = counterparties.payment[Math.floor(Math.random() * counterparties.payment.length)];
          titleEn = `Make Payment - ${counterparty}`;
          titleBn = `মেক পেমেন্ট - ${counterparty}`;
          fee = 0;
          break;
      }

      const totalDeduction = type === 'add_money' ? 0 : amount + fee;

      if (status === 'success') {
        if (type === 'add_money') {
          runningBalance += amount;
        } else {
          runningBalance = Math.max(500, runningBalance - totalDeduction);
        }
      }

      const dateStr = txDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = txDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const tx: Transaction = {
        id: `SEED${txDate.getFullYear()}${String(txDate.getMonth() + 1).padStart(2, '0')}${String(txDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`,
        type,
        titleEn: status === 'failed' ? `${titleEn} (Failed)` : titleEn,
        titleBn: status === 'failed' ? `${titleBn} (ব্যর্থ)` : titleBn,
        counterparty,
        amount,
        fee,
        total: type === 'add_money' ? amount : totalDeduction,
        balanceAfter: Math.round(runningBalance * 100) / 100,
        timestamp: `${timeStr}, ${dateStr}`,
        status,
        walletType: 'primary',
        impactIQSponsored: Math.random() < 0.2, // ~20% ImpactIQ sponsored
        whyOfferReasonEn: type === 'pay_bill' ? 'ImpactIQ 10% Eid Bill-Pay Cashback' : undefined,
      };

      transactions.push(tx);
    }

    // Sort newest first
    transactions.sort((a, b) => {
      const dateA = new Date(a.timestamp.split(',')[1] || a.timestamp).getTime();
      const dateB = new Date(b.timestamp.split(',')[1] || b.timestamp).getTime();
      return dateB - dateA;
    });

    return transactions;
  }

  /**
   * Seed transactions into storage & Zustand store
   */
  static async seedDemoDataToStorage(count = 105): Promise<{ balance: number; transactions: Transaction[] }> {
    const txs = this.generate90DayDemoData(count);
    const balance = txs.length > 0 && txs[0].balanceAfter !== undefined ? txs[0].balanceAfter : 14250.00;

    await transactionService.setBalance(balance);
    // Write directly into transactionService storage
    const storageKey = 'upay_bd_transactions_v1';
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(txs));
    }
    return { balance, transactions: txs };
  }
}
