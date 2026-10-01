import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2, Landmark } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { paymentService } from '../services/paymentService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function AddMoneyScreen() {
  const [bank, setBank] = useState('City Bank Card');
  const [amount, setAmount] = useState('5000');
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
        type: 'add_money',
        titleBn: 'অ্যাড মানি - ব্যাংক কার্ড',
        titleEn: 'Add Money - Bank Card',
        counterparty: bank,
        amount: parseFloat(amount) || 5000,
        impactIQSponsored: true,
        cashbackBDT: 50.00,
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
        <Text style={styles.headerTitle}>{t.addMoney}</Text>
        <View style={{ width: 22 }} />
      </View>

      {step !== 'success' ? (
        <View style={styles.body}>
          <View style={styles.inputCard}>
            <View style={styles.bankRow}>
              <Landmark size={24} color={themeTokens.brand.primary} />
              <View>
                <Text style={styles.bankName}>{bank}</Text>
                <Text style={styles.subText}>Card ending in **** 8362</Text>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 14 }]}>Add Amount (BDT)</Text>
            <Text style={styles.amountDisplay}>৳{step === 'pin' ? '••••' : amount}</Text>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                ✦ ImpactIQ Campaign Bonus: Get ৳50 Instant Bonus on ৳5,000 Add Money!
              </Text>
            </View>
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
          <Text style={styles.successTitle}>Add Money Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(parseFloat(amount), language)}</Text>
          <Text style={styles.subText}>Added from {bank}</Text>
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
  bankRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: themeTokens.colors.border },
  bankName: { fontSize: 15, fontWeight: '800', color: themeTokens.colors.textPrimary },
  label: { fontSize: 12, color: themeTokens.colors.textMuted, fontWeight: '600' },
  amountDisplay: { fontSize: 32, fontWeight: '900', color: themeTokens.brand.primary, marginTop: 4 },
  noticeBox: { backgroundColor: '#E6F8F0', padding: 10, borderRadius: themeTokens.radius.sm, marginTop: 12 },
  noticeText: { fontSize: 11, fontWeight: '800', color: '#00A859' },
  subText: { fontSize: 12, color: themeTokens.colors.textSecondary },
  pinPrompt: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: themeTokens.brand.primary, marginBottom: 8 },
  successBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 14 },
  successAmount: { fontSize: 36, fontWeight: '900', color: themeTokens.brand.primary, marginVertical: 10 },
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
