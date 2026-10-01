import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { mockUpliftSegments } from '../../data/seededData';
import { UpliftQuadrantScatter } from '../../components/charts/UpliftQuadrantScatter';
import { UpliftQuadrant } from '../../types';
import { formatCurrency } from '../../i18n';
import { useAppStore } from '../../lib/store';
import { GitFork, Sparkles, AlertCircle } from 'lucide-react-native';

export default function UpliftExplorerScreen() {
  const [selectedQuad, setSelectedQuad] = useState<UpliftQuadrant>('persuadables');
  const language = useAppStore((state) => state.language);

  const activeSegment = mockUpliftSegments.find((s) => s.quadrant === selectedQuad) || mockUpliftSegments[0];

  return (
    <View style={styles.container}>
      <ConsoleHeader title="Uplift Model Explorer" subtitle="Four Quadrants Causal Segmentation & Top Behavioral Feature Drivers" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Interactive 4 Quadrant Scatter */}
        <UpliftQuadrantScatter
          segments={mockUpliftSegments}
          onSelectQuadrant={(q) => setSelectedQuad(q)}
        />

        {/* Selected Quadrant Deep Dive Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailTitle}>{activeSegment.title} ({activeSegment.percentage}%)</Text>
              <Text style={styles.detailSub}>{activeSegment.description}</Text>
            </View>

            <View style={styles.actionPill}>
              <Text style={styles.actionPillText}>{activeSegment.recommendedAction}</Text>
            </View>
          </View>

          {/* Metrics strip */}
          <View style={styles.mStrip}>
            <View style={styles.mItem}>
              <Text style={styles.mLabel}>Customer Count</Text>
              <Text style={styles.mVal}>{activeSegment.userCount.toLocaleString()}</Text>
            </View>
            <View style={styles.mItem}>
              <Text style={styles.mLabel}>Avg Predicted Uplift</Text>
              <Text style={[styles.mVal, { color: activeSegment.avgPredictedUpliftPct > 0 ? themeTokens.colors.success : themeTokens.colors.danger }]}>
                {activeSegment.avgPredictedUpliftPct > 0 ? '+' : ''}{activeSegment.avgPredictedUpliftPct}%
              </Text>
            </View>
            <View style={styles.mItem}>
              <Text style={styles.mLabel}>Potential Savings</Text>
              <Text style={[styles.mVal, { color: themeTokens.brand.yellow }]}>
                {activeSegment.potentialSavingsBDT > 0 ? formatCurrency(activeSegment.potentialSavingsBDT, 'en') : '৳0'}
              </Text>
            </View>
          </View>

          {/* Top Feature Drivers Panel (Prompt Requirement) */}
          <View style={styles.driversPanel}>
            <View style={styles.driversHeader}>
              <Sparkles size={16} color={themeTokens.brand.primary} />
              <Text style={styles.driversTitle}>Top Causal Feature Drivers (Explainable AI)</Text>
            </View>

            {activeSegment.topDrivers.map((driver, idx) => (
              <View key={idx} style={styles.driverRow}>
                <Text style={styles.dName}>{language === 'bn' ? driver.featureNameBn : driver.featureName}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.barFill, { width: `${driver.importanceScore * 100}%` }]} />
                </View>
                <Text style={styles.dScore}>{(driver.importanceScore * 100).toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  detailCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 16,
  },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailTitle: { fontSize: 18, fontWeight: '900', color: themeTokens.colors.textPrimary },
  detailSub: { fontSize: 12, color: themeTokens.colors.textSecondary, marginTop: 2, maxWidth: 350 },
  actionPill: { backgroundColor: '#EBF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: themeTokens.radius.full },
  actionPillText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary },
  mStrip: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderRadius: themeTokens.radius.md, gap: 12 },
  mItem: { flex: 1 },
  mLabel: { fontSize: 10, fontWeight: '700', color: themeTokens.colors.textMuted },
  mVal: { fontSize: 16, fontWeight: '900', color: themeTokens.colors.textPrimary, marginTop: 2 },
  driversPanel: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: themeTokens.radius.md, gap: 10 },
  driversHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driversTitle: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dName: { width: 140, fontSize: 12, fontWeight: '600', color: themeTokens.colors.textSecondary },
  barContainer: { flex: 1, height: 8, backgroundColor: '#CBD5E0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: themeTokens.brand.primary },
  dScore: { width: 35, fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary, textAlign: 'right' },
});
