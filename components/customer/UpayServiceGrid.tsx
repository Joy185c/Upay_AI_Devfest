import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Send,
  Smartphone,
  ArrowDownLeft,
  QrCode,
  FileText,
  PlusCircle,
  PiggyBank,
  ArrowRightLeft,
  HandCoins,
  Gift,
  Building2,
} from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';
import { useRouter } from 'expo-router';

export const UpayServiceGrid: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const services = [
    { id: 'send-money', label: t.sendMoney, icon: Send, route: '/send-money', color: '#0B4DA2' },
    { id: 'recharge', label: t.mobileRecharge, icon: Smartphone, route: '/topup', color: '#00A859' },
    { id: 'cash-out', label: t.cashOut, icon: ArrowDownLeft, route: '/cash-out', color: '#FF9900' },
    { id: 'make-payment', label: t.makePayment, icon: QrCode, route: '/qr-scan', color: '#0B4DA2' },
    { id: 'pay-bill', label: t.payBill, icon: FileText, route: '/pay-bill', color: '#E53E3E' },
    { id: 'add-money', label: t.addMoney, icon: PlusCircle, route: '/add-money', color: '#00A859' },
    { id: 'insights', label: language === 'bn' ? 'ইনসাইটস' : 'Insights', icon: PiggyBank, route: '/insights', color: '#0B4DA2' },
    { id: 'savings', label: t.savings, icon: PiggyBank, route: '/savings', color: '#8B5CF6' },
    { id: 'fund-transfer', label: t.fundTransfer, icon: ArrowRightLeft, route: '/fund-transfer', color: '#0B4DA2' },
    { id: 'request-money', label: t.requestMoney, icon: HandCoins, route: '/request-money', color: '#F59E0B' },
    { id: 'refer-earn', label: t.referEarn, icon: Gift, route: '/refer-earn', color: '#EC4899' },
    { id: 'npsb', label: t.npsb, icon: Building2, route: '/npsb', color: '#0B4DA2' },
  ];

  return (
    <View style={styles.gridContainer}>
      {services.map((s) => {
        const Icon = s.icon;
        return (
          <TouchableOpacity
            key={s.id}
            style={styles.serviceTile}
            onPress={() => router.push(s.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EBF4FF' }]}>
              <Icon size={24} color={s.color} />
            </View>
            <Text style={styles.serviceLabel} numberOfLines={2}>
              {s.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  serviceTile: {
    width: '25%', // 4 columns
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(11, 77, 162, 0.1)',
  },
  serviceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
