// ImpactIQ What-If Campaign Simulator Service

import { WhatIfScenarioInput, WhatIfScenarioResult } from '../types';

export class SimulatorService {
  /**
   * Simulates expected campaign outcomes based on interactive sliders.
   */
  async simulateScenario(input: WhatIfScenarioInput): Promise<WhatIfScenarioResult> {
    const baseAudience = input.audienceSize;
    let targetMultiplier = 1.0;
    let organicOverlapPct = 0.40; // Default 40% organic overlap

    if (input.targetQuadrant === 'persuadables') {
      targetMultiplier = 1.85; // 85% higher conversion efficiency
      organicOverlapPct = 0.05; // Almost zero organic overlap
    } else if (input.targetQuadrant === 'sure_things') {
      targetMultiplier = 0.15; // Very low incremental response
      organicOverlapPct = 0.90;
    }

    const estimatedParticipants = Math.round(baseAudience * (input.targetQuadrant === 'all' ? 0.35 : 0.48));
    const avgTxVal = 1200;
    const grossVal = estimatedParticipants * avgTxVal;
    
    // Causal separation
    const controlBaseline = grossVal * organicOverlapPct;
    const treatedActual = grossVal * targetMultiplier;
    const predictedIncrementalRevenue = Math.max(0, treatedActual - controlBaseline);
    
    // Spend calculation
    const avgCashbackPerTx = Math.min(avgTxVal * (input.cashbackPct / 100), input.maxCapPerUserBDT);
    const predictedCost = estimatedParticipants * avgCashbackPerTx;
    
    // iROI
    const predictedIROI = predictedCost > 0
      ? parseFloat((((predictedIncrementalRevenue - predictedCost) / predictedCost) * 100).toFixed(1))
      : 0;

    // Abuse risk estimation
    const channelRisk = input.channel === 'sms' ? 12 : 5;
    const cashbackRisk = input.cashbackPct > 15 ? 18 : 6;
    const predictedAbuseRiskPct = Math.min(45, channelRisk + cashbackRisk);

    const margin = predictedIncrementalRevenue * 0.12;
    const confidenceRange: [number, number] = [
      Math.round(predictedIncrementalRevenue - margin),
      Math.round(predictedIncrementalRevenue + margin),
    ];

    return {
      scenarioId: `SIM-${Date.now()}`,
      name: `${input.cashbackPct}% Cashback (${input.targetQuadrant.toUpperCase()})`,
      input,
      predictedIncrementalRevenue: Math.round(predictedIncrementalRevenue),
      predictedCost: Math.round(predictedCost),
      predictedIROI,
      predictedAbuseRiskPct,
      confidenceRange,
    };
  }
}

export const simulatorService = new SimulatorService();
