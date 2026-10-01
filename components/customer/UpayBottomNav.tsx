import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, User, QrCode, History, MoreHorizontal } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';
import { useRouter, usePathname } from 'expo-router';

export const UpayBottomNav: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: t.home, icon: Home, route: '/home' },
    { id: 'account', label: t.account, icon: User, route: '/account' },
    { id: 'qr', label: t.qrScan, icon: QrCode, route: '/qr-scan', isCenterQr: true },
    { id: 'history', label: t.history, icon: History, route: '/history' },
    { id: 'more', label: t.more, icon: MoreHorizontal, route: '/more' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;

          if (item.isCenterQr) {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.centerQrWrapper}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.85}
              >
                <View style={styles.centerQrOuterRing}>
                  <View style={styles.centerQrCircle}>
                    <Icon size={26} color={themeTokens.colors.surface} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navTab}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconPill]}>
                <Icon
                  size={20}
                  color={isActive ? themeTokens.brand.primary : themeTokens.colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && { color: themeTokens.brand.primary, fontWeight: '800' },
                ]}
              >
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
    backgroundColor: themeTokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: themeTokens.colors.border,
    paddingBottom: 8,
    paddingTop: 4,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 56,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  activeIconPill: {
    backgroundColor: '#EAEFF5',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: themeTokens.colors.textSecondary,
  },
  centerQrWrapper: {
    width: 64,
    alignItems: 'center',
    marginTop: -24,
  },
  centerQrOuterRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: themeTokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  centerQrCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: themeTokens.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
