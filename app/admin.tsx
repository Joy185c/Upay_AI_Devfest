import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../components/layout/ConsoleHeader';
import { themeTokens } from '../theme/tokens';
import { mockCampaigns } from '../data/seededData';
import { formatCurrency } from '../i18n';
import { ShieldCheck, Download, Sparkles, TrendingUp, DollarSign } from 'lucide-react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <ConsoleHeader title="Admin & Finance Dashboard" subtitle="Executive Portfolio ROI & Budget Leakage Audit" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Executive Summary Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Total Campaign Spend</Text>
            <Text style={styles.kVal}>৳5,500,000</Text>
            <Text style={styles.kSub}>Across active MFS offers</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Incremental Portfolio Revenue</Text>
            <Text style={[styles.kVal, { color: themeTokens.brand.primary }]}>৳14,000,000</Text>
            <Text style={styles.kSub}>Causal treatment lift</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Portfolio iROI</Text>
            <Text style={[styles.kVal, { color: themeTokens.colors.success }]}>164.5%</Text>
            <Text style={styles.kSub}>Net Incremental ROI</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kLabel}>Total Waste & Leakage Saved</Text>
            <Text style={[styles.kVal, { color: themeTokens.brand.yellow }]}>৳2,125,000</Text>
            <Text style={styles.kSub}>Sure Things & Fraud rings</Text>
          </View>
        </View>

        {/* AI Executive Report Card */}
        <View style={styles.aiReportCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={20} color={themeTokens.brand.yellow} />
            <Text style={styles.aiTitle}>ImpactIQ Executive Board Audit Summary</Text>
          </View>
          <Text style={styles.aiText}>
            ImpactIQ Causal AI reduced gross subsidy leakage by 28% in Q3 2026. Portfolio incremental revenue grew by +৳14.0M with a net iROI of 164.5%. Excluding Sure Things saved ৳1.8M while Abuse Guard prevented ৳325k in automated account farming.
          </Text>
          <TouchableOpacity style={styles.pdfBtn}>
            <Download size={16} color={themeTokens.brand.primaryDark} />
            <Text style={styles.pdfBtnText}>Export Board PDF Report</Text>
          </TouchableOpacity>
        </View>

        {/* Campaign Leaderboard */}
        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Campaign Leaderboard (Best to Worst by iROI)</Text>

          {mockCampaigns.map((c) => (
            <View key={c.id} style={styles.row}>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.cTitle}>{c.title}</Text>

                <View style={styles.catBadge}>
                  <Text style={styles.catText}>{c.category}</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.sub}>Spend</Text>
                <Text style={styles.val}>{formatCurrency(c.budgetSpent, 'en')}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.sub}>Inc Revenue</Text>
                <Text style={[styles.val, { color: themeTokens.brand.primary }]}>{formatCurrency(c.incrementalRevenue, 'en')}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.sub}>iROI</Text>
                <Text style={[styles.val, { color: themeTokens.colors.success, fontWeight: '900' }]}>{c.iROI}%</Text>
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
  kpiRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  kpiCard: { flex: 1, minWidth: 160, backgroundColor: themeTokens.colors.surface, padding: 16, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border },
  kLabel: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  kVal: { fontSize: 24, fontWeight: '900', color: themeTokens.colors.textPrimary, marginTop: 2 },
  kSub: { fontSize: 10, color: themeTokens.colors.textSecondary },
  aiReportCard: { backgroundColor: themeTokens.brand.primaryDark, padding: 20, borderRadius: themeTokens.radius.lg, gap: 12 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.brand.yellow },
  aiText: { fontSize: 13, color: themeTokens.colors.surface, lineHeight: 20 },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: themeTokens.brand.yellow, paddingHorizontal: 16, paddingVertical: 10, borderRadius: themeTokens.radius.md, alignSelf: 'flex-start' },
  pdfBtnText: { fontSize: 12, fontWeight: '900', color: themeTokens.brand.primaryDark },
  listCard: { backgroundColor: themeTokens.colors.surface, padding: 20, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  cTitle: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  catBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 2 },
  catText: { fontSize: 9, fontWeight: '700', color: themeTokens.colors.textMuted },
  sub: { fontSize: 10, color: themeTokens.colors.textMuted },
  val: { fontSize: 14, color: themeTokens.colors.textPrimary, fontWeight: '700' },
});
