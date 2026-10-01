import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, ShieldCheck, FileCheck2, HeartHandshake, Stethoscope, Ticket, Landmark } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function UpayPaymentsScreen() {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const items = [
    { title: 'সরকারি ফি (Govt Fee)', desc: 'Passport, NID, Land Tax', icon: FileCheck2 },
    { title: 'ট্রাফিক ফাইন (Traffic Fine)', desc: 'DMP Traffic Fine Payment', icon: ShieldCheck },
    { title: 'এনজিও ও দান (NGO / Charity)', desc: 'As-Sunnah Foundation, BRAC, Red Crescent', icon: HeartHandshake },
    { title: 'স্বাস্থ্য ও বীমা (Health & Insurance)', desc: 'MetLife, Delta Life, Hospital Fees', icon: Stethoscope },
    { title: 'টিকিট (Ticket)', desc: 'Bus, Train, Launch, Flight Tickets', icon: Ticket },
    { title: 'শিক্ষা ফি (Education Fee)', desc: 'School, College, University Fees', icon: Landmark },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.upayPayments}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <TouchableOpacity key={i} style={styles.card} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Icon size={22} color={themeTokens.brand.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{it.title}</Text>
                <Text style={styles.desc}>{it.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: themeTokens.colors.surface,
    padding: 16,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  desc: { fontSize: 11, color: themeTokens.colors.textMuted, marginTop: 2 },
});
