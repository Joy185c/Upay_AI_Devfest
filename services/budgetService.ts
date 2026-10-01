// ImpactIQ Budget Optimization & Return Curve Service

import { BudgetOptimizationResult } from '../types';

export class BudgetService {
  /**
   * Optimizes budget allocation by shifting budget away from Sure Things/Lost Causes to Persuadables.
   */
  async getOptimization(totalBudgetBDT: number = 5500000): Promise<BudgetOptimizationResult> {
    // Baseline "Broad Blast" allocation
    const beforeSpent = totalBudgetBDT;
    const beforeIncrementalRev = 14500000;
    const beforeIROI = parseFloat((((beforeIncrementalRev - beforeSpent) / beforeSpent) * 100).toFixed(1));
    
    // ImpactIQ Targeted allocation
    const afterSpent = totalBudgetBDT * 0.72; // 28% budget saved
    const savedBDT = totalBudgetBDT - afterSpent;
    const afterIncrementalRev = 18800000; // Higher revenue by focusing on Persuadables
    const afterIROI = parseFloat((((afterIncrementalRev - afterSpent) / afterSpent) * 100).toFixed(1));

    // Diminishing returns curve simulation
    const marginalReturnCurve = [
      { spendBDT: 1000000, incrementalRevenueBDT: 4800000 },
      { spendBDT: 2000000, incrementalRevenueBDT: 8900000 },
      { spendBDT: 3000000, incrementalRevenueBDT: 12500000 },
      { spendBDT: 4000000, incrementalRevenueBDT: 15400000 },
      { spendBDT: 5000000, incrementalRevenueBDT: 17200000 },
      { spendBDT: 6000000, incrementalRevenueBDT: 18100000 },
      { spendBDT: 7000000, incrementalRevenueBDT: 18500000 },
    ];

    return {
      totalBudgetBDT,
      before: {
        spent: beforeSpent,
        incrementalRevenue: beforeIncrementalRev,
        iROI: beforeIROI,
        reach: 300000,
      },
      after: {
        spent: Math.round(afterSpent),
        incrementalRevenue: afterIncrementalRev,
        iROI: afterIROI,
        savedBDT: Math.round(savedBDT),
        reach: 185000, // Filtered out Sure Things & Lost Causes
      },
      campaignAllocations: [
        {
          campaignId: 'CMP-2026-EID-BILL',
          campaignTitle: 'Eid Bill-Pay Cashback 10%',
          currentSpend: 2500000,
          optimizedSpend: 1800000,
          expectedIncrementalRevenue: 8100000,
          quadrantTarget: 'Persuadables Only',
        },
        {
          campaignId: 'CMP-2026-ADD-MONEY',
          campaignTitle: 'Add Money Bank Bonus ৳50',
          currentSpend: 1200000,
          optimizedSpend: 1100000,
          expectedIncrementalRevenue: 4200000,
          quadrantTarget: 'Persuadables & Digital Switchers',
        },
        {
          campaignId: 'CMP-2026-MERCHANT-PAY',
          campaignTitle: 'Supermarket Pay 5% Instant Back',
          currentSpend: 1800000,
          optimizedSpend: 1060000,
          expectedIncrementalRevenue: 4500000,
          quadrantTarget: 'Weekend Evening Shoppers',
        },
      ],
      marginalReturnCurve,
    };
  }
}

export const budgetService = new BudgetService();
