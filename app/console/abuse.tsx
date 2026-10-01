import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { abuseService } from '../../services/abuseService';
import { AbuseCluster } from '../../types';
import { formatCurrency } from '../../i18n';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Search } from 'lucide-react-native';

export default function AbuseGuardScreen() {
  const [clusters, setClusters] = useState<AbuseCluster[]>([]);

  React.useEffect(() => {
    abuseService.getClusters().then(setClusters);
  }, []);

  const handleAction = async (clusterId: string, status: AbuseCluster['status']) => {
    const updated = await abuseService.updateClusterStatus(clusterId, status);
    setClusters(clusters.map((c) => (c.id === clusterId ? updated : c)));
  };

  return (
    <View style={styles.container}>
      <ConsoleHeader title="Promo Abuse Guard & Leakage Monitor" subtitle="Detect Farming Rings, Velocity Spikes & Cashback Round-Tripping" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* KPI Strip */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Total Leakage Prevented</Text>
            <Text style={[styles.kVal, { color: themeTokens.colors.success }]}>৳325,000</Text>
            <Text style={styles.kSub}>Saved in September 2026</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Active Flagged Clusters</Text>
            <Text style={[styles.kVal, { color: themeTokens.colors.warning }]}>2 Clusters</Text>
            <Text style={styles.kSub}>498 Suspicious Accounts</Text>
          </View>
        </View>

        {/* Flagged Clusters List */}
        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Flagged Fraud & Abuse Clusters</Text>

          {clusters.map((c) => (
            <View key={c.id} style={styles.clusterRow}>
              <View style={styles.cHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ShieldAlert size={20} color={themeTokens.colors.danger} />
                    <Text style={styles.cName}>{c.name}</Text>
                  </View>
                  <Text style={styles.cMeta}>Pattern: {c.patternType.toUpperCase()} | Detected: {c.detectedAt}</Text>
                </View>

                <View style={styles.scorePill}>
                  <Text style={styles.scoreLabel}>prototype AI-generated score</Text>
                  <Text style={styles.scoreVal}>{c.riskScorePct}% RISK</Text>
                </View>
              </View>

              <View style={styles.cMetrics}>
                <Text style={styles.mText}>Accounts: {c.userCount}</Text>
                <Text style={styles.mText}>Devices: {c.deviceCount}</Text>
                <Text style={[styles.mText, { color: themeTokens.colors.danger, fontWeight: '800' }]}>
                  Est. Leakage: {formatCurrency(c.estimatedLeakageBDT, 'en')}
                </Text>

                <View style={[styles.statusBadge, c.status === 'blocked' && { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.statusText, c.status === 'blocked' && { color: themeTokens.colors.danger }]}>
                    STATUS: {c.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actBtn, styles.actBlock]}
                  onPress={() => handleAction(c.id, 'blocked')}
                >
                  <Ban size={14} color={themeTokens.colors.surface} />
                  <Text style={styles.actBtnTextWhite}>Block Cluster</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actBtn, styles.actInvestigate]}
                  onPress={() => handleAction(c.id, 'investigating')}
                >
                  <Search size={14} color={themeTokens.brand.primary} />
                  <Text style={styles.actBtnTextBlue}>Investigate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actBtn, styles.actSafe]}
                  onPress={() => handleAction(c.id, 'safe')}
                >
                  <CheckCircle size={14} color={themeTokens.colors.success} />
                  <Text style={styles.actBtnTextGreen}>Mark Safe</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  kpiRow: { flexDirection: 'row', gap: 14 },
  kpiCard: { flex: 1, backgroundColor: themeTokens.colors.surface, padding: 16, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border },
  kLabel: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  kVal: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  kSub: { fontSize: 10, color: themeTokens.colors.textSecondary },
  listCard: { backgroundColor: themeTokens.colors.surface, padding: 20, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border, gap: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  clusterRow: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: themeTokens.radius.md, borderWidth: 1, borderColor: themeTokens.colors.border, gap: 12 },
  cHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cName: { fontSize: 15, fontWeight: '800', color: themeTokens.colors.textPrimary },
  cMeta: { fontSize: 11, color: themeTokens.colors.textMuted, marginTop: 2 },
  scorePill: { alignItems: 'flex-end' },
  scoreLabel: { fontSize: 9, color: themeTokens.colors.textMuted, fontStyle: 'italic' },
  scoreVal: { fontSize: 13, fontWeight: '900', color: themeTokens.colors.danger },
  cMetrics: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: themeTokens.colors.surface, padding: 10, borderRadius: 6 },
  mText: { fontSize: 12, color: themeTokens.colors.textSecondary },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#D97706' },
  actionRow: { flexDirection: 'row', gap: 10 },
  actBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  actBlock: { backgroundColor: themeTokens.colors.danger },
  actInvestigate: { backgroundColor: '#EBF4FF' },
  actSafe: { backgroundColor: '#D1FAE5' },
  actBtnTextWhite: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.surface },
  actBtnTextBlue: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary },
  actBtnTextGreen: { fontSize: 11, fontWeight: '800', color: '#10B981' },
});
