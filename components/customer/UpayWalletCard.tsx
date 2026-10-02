import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet, Gift, ArrowDownLeft, Landmark, HeartHandshake } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { mockWallets } from '../../data/seededData';
import { formatCurrency, translations } from '../../i18n';
import { useAppStore } from '../../lib/store';
import { useRouter } from 'expo-router';

export const UpayWalletCard: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const balance = useAppStore((state) => state.balance);
  const t = translations[language];
  const router = useRouter();

  const pastelCards = [
    { title: t.primaryWallet, amount: balance, bg: themeTokens.wallets.primary, icon: Wallet, color: '#0B4DA2' },
    { title: t.disbursementWallet, amount: mockWallets.disbursement, bg: themeTokens.wallets.disbursement, icon: ArrowDownLeft, color: '#E53E3E' },
    { title: t.secondaryWallet, amount: mockWallets.secondary, bg: themeTokens.wallets.secondary, icon: Landmark, color: '#8B5CF6' },
    { title: t.remittanceWallet, amount: mockWallets.remittance, bg: themeTokens.wallets.remittance, icon: HeartHandshake, color: '#00A859' },
  ];

  return (
    <View style={styles.container}>
      {/* 2x2 Grid */}
      <View style={styles.grid2x2}>
        {pastelCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <View key={idx} style={[styles.walletCard, { backgroundColor: card.bg }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: card.color }]}>{card.title}</Text>
                <Icon size={20} color={card.color} opacity={0.8} />
              </View>
              <Text style={styles.cardAmount}>{formatCurrency(card.amount, language)}</Text>
            </View>
          );
        })}
      </View>

      {/* Full-width Cash Reward Card with ImpactIQ Tie-in */}
      <View style={[styles.cashRewardCard, { backgroundColor: themeTokens.wallets.cashReward }]}>
        <View style={styles.cashRewardTop}>
          <View style={styles.rewardTitleRow}>
            <View style={styles.giftIconCircle}>
              <Gift size={20} color={themeTokens.brand.primary} />
            </View>
            <Text style={styles.cashRewardTitle}>{t.cashReward}</Text>
          </View>
          <Text style={styles.cashRewardAmount}>{formatCurrency(mockWallets.cashReward, language)}</Text>
        </View>

        <Text style={styles.cashRewardDesc}>{t.cashRewardDesc}</Text>

        {/* ImpactIQ Tie-in Link */}
        <TouchableOpacity
          style={styles.whyLink}
          onPress={() => router.push('/offers' as any)}
        >
          <Text style={styles.whyLinkText}>
            {language === 'bn' ? '✦ কেন এই ক্যাশব্যাক পেয়েছেন? (ইমপ্যাক্টআইকিউ)' : '✦ Why did I get this cashback? (ImpactIQ)'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  walletCard: {
    width: '48%',
    borderRadius: themeTokens.radius.lg,
    padding: 14,
    height: 95,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  cashRewardCard: {
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: themeTokens.brand.yellow,
    gap: 8,
  },
  cashRewardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  giftIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeTokens.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashRewardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  cashRewardAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: themeTokens.brand.primary,
  },
  cashRewardDesc: {
    fontSize: 11,
    color: themeTokens.colors.textSecondary,
    fontWeight: '500',
  },
  whyLink: {
    backgroundColor: 'rgba(11, 77, 162, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  whyLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
});
