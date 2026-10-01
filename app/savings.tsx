import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, PiggyBank } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function SavingsScreen() {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.savings}</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <PiggyBank size={64} color={themeTokens.brand.primary} />
        <Text style={styles.title}>
          {language === 'bn' ? 'উপায় ডিপিএস ও সঞ্চয় প্রকল্প' : 'upay Digital DPS & Savings'}
        </Text>
        <Text style={styles.desc}>
          {language === 'bn'
            ? 'মাসে ৫০০ টাকা থেকে শুরু করে আকর্ষণীয় মুনাফায় অটো-সঞ্চয় করুন'
            : 'Start monthly auto-savings starting from ৳500 with high profits'}
        </Text>
      </View>
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
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: themeTokens.colors.textPrimary },
  desc: { fontSize: 13, color: themeTokens.colors.textSecondary, textAlign: 'center' },
});
