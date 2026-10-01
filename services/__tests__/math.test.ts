import { describe, test, expect } from '@jest/globals';
import { UpliftService } from '../upliftService';
import { ExperimentService } from '../experimentService';

describe('ImpactIQ Causal AI Math Unit Tests', () => {
  describe('UpliftService Math', () => {
    test('calculateIncrementalLift - computes correct percentage lift', () => {
      // treated = 18.5M, control baseline = 11.2M
      const lift = UpliftService.calculateIncrementalLift(18500000, 11200000);
      expect(lift).toBeCloseTo(65.18, 1);
    });

    test('calculateIROI - computes correct incremental ROI percentage', () => {
      // incremental revenue = 7.3M, budget spent = 2.5M
      // iROI = (7.3M - 2.5M) / 2.5M * 100 = 192%
      const iROI = UpliftService.calculateIROI(7300000, 2500000);
      expect(iROI).toBe(192.0);
    });

    test('calculateCPIT - computes correct cost per incremental transaction', () => {
      // budget = 2,500,000, incremental txs = 59,101
      // CPIT = 2,500,000 / 59,101 = 42.30
      const cpit = UpliftService.calculateCPIT(2500000, 59101);
      expect(cpit).toBeCloseTo(42.3, 1);
    });

    test('classifyCustomerQuadrant - correctly assigns Persuadables vs Sure Things', () => {
      // Low organic prob (0.3), high treated prob (0.75) -> Persuadables
      expect(UpliftService.classifyCustomerQuadrant(0.3, 0.75)).toBe('persuadables');

      // High organic prob (0.8), high treated prob (0.85) -> Sure Things
      expect(UpliftService.classifyCustomerQuadrant(0.8, 0.85)).toBe('sure_things');

      // Low organic prob (0.05), low treated prob (0.08) -> Lost Causes
      expect(UpliftService.classifyCustomerQuadrant(0.05, 0.08)).toBe('lost_causes');
    });
  });

  describe('ExperimentService DiD Math', () => {
    test('calculateDiDEstimate - computes correct difference-in-differences', () => {
      // preTreated = 850, postTreated = 2450 (change = +1600)
      // preControl = 830, postControl = 1280 (change = +450)
      // DiD = 1600 - 450 = 1150
      const did = ExperimentService.calculateDiDEstimate(850, 2450, 830, 1280);
      expect(did).toBe(1150);
    });

    test('evaluateSignificance - detects statistically significant results', () => {
      const { isSignificant, pValue } = ExperimentService.evaluateSignificance(1150, 200);
      expect(isSignificant).toBe(true);
      expect(pValue).toBeLessThanOrEqual(0.05);
    });
  });
});
