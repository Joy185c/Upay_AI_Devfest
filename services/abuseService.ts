// ImpactIQ Promo Abuse Guard & Leakage Service

import { AbuseCluster } from '../types';
import { mockAbuseClusters } from '../data/seededData';

export class AbuseService {
  private clusters: AbuseCluster[] = [...mockAbuseClusters];

  async getClusters(): Promise<AbuseCluster[]> {
    return [...this.clusters];
  }

  async updateClusterStatus(clusterId: string, status: AbuseCluster['status']): Promise<AbuseCluster> {
    const idx = this.clusters.findIndex((c) => c.id === clusterId);
    if (idx !== -1) {
      this.clusters[idx] = { ...this.clusters[idx], status };
      return this.clusters[idx];
    }
    throw new Error('Cluster not found');
  }

  async getTotalLeakagePreventedBDT(): Promise<number> {
    return this.clusters
      .filter((c) => c.status === 'blocked')
      .reduce((sum, c) => sum + c.estimatedLeakageBDT, 325000);
  }
}

export const abuseService = new AbuseService();
