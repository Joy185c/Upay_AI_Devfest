import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ConsoleHeader } from '../components/layout/ConsoleHeader';
import { themeTokens } from '../theme/tokens';
import { mockMerchants } from '../data/seededData';
import { formatCurrency } from '../i18n';
import { Store, Sparkles, TrendingUp, Check } from 'lucide-react-native';

export default function MerchantPortalScreen() {
  return (
    <View style={styles.container}>
      <ConsoleHeader title="Merchant Impact Portal" subtitle="See Which Offers Truly Grow Merchant Sales (Incremental, Not Gross)" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {mockMerchants.map((m) => (
          <View key={m.id} style={styles.mCard}>
            <View style={styles.mHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Store size={24} color={themeTokens.brand.primary} />
                <View>
                  <Text style={styles.mName}>{m.name}</Text>
                  <Text style={styles.mSub}>{m.category} • {m.region}</Text>
                </View>
              </View>

              <View style={styles.campaignBadge}>
                <Text style={styles.cText}>{m.activeCampaignName}</Text>
              </View>
            </View>

            {/* Incremental Metrics Grid */}
            <View style={styles.mGrid}>
              <View style={styles.mItem}>
                <Text style={styles.mLabel}>Total Sales</Text>
                <Text style={styles.mVal}>{formatCurrency(m.totalSalesBDT, 'en')}</Text>
              </View>

              <View style={styles.mItem}>
                <Text style={styles.mLabel}>Organic Baseline</Text>
                <Text style={styles.mVal}>{formatCurrency(m.organicBaselineBDT, 'en')}</Text>
              </View>

              <View style={styles.mItem}>
                <Text style={styles.mLabel}>True Incremental Sales</Text>
                <Text style={[styles.mVal, { color: themeTokens.brand.primary, fontWeight: '900' }]}>
                  {formatCurrency(m.incrementalSalesBDT, 'en')}
                </Text>
              </View>

              <View style={styles.mItem}>
                <Text style={styles.mLabel}>Incremental Lift</Text>
                <Text style={[styles.mVal, { color: themeTokens.colors.success, fontWeight: '900' }]}>
                  +{m.incrementalLiftPct}%
                </Text>
              </View>
            </View>

            {/* ImpactIQ AI Recommendation for Merchant */}
            <View style={styles.aiBox}>
              <Sparkles size={18} color={themeTokens.brand.primaryDark} />
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>Recommended Offer Strategy</Text>
                <Text style={styles.aiText}>{m.recommendedOfferEn}</Text>
              </View>
              <TouchableOpacity style={styles.applyBtn}>
                <Check size={14} color={themeTokens.brand.primaryDark} />
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  mCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 16,
  },
  mHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mName: { fontSize: 18, fontWeight: '800', color: themeTokens.colors.textPrimary },
  mSub: { fontSize: 12, color: themeTokens.colors.textMuted },
  campaignBadge: { backgroundColor: '#EBF4FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: themeTokens.radius.full },
  cText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary },
  mGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 14, borderRadius: themeTokens.radius.md, gap: 12 },
  mItem: { flex: 1 },
  mLabel: { fontSize: 10, fontWeight: '700', color: themeTokens.colors.textMuted },
  mVal: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 2 },
  aiBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF8CE', padding: 14, borderRadius: themeTokens.radius.md },
  aiTitle: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primaryDark },
  aiText: { fontSize: 11, color: themeTokens.colors.textSecondary, marginTop: 2 },
  applyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: themeTokens.brand.yellow, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  applyBtnText: { fontSize: 11, fontWeight: '900', color: themeTokens.brand.primaryDark },
});
