import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { translations } from '../../i18n';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', showWordmark = true }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const markSize = isSm ? 28 : isLg ? 48 : 36;
  const fontSize = isSm ? 14 : isLg ? 24 : 18;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoBox,
          {
            width: markSize,
            height: markSize,
            borderRadius: markSize * 0.35,
          },
        ]}
      >
        <Text style={[styles.uLetter, { fontSize: markSize * 0.65 }]}>u</Text>
        <View style={styles.dotAccent} />
      </View>

      {showWordmark && (
        <View style={styles.wordmarkContainer}>
          <Text style={[styles.wordmark, { fontSize }]}>উপায়</Text>
          <Text style={styles.taglineSub}>upay</Text>
        </View>
      )}
    </View>
  );
};

export const BrandFooter: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>{t.disclaimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    backgroundColor: themeTokens.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: themeTokens.brand.yellow,
  },
  uLetter: {
    color: themeTokens.brand.yellow,
    fontWeight: '900',
    marginTop: -2,
  },
  dotAccent: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: themeTokens.brand.yellow,
  },
  wordmarkContainer: {
    flexDirection: 'column',
  },
  wordmark: {
    fontWeight: '800',
    color: themeTokens.brand.primary,
    lineHeight: 22,
  },
  taglineSub: {
    fontSize: 10,
    fontWeight: '600',
    color: themeTokens.colors.textSecondary,
    marginTop: -4,
  },
  footerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(11, 77, 162, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: themeTokens.colors.border,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    color: themeTokens.colors.textSecondary,
    textAlign: 'center',
  },
});
