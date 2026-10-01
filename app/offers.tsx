import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Sparkles, Gift, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { mockCampaigns } from '../data/seededData';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function OffersScreen() {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.upayOffer}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Banner Explainer */}
        <View style={styles.aiHeaderCard}>
          <Sparkles size={24} color={themeTokens.brand.yellow} />
          <View style={{ flex: 1 }}>
            <Text style={styles.aiHeaderTitle}>
              {language === 'bn' ? 'ইমপ্যাক্টআইকিউ পার্সোনালাইজড অফারস' : 'ImpactIQ Personalized Offers'}
            </Text>
            <Text style={styles.aiHeaderSub}>
              {language === 'bn'
                ? 'আপনার ব্যবহার ইতিহাসের উপর ভিত্তি করে কজ্যাল এআই দ্বারা তৈরি অফারসমূহ'
                : 'Offers powered by Causal AI tailored for your transaction habits'}
            </Text>
          </View>
        </View>

        {/* Offer Cards */}
        {mockCampaigns.map((cmp) => (
          <View key={cmp.id} style={styles.offerCard}>
            <View style={styles.cardTop}>
              <View style={styles.giftCircle}>
                <Gift size={22} color={themeTokens.brand.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.offerTitle}>{language === 'bn' ? cmp.titleBn : cmp.title}</Text>
                <Text style={styles.validText}>Valid till: {cmp.endDate}</Text>
              </View>
              <View style={styles.activeTag}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            {/* Why This Offer Explainer (Prompt Requirement) */}
            <View style={styles.whyBox}>
              <Text style={styles.whyHeader}>{t.whyThisOffer}</Text>
              <Text style={styles.whyDesc}>
                {language === 'bn'
                  ? 'আপনি গত মাসে ২টি বিদ্যুৎ বিল পরিশোধ করেছেন এবং Persuadables সেগমেন্টে আছেন। অফারটি নিলে আপনার অতিরিক্ত ১০% ক্যাশব্যাক জমা হবে!'
                  : 'You paid 2 utility bills last month and belong to the Persuadables segment. Claiming this offer gives +10% instant cashback!'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.claimBtn}
              onPress={() => router.push('/pay-bill' as any)}
            >
              <Text style={styles.claimBtnText}>
                {language === 'bn' ? 'অফার ব্যবহার করুন' : 'Use Offer Now'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeTokens.colors.creamBg },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 14,
    backgroundColor: themeTokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },
  aiHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: themeTokens.brand.primaryDark,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
  },
  aiHeaderTitle: { fontSize: 15, fontWeight: '800', color: themeTokens.colors.surface },
  aiHeaderSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  offerCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  giftCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerTitle: { fontSize: 15, fontWeight: '800', color: themeTokens.colors.textPrimary },
  validText: { fontSize: 11, color: themeTokens.colors.textMuted },
  activeTag: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  activeText: { fontSize: 10, fontWeight: '800', color: '#10B981' },
  whyBox: { backgroundColor: '#FFF8CE', padding: 12, borderRadius: themeTokens.radius.md },
  whyHeader: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primaryDark, marginBottom: 2 },
  whyDesc: { fontSize: 11, color: themeTokens.colors.textSecondary },
  claimBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.md,
    alignItems: 'center',
  },
  claimBtnText: { fontSize: 13, fontWeight: '900', color: themeTokens.brand.primaryDark },
});
