import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { mockCampaigns } from '../../data/seededData';
import { formatCurrency } from '../../i18n';
import { useAppStore } from '../../lib/store';
import { Sparkles, TrendingUp, ShieldAlert, Users, ArrowUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ConsoleOverview() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ConsoleHeader title="Executive Overview" subtitle="Portfolio Incremental Performance & Portfolio Health" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Core Loop Banner */}
        <View style={styles.coreLoopCard}>
          <View style={styles.coreLoopTop}>
            <Sparkles size={20} color={themeTokens.brand.yellow} />
            <Text style={styles.coreLoopTag}>CAUSAL AI CORE LOOP</Text>
          </View>
          <Text style={styles.coreLoopTitle}>DATA ➔ CAUSAL AI ➔ INCREMENTAL INSIGHT ➔ BUDGET ACTION</Text>
          <Text style={styles.coreLoopSub}>"Pay for impact, not for noise."</Text>
        </View>

        {/* Top KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Incremental Revenue</Text>
            <Text style={styles.kpiVal}>৳14.0M</Text>
            <Text style={styles.kpiSub}>vs ৳32.5M Gross Reported</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Portfolio iROI</Text>
            <Text style={[styles.kpiVal, { color: themeTokens.colors.success }]}>164.5%</Text>
            <Text style={styles.kpiSub}>Net Incremental Return</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Subsidy Waste Prevented</Text>
            <Text style={[styles.kpiVal, { color: themeTokens.brand.yellow }]}>৳1.8M</Text>
            <Text style={styles.kpiSub}>Saved on Sure Things</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Abuse Leakage Blocked</Text>
            <Text style={[styles.kpiVal, { color: themeTokens.colors.danger }]}>৳325k</Text>
            <Text style={styles.kpiSub}>Farming & Harvesters</Text>
          </View>
        </View>

        {/* Active Campaigns Leaderboard */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Campaign Leaderboard (by iROI)</Text>
            <TouchableOpacity onPress={() => router.push('/console/campaigns')}>
              <Text style={styles.viewAllText}>View All Campaigns ➔</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Campaign Name</Text>
            <Text style={[styles.th, { flex: 1 }]}>Spend</Text>
            <Text style={[styles.th, { flex: 1 }]}>True Incremental Rev</Text>
            <Text style={[styles.th, { flex: 1 }]}>iROI</Text>
            <Text style={[styles.th, { width: 80 }]}>Action</Text>
          </View>

          {mockCampaigns.map((c) => (
            <View key={c.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.cTitle}>{c.title}</Text>
                <Text style={styles.cCat}>{c.category.toUpperCase()}</Text>
              </View>
              <Text style={[styles.td, { flex: 1 }]}>{formatCurrency(c.budgetSpent, 'en')}</Text>
              <Text style={[styles.td, { flex: 1, fontWeight: '800', color: themeTokens.brand.primary }]}>
                {formatCurrency(c.incrementalRevenue, 'en')}
              </Text>
              <Text style={[styles.td, { flex: 1, fontWeight: '800', color: themeTokens.colors.success }]}>
                {c.iROI}%
              </Text>
              <TouchableOpacity
                style={styles.inspectBtn}
                onPress={() => router.push(`/console/campaigns/${c.id}` as any)}
              >
                <Text style={styles.inspectBtnText}>Report</Text>
                <ArrowUpRight size={12} color={themeTokens.brand.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  coreLoopCard: {
    backgroundColor: themeTokens.brand.primaryDark,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    gap: 6,
  },
  coreLoopTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coreLoopTag: { fontSize: 10, fontWeight: '800', color: themeTokens.brand.yellow },
  coreLoopTitle: { fontSize: 15, fontWeight: '900', color: themeTokens.colors.surface },
  coreLoopSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },
  kpiGrid: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  kpiCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: themeTokens.colors.surface,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 4,
  },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  kpiVal: { fontSize: 24, fontWeight: '900', color: themeTokens.brand.primary },
  kpiSub: { fontSize: 10, color: themeTokens.colors.textSecondary },
  sectionCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: themeTokens.colors.textPrimary },
  viewAllText: { fontSize: 12, fontWeight: '700', color: themeTokens.brand.primary },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 6 },
  th: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.textMuted },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  cTitle: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  cCat: { fontSize: 9, fontWeight: '700', color: themeTokens.colors.textMuted },
  td: { fontSize: 13, color: themeTokens.colors.textPrimary },
  inspectBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#EBF4FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  inspectBtnText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary },
});
