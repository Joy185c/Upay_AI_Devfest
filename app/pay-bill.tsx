import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { paymentService } from '../services/paymentService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function PayBillScreen() {
  const [biller, setBiller] = useState('DESCO Electricity');
  const [accNo, setAccNo] = useState('1094857201');
  const [amount, setAmount] = useState('1450');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'input' | 'pin' | 'success'>('input');
  const [txId, setTxId] = useState('');

  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const billers = ['DESCO Electricity', 'DPDC Electricity', 'TITAS Gas', 'WASA Water', 'Carnival Internet'];

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
        type: 'pay_bill',
        titleBn: `পে বিল - ${biller}`,
        titleEn: `Pay Bill - ${biller}`,
        counterparty: accNo,
        amount: parseFloat(amount) || 1450,
        impactIQSponsored: true,
        cashbackBDT: 145.00, // 10% Eid Bill-Pay cashback
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
        <Text style={styles.headerTitle}>{t.payBill}</Text>
        <View style={{ width: 22 }} />
      </View>

      {step !== 'success' ? (
        <View style={styles.body}>
          <View style={styles.inputCard}>
            <Text style={styles.label}>Select Biller</Text>
            <View style={styles.billerRow}>
              {billers.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.bChip, biller === b && styles.activeBChip]}
                  onPress={() => setBiller(b)}
                >
                  <Text style={[styles.bText, biller === b && styles.activeBText]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>Account / Bill No</Text>
            <Text style={styles.accNoText}>{accNo}</Text>

            <Text style={[styles.label, { marginTop: 10 }]}>Bill Amount (BDT)</Text>
            <Text style={styles.amountDisplay}>৳{step === 'pin' ? '••••' : amount}</Text>

            <View style={styles.impactNotice}>
              <Zap size={14} color={themeTokens.brand.primaryDark} />
              <Text style={styles.impactNoticeText}>
                {language === 'bn'
                  ? '✦ ইমপ্যাক্টআইকিউ অফার: এই বিলে ১০% ইনস্ট্যান্ট ক্যাশব্যাক দেওয়া হবে!'
                  : '✦ ImpactIQ Offer: Eligible for 10% Instant Cashback!'}
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
          <Text style={styles.successTitle}>Bill Payment Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(parseFloat(amount), language)}</Text>
          <Text style={styles.subText}>{biller} - Acc #{accNo}</Text>
          <Text style={styles.txIdText}>Trx ID: {txId}</Text>
          <View style={styles.cbBadge}>
            <Text style={styles.cbText}>✦ ৳145.00 Cashback Credited to Cash Reward!</Text>
          </View>

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
  billerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  bChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: themeTokens.radius.full },
  activeBChip: { backgroundColor: themeTokens.brand.primary },
  bText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeBText: { color: themeTokens.colors.surface },
  accNoText: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 2 },
  amountDisplay: { fontSize: 32, fontWeight: '900', color: themeTokens.brand.primary, marginTop: 2 },
  impactNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8CE',
    padding: 8,
    borderRadius: themeTokens.radius.sm,
    marginTop: 10,
  },
  impactNoticeText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primaryDark, flex: 1 },
  pinPrompt: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: themeTokens.brand.primary, marginBottom: 8 },
  successBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 14 },
  successAmount: { fontSize: 36, fontWeight: '900', color: themeTokens.brand.primary, marginVertical: 10 },
  subText: { fontSize: 14, color: themeTokens.colors.textSecondary },
  txIdText: { fontSize: 12, color: themeTokens.colors.textMuted, marginTop: 4 },
  cbBadge: { backgroundColor: '#FFF8CE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: themeTokens.radius.full, marginTop: 12 },
  cbText: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primaryDark },
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
