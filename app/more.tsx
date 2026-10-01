import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import {
  KeyRound,
  Globe,
  Shield,
  Headphones,
  HelpCircle,
  RefreshCw,
  Disc,
  ScanFace,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const { language, setLanguage, setAuthenticated } = useAppStore();
  const t = translations[language];
  const router = useRouter();

  const handleLogout = () => {
    setAuthenticated(false);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{t.more}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Group 1: Settings */}
        <Text style={styles.groupHeader}>{t.settings}</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF9CC' }]}>
              <KeyRound size={18} color="#D97706" />
            </View>
            <Text style={styles.rowLabel}>{t.changePin}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E6F8F0' }]}>
              <Globe size={18} color="#00A859" />
            </View>
            <Text style={styles.rowLabel}>{t.changeLanguage}</Text>
            <Text style={styles.langValue}>{language === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: '#EBF4FF' }]}>
              <Shield size={18} color="#0B4DA2" />
            </View>
            <Text style={styles.rowLabel}>{t.changePermissions}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Group 2: Support */}
        <Text style={styles.groupHeader}>{t.support}</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Headphones size={18} color="#E53E3E" />
            </View>
            <Text style={styles.rowLabel}>{t.support24x7}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <HelpCircle size={18} color="#F59E0B" />
            </View>
            <Text style={styles.rowLabel}>{t.faq}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Group 3: Account Services */}
        <Text style={styles.groupHeader}>{t.accountServices}</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: '#F5EEFC' }]}>
              <RefreshCw size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.rowLabel}>{t.mnpUpdate}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => router.push('/wheel' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF8CE' }]}>
              <Disc size={18} color="#0B4DA2" />
            </View>
            <Text style={styles.rowLabel}>{t.upayWheel}</Text>
            <ChevronRight size={18} color={themeTokens.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.rowItem}>
            <View style={[styles.iconBox, { backgroundColor: '#EBF4FF' }]}>
              <ScanFace size={18} color="#0B4DA2" />
            </View>
            <Text style={styles.rowLabel}>{t.biometricsToggle}</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#CBD5E0', true: themeTokens.brand.primary }}
            />
          </View>
        </View>

        {/* Group 4: ImpactIQ Offer & Privacy (Prompt Requirement) */}
        <Text style={styles.groupHeader}>{t.privacySection}</Text>
        <View style={[styles.groupCard, { borderColor: themeTokens.brand.yellow, borderWidth: 1.5 }]}>
          <View style={styles.rowItem}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF9CC' }]}>
              <Sparkles size={18} color={themeTokens.brand.primaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { fontWeight: '800' }]}>{t.privacyToggle}</Text>
              <Text style={styles.subText}>
                {language === 'bn'
                  ? 'ইমপ্যাক্টআইকিউ কজ্যাল এআই দ্বারা সবচেয়ে প্রাসঙ্গিক অফার পেতে সম্মতি প্রদান করুন'
                  : 'Allow ImpactIQ Causal AI to recommend personalized cashback offers'}
              </Text>
            </View>
            <Switch
              value={privacyConsent}
              onValueChange={setPrivacyConsent}
              trackColor={{ false: '#CBD5E0', true: themeTokens.brand.yellow }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={themeTokens.colors.danger} />
          <Text style={styles.logoutText}>
            {language === 'bn' ? 'লগ আউট করুন' : 'Log Out'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  groupHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: themeTokens.colors.textSecondary,
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
  },
  subText: {
    fontSize: 10,
    color: themeTokens.colors.textMuted,
    marginTop: 2,
  },
  langValue: {
    fontSize: 11,
    color: themeTokens.brand.primary,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: themeTokens.colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.colors.danger,
  },
});
