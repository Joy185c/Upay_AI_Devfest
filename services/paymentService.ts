// ImpactIQ Customer Payment & Wallet Service Wrapper
import { Transaction } from '../types';
import { transactionService, DEMO_PIN } from './transactionService';
import { mockWallets } from '../data/seededData';

export class PaymentService {
  async getWallets() {
    const primary = await transactionService.getBalance();
    return { ...mockWallets, primary };
  }

  async getTransactions(): Promise<Transaction[]> {
    return await transactionService.getTransactions();
  }

  async executePayment(params: {
    type: Transaction['type'];
    titleBn: string;
    titleEn: string;
    counterparty: string;
    amount: number;
    fee?: number;
    pin?: string;
    impactIQSponsored?: boolean;
    cashbackBDT?: number;
    note?: string;
  }): Promise<Transaction> {
    const res = await transactionService.executeTransaction({
      type: params.type,
      titleEn: params.titleEn,
      titleBn: params.titleBn,
      counterparty: params.counterparty,
      amount: params.amount,
      pin: params.pin || DEMO_PIN,
      impactIQSponsored: params.impactIQSponsored,
      cashbackBDT: params.cashbackBDT,
      note: params.note,
    });
    return res.transaction;
  }
}

export const paymentService = new PaymentService();
