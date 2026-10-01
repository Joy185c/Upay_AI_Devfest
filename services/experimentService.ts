// ImpactIQ Holdout & Difference-in-Differences (DiD) Experimentation Service

import { Experiment } from '../types';
import { mockExperiments } from '../data/seededData';

export class ExperimentService {
  /**
   * Calculates Difference-in-Differences (DiD) causal estimate.
   * Formula: (Post_Treated - Pre_Treated) - (Post_Control - Pre_Control)
   */
  static calculateDiDEstimate(
    preTreatedAvg: number,
    postTreatedAvg: number,
    preControlAvg: number,
    postControlAvg: number
  ): number {
    const treatedChange = postTreatedAvg - preTreatedAvg;
    const controlChange = postControlAvg - preControlAvg;
    return parseFloat((treatedChange - controlChange).toFixed(2));
  }

  /**
   * Evaluates statistical significance and p-value.
   */
  static evaluateSignificance(didEstimate: number, stdError: number): { pValue: number; isSignificant: boolean } {
    if (stdError <= 0) return { pValue: 0.001, isSignificant: true };
    const zScore = Math.abs(didEstimate / stdError);
    // Simplified p-value approximation for standard normal z-score
    let pValue = 0.05;
    if (zScore > 2.58) pValue = 0.001;
    else if (zScore > 1.96) pValue = 0.01;
    else if (zScore > 1.64) pValue = 0.05;
    else pValue = 0.25;

    return {
      pValue,
      isSignificant: pValue <= 0.05,
    };
  }

  /**
   * Gets list of holdout experiments.
   */
  async getExperiments(): Promise<Experiment[]> {
    return [...mockExperiments];
  }
}

export const experimentService = new ExperimentService();
