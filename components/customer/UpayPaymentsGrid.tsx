import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, FileCheck2, HeartHandshake, Stethoscope, Ticket, MoreHorizontal } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';
import { useRouter } from 'expo-router';

export const UpayPaymentsGrid: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const paymentItems = [
    { id: 'gov', label: language === 'bn' ? 'সরকারি ফি' : 'Govt Fee', icon: FileCheck2 },
    { id: 'traffic', label: language === 'bn' ? 'ট্রাফিক ফাইন' : 'Traffic Fine', icon: ShieldCheck },
    { id: 'ngo', label: language === 'bn' ? 'এনজিও / দান' : 'NGO / Donation', icon: HeartHandshake },
    { id: 'health', label: language === 'bn' ? 'স্বাস্থ্য / ইন্স্যুরেন্স' : 'Health', icon: Stethoscope },
    { id: 'ticket', label: language === 'bn' ? 'টিকিট' : 'Ticket', icon: Ticket },
    { id: 'more', label: language === 'bn' ? 'আরো' : 'More', icon: MoreHorizontal },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.upayPayments}</Text>

      <View style={styles.gridRow}>
        {paymentItems.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tile}
              onPress={() => router.push('/upay-payments' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Icon size={22} color={themeTokens.brand.primary} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeTokens.brand.primary,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  tile: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
  },
});
