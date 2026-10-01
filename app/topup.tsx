import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { paymentService } from '../services/paymentService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function TopupScreen() {
  const [operator, setOperator] = useState('Grameenphone');
  const [phone, setPhone] = useState('01712345678');
  const [amount, setAmount] = useState('200');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'input' | 'pin' | 'success'>('input');
  const [txId, setTxId] = useState('');

  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const operators = ['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'];

  const handleKeypadPress = (digit: string) => {
    if (step === 'input') setAmount((prev) => (prev === '0' ? digit : prev + digit));
    else if (step === 'pin' && pin.length < 4) setPin((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (step === 'input') setAmount((prev) => prev.slice(0, -1) || '0');
    else if (step === 'pin') setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (step === 'input') setStep('pin');
    else if (step === 'pin' && pin.length === 4) {
      const res = await paymentService.executePayment({
        type: 'recharge',
        titleBn: `মোবাইল রিচার্জ - ${operator}`,
        titleEn: `Mobile Recharge - ${operator}`,
        counterparty: phone,
        amount: parseFloat(amount) || 200,
      });
      setTxId(res.id);
      setStep('success');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.mobileRecharge}</Text>
        <View style={{ width: 22 }} />
      </View>

      {step !== 'success' ? (
        <View style={styles.body}>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Select Operator</Text>
            <View style={styles.operatorRow}>
              {operators.map((op) => (
                <TouchableOpacity
                  key={op}
                  style={[styles.opChip, operator === op && styles.activeOpChip]}
                  onPress={() => setOperator(op)}
                >
                  <Text style={[styles.opText, operator === op && styles.activeOpText]}>{op}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>Amount (BDT)</Text>
            <Text style={styles.amountDisplay}>৳{step === 'pin' ? '••••' : amount}</Text>
          </View>

          {step === 'pin' && <Text style={styles.pinPrompt}>{t.enterPinPrompt}</Text>}

          <UpayKeypad
            onKeyPress={handleKeypadPress}
            onBackspace={handleBackspace}
            onConfirm={handleConfirm}
          />
        </View>
      ) : (
        <View style={styles.successBody}>
          <CheckCircle2 size={64} color={themeTokens.colors.success} />
          <Text style={styles.successTitle}>Recharge Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(parseFloat(amount), language)}</Text>
          <Text style={styles.subText}>{operator} - {phone}</Text>
          <Text style={styles.txIdText}>Trx ID: {txId}</Text>

          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/home')}>
            <Text style={styles.doneText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
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
  body: { flex: 1, justifyContent: 'space-between', paddingTop: 16 },
  inputCard: {
    backgroundColor: themeTokens.colors.surface,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  label: { fontSize: 12, color: themeTokens.colors.textMuted, fontWeight: '600' },
  operatorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  opChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
  },
  activeOpChip: { backgroundColor: themeTokens.brand.primary },
  opText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeOpText: { color: themeTokens.colors.surface },
  amountDisplay: { fontSize: 32, fontWeight: '900', color: themeTokens.brand.primary, marginTop: 4 },
  pinPrompt: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: themeTokens.brand.primary, marginBottom: 8 },
  successBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 14 },
  successAmount: { fontSize: 36, fontWeight: '900', color: themeTokens.brand.primary, marginVertical: 10 },
  subText: { fontSize: 14, color: themeTokens.colors.textSecondary },
  txIdText: { fontSize: 12, color: themeTokens.colors.textMuted, marginTop: 4 },
  doneBtn: {
    backgroundColor: themeTokens.brand.yellow,
    width: '100%',
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 24,
  },
  doneText: { fontSize: 16, fontWeight: '900', color: themeTokens.brand.primaryDark },
});
