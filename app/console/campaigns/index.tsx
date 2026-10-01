import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../../../components/layout/ConsoleHeader';
import { themeTokens } from '../../../theme/tokens';
import { mockCampaigns } from '../../../data/seededData';
import { formatCurrency } from '../../../i18n';
import { useRouter } from 'expo-router';

export default function CampaignListScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const router = useRouter();

  const filtered = mockCampaigns.filter((c) => filter === 'all' || c.status === filter);

  return (
    <View style={styles.container}>
      <ConsoleHeader title="Marketing Campaigns" subtitle="Causal Impact & Lift Analysis Across All Active Initiatives" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {['all', 'active', 'completed'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.activeFilterChip]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campaign List Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Campaign</Text>
            <Text style={[styles.th, { flex: 1 }]}>Status</Text>
            <Text style={[styles.th, { flex: 1 }]}>Budget Spent</Text>
            <Text style={[styles.th, { flex: 1 }]}>True Incremental Rev</Text>
            <Text style={[styles.th, { flex: 1 }]}>iROI</Text>
            <Text style={[styles.th, { width: 100 }]}>Impact Report</Text>
          </View>

          {filtered.map((c) => (
            <View key={c.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.cTitle}>{c.title}</Text>
                <Text style={styles.cSub}>{c.startDate} to {c.endDate}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{c.status.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={[styles.td, { flex: 1 }]}>{formatCurrency(c.budgetSpent, 'en')}</Text>
              <Text style={[styles.td, { flex: 1, fontWeight: '800', color: themeTokens.brand.primary }]}>
                {formatCurrency(c.incrementalRevenue, 'en')}
              </Text>
              <Text style={[styles.td, { flex: 1, fontWeight: '800', color: themeTokens.colors.success }]}>
                {c.iROI}%
              </Text>

              <TouchableOpacity
                style={styles.reportBtn}
                onPress={() => router.push(`/console/campaigns/${c.id}` as any)}
              >
                <Text style={styles.reportBtnText}>Open Report</Text>
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
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: { backgroundColor: themeTokens.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: themeTokens.radius.full, borderWidth: 1, borderColor: themeTokens.colors.border },
  activeFilterChip: { backgroundColor: themeTokens.brand.yellow, borderColor: themeTokens.brand.yellow },
  filterText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeFilterText: { color: themeTokens.brand.primaryDark, fontWeight: '900' },
  tableCard: { backgroundColor: themeTokens.colors.surface, borderRadius: themeTokens.radius.lg, padding: 16, borderWidth: 1, borderColor: themeTokens.colors.border },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 6 },
  th: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.textMuted },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  cTitle: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  cSub: { fontSize: 10, color: themeTokens.colors.textMuted },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#10B981' },
  td: { fontSize: 13, color: themeTokens.colors.textPrimary },
  reportBtn: { backgroundColor: themeTokens.brand.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  reportBtnText: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.surface },
});
