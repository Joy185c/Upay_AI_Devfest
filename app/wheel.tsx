import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Disc, Gift } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function WheelScreen() {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<string | null>(null);

  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setReward(null);
    setTimeout(() => {
      setSpinning(false);
      setReward('৳50 Cash Reward Bonus!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.upayWheel}</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.wheelSubtitle}>
          {language === 'bn' ? 'উপায় চাকা ঘুরিয়ে জিতে নিন ক্যাশ রিওয়ার্ড!' : 'Spin the upay Wheel to Win Cash Rewards!'}
        </Text>

        <View style={styles.wheelDiscBox}>
          <Disc
            size={220}
            color={themeTokens.brand.yellow}
            style={{ transform: [{ rotate: spinning ? '720deg' : '0deg' }] }}
          />
          <TouchableOpacity style={styles.spinCenterBtn} onPress={handleSpin} disabled={spinning}>
            <Text style={styles.spinText}>{spinning ? 'SPINNING...' : 'SPIN'}</Text>
          </TouchableOpacity>
        </View>

        {reward && (
          <View style={styles.rewardCard}>
            <Gift size={32} color={themeTokens.brand.primary} />
            <Text style={styles.rewardTitle}>Congratulations!</Text>
            <Text style={styles.rewardValue}>{reward}</Text>
            <Text style={styles.rewardSub}>Credited to Cash Reward Wallet by ImpactIQ</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeTokens.brand.primaryDark },
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
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
  wheelSubtitle: { fontSize: 16, fontWeight: '800', color: themeTokens.brand.yellow, textAlign: 'center' },
  wheelDiscBox: { width: 240, height: 240, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  spinCenterBtn: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: themeTokens.brand.primary,
    borderWidth: 4,
    borderColor: themeTokens.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  spinText: { fontSize: 11, fontWeight: '900', color: themeTokens.brand.yellow },
  rewardCard: {
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    width: '100%',
    elevation: 6,
  },
  rewardTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 8 },
  rewardValue: { fontSize: 20, fontWeight: '900', color: themeTokens.brand.primary, marginVertical: 4 },
  rewardSub: { fontSize: 11, color: themeTokens.colors.textMuted },
});
