import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <FileText size={24} color={themeTokens.brand.primary} />
            <Text style={styles.cardTitle}>Terms & Conditions</Text>
          </View>
          <Text style={styles.dateText}>Effective Date: October 02, 2026</Text>

          <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using Upay BD, you acknowledge that this is a simulated wallet application designed for testing, demonstration, and staging purposes. You agree to use the app in compliance with applicable law.
          </Text>

          <Text style={styles.sectionHeading}>2. Simulated Funds & Financial Disclaimer</Text>
          <Text style={styles.paragraph}>
            All balances, transfers, utility payments, and mobile recharges conducted inside Upay BD are non-monetary simulations. No actual fiat currency (BDT) is held, processed, or transferred.
          </Text>

          <Text style={styles.sectionHeading}>3. Account Responsibilities & Security</Text>
          <Text style={styles.paragraph}>
            Users are responsible for maintaining the security of their login credentials and 4-digit transaction PINs. Upay BD stores PINs in salted hashed format and enforces Row Level Security.
          </Text>

          <Text style={styles.sectionHeading}>4. Governing Law & Contact</Text>
          <Text style={styles.paragraph}>
            These terms are governed by applicable local standards. For legal inquiries or support, reach out to support@upaybd.example.com.
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
