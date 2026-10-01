// ImpactIQ Uplift & Causal AI Analytics Engine Service

import { Campaign, UpliftSegmentDetail, UpliftQuadrant } from '../types';
import { mockCampaigns, mockUpliftSegments } from '../data/seededData';

export class UpliftService {
  /**
   * Calculates Incremental Lift Percentage.
   * Formula: ((Treated Actual - Control Baseline) / Control Baseline) * 100
   */
  static calculateIncrementalLift(treatedActual: number, controlBaseline: number): number {
    if (controlBaseline <= 0) return 0;
    return parseFloat((((treatedActual - controlBaseline) / controlBaseline) * 100).toFixed(2));
  }

  /**
   * Calculates Incremental Return on Investment (iROI %).
   * Formula: ((Incremental Revenue - Budget Spent) / Budget Spent) * 100
   */
  static calculateIROI(incrementalRevenue: number, budgetSpent: number): number {
    if (budgetSpent <= 0) return 0;
    return parseFloat((((incrementalRevenue - budgetSpent) / budgetSpent) * 100).toFixed(2));
  }

  /**
   * Calculates Cost Per Incremental Transaction (CPIT ৳).
   * Formula: Budget Spent / Incremental Transactions
   */
  static calculateCPIT(budgetSpent: number, incrementalTransactions: number): number {
    if (incrementalTransactions <= 0) return 0;
    return parseFloat((budgetSpent / incrementalTransactions).toFixed(2));
  }

  /**
   * Classifies a customer into one of four Causal Uplift Quadrants based on predicted response.
   */
  static classifyCustomerQuadrant(
    organicProb: number, // P(Y=1 | Control)
    treatedProb: number  // P(Y=1 | Treated)
  ): UpliftQuadrant {
    const uplift = treatedProb - organicProb;
    
    if (uplift > 0.15 && organicProb < 0.6) {
      return 'persuadables'; // High uplift, wouldn't transact on own
    } else if (organicProb >= 0.6 && treatedProb >= 0.6) {
      return 'sure_things'; // Transacts anyway
    } else if (organicProb < 0.2 && treatedProb < 0.2) {
      return 'lost_causes'; // Won't transact regardless
    } else {
      return 'sleeping_dogs'; // Negative response / churn trigger
    }
  }

  /**
   * Gets campaign impact report details by campaign ID.
   */
  async getCampaignImpact(campaignId: string): Promise<Campaign> {
    const campaign = mockCampaigns.find((c) => c.id === campaignId) || mockCampaigns[0];
    return { ...campaign };
  }

  /**
   * Gets all campaigns list.
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    return [...mockCampaigns];
  }

  /**
   * Gets uplift quadrant details & segment insights.
   */
  async getUpliftSegments(): Promise<UpliftSegmentDetail[]> {
    return [...mockUpliftSegments];
  }
}

export const upliftService = new UpliftService();
