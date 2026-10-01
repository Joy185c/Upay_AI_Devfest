import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { paymentService } from '../services/paymentService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function CashOutScreen() {
  const [agentNo, setAgentNo] = useState('01711223344');
  const [amount, setAmount] = useState('1000');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'input' | 'pin' | 'success'>('input');
  const [txId, setTxId] = useState('');

  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

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
        type: 'cash_out',
        titleBn: 'ক্যাশ আউট - এজেন্ট',
        titleEn: 'Cash Out - Agent',
        counterparty: agentNo,
        amount: parseFloat(amount) || 1000,
        fee: 14.00,
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
        <Text style={styles.headerTitle}>{t.cashOut}</Text>
        <View style={{ width: 22 }} />
      </View>

      {step !== 'success' ? (
        <View style={styles.body}>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Agent Number</Text>
            <Text style={styles.valText}>{agentNo}</Text>

            <Text style={[styles.label, { marginTop: 14 }]}>Amount (BDT)</Text>
            <Text style={styles.amountDisplay}>৳{step === 'pin' ? '••••' : amount}</Text>
            <Text style={styles.feeText}>Charge: ৳14.00 (৳14/1000 in upay app)</Text>
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
          <Text style={styles.successTitle}>Cash Out Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(parseFloat(amount), language)}</Text>
          <Text style={styles.subText}>Agent: {agentNo}</Text>
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
  valText: { fontSize: 18, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 2 },
  amountDisplay: { fontSize: 32, fontWeight: '900', color: themeTokens.brand.primary, marginTop: 4 },
  feeText: { fontSize: 11, color: themeTokens.colors.textMuted, marginTop: 4 },
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
