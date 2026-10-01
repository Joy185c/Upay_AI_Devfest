import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { budgetService } from '../../services/budgetService';
import { BudgetOptimizationResult } from '../../types';
import { MarginalReturnsChart } from '../../components/charts/MarginalReturnsChart';
import { formatCurrency } from '../../i18n';
import { ArrowRightLeft, Sparkles, Check } from 'lucide-react-native';

export default function BudgetOptimizerScreen() {
  const [totalBudget, setTotalBudget] = useState(5500000);
  const [optResult, setOptResult] = useState<BudgetOptimizationResult | null>(null);

  useEffect(() => {
    budgetService.getOptimization(totalBudget).then(setOptResult);
  }, [totalBudget]);

  if (!optResult) return null;

  return (
    <View style={styles.container}>
      <ConsoleHeader title="Budget Optimizer" subtitle="Maximize Incremental Revenue per Taka Spent Across Portfolio" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Before vs After Comparison Card */}
        <View style={styles.baCard}>
          {/* Before: Broad Blast */}
          <View style={styles.baColBefore}>
            <Text style={styles.baHeader}>BEFORE (Broad Blast)</Text>
            <Text style={styles.baSub}>Promos sent to all users indiscriminately</Text>

            <View style={styles.baMetricBox}>
              <Text style={styles.baLabel}>Total Spend</Text>
              <Text style={styles.baVal}>{formatCurrency(optResult.before.spent, 'en')}</Text>
            </View>

            <View style={styles.baMetricBox}>
              <Text style={styles.baLabel}>Incremental Revenue</Text>
              <Text style={styles.baVal}>{formatCurrency(optResult.before.incrementalRevenue, 'en')}</Text>
            </View>

            <View style={styles.baMetricBox}>
              <Text style={styles.baLabel}>iROI</Text>
              <Text style={styles.baVal}>{optResult.before.iROI}%</Text>
            </View>
          </View>

          {/* After: ImpactIQ Targeted */}
          <View style={styles.baColAfter}>
            <View style={styles.aiTagRow}>
              <Sparkles size={14} color={themeTokens.brand.yellow} />
              <Text style={styles.aiTagText}>AFTER (ImpactIQ Targeted)</Text>
            </View>
            <Text style={styles.baSubAfter}>Persuadables targeted, Sure Things excluded</Text>

            <View style={styles.baMetricBoxAfter}>
              <Text style={styles.baLabelAfter}>Total Spend</Text>
              <Text style={styles.baValAfter}>{formatCurrency(optResult.after.spent, 'en')}</Text>
            </View>

            <View style={styles.baMetricBoxAfter}>
              <Text style={styles.baLabelAfter}>Incremental Revenue</Text>
              <Text style={[styles.baValAfter, { color: themeTokens.brand.yellow }]}>
                {formatCurrency(optResult.after.incrementalRevenue, 'en')}
              </Text>
            </View>

            <View style={styles.baMetricBoxAfter}>
              <Text style={styles.baLabelAfter}>Optimized iROI</Text>
              <Text style={[styles.baValAfter, { color: themeTokens.colors.success }]}>
                {optResult.after.iROI}%
              </Text>
            </View>

            <View style={styles.savingsBanner}>
              <Text style={styles.savingsText}>
                ✦ Saved ৳{formatCurrency(optResult.after.savedBDT, 'en')} in Subsidy Waste!
              </Text>
            </View>
          </View>
        </View>

        {/* Marginal Returns Curve Chart */}
        <View style={styles.chartCard}>
          <MarginalReturnsChart data={optResult.marginalReturnCurve} recommendedSpendBDT={3960000} />
        </View>

        {/* Reallocation Recommendations Table */}
        <View style={styles.reallocCard}>
          <Text style={styles.cardTitle}>Recommended Campaign Allocations</Text>
          {optResult.campaignAllocations.map((alloc) => (
            <View key={alloc.campaignId} style={styles.allocRow}>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.cTitle}>{alloc.campaignTitle}</Text>
                <Text style={styles.cTarget}>{alloc.quadrantTarget}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.aLabel}>Current Spend</Text>
                <Text style={styles.aPrev}>{formatCurrency(alloc.currentSpend, 'en')}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.aLabel}>Optimized Spend</Text>
                <Text style={styles.aNext}>{formatCurrency(alloc.optimizedSpend, 'en')}</Text>
              </View>

              <TouchableOpacity style={styles.applyBtn}>
                <Check size={14} color={themeTokens.brand.primaryDark} />
                <Text style={styles.applyBtnText}>Apply</Text>
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
  baCard: { flexDirection: 'row', borderRadius: themeTokens.radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: themeTokens.colors.border },
  baColBefore: { flex: 1, backgroundColor: themeTokens.colors.surface, padding: 20, gap: 12 },
  baHeader: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textMuted },
  baSub: { fontSize: 11, color: themeTokens.colors.textMuted },
  baMetricBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 6 },
  baLabel: { fontSize: 10, color: themeTokens.colors.textMuted },
  baVal: { fontSize: 18, fontWeight: '800', color: themeTokens.colors.textPrimary },
  baColAfter: { flex: 1.2, backgroundColor: themeTokens.brand.primaryDark, padding: 20, gap: 12 },
  aiTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiTagText: { fontSize: 12, fontWeight: '900', color: themeTokens.brand.yellow },
  baSubAfter: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  baMetricBoxAfter: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 6 },
  baLabelAfter: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  baValAfter: { fontSize: 20, fontWeight: '900', color: themeTokens.colors.surface },
  savingsBanner: { backgroundColor: 'rgba(255,213,0,0.25)', padding: 10, borderRadius: 6, alignItems: 'center' },
  savingsText: { fontSize: 12, fontWeight: '900', color: themeTokens.brand.yellow },
  chartCard: { gap: 10 },
  reallocCard: { backgroundColor: themeTokens.colors.surface, padding: 20, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  allocRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  cTitle: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  cTarget: { fontSize: 10, color: themeTokens.brand.primary, fontWeight: '700' },
  aLabel: { fontSize: 9, color: themeTokens.colors.textMuted },
  aPrev: { fontSize: 13, textDecorationLine: 'line-through', color: themeTokens.colors.textMuted },
  aNext: { fontSize: 14, fontWeight: '900', color: themeTokens.colors.success },
  applyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: themeTokens.brand.yellow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  applyBtnText: { fontSize: 11, fontWeight: '900', color: themeTokens.brand.primaryDark },
});
