import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { simulatorService } from '../../services/simulatorService';
import { WhatIfScenarioInput, WhatIfScenarioResult } from '../../types';
import { formatCurrency } from '../../i18n';
import { SlidersHorizontal, Sparkles, Plus, Check } from 'lucide-react-native';

export default function SimulatorScreen() {
  const [cashbackPct, setCashbackPct] = useState(10);
  const [maxCap, setMaxCap] = useState(150);
  const [audienceSize, setAudienceSize] = useState(100000);
  const [targetQuadrant, setTargetQuadrant] = useState<'persuadables' | 'sure_things' | 'all'>('persuadables');
  const [channel, setChannel] = useState<'in_app' | 'push' | 'sms'>('in_app');

  const [currentResult, setCurrentResult] = useState<WhatIfScenarioResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<WhatIfScenarioResult[]>([]);

  useEffect(() => {
    runSimulation();
  }, [cashbackPct, maxCap, audienceSize, targetQuadrant, channel]);

  const runSimulation = async () => {
    const input: WhatIfScenarioInput = {
      cashbackPct,
      maxCapPerUserBDT: maxCap,
      audienceSize,
      durationDays: 30,
      channel,
      targetQuadrant,
    };
    const res = await simulatorService.simulateScenario(input);
    setCurrentResult(res);
  };

  const handleSaveScenario = () => {
    if (currentResult && savedScenarios.length < 3) {
      setSavedScenarios([...savedScenarios, currentResult]);
    }
  };

  return (
    <View style={styles.container}>
      <ConsoleHeader title="What-If Campaign Simulator" subtitle="Predict Causal Incremental Lift & iROI Before Launching" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View style={styles.gridRow}>
          {/* Controls Panel */}
          <View style={styles.controlsCard}>
            <Text style={styles.cardTitle}>Simulation Parameters</Text>

            {/* Target Segment */}
            <Text style={styles.label}>Target Segment</Text>
            <View style={styles.chipRow}>
              {(['persuadables', 'sure_things', 'all'] as const).map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.chip, targetQuadrant === q && styles.activeChip]}
                  onPress={() => setTargetQuadrant(q)}
                >
                  <Text style={[styles.chipText, targetQuadrant === q && styles.activeChipText]}>
                    {q.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cashback % */}
            <Text style={styles.label}>Cashback Rate: {cashbackPct}%</Text>
            <View style={styles.sliderBtnRow}>
              {[5, 10, 15, 20].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.sBtn, cashbackPct === v && styles.activeSBtn]}
                  onPress={() => setCashbackPct(v)}
                >
                  <Text style={[styles.sText, cashbackPct === v && styles.activeSText]}>{v}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Max Cap */}
            <Text style={styles.label}>Max Cap Per User: ৳{maxCap}</Text>
            <View style={styles.sliderBtnRow}>
              {[50, 100, 150, 200, 300].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.sBtn, maxCap === v && styles.activeSBtn]}
                  onPress={() => setMaxCap(v)}
                >
                  <Text style={[styles.sText, maxCap === v && styles.activeSText]}>৳{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Audience Size */}
            <Text style={styles.label}>Audience Reach: {(audienceSize / 1000).toFixed(0)}k Users</Text>
            <View style={styles.sliderBtnRow}>
              {[25000, 50000, 100000, 250000].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.sBtn, audienceSize === v && styles.activeSBtn]}
                  onPress={() => setAudienceSize(v)}
                >
                  <Text style={[styles.sText, audienceSize === v && styles.activeSText]}>
                    {(v / 1000).toFixed(0)}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveScenario}>
              <Plus size={16} color={themeTokens.brand.primaryDark} />
              <Text style={styles.saveBtnText}>Save Scenario for Comparison</Text>
            </TouchableOpacity>
          </View>

          {/* Forecast Output Panel */}
          {currentResult && (
            <View style={styles.outputCard}>
              <View style={styles.outputHeader}>
                <Sparkles size={20} color={themeTokens.brand.yellow} />
                <Text style={styles.outputTitle}>Predicted Causal Forecast</Text>
              </View>

              <View style={styles.resGrid}>
                <View style={styles.resItem}>
                  <Text style={styles.rLabel}>Predicted Incremental Revenue</Text>
                  <Text style={styles.rVal}>{formatCurrency(currentResult.predictedIncrementalRevenue, 'en')}</Text>
                </View>

                <View style={styles.resItem}>
                  <Text style={styles.rLabel}>Predicted Campaign Cost</Text>
                  <Text style={styles.rVal}>{formatCurrency(currentResult.predictedCost, 'en')}</Text>
                </View>

                <View style={styles.resItem}>
                  <Text style={styles.rLabel}>Predicted iROI</Text>
                  <Text style={[styles.rVal, { color: themeTokens.colors.success }]}>
                    {currentResult.predictedIROI}%
                  </Text>
                </View>

                <View style={styles.resItem}>
                  <Text style={styles.rLabel}>Abuse Risk Score</Text>
                  <Text style={[styles.rVal, { color: currentResult.predictedAbuseRiskPct > 15 ? themeTokens.colors.warning : themeTokens.colors.success }]}>
                    {currentResult.predictedAbuseRiskPct}%
                  </Text>
                </View>
              </View>

              <View style={styles.ciBox}>
                <Text style={styles.ciText}>
                  Confidence Interval (95%): {formatCurrency(currentResult.confidenceRange[0], 'en')} to {formatCurrency(currentResult.confidenceRange[1], 'en')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Side-by-Side Comparison (Up to 3 Scenarios) */}
        {savedScenarios.length > 0 && (
          <View style={styles.compCard}>
            <Text style={styles.cardTitle}>Side-by-Side Scenario Comparison</Text>
            <View style={styles.compRow}>
              {savedScenarios.map((sc, idx) => (
                <View key={idx} style={styles.compCol}>
                  <Text style={styles.compName}>Scenario #{idx + 1}</Text>
                  <Text style={styles.compDetail}>{sc.input.cashbackPct}% Cashback ({sc.input.targetQuadrant})</Text>
                  <Text style={styles.compRev}>Inc Rev: {formatCurrency(sc.predictedIncrementalRevenue, 'en')}</Text>
                  <Text style={styles.compCost}>Cost: {formatCurrency(sc.predictedCost, 'en')}</Text>
                  <Text style={styles.compIROI}>iROI: {sc.predictedIROI}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  gridRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  controlsCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  label: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textSecondary, marginTop: 4 },
  chipRow: { flexDirection: 'row', gap: 6 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: themeTokens.radius.full },
  activeChip: { backgroundColor: themeTokens.brand.primary },
  chipText: { fontSize: 10, fontWeight: '800', color: themeTokens.colors.textSecondary },
  activeChipText: { color: themeTokens.colors.surface },
  sliderBtnRow: { flexDirection: 'row', gap: 6 },
  sBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  activeSBtn: { backgroundColor: themeTokens.brand.yellow },
  sText: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.textPrimary },
  activeSText: { color: themeTokens.brand.primaryDark },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.md,
    marginTop: 10,
  },
  saveBtnText: { fontSize: 13, fontWeight: '900', color: themeTokens.brand.primaryDark },
  outputCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: themeTokens.brand.primaryDark,
    padding: 20,
    borderRadius: themeTokens.radius.lg,
    gap: 16,
  },
  outputHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  outputTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.brand.yellow },
  resGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  resItem: { flex: 1, minWidth: 130, backgroundColor: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: themeTokens.radius.md },
  rLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  rVal: { fontSize: 20, fontWeight: '900', color: themeTokens.colors.surface, marginTop: 4 },
  ciBox: { backgroundColor: 'rgba(255,213,0,0.2)', padding: 10, borderRadius: themeTokens.radius.sm },
  ciText: { fontSize: 11, fontWeight: '700', color: themeTokens.brand.yellow, textAlign: 'center' },
  compCard: { backgroundColor: themeTokens.colors.surface, padding: 20, borderRadius: themeTokens.radius.lg, borderWidth: 1, borderColor: themeTokens.colors.border, gap: 12 },
  compRow: { flexDirection: 'row', gap: 12 },
  compCol: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: themeTokens.radius.md, gap: 4 },
  compName: { fontSize: 14, fontWeight: '800', color: themeTokens.brand.primary },
  compDetail: { fontSize: 11, color: themeTokens.colors.textMuted },
  compRev: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  compCost: { fontSize: 12, color: themeTokens.colors.textSecondary },
  compIROI: { fontSize: 14, fontWeight: '900', color: themeTokens.colors.success },
});
