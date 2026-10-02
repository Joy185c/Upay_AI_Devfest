import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { QrCode } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { mockCustomer, mockWallets } from '../data/seededData';
import { UpayWalletCard } from '../components/customer/UpayWalletCard';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const language = useAppStore((state) => state.language);
  const balance = useAppStore((state) => state.balance);
  const t = translations[language];
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{t.account}</Text>
        <TouchableOpacity
          style={styles.qrBtn}
          onPress={() => router.push('/qr-scan' as any)}
        >
          <QrCode size={22} color={themeTokens.brand.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Image 
              source={require('../assets/profile.jpg')} 
              style={{ width: 44, height: 44, borderRadius: 22 }} 
            />
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.userName}>{mockCustomer.name}</Text>
            <Text style={styles.userPhone}>{mockCustomer.phone}</Text>
          </View>
          <View style={styles.balanceRight}>
            <Text style={styles.balanceLabel}>{t.balance}</Text>
            <Text style={styles.balanceVal}>{formatCurrency(balance, language)}</Text>
          </View>
        </View>

        {/* Wallets Section Title */}
        <Text style={styles.sectionTitle}>
          {language === 'bn' ? 'ওয়ালেটসমূহ' : 'Wallets'}
        </Text>

        {/* 2x2 Pastel Wallets + Cash Reward Card */}
        <UpayWalletCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
  qrBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeTokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: themeTokens.radius.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themeTokens.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  userPhone: {
    fontSize: 12,
    color: themeTokens.colors.textSecondary,
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 10,
    color: themeTokens.colors.textMuted,
    fontWeight: '600',
  },
  balanceVal: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeTokens.brand.primary,
    marginLeft: 20,
    marginBottom: 10,
  },
});
