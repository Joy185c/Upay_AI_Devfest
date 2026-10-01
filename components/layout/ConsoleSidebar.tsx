import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  LayoutDashboard,
  Megaphone,
  FlaskConical,
  GitFork,
  SlidersHorizontal,
  Wallet,
  ShieldAlert,
  Bot,
  Activity,
  Store,
  ShieldCheck,
  Smartphone,
  Globe,
  PlayCircle,
} from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { BrandMark } from '../ui/BrandMark';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';
import { useRouter, usePathname } from 'expo-router';

export const ConsoleSidebar: React.FC = () => {
  const { language, setLanguage, mode, setMode, demoModeActive, toggleDemoMode } = useAppStore();
  const t = translations[language];
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'cc', label: t.consoleTitle, icon: Activity, route: '/console/command-center', highlight: true },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, route: '/console' },
    { id: 'campaigns', label: t.campaigns, icon: Megaphone, route: '/console/campaigns' },
    { id: 'experiments', label: t.experiments, icon: FlaskConical, route: '/console/experiments' },
    { id: 'uplift', label: t.upliftExplorer, icon: GitFork, route: '/console/uplift' },
    { id: 'simulator', label: t.simulator, icon: SlidersHorizontal, route: '/console/simulator' },
    { id: 'budget', label: t.budgetOptimizer, icon: Wallet, route: '/console/budget' },
    { id: 'abuse', label: t.abuseGuard, icon: ShieldAlert, route: '/console/abuse' },
    { id: 'ai', label: t.aiAssistant, icon: Bot, route: '/console/ai' },
    { id: 'merchant', label: t.merchantPortal, icon: Store, route: '/merchant' },
    { id: 'admin', label: t.adminView, icon: ShieldCheck, route: '/admin' },
  ];

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.brandHeader}>
        <BrandMark size="md" showWordmark={true} />
        <View style={styles.consoleTag}>
          <Text style={styles.consoleTagText}>Causal AI Console</Text>
        </View>
      </View>

      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navRow,
                isActive && styles.activeNavRow,
                item.highlight && styles.highlightRow,
              ]}
              onPress={() => {
                setMode('console');
                router.push(item.route as any);
              }}
              activeOpacity={0.7}
            >
              <Icon
                size={18}
                color={
                  item.highlight
                    ? themeTokens.brand.yellow
                    : isActive
                    ? themeTokens.colors.surface
                    : 'rgba(255,255,255,0.7)'
                }
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.activeNavLabel,
                  item.highlight && { color: themeTokens.brand.yellow, fontWeight: '800' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Switcher & Demo Mode Controls */}
      <View style={styles.bottomControls}>
        {/* Hackathon Demo Mode */}
        <TouchableOpacity
          style={[styles.demoModeBtn, demoModeActive && styles.demoModeBtnActive]}
          onPress={toggleDemoMode}
        >
          <PlayCircle size={16} color={demoModeActive ? themeTokens.brand.primaryDark : themeTokens.brand.yellow} />
          <Text style={[styles.demoBtnText, demoModeActive && { color: themeTokens.brand.primaryDark }]}>
            {demoModeActive ? 'DEMO ACTIVE' : 'HACKATHON DEMO'}
          </Text>
        </TouchableOpacity>

        {/* Target App Switcher: upay Mobile App */}
        <TouchableOpacity
          style={styles.switchTargetBtn}
          onPress={() => {
            setMode('customer');
            router.push('/home' as any);
          }}
        >
          <Smartphone size={16} color={themeTokens.brand.yellow} />
          <Text style={styles.switchTargetText}>upay Customer App</Text>
        </TouchableOpacity>

        {/* Language Switcher */}
        <TouchableOpacity
          style={styles.langToggleBtn}
          onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
        >
          <Globe size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.langToggleText}>
            {language === 'bn' ? 'English Language' : 'বাংলা ভাষা'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 240,
    backgroundColor: themeTokens.brand.primaryDark,
    height: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  brandHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  consoleTag: {
    backgroundColor: 'rgba(255, 213, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  consoleTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: themeTokens.brand.yellow,
    letterSpacing: 0.5,
  },
  menuScroll: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: themeTokens.radius.sm,
    marginBottom: 2,
  },
  activeNavRow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  highlightRow: {
    backgroundColor: 'rgba(255, 213, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 0, 0.4)',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  activeNavLabel: {
    color: themeTokens.colors.surface,
    fontWeight: '800',
  },
  bottomControls: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  demoModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 213, 0, 0.2)',
    borderWidth: 1,
    borderColor: themeTokens.brand.yellow,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.sm,
  },
  demoModeBtnActive: {
    backgroundColor: themeTokens.brand.yellow,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: themeTokens.brand.yellow,
  },
  switchTargetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    borderRadius: themeTokens.radius.sm,
  },
  switchTargetText: {
    fontSize: 11,
    fontWeight: '700',
    color: themeTokens.colors.surface,
  },
  langToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  langToggleText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
});
