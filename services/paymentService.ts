// ImpactIQ Customer Payment & Wallet Service

import { Transaction } from '../types';
import { mockTransactions, mockWallets } from '../data/seededData';

export class PaymentService {
  private wallets = { ...mockWallets };
  private transactions = [...mockTransactions];

  async getWallets() {
    return { ...this.wallets };
  }

  async getTransactions(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async executePayment(params: {
    type: Transaction['type'];
    titleBn: string;
    titleEn: string;
    counterparty: string;
    amount: number;
    fee?: number;
    impactIQSponsored?: boolean;
    cashbackBDT?: number;
  }): Promise<Transaction> {
    const fee = params.fee || 0;
    const totalDeduction = params.amount + fee;
    
    // Deduct from primary wallet
    this.wallets.primary = Math.max(0, this.wallets.primary - totalDeduction);
    
    // If cashback earned from ImpactIQ, credit to Cash Reward wallet
    if (params.cashbackBDT && params.cashbackBDT > 0) {
      this.wallets.cashReward += params.cashbackBDT;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newTx: Transaction = {
      id: `IIQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type: params.type,
      titleBn: params.titleBn,
      titleEn: params.titleEn,
      counterparty: params.counterparty,
      amount: params.amount,
      fee,
      timestamp: `${timeStr}, ${dateStr}`,
      status: 'success',
      walletType: 'primary',
      impactIQSponsored: params.impactIQSponsored,
      whyOfferReasonBn: params.cashbackBDT ? `ইমপ্যাক্টআইকিউ ক্যাশব্যাক ৳${params.cashbackBDT} ক্যাশ রিওয়ার্ড ওয়ালেটে জমা হয়েছে!` : undefined,
      whyOfferReasonEn: params.cashbackBDT ? `ImpactIQ Cashback ৳${params.cashbackBDT} credited to Cash Reward!` : undefined,
    };

    this.transactions.unshift(newTx);
    return newTx;
  }
}

export const paymentService = new PaymentService();
