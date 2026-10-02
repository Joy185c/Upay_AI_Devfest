// ImpactIQ - UPAY Type Definitions

export type UpliftQuadrant = 'persuadables' | 'sure_things' | 'lost_causes' | 'sleeping_dogs';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  region: string;
  quadrant: UpliftQuadrant;
  predictedUplift: number; // e.g., +28.5%
  avgMonthlySpend: number;
  billPayUser: boolean;
  preferredChannel: 'in_app' | 'push' | 'sms';
}

export interface CampaignTimeSeriesPoint {
  date: string;
  treatedActual: number;
  controlBaseline: number;
  counterfactualDifference: number;
  upperConfidence: number;
  lowerConfidence: number;
}

export interface WaterfallItem {
  stage: string;
  stageBn: string;
  amount: number; // positive or negative
  isTotal?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  titleBn: string;
  category: 'bill_pay' | 'add_money' | 'merchant' | 'referral' | 'recharge' | 'cash_out';
  status: 'active' | 'completed' | 'draft' | 'paused';
  startDate: string;
  endDate: string;
  budgetSpent: number;
  
  // Gross vs Incremental
  grossRevenue: number;
  controlBaselineRevenue: number; // counterfactual
  incrementalRevenue: number; // treatedActual - controlBaseline
  incrementalLiftPct: number; // (incrementalRevenue / controlBaselineRevenue) * 100
  iROI: number; // (incrementalRevenue - budgetSpent) / budgetSpent * 100
  cpit: number; // budgetSpent / incrementalTransactions
  
  treatedCount: number;
  controlCount: number;
  incrementalTransactions: number;
  
  cannibalizationCost: number; // spend wasted on Sure Things
  abuseLeakageCost: number; // estimated fraud leakage
  
  confidenceScore: number; // e.g. 94%
  pValue: number; // e.g. 0.012
  
  timeSeries: CampaignTimeSeriesPoint[];
  waterfall: WaterfallItem[];
  regionBreakdown: { region: string; incrementalRevenue: number; iROI: number }[];
  quadrantShare: { quadrant: UpliftQuadrant; spendShare: number; impactShare: number }[];
  aiSummaryEn: string;
  aiSummaryBn: string;
}

export interface Experiment {
  id: string;
  name: string;
  campaignId: string;
  campaignTitle: string;
  holdoutPercentage: number; // e.g. 15%
  treatedSize: number;
  controlSize: number;
  
  // Difference-in-Differences (DiD)
  preTreatedAvg: number;
  postTreatedAvg: number;
  preControlAvg: number;
  postControlAvg: number;
  didEstimate: number; // (postTreated - preTreated) - (postControl - preControl)
  
  pValue: number;
  confidenceInterval: [number, number]; // [lower, upper]
  isStatisticallySignificant: boolean;
}

export interface FeatureDriver {
  featureName: string;
  featureNameBn: string;
  importanceScore: number; // 0 to 1
  impactDirection: 'positive' | 'negative';
}

export interface UpliftSegmentDetail {
  quadrant: UpliftQuadrant;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  userCount: number;
  percentage: number;
  avgPredictedUpliftPct: number;
  recommendedAction: string;
  recommendedActionBn: string;
  potentialSavingsBDT: number;
  topDrivers: FeatureDriver[];
}

export interface BudgetOptimizationResult {
  totalBudgetBDT: number;
  before: {
    spent: number;
    incrementalRevenue: number;
    iROI: number;
    reach: number;
  };
  after: {
    spent: number;
    incrementalRevenue: number;
    iROI: number;
    savedBDT: number;
    reach: number;
  };
  campaignAllocations: {
    campaignId: string;
    campaignTitle: string;
    currentSpend: number;
    optimizedSpend: number;
    expectedIncrementalRevenue: number;
    quadrantTarget: string;
  }[];
  marginalReturnCurve: { spendBDT: number; incrementalRevenueBDT: number }[];
}

export interface WhatIfScenarioInput {
  cashbackPct: number;
  maxCapPerUserBDT: number;
  audienceSize: number;
  durationDays: number;
  channel: 'in_app' | 'push' | 'sms';
  targetQuadrant: UpliftQuadrant | 'all';
}

export interface WhatIfScenarioResult {
  scenarioId: string;
  name: string;
  input: WhatIfScenarioInput;
  predictedIncrementalRevenue: number;
  predictedCost: number;
  predictedIROI: number;
  predictedAbuseRiskPct: number;
  confidenceRange: [number, number];
}

export interface AbuseCluster {
  id: string;
  name: string;
  patternType: 'farming' | 'referral_ring' | 'velocity_spike' | 'same_device' | 'round_tripping';
  userCount: number;
  deviceCount: number;
  estimatedLeakageBDT: number;
  riskScorePct: number; // 0-100%
  status: 'flagged' | 'investigating' | 'blocked' | 'safe';
  detectedAt: string;
  flaggedAccounts: string[];
}

export interface Transaction {
  id: string;
  type: 'send_money' | 'recharge' | 'cash_out' | 'payment' | 'pay_bill' | 'add_money' | 'savings' | 'transfer' | 'request' | 'referral' | 'npsb';
  titleBn: string;
  titleEn: string;
  counterparty: string;
  amount: number;
  fee: number;
  total?: number;
  balanceAfter?: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  walletType: 'primary' | 'disbursement' | 'secondary' | 'remittance' | 'cash_reward';
  impactIQSponsored?: boolean;
  whyOfferReasonBn?: string;
  whyOfferReasonEn?: string;
  note?: string;
}

export interface MerchantImpact {
  id: string;
  name: string;
  category: string;
  region: string;
  totalSalesBDT: number;
  organicBaselineBDT: number;
  incrementalSalesBDT: number;
  incrementalLiftPct: number;
  activeCampaignName: string;
  recommendedOfferBn: string;
  recommendedOfferEn: string;
}

export interface AIResponse {
  answerEn: string;
  answerBn: string;
  citations: string[];
  suggestedActions: { labelEn: string; labelBn: string; route?: string; actionId?: string }[];
  miniChart?: {
    type: 'bar' | 'line' | 'quadrant';
    title: string;
    data: { label: string; value: number }[];
  };
}
