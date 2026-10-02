import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, ArrowRight, Zap, FileText } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { transactionService, DEMO_PIN } from '../services/transactionService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';
import { Transaction } from '../types';

export default function PayBillScreen() {
  const [biller, setBiller] = useState('DESCO Electricity');
  const [accNo, setAccNo] = useState('1094857201');
  const [amount, setAmount] = useState('1450');
  const [pin, setPin] = useState('');

  const [step, setStep] = useState<'input' | 'review' | 'pin' | 'result'>('input');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [txResult, setTxResult] = useState<{ success: boolean; transaction: Transaction; balanceAfter: number } | null>(null);

  const { language, balance, loadDemoState } = useAppStore();
  const t = translations[language];
  const router = useRouter();

  const billers = ['DESCO Electricity', 'DPDC Electricity', 'TITAS Gas', 'WASA Water', 'Carnival Internet'];

  const numAmount = parseFloat(amount) || 0;
  const fee = transactionService.calculateFee('pay_bill', numAmount);
  const totalDeduction = numAmount + fee;
  const estBalanceAfter = balance - totalDeduction;

  const isAccNoValid = accNo.trim().length >= 4;
  const isAmountValid = numAmount > 0;
  const isBalanceSufficient = totalDeduction <= balance;
  const isFormValid = isAccNoValid && isAmountValid && isBalanceSufficient;

  const handleNextToReview = () => {
    if (!isAccNoValid) {
      setErrorMessage('Please enter a valid bill / account number.');
      return;
    }
    if (!isAmountValid) {
      setErrorMessage('Amount must be greater than 0.');
      return;
    }
    if (!isBalanceSufficient) {
      setErrorMessage(`Insufficient balance. Available: ৳${balance.toFixed(2)}`);
      return;
    }
    setErrorMessage('');
    setStep('review');
  };

  const handleKeypadPress = (digit: string) => {
    setErrorMessage('');
    if (step === 'input') {
      setAmount((prev) => (prev === '0' ? digit : prev + digit));
    } else if (step === 'pin') {
      if (pin.length < 4) setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setErrorMessage('');
    if (step === 'input') {
      setAmount((prev) => prev.slice(0, -1) || '0');
    } else if (step === 'pin') {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleConfirmTransaction = async () => {
    if (isSubmitting) return;
    if (pin.length < 4) {
      setErrorMessage('Please enter 4-digit PIN.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cashbackAmount = Math.round(numAmount * 0.1 * 100) / 100; // 10% Eid Bill Pay cashback
      const res = await transactionService.executeTransaction({
        type: 'pay_bill',
        counterparty: `${biller} (${accNo})`,
        amount: numAmount,
        titleEn: `Pay Bill - ${biller}`,
        titleBn: `পে বিল - ${biller}`,
        impactIQSponsored: true,
        cashbackBDT: cashbackAmount,
        pin,
      });

      await loadDemoState();
      setTxResult(res);

      if (!res.success) {
        setErrorMessage(res.errorMessage || 'Bill Payment Failed');
      }
      setStep('result');
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'review') setStep('input');
            else if (step === 'pin') setStep('review');
            else router.back();
          }}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.payBill}</Text>
        <View style={{ width: 22 }} />
      </View>

      {step !== 'result' ? (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <View style={styles.balanceInfoBar}>
            <Text style={styles.balanceInfoLabel}>Available Balance:</Text>
            <Text style={styles.balanceInfoVal}>{formatCurrency(balance, language)}</Text>
          </View>

          {step === 'input' && (
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Select Utility Biller</Text>
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

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Account / Customer Bill No</Text>
              <View style={styles.inputRow}>
                <FileText size={18} color={themeTokens.brand.primary} />
                <TextInput
                  style={styles.textInput}
                  value={accNo}
                  onChangeText={(val) => {
                    setAccNo(val);
                    setErrorMessage('');
                  }}
                  keyboardType="numeric"
                  placeholder="Enter Account No"
                  accessibilityLabel="Bill Account Number"
                />
              </View>
              {!isAccNoValid && accNo.length > 0 && (
                <Text style={styles.fieldError}>Account number must be at least 4 digits.</Text>
              )}

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Bill Amount (BDT)</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(val) => {
                  setAmount(val.replace(/[^0-9]/g, ''));
                  setErrorMessage('');
                }}
                keyboardType="numeric"
                placeholder="0"
                accessibilityLabel="Bill Amount"
              />
              {!isBalanceSufficient && numAmount > 0 && (
                <Text style={styles.fieldError}>Amount exceeds available balance.</Text>
              )}

              <View style={styles.impactNotice}>
                <Zap size={14} color={themeTokens.brand.primaryDark} />
                <Text style={styles.impactNoticeText}>
                  ✦ ImpactIQ Offer: Get 10% Instant Cashback on Utility Bills!
                </Text>
              </View>

              {errorMessage ? <Text style={styles.mainErrorText}>{errorMessage}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, !isFormValid && styles.disabledBtn]}
                onPress={handleNextToReview}
                disabled={!isFormValid}
                accessibilityLabel="Proceed to Review"
              >
                <Text style={styles.primaryBtnText}>Proceed</Text>
                <ArrowRight size={18} color={themeTokens.brand.primaryDark} />
              </TouchableOpacity>
            </View>
          )}

          {step === 'review' && (
            <View style={styles.card}>
              <Text style={styles.reviewTitle}>Confirm Bill Payment Details</Text>
              <View style={styles.reviewTable}>
                <View style={styles.reviewRow}>
                  <Text style={styles.rLabel}>Biller Organization:</Text>
                  <Text style={styles.rValBold}>{biller}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.rLabel}>Account Number:</Text>
                  <Text style={styles.rVal}>{accNo}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.rLabel}>Bill Amount:</Text>
                  <Text style={styles.rVal}>৳{numAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.rLabel}>Service Fee:</Text>
                  <Text style={styles.rVal}>৳0.00 (Free)</Text>
                </View>
                <View style={[styles.reviewRow, styles.totalRow]}>
                  <Text style={styles.rTotalLabel}>Total Deduction:</Text>
                  <Text style={styles.rTotalVal}>৳{totalDeduction.toFixed(2)}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.rLabel}>Est. Balance After:</Text>
                  <Text style={styles.rVal}>৳{Math.max(0, estBalanceAfter).toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  setPin('');
                  setErrorMessage('');
                  setStep('pin');
                }}
                accessibilityLabel="Confirm and Enter PIN"
              >
                <Text style={styles.primaryBtnText}>Confirm & Enter PIN</Text>
                <ArrowRight size={18} color={themeTokens.brand.primaryDark} />
              </TouchableOpacity>
            </View>
          )}

          {step === 'pin' && (
            <View style={styles.card}>
              <View style={styles.pinHeader}>
                <ShieldCheck size={28} color={themeTokens.brand.primary} />
                <Text style={styles.pinTitle}>{t.enterPinPrompt}</Text>
                <Text style={styles.pinHint}>(Demo PIN: {DEMO_PIN})</Text>
              </View>

              <View style={styles.dotRow}>
                {[0, 1, 2, 3].map((idx) => (
                  <View
                    key={idx}
                    style={[styles.dotCircle, pin.length > idx && styles.dotCircleFilled]}
                  />
                ))}
              </View>

              {errorMessage ? <Text style={styles.mainErrorText}>{errorMessage}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, (pin.length < 4 || isSubmitting) && styles.disabledBtn]}
                onPress={handleConfirmTransaction}
                disabled={pin.length < 4 || isSubmitting}
                accessibilityLabel="Submit PIN"
              >
                <Text style={styles.primaryBtnText}>
                  {isSubmitting ? 'Processing...' : 'Confirm Bill Payment'}
                </Text>
              </TouchableOpacity>

              <UpayKeypad
                onKeyPress={handleKeypadPress}
                onBackspace={handleBackspace}
                onConfirm={handleConfirmTransaction}
                disableConfirm={pin.length < 4 || isSubmitting}
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.resultContainer}>
          {txResult?.success ? (
            <View style={styles.resultCard}>
              <CheckCircle2 size={64} color={themeTokens.colors.success} />
              <Text style={styles.resultTitle}>Bill Paid Successfully!</Text>
              <Text style={styles.resultAmount}>{formatCurrency(txResult.transaction.amount, language)}</Text>

              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Trx ID:</Text>
                  <Text style={styles.rcVal}>{txResult.transaction.id}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Biller:</Text>
                  <Text style={styles.rcVal}>{txResult.transaction.counterparty}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Fee:</Text>
                  <Text style={styles.rcVal}>৳0.00</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>New Balance:</Text>
                  <Text style={styles.rcValBold}>৳{txResult.balanceAfter.toFixed(2)}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Time:</Text>
                  <Text style={styles.rcVal}>{txResult.transaction.timestamp}</Text>
                </View>
              </View>

              {txResult.transaction.whyOfferReasonEn && (
                <View style={styles.cbBadge}>
                  <Text style={styles.cbText}>✦ 10% ImpactIQ Cashback Credited!</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => router.replace('/home')}
                accessibilityLabel="Back to Home"
              >
                <Text style={styles.doneBtnText}>Back to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.replace('/history' as any)}
                accessibilityLabel="View in History"
              >
                <Text style={styles.secondaryBtnText}>View in History</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultCard}>
              <XCircle size={64} color={themeTokens.colors.danger} />
              <Text style={styles.resultTitleFail}>Payment Failed!</Text>
              <Text style={styles.failReason}>{errorMessage || 'Incorrect PIN entered.'}</Text>

              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Status:</Text>
                  <Text style={[styles.rcVal, { color: themeTokens.colors.danger }]}>FAILED</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.rcLabel}>Trx ID:</Text>
                  <Text style={styles.rcVal}>{txResult?.transaction.id || 'N/A'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => {
                  setPin('');
                  setStep('input');
                }}
                accessibilityLabel="Try Again"
              >
                <Text style={styles.doneBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
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
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  balanceInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.md,
    marginBottom: 12,
  },
  balanceInfoLabel: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textSecondary },
  balanceInfoVal: { fontSize: 14, fontWeight: '800', color: themeTokens.brand.primary },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  fieldLabel: { fontSize: 12, color: themeTokens.colors.textMuted, fontWeight: '700', marginBottom: 6 },
  billerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  bChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: themeTokens.radius.full },
  activeBChip: { backgroundColor: themeTokens.brand.primary },
  bText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeBText: { color: themeTokens.colors.surface },
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
  textInput: { flex: 1, fontSize: 15, fontWeight: '700', color: themeTokens.colors.textPrimary, paddingVertical: 10 },
  amountInput: {
    fontSize: 28,
    fontWeight: '900',
    color: themeTokens.brand.primary,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  fieldError: { fontSize: 11, color: themeTokens.colors.danger, marginTop: 4, fontWeight: '700' },
  impactNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8CE',
    padding: 10,
    borderRadius: themeTokens.radius.sm,
    marginTop: 12,
  },
  impactNoticeText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primaryDark, flex: 1 },
  mainErrorText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.danger, textAlign: 'center', marginVertical: 10 },
  primaryBtn: {
    backgroundColor: themeTokens.brand.yellow,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    marginTop: 14,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { fontSize: 15, fontWeight: '900', color: themeTokens.brand.primaryDark },
  reviewTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.brand.primaryDark, marginBottom: 14 },
  reviewTable: { gap: 10, marginBottom: 16 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rLabel: { fontSize: 13, color: themeTokens.colors.textSecondary },
  rVal: { fontSize: 13, fontWeight: '700', color: themeTokens.colors.textPrimary },
  rValBold: { fontSize: 14, fontWeight: '800', color: themeTokens.brand.primaryDark },
  totalRow: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: themeTokens.colors.border, paddingVertical: 8 },
  rTotalLabel: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  rTotalVal: { fontSize: 16, fontWeight: '900', color: themeTokens.brand.primary },
  pinHeader: { alignItems: 'center', gap: 4, marginBottom: 12 },
  pinTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  pinHint: { fontSize: 12, color: themeTokens.brand.primary, fontWeight: '700' },
  dotRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginVertical: 14 },
  dotCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#CBD5E0' },
  dotCircleFilled: { backgroundColor: themeTokens.brand.primaryDark },
  resultContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  resultCard: {
    backgroundColor: themeTokens.colors.surface,
    padding: 24,
    borderRadius: themeTokens.radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  resultTitle: { fontSize: 22, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 12 },
  resultTitleFail: { fontSize: 22, fontWeight: '800', color: themeTokens.colors.danger, marginTop: 12 },
  failReason: { fontSize: 13, color: themeTokens.colors.textSecondary, marginTop: 4, textAlign: 'center' },
  resultAmount: { fontSize: 34, fontWeight: '900', color: themeTokens.brand.primary, marginVertical: 10 },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: themeTokens.radius.md,
    padding: 14,
    gap: 8,
    marginVertical: 16,
  },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rcLabel: { fontSize: 12, color: themeTokens.colors.textMuted },
  rcVal: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textPrimary },
  rcValBold: { fontSize: 13, fontWeight: '900', color: themeTokens.brand.primary },
  cbBadge: { backgroundColor: '#FFF8CE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: themeTokens.radius.full, marginBottom: 16 },
  cbText: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primaryDark },
  doneBtn: {
    backgroundColor: themeTokens.brand.yellow,
    width: '100%',
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 15, fontWeight: '900', color: themeTokens.brand.primaryDark },
  secondaryBtn: { marginTop: 10, paddingVertical: 8 },
  secondaryBtnText: { fontSize: 13, fontWeight: '700', color: themeTokens.brand.primary },
});
