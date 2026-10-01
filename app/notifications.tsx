import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell, Sparkles } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const notifications = [
    {
      id: '1',
      title: '✦ Eid Bill-Pay Cashback Earned!',
      desc: 'You earned ৳145.00 cashback on DESCO electricity bill payment credited to Cash Reward.',
      time: '10 min ago',
    },
    {
      id: '2',
      title: 'ImpactIQ Personalized Offer Ready',
      desc: 'Supermarket 5% Instant Back is now active for your account.',
      time: '2 hours ago',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {notifications.map((n) => (
          <View key={n.id} style={styles.card}>
            <Bell size={20} color={themeTokens.brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{n.title}</Text>
              <Text style={styles.desc}>{n.desc}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
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
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: themeTokens.colors.surface,
    padding: 14,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  title: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  desc: { fontSize: 12, color: themeTokens.colors.textSecondary, marginTop: 2 },
  time: { fontSize: 10, color: themeTokens.colors.textMuted, marginTop: 4 },
});
