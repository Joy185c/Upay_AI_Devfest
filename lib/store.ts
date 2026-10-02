// Global Application State Store using Zustand
import { create } from 'zustand';
import { Language } from '../i18n';
import { Transaction } from '../types';
import { transactionService, DEFAULT_BALANCE } from '../services/transactionService';

export type Mode = 'customer' | 'console' | 'merchant' | 'admin';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  mode: Mode;
  setMode: (mode: Mode) => void;

  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;

  demoModeActive: boolean;
  setDemoModeActive: (active: boolean) => void;
  toggleDemoMode: () => void;
  
  simulationStep: number;
  setSimulationStep: (step: number) => void;

  // Selected Campaign ID in Console
  selectedCampaignId: string;
  setSelectedCampaignId: (id: string) => void;

  // Simulated Wallet & History State
  balance: number;
  transactions: Transaction[];
  setBalance: (bal: number) => void;
  setTransactions: (txs: Transaction[]) => void;
  loadDemoState: () => Promise<void>;
  resetDemoState: () => Promise<{ balance: number; transactions: Transaction[] }>;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'bn', // Bangla-first by default as specified in prompt
  setLanguage: (lang) => set({ language: lang }),

  mode: 'customer',
  setMode: (mode) => set({ mode }),

  isAuthenticated: false,
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  demoModeActive: false,
  setDemoModeActive: (demoModeActive) => set({ demoModeActive }),
  toggleDemoMode: () => set((state) => ({ demoModeActive: !state.demoModeActive })),

  simulationStep: 0,
  setSimulationStep: (step) => set({ simulationStep: step }),

  selectedCampaignId: 'CMP-2026-EID-BILL',
  setSelectedCampaignId: (selectedCampaignId) => set({ selectedCampaignId }),

  balance: DEFAULT_BALANCE,
  transactions: [],

  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),

  loadDemoState: async () => {
    const balance = await transactionService.getBalance();
    const transactions = await transactionService.getTransactions();
    set({ balance, transactions });
  },

  resetDemoState: async () => {
    const res = await transactionService.resetDemoData();
    set({ balance: res.balance, transactions: res.transactions });
    return res;
  },
}));
