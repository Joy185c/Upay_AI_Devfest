// ImpactIQ Merchant Impact Analytics Service

import { MerchantImpact } from '../types';
import { mockMerchants } from '../data/seededData';

export class MerchantService {
  async getMerchants(): Promise<MerchantImpact[]> {
    return [...mockMerchants];
  }

  async getMerchantById(id: string): Promise<MerchantImpact> {
    return mockMerchants.find((m) => m.id === id) || mockMerchants[0];
  }
}

export const merchantService = new MerchantService();
