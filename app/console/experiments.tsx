import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../components/layout/ConsoleHeader';
import { themeTokens } from '../../theme/tokens';
import { mockExperiments } from '../../data/seededData';
import { Sparkles, FlaskConical, CheckCircle2 } from 'lucide-react-native';

export default function ExperimentsScreen() {
  return (
    <View style={styles.container}>
      <ConsoleHeader title="Holdout & DiD Experiments" subtitle="Randomized Control Trials (RCT) & Statistical Significance" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {mockExperiments.map((exp) => (
          <View key={exp.id} style={styles.expCard}>
            <View style={styles.expHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FlaskConical size={22} color={themeTokens.brand.primary} />
                <View>
                  <Text style={styles.expName}>{exp.name}</Text>
                  <Text style={styles.expSub}>Campaign: {exp.campaignTitle}</Text>
                </View>
              </View>

              <View style={styles.sigBadge}>
                <CheckCircle2 size={14} color="#10B981" />
                <Text style={styles.sigText}>Statistically Significant (p = {exp.pValue})</Text>
              </View>
            </View>

            {/* Holdout Split Info */}
            <View style={styles.splitRow}>
              <View style={styles.splitBox}>
                <Text style={styles.splitLabel}>Treated Group (85%)</Text>
                <Text style={styles.splitVal}>{exp.treatedSize.toLocaleString()} Users</Text>
                <Text style={styles.splitChange}>Pre ৳{exp.preTreatedAvg} ➔ Post ৳{exp.postTreatedAvg} (+৳{exp.postTreatedAvg - exp.preTreatedAvg})</Text>
              </View>

              <View style={styles.splitBoxControl}>
                <Text style={styles.splitLabel}>Holdout Control Group ({exp.holdoutPercentage}%)</Text>
                <Text style={styles.splitVal}>{exp.controlSize.toLocaleString()} Users</Text>
                <Text style={styles.splitChange}>Pre ৳{exp.preControlAvg} ➔ Post ৳{exp.postControlAvg} (+৳{exp.postControlAvg - exp.preControlAvg})</Text>
              </View>
            </View>

            {/* Difference-in-Differences Result */}
            <View style={styles.didResultBox}>
              <Sparkles size={18} color={themeTokens.brand.primaryDark} />
              <View style={{ flex: 1 }}>
                <Text style={styles.didTitle}>Difference-in-Differences (DiD) Causal Impact</Text>
                <Text style={styles.didVal}>+৳{exp.didEstimate} per user true uplift</Text>
                <Text style={styles.didCi}>95% Confidence Interval: [৳{exp.confidenceInterval[0]}, ৳{exp.confidenceInterval[1]}]</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  expCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 16,
  },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expName: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  expSub: { fontSize: 12, color: themeTokens.colors.textMuted },
  sigBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  sigText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  splitRow: { flexDirection: 'row', gap: 12 },
  splitBox: { flex: 1, backgroundColor: '#EBF4FF', padding: 14, borderRadius: themeTokens.radius.md, gap: 4 },
  splitBoxControl: { flex: 1, backgroundColor: '#F1F5F9', padding: 14, borderRadius: themeTokens.radius.md, gap: 4 },
  splitLabel: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.textMuted },
  splitVal: { fontSize: 18, fontWeight: '900', color: themeTokens.colors.textPrimary },
  splitChange: { fontSize: 11, color: themeTokens.colors.textSecondary },
  didResultBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF8CE', padding: 14, borderRadius: themeTokens.radius.md },
  didTitle: { fontSize: 13, fontWeight: '800', color: themeTokens.brand.primaryDark },
  didVal: { fontSize: 18, fontWeight: '900', color: themeTokens.brand.primary },
  didCi: { fontSize: 11, color: themeTokens.colors.textSecondary },
});
