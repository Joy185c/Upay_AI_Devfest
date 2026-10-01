import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanFace, ArrowRight } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { BrandMark } from '../components/ui/BrandMark';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { useAppStore } from '../lib/store';
import { translations } from '../i18n';
import { useRouter } from 'expo-router';

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const { language, setLanguage, setAuthenticated } = useAppStore();
  const t = translations[language];
  const router = useRouter();

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Auto authenticate on 4 digits
        setTimeout(() => {
          setAuthenticated(true);
          router.replace('/home');
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      setAuthenticated(true);
      router.replace('/home');
    }
  };

  const handleBiometricLogin = () => {
    setAuthenticated(true);
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeader}>
        <BrandMark size="sm" showWordmark={true} />

        <TouchableOpacity
          style={styles.langPill}
          onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
        >
          <Text style={styles.langPillText}>
            {language === 'bn' ? 'English' : 'বাংলা'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main PIN Prompt Section */}
      <View style={styles.promptSection}>
        <Text style={styles.promptTitle}>{t.enterPinPrompt}</Text>

        {/* 4 Dots Box + Round Arrow Button */}
        <View style={styles.pinDotRow}>
          <View style={styles.dotBar}>
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.dotCircle,
                  pin.length > idx && styles.dotCircleFilled,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.arrowCircle,
              pin.length === 4 && styles.arrowCircleActive,
            ]}
            onPress={handleConfirm}
            disabled={pin.length < 4}
          >
            <ArrowRight size={20} color={themeTokens.colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Biometric Scan Trigger */}
        <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometricLogin}>
          <ScanFace size={24} color={themeTokens.brand.primary} />
          <Text style={styles.biometricText}>{t.biometricLogin}</Text>
        </TouchableOpacity>

        {/* Forgot PIN Link */}
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>{t.forgotPin}</Text>
        </TouchableOpacity>
      </View>

      {/* Keypad */}
      <UpayKeypad
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onConfirm={handleConfirm}
        disableConfirm={pin.length < 4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeTokens.colors.surface,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 10,
  },
  langPill: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(11, 77, 162, 0.2)',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  promptSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
    textAlign: 'center',
  },
  pinDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: themeTokens.radius.full,
    minWidth: 180,
  },
  dotCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E0',
  },
  dotCircleFilled: {
    backgroundColor: themeTokens.brand.primaryDark,
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircleActive: {
    backgroundColor: themeTokens.brand.primary,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.md,
    marginTop: 8,
  },
  biometricText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.brand.primary,
  },
  forgotBtn: {
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.brand.primary,
  },
});
