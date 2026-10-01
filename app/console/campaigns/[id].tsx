import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../../components/layout/ConsoleHeader';
import { themeTokens } from '../../../theme/tokens';
import { mockCampaigns } from '../../../data/seededData';
import { CounterfactualChart } from '../../../components/charts/CounterfactualChart';
import { WaterfallChart } from '../../../components/charts/WaterfallChart';
import { UpliftQuadrantScatter } from '../../../components/charts/UpliftQuadrantScatter';
import { formatCurrency } from '../../../i18n';
import { useAppStore } from '../../../lib/store';
import { Sparkles, Download, Share2, PauseCircle, Copy, ArrowRightLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CampaignImpactReportScreen() {
  const { id } = useLocalSearchParams();
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const campaign = mockCampaigns.find((c) => c.id === id) || mockCampaigns[0];

  return (
    <View style={styles.container}>
      <ConsoleHeader
        title={`Hero Impact Report: ${campaign.title}`}
        subtitle="Causal Treatment vs Control Baseline Counterfactual Decomposition"
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* 1. Headline Contrast Strip: Gross vs True Incremental */}
        <View style={styles.headlineStrip}>
          <View style={styles.headlineBoxGross}>
            <Text style={styles.headlineLabel}>GROSS REPORTED REVENUE</Text>
            <Text style={styles.headlineValGross}>{formatCurrency(campaign.grossRevenue, 'en')}</Text>
            <Text style={styles.headlineSub}>Includes organic users who would pay anyway</Text>
          </View>

          <View style={styles.headlineVS}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.headlineBoxIncremental}>
            <View style={styles.aiTagRow}>
              <Sparkles size={14} color={themeTokens.brand.yellow} />
              <Text style={styles.aiTagText}>TRUE INCREMENTAL CAUSAL UPLIFT</Text>
            </View>
            <Text style={styles.headlineValIncremental}>{formatCurrency(campaign.incrementalRevenue, 'en')}</Text>
            <Text style={styles.headlineSubIncremental}>
              +{campaign.incrementalLiftPct}% true lift over control baseline
            </Text>
          </View>
        </View>

        {/* 2. KPI Strip */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>Spend</Text>
            <Text style={styles.kVal}>{formatCurrency(campaign.budgetSpent, 'en')}</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>iROI</Text>
            <Text style={[styles.kVal, { color: themeTokens.colors.success }]}>{campaign.iROI}%</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>CPIT</Text>
            <Text style={styles.kVal}>৳{campaign.cpit}</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>Incremental Txs</Text>
            <Text style={styles.kVal}>{campaign.incrementalTransactions.toLocaleString()}</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>Holdout Size</Text>
            <Text style={styles.kVal}>15% Control</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kLabel}>p-Value</Text>
            <Text style={[styles.kVal, { color: themeTokens.colors.success }]}>p = {campaign.pValue}</Text>
          </View>
        </View>

        {/* 3. Counterfactual Chart (Treated Actual vs Control Baseline) */}
        <View style={styles.cardSection}>
          <Text style={styles.cardSectionTitle}>1. Counterfactual Baseline & Shaded Incremental Area</Text>
          <CounterfactualChart data={campaign.timeSeries} />
        </View>

        {/* 4. Waterfall Chart (Decomposition) */}
        <View style={styles.cardSection}>
          <Text style={styles.cardSectionTitle}>2. Causal Waterfall Decomposition (Gross ➔ Net Value)</Text>
          <WaterfallChart data={campaign.waterfall} />
        </View>

        {/* 5. 4-Quadrant Segment Breakdown */}
        <View style={styles.cardSection}>
          <Text style={styles.cardSectionTitle}>3. Customer Uplift Quadrants & Budget Waste Share</Text>
          <UpliftQuadrantScatter
            segments={[]}
            onSelectQuadrant={() => router.push('/console/uplift')}
          />
        </View>

        {/* 6. ImpactIQ AI Summary Card */}
        <View style={styles.aiSummaryCard}>
          <View style={styles.aiHeaderRow}>
            <Sparkles size={20} color={themeTokens.brand.yellow} />
            <Text style={styles.aiHeaderTitle}>ImpactIQ AI ✦ Executive Summary</Text>
          </View>
          <Text style={styles.aiSummaryText}>
            {language === 'bn' ? campaign.aiSummaryBn : campaign.aiSummaryEn}
          </Text>
        </View>

        {/* 7. Action Buttons Bar */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => router.push('/console/budget')}
          >
            <ArrowRightLeft size={16} color={themeTokens.brand.primaryDark} />
            <Text style={styles.primaryActionText}>Reallocate Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secActionBtn}>
            <PauseCircle size={16} color={themeTokens.colors.danger} />
            <Text style={[styles.secActionText, { color: themeTokens.colors.danger }]}>Pause Campaign</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secActionBtn}>
            <Copy size={16} color={themeTokens.colors.textPrimary} />
            <Text style={styles.secActionText}>Clone & Improve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secActionBtn}>
            <Download size={16} color={themeTokens.colors.textPrimary} />
            <Text style={styles.secActionText}>Export PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secActionBtn}>
            <Share2 size={16} color={themeTokens.colors.textPrimary} />
            <Text style={styles.secActionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headlineStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  headlineBoxGross: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: themeTokens.radius.md,
  },
  headlineLabel: { fontSize: 10, fontWeight: '800', color: themeTokens.colors.textMuted },
  headlineValGross: { fontSize: 26, fontWeight: '900', color: themeTokens.colors.textSecondary, textDecorationLine: 'line-through' },
  headlineSub: { fontSize: 11, color: themeTokens.colors.textMuted, marginTop: 4 },
  headlineVS: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeTokens.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: { color: themeTokens.colors.surface, fontWeight: '900', fontSize: 12 },
  headlineBoxIncremental: {
    flex: 1.2,
    backgroundColor: themeTokens.brand.primaryDark,
    padding: 16,
    borderRadius: themeTokens.radius.md,
  },
  aiTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiTagText: { fontSize: 10, fontWeight: '900', color: themeTokens.brand.yellow },
  headlineValIncremental: { fontSize: 32, fontWeight: '900', color: themeTokens.colors.surface, marginTop: 2 },
  headlineSubIncremental: { fontSize: 11, color: themeTokens.brand.yellow, fontWeight: '700', marginTop: 4 },
  kpiRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  kpiItem: {
    flex: 1,
    minWidth: 110,
    backgroundColor: themeTokens.colors.surface,
    padding: 12,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  kLabel: { fontSize: 10, fontWeight: '700', color: themeTokens.colors.textMuted },
  kVal: { fontSize: 16, fontWeight: '900', color: themeTokens.colors.textPrimary, marginTop: 2 },
  cardSection: { gap: 10 },
  cardSectionTitle: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  aiSummaryCard: {
    backgroundColor: themeTokens.brand.primaryDark,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    gap: 8,
  },
  aiHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiHeaderTitle: { fontSize: 15, fontWeight: '800', color: themeTokens.brand.yellow },
  aiSummaryText: { fontSize: 13, color: themeTokens.colors.surface, lineHeight: 20 },
  actionsBar: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', paddingTop: 10 },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.md,
  },
  primaryActionText: { fontSize: 13, fontWeight: '900', color: themeTokens.brand.primaryDark },
  secActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  secActionText: { fontSize: 13, fontWeight: '700', color: themeTokens.colors.textPrimary },
});
