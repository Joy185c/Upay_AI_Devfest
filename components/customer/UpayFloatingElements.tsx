import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, Gift, Disc, X } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';
import { useRouter } from 'expo-router';

export const UpayFloatingElements: React.FC = () => {
  const [showWheel, setShowWheel] = useState(true);
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  return (
    <>
      {/* Docked Left: upay Card */}
      <TouchableOpacity
        style={[styles.dockedPill, styles.leftDock]}
        onPress={() => router.push('/account' as any)}
        activeOpacity={0.85}
      >
        <CreditCard size={18} color={themeTokens.brand.primary} />
        <Text style={styles.dockedText}>{t.upayCard}</Text>
      </TouchableOpacity>

      {/* Docked Right: upay Offer */}
      <TouchableOpacity
        style={[styles.dockedPill, styles.rightDock]}
        onPress={() => router.push('/offers' as any)}
        activeOpacity={0.85}
      >
        <Gift size={18} color={themeTokens.colors.danger} />
        <Text style={styles.dockedText}>{t.upayOffer}</Text>
      </TouchableOpacity>

      {/* Floating Spin Wheel Button */}
      {showWheel && (
        <View style={styles.wheelContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowWheel(false)}>
            <X size={12} color={themeTokens.colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wheelCircle}
            onPress={() => router.push('/wheel' as any)}
            activeOpacity={0.8}
          >
            <Disc size={28} color={themeTokens.brand.yellow} />
            <Text style={styles.wheelText}>উপায় চাকা</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dockedPill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.colors.creamBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    borderWidth: 1.5,
    borderColor: themeTokens.brand.primary,
    elevation: 4,
    zIndex: 10,
  },
  leftDock: {
    top: 240,
    left: -4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  rightDock: {
    top: 240,
    right: -4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  dockedText: {
    fontSize: 11,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  wheelContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    alignItems: 'center',
    zIndex: 20,
  },
  closeBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: themeTokens.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -4,
    zIndex: 21,
  },
  wheelCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themeTokens.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeTokens.brand.yellow,
    elevation: 6,
  },
  wheelText: {
    fontSize: 8,
    fontWeight: '900',
    color: themeTokens.brand.yellow,
    marginTop: -2,
  },
});
