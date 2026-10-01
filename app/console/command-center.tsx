import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import {
  Activity,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Users,
  Megaphone,
  Store,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react-native';

export default function CommandCenterScreen() {
  const [simStep, setSimStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<{ id: string; time: string; text: string }[]>([
    { id: 'l1', time: 'Just now', text: 'ImpactIQ Engine initialized. Portfolio iROI: 164.5%.' },
    { id: 'l2', time: '1 min ago', text: 'Persuadable segment identified: 37% of customer base.' },
  ]);

  const simulationChain = [
    { step: 1, title: 'Campaign Launch', desc: 'Eid Bill-Pay campaign launches across 125,000 customers.' },
    { step: 2, title: 'Causal Separation', desc: 'Engine isolates organic control baseline from campaign lift.' },
    { step: 3, title: 'Uplift Segmentation', desc: 'Persuadables identified (+42% lift); Sure Things excluded.' },
    { step: 4, title: 'Budget Reallocation', desc: '৳1.8M broad blast subsidy waste saved and reallocated.' },
    { step: 5, title: 'Abuse Blocked', desc: 'Chattogram multi-account farming ring (৳180k) auto-blocked.' },
    { step: 6, title: 'Executive Outcome', desc: 'Final Net iROI boosted from 120% to 192% (+৳7.3M Inc Rev).' },
  ];

  const runSimulationStepByStep = () => {
    setIsSimulating(true);
    setSimStep(1);

    let current = 1;
    const timer = setInterval(() => {
      current += 1;
      if (current <= 6) {
        setSimStep(current);
        const newLog = {
          id: `log-${Date.now()}`,
          time: 'Just now',
          text: `[Step ${current}] ${simulationChain[current - 1].desc}`,
        };
        setLogs((prev) => [newLog, ...prev]);
      } else {
        clearInterval(timer);
        setIsSimulating(false);
      }
    }, 2200);
  };

  const handleReset = () => {
    setSimStep(0);
    setIsSimulating(false);
    setLogs([
      { id: 'l1', time: 'Just now', text: 'Engine reset. Monitoring live transactions...' },
    ]);
  };

  return (
    <View style={styles.container}>
      <ConsoleHeader title="ImpactIQ Command Center" subtitle="Live Causal Engine Graph & Real-Time Simulation Center" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Simulation Control Bar */}
        <View style={styles.controlBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Activity size={24} color={themeTokens.brand.yellow} />
            <View>
              <Text style={styles.controlTitle}>ImpactIQ Simulation Engine</Text>
              <Text style={styles.controlSub}>Run full end-to-end Causal AI optimization flow</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={[styles.simBtn, isSimulating && { opacity: 0.6 }]}
              onPress={runSimulationStepByStep}
              disabled={isSimulating}
            >
              <PlayCircle size={18} color={themeTokens.brand.primaryDark} />
              <Text style={styles.simBtnText}>{isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={16} color={themeTokens.colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 6-Step Visual Chain Progress */}
        <View style={styles.chainRow}>
          {simulationChain.map((s) => {
            const isPassed = simStep >= s.step;
            const isCurrent = simStep === s.step;
            return (
              <View key={s.step} style={[styles.chainNode, isCurrent && styles.activeChainNode, isPassed && styles.passedChainNode]}>
                <Text style={[styles.stepNum, isPassed && { color: themeTokens.brand.yellow }]}>#{s.step}</Text>
                <Text style={styles.nodeTitle} numberOfLines={1}>{s.title}</Text>
              </View>
            );
          })}
        </View>

        {/* Interactive Engine Node Network Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphHeader}>CAUSAL AI ENGINE GRAPH</Text>

          {/* Central Engine Node */}
          <View style={styles.centerNode}>
            <Sparkles size={32} color={themeTokens.brand.yellow} />
            <Text style={styles.centerNodeText}>IMPACTIQ CAUSAL ENGINE</Text>
          </View>

          {/* Connected Satellite Nodes */}
          <View style={styles.satelliteRow}>
            <View style={styles.satNode}>
              <Users size={20} color={themeTokens.brand.primary} />
              <Text style={styles.satText}>50k Customers</Text>
            </View>
            <View style={styles.satNode}>
              <Megaphone size={20} color="#00A859" />
              <Text style={styles.satText}>Campaigns</Text>
            </View>
            <View style={styles.satNode}>
              <Store size={20} color="#8B5CF6" />
              <Text style={styles.satText}>Merchants</Text>
            </View>
            <View style={styles.satNode}>
              <ShieldAlert size={20} color="#E53E3E" />
              <Text style={styles.satText}>Abuse Guard</Text>
            </View>
          </View>
        </View>

        {/* Four Live Panels Grid */}
        <View style={styles.panelsGrid}>
          {/* Panel 1: Demand */}
          <View style={styles.panelCard}>
            <Text style={styles.pTitle}>1. Demand & Activity</Text>
            <Text style={styles.pVal}>185,000 Txs</Text>
            <Text style={styles.pSub}>Active treat vs holdout baseline</Text>
          </View>

          {/* Panel 2: Uplift */}
          <View style={styles.panelCard}>
            <Text style={styles.pTitle}>2. Uplift Intelligence</Text>
            <Text style={[styles.pVal, { color: themeTokens.colors.success }]}>+42.5% Lift</Text>
            <Text style={styles.pSub}>Persuadables segment response</Text>
          </View>

          {/* Panel 3: Budget */}
          <View style={styles.panelCard}>
            <Text style={styles.pTitle}>3. Budget & iROI</Text>
            <Text style={[styles.pVal, { color: themeTokens.brand.yellow }]}>192% iROI</Text>
            <Text style={styles.pSub}>৳1.8M subsidy waste saved</Text>
          </View>

          {/* Panel 4: Risk */}
          <View style={styles.panelCard}>
            <Text style={styles.pTitle}>4. Risk & Leakage</Text>
            <Text style={[styles.pVal, { color: themeTokens.colors.danger }]}>৳325k Blocked</Text>
            <Text style={styles.pSub}>Abuse harvester rings isolated</Text>
          </View>
        </View>

        {/* Live Stream Logs */}
        <View style={styles.logCard}>
          <Text style={styles.logHeader}>Live Insight & Event Stream</Text>
          {logs.map((l) => (
            <View key={l.id} style={styles.logRow}>
              <Text style={styles.logTime}>{l.time}</Text>
              <Text style={styles.logText}>{l.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controlTitle: { fontSize: 16, fontWeight: '900', color: themeTokens.colors.surface },
  controlSub: { fontSize: 11, color: themeTokens.colors.textMuted },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.md,
  },
  simBtnText: { fontSize: 12, fontWeight: '900', color: themeTokens.brand.primaryDark },
  resetBtn: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: themeTokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chainRow: { flexDirection: 'row', gap: 6 },
  chainNode: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeChainNode: { borderColor: themeTokens.brand.yellow, backgroundColor: 'rgba(255,213,0,0.15)' },
  passedChainNode: { borderColor: '#10B981' },
  stepNum: { fontSize: 9, fontWeight: '800', color: themeTokens.colors.textMuted },
  nodeTitle: { fontSize: 10, fontWeight: '700', color: themeTokens.colors.surface, marginTop: 2 },
  graphContainer: {
    backgroundColor: '#1E293B',
    borderRadius: themeTokens.radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  graphHeader: { fontSize: 11, fontWeight: '900', color: themeTokens.brand.yellow, letterSpacing: 1 },
  centerNode: {
    backgroundColor: themeTokens.brand.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: themeTokens.radius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeTokens.brand.yellow,
    elevation: 10,
  },
  centerNodeText: { fontSize: 13, fontWeight: '900', color: themeTokens.brand.yellow, marginTop: 6 },
  satelliteRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  satNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  satText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.surface },
  panelsGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  panelCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  pTitle: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  pVal: { fontSize: 20, fontWeight: '900', color: themeTokens.colors.surface },
  pSub: { fontSize: 10, color: themeTokens.colors.textMuted },
  logCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: themeTokens.radius.lg, gap: 10 },
  logHeader: { fontSize: 13, fontWeight: '800', color: themeTokens.brand.yellow },
  logRow: { flexDirection: 'row', gap: 10, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  logTime: { fontSize: 10, color: themeTokens.colors.textMuted, width: 70 },
  logText: { fontSize: 12, color: themeTokens.colors.surface, flex: 1 },
});
