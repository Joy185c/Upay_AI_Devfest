// Global Application State Store using Zustand

import { create } from 'zustand';
import { Language } from '../i18n';

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
}

export const useAppStore = create<AppState>((set) => ({
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
}));
