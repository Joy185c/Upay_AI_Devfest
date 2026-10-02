import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { AuthService } from '../../services/authService';
import { pinSchema } from '../../utils/validationSchemas';
import { useRouter } from 'expo-router';

export default function PinSetupScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSavePin = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (pin !== confirmPin) {
      setErrorMessage('PINs do not match');
      return;
    }

    const validation = pinSchema.safeParse({ pin });
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const res = await AuthService.setPin(pin);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Transaction PIN updated successfully!');
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction PIN Setup</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <ShieldCheck size={26} color={themeTokens.brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Set 4-Digit Security PIN</Text>
              <Text style={styles.cardSubtitle}>Required to authorize transfers and bill payments</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>New 4-Digit PIN</Text>
          <View style={styles.inputRow}>
            <Lock size={18} color={themeTokens.brand.primary} />
            <TextInput
              style={styles.textInput}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder="••••"
            />
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Confirm 4-Digit PIN</Text>
          <View style={styles.inputRow}>
            <Lock size={18} color={themeTokens.brand.primary} />
            <TextInput
              style={styles.textInput}
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              placeholder="••••"
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? (
            <View style={styles.successRow}>
              <CheckCircle2 size={18} color={themeTokens.colors.success} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
            onPress={handleSavePin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={themeTokens.brand.primaryDark} />
            ) : (
              <Text style={styles.primaryBtnText}>Save Hashed PIN</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.xl,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  cardSubtitle: { fontSize: 12, color: themeTokens.colors.textSecondary },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textMuted, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  textInput: { flex: 1, fontSize: 18, fontWeight: '800', color: themeTokens.colors.textPrimary, paddingVertical: 10, letterSpacing: 4 },
  errorText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.danger, textAlign: 'center', marginVertical: 10 },
  successRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginVertical: 10 },
  successText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.success },
  primaryBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { fontSize: 15, fontWeight: '900', color: themeTokens.brand.primaryDark },
});
