import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <Shield size={24} color={themeTokens.brand.primary} />
            <Text style={styles.cardTitle}>Upay BD Simulation Privacy Policy</Text>
          </View>
          <Text style={styles.dateText}>Last updated: October 02, 2026</Text>

          <Text style={styles.sectionHeading}>1. Data Collection & Simulation Notice</Text>
          <Text style={styles.paragraph}>
            Upay BD is a simulated mobile wallet payment application environment. All user balances, transactions, and payment activities are purely simulated for demonstration and prototyping purposes. No real monetary transactions take place.
          </Text>

          <Text style={styles.sectionHeading}>2. Account & Authentication Security</Text>
          <Text style={styles.paragraph}>
            User authentication is powered by Supabase Auth with Row Level Security (RLS) policies. User authentication tokens and sessions are stored securely. Transaction PINs are hashed and never stored in plain text.
          </Text>

          <Text style={styles.sectionHeading}>3. Contact Us</Text>
          <Text style={styles.paragraph}>
            For privacy inquiries or technical questions regarding this application prototype, please contact support@upaybd.example.com.
          </Text>
        </View>
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
  scrollContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.xl,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  dateText: { fontSize: 11, color: themeTokens.colors.textMuted, fontStyle: 'italic' },
  sectionHeading: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 8 },
  paragraph: { fontSize: 13, color: themeTokens.colors.textSecondary, lineHeight: 18 },
});
