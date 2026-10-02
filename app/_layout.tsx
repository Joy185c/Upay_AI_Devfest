import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConsoleSidebar } from '../components/layout/ConsoleSidebar';
import { UpayBottomNav } from '../components/customer/UpayBottomNav';
import { BrandFooter, BrandMark } from '../components/ui/BrandMark';
import { useAppStore } from '../lib/store';
import { themeTokens } from '../theme/tokens';
import { LayoutDashboard, Smartphone, Activity, Globe } from 'lucide-react-native';

import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode, language, setLanguage } = useAppStore();

  const isDesktop = width > 768;
  const isConsoleRoute = pathname.startsWith('/console') || pathname === '/merchant' || pathname === '/admin';
  const isAuthRoute = pathname === '/' || pathname === '/pin';

  return (
    <ErrorBoundary>
      <View style={styles.rootContainer}>
        <StatusBar style="auto" />

        {/* Simulation Banner Notice */}
        <View style={styles.simulationBanner}>
          <Text style={styles.simulationBannerText}>
            ⚠️ upay BD Simulation Environment • All balances & transactions are simulated
          </Text>
        </View>

      {isDesktop ? (
        // Universal Desktop Web Application Layout
        <View style={styles.desktopContainer}>
          {isConsoleRoute ? (
            // Console Layout with Left Sidebar
            <View style={styles.desktopConsoleWrapper}>
              <ConsoleSidebar />
              <View style={styles.consoleMainArea}>
                <Slot />
                <BrandFooter />
              </View>
            </View>
          ) : (
            // Desktop Web Application Layout for Customer App
            <View style={styles.webAppWrapper}>
              {/* Top Desktop Web Bar */}
              <View style={styles.webNavBar}>
                <View style={styles.webNavLeft}>
                  <BrandMark size="md" showWordmark={true} />
                  <View style={styles.webNavTag}>
                    <Text style={styles.webNavTagText}>Consumer Web App</Text>
                  </View>
                </View>

                {/* Quick Navigation Links */}
                <View style={styles.webNavLinks}>
                  <TouchableOpacity
                    style={[styles.webLinkBtn, pathname === '/home' && styles.activeWebLink]}
                    onPress={() => router.push('/home' as any)}
                  >
                    <Text style={[styles.webLinkText, pathname === '/home' && styles.activeWebLinkText]}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.webLinkBtn, pathname === '/account' && styles.activeWebLink]}
                    onPress={() => router.push('/account' as any)}
                  >
                    <Text style={[styles.webLinkText, pathname === '/account' && styles.activeWebLinkText]}>
                      Account & Wallets
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.webLinkBtn, pathname === '/history' && styles.activeWebLink]}
                    onPress={() => router.push('/history' as any)}
                  >
                    <Text style={[styles.webLinkText, pathname === '/history' && styles.activeWebLinkText]}>
                      Transactions
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.webLinkBtn, pathname === '/more' && styles.activeWebLink]}
                    onPress={() => router.push('/more' as any)}
                  >
                    <Text style={[styles.webLinkText, pathname === '/more' && styles.activeWebLinkText]}>
                      Settings & Privacy
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Switch to ImpactIQ Marketing Console */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    style={styles.switchToConsoleBtn}
                    onPress={() => {
                      setMode('console');
                      router.push('/console' as any);
                    }}
                  >
                    <Activity size={16} color={themeTokens.brand.primaryDark} />
                    <Text style={styles.switchToConsoleText}>ImpactIQ Console</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.langBtn}
                    onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                  >
                    <Globe size={14} color={themeTokens.brand.primary} />
                    <Text style={styles.langText}>{language === 'bn' ? 'EN' : 'বাংলা'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Desktop Container Body */}
              <View style={styles.webAppBody}>
                <View style={styles.webAppContentCard}>
                  <Slot />
                  {!isAuthRoute && <UpayBottomNav />}
                </View>
              </View>
              <BrandFooter />
            </View>
          )}
        </View>
      ) : (
        // Full Mobile Device Layout (Native iOS/Android or Mobile Browser)
        <View style={styles.mobileWrapper}>
          <Slot />
          {!isConsoleRoute && !isAuthRoute && <UpayBottomNav />}
          <BrandFooter />
        </View>
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
  },
  simulationBanner: {
    backgroundColor: '#FFF8CE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE047',
  },
  simulationBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  desktopContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  desktopConsoleWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  consoleMainArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  webAppWrapper: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    justifyContent: 'space-between',
  },
  webNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: themeTokens.colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
    elevation: 2,
  },
  webNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  webNavTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: themeTokens.radius.full,
  },
  webNavTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  webNavLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webLinkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
  },
  activeWebLink: {
    backgroundColor: themeTokens.brand.yellow,
  },
  webLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.colors.textSecondary,
  },
  activeWebLinkText: {
    color: themeTokens.brand.primaryDark,
    fontWeight: '900',
  },
  switchToConsoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.md,
  },
  switchToConsoleText: {
    fontSize: 12,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  webAppBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  webAppContentCard: {
    width: '100%',
    maxWidth: 600,
    height: '100%',
    backgroundColor: themeTokens.colors.creamBg,
    borderRadius: themeTokens.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    elevation: 4,
    justifyContent: 'space-between',
  },
  mobileWrapper: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    justifyContent: 'space-between',
  },
});
