import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bell, Eye, EyeOff } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { mockCustomer, mockWallets } from '../../data/seededData';
import { formatCurrency } from '../../i18n';
import { useAppStore } from '../../lib/store';
import { useRouter } from 'expo-router';

export const UpayHeader: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  useEffect(() => {
    if (showBalance) {
      const timer = setTimeout(() => setShowBalance(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showBalance]);

  return (
    <View style={styles.headerBackground}>
      <View style={styles.topRow}>
        {/* User Info */}
        <View style={styles.userInfoLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.userName}>{mockCustomer.name}</Text>
            <Text style={styles.userPhone}>{mockCustomer.phone}</Text>
          </View>
        </View>

        {/* Right Action Controls: Balance Pill + Bell */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.balancePill}
            onPress={() => setShowBalance(!showBalance)}
            activeOpacity={0.8}
          >
            <Text style={styles.balancePillText}>
              {showBalance ? formatCurrency(mockWallets.primary, language) : (language === 'bn' ? 'ব্যালেন্স' : 'Balance')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/notifications' as any)}
          >
            <Bell size={20} color={themeTokens.brand.primary} />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: themeTokens.brand.yellow,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themeTokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeTokens.brand.primary,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  userTextCol: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
    letterSpacing: 0.5,
  },
  userPhone: {
    fontSize: 12,
    color: themeTokens.colors.textSecondary,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  balancePill: {
    backgroundColor: themeTokens.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    elevation: 2,
  },
  balancePillText: {
    color: themeTokens.colors.surface,
    fontSize: 13,
    fontWeight: '800',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: themeTokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: themeTokens.colors.danger,
  },
});
