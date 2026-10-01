import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { QrCode, Flashlight, ArrowLeft, CheckCircle2, Download } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { UpayKeypad } from '../components/customer/UpayKeypad';
import { paymentService } from '../services/paymentService';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function QrScanScreen() {
  const [activeTab, setActiveTab] = useState<'scan' | 'myqr'>('scan');
  const [step, setStep] = useState<'scan' | 'amount' | 'pin' | 'success'>('scan');
  const [merchantId, setMerchantId] = useState('Dhaka Fresh Mart');
  const [amount, setAmount] = useState('850');
  const [pin, setPin] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const [txId, setTxId] = useState('');

  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const router = useRouter();

  const handleKeypadPress = (digit: string) => {
    if (step === 'amount') {
      setAmount((prev) => (prev === '0' ? digit : prev + digit));
    } else if (step === 'pin') {
      if (pin.length < 4) setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (step === 'amount') setAmount((prev) => prev.slice(0, -1) || '0');
    else if (step === 'pin') setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (step === 'scan') setStep('amount');
    else if (step === 'amount') setStep('pin');
    else if (step === 'pin' && pin.length === 4) {
      const res = await paymentService.executePayment({
        type: 'payment',
        titleBn: 'মেক পেমেন্ট - ঢাকা ফ্রেশ মার্ট',
        titleEn: 'Make Payment - Dhaka Fresh Mart',
        counterparty: merchantId,
        amount: parseFloat(amount) || 500,
        impactIQSponsored: true,
        cashbackBDT: 42.50,
      });
      setTxId(res.id);
      setStep('success');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.makePayment}</Text>
        <TouchableOpacity style={styles.flashBtn} onPress={() => setFlashOn(!flashOn)}>
          <Flashlight size={20} color={flashOn ? themeTokens.brand.yellow : themeTokens.colors.surface} />
        </TouchableOpacity>
      </View>

      {step === 'scan' && (
        <View style={styles.scanBody}>
          {/* Tabs: Scan | My QR */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'scan' && styles.activeTabBtn]}
              onPress={() => setActiveTab('scan')}
            >
              <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'myqr' && styles.activeTabBtn]}
              onPress={() => setActiveTab('myqr')}
            >
              <Text style={[styles.tabText, activeTab === 'myqr' && styles.activeTabText]}>My QR</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'scan' ? (
            <View style={styles.cameraBox}>
              <View style={styles.scanTargetFrame}>
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
                <QrCode size={120} color={themeTokens.brand.yellow} opacity={0.4} />
              </View>

              <Text style={styles.scanPrompt}>
                {language === 'bn' ? 'মার্চেন্টের কিউআর কোড স্ক্যান করুন' : 'Scan Merchant QR Code'}
              </Text>

              {/* Enter Merchant ID Fallback */}
              <TouchableOpacity style={styles.fallbackBtn} onPress={() => setStep('amount')}>
                <Text style={styles.fallbackText}>
                  {language === 'bn' ? 'মার্চেন্ট আইডি লিখুন' : 'Enter Merchant ID Directly'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.myQrBox}>
              <Text style={styles.myQrTitle}>RAFIQUL ISLAM</Text>
              <Text style={styles.myQrPhone}>01712345678</Text>
              <View style={styles.qrCodeCard}>
                <QrCode size={180} color={themeTokens.brand.primary} />
              </View>
            </View>
          )}
        </View>
      )}

      {(step === 'amount' || step === 'pin') && (
        <View style={styles.flowBody}>
          <View style={styles.merchantCard}>
            <Text style={styles.mName}>{merchantId}</Text>
            <Text style={styles.mCategory}>Dhaka Supermarket Partner</Text>
          </View>

          <View style={styles.inputDisplay}>
            <Text style={styles.currencySymbol}>৳</Text>
            <Text style={styles.amountText}>{step === 'amount' ? amount : '••••'}</Text>
          </View>

          {step === 'pin' && (
            <Text style={styles.pinPrompt}>{t.enterPinPrompt}</Text>
          )}

          <UpayKeypad
            onKeyPress={handleKeypadPress}
            onBackspace={handleBackspace}
            onConfirm={handleConfirm}
          />
        </View>
      )}

      {step === 'success' && (
        <View style={styles.successBody}>
          <View style={styles.successCard}>
            <CheckCircle2 size={64} color={themeTokens.colors.success} />
            <Text style={styles.successTitle}>
              {language === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
            </Text>
            <Text style={styles.successAmount}>{formatCurrency(parseFloat(amount), language)}</Text>

            <View style={styles.receiptBox}>
              <View style={styles.rRow}>
                <Text style={styles.rLabel}>Trx ID</Text>
                <Text style={styles.rVal}>{txId}</Text>
              </View>
              <View style={styles.rRow}>
                <Text style={styles.rLabel}>Recipient</Text>
                <Text style={styles.rVal}>{merchantId}</Text>
              </View>
              <View style={styles.rRow}>
                <Text style={styles.rLabel}>Fee</Text>
                <Text style={styles.rVal}>৳0.00</Text>
              </View>
              <View style={styles.aiRewardRow}>
                <Text style={styles.aiRewardText}>
                  ✦ ImpactIQ Cashback Earned: ৳42.50
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.receiptBtn}>
              <Download size={18} color={themeTokens.brand.primary} />
              <Text style={styles.receiptBtnText}>Download Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/home')}>
              <Text style={styles.doneText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: themeTokens.colors.surface,
  },
  flashBtn: {
    padding: 4,
  },
  scanBody: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: themeTokens.radius.full,
    padding: 3,
    marginBottom: 24,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
  },
  activeTabBtn: {
    backgroundColor: themeTokens.brand.yellow,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  activeTabText: {
    color: themeTokens.brand.primaryDark,
    fontWeight: '900',
  },
  cameraBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  scanTargetFrame: {
    width: 240,
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(255,213,0,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: themeTokens.brand.yellow,
  },
  tl: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  tr: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  br: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scanPrompt: {
    color: themeTokens.colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  fallbackBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.full,
  },
  fallbackText: {
    color: themeTokens.brand.primaryDark,
    fontWeight: '800',
    fontSize: 13,
  },
  myQrBox: {
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    padding: 24,
    borderRadius: themeTokens.radius.xl,
    marginTop: 20,
  },
  myQrTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  myQrPhone: {
    fontSize: 13,
    color: themeTokens.colors.textSecondary,
    marginBottom: 16,
  },
  qrCodeCard: {
    padding: 16,
    backgroundColor: themeTokens.colors.surface,
    borderRadius: 16,
    elevation: 4,
  },
  flowBody: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    borderTopLeftRadius: themeTokens.radius.xl,
    borderTopRightRadius: themeTokens.radius.xl,
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  merchantCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mName: {
    fontSize: 18,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  mCategory: {
    fontSize: 12,
    color: themeTokens.colors.textSecondary,
  },
  inputDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  amountText: {
    fontSize: 40,
    fontWeight: '900',
    color: themeTokens.colors.textPrimary,
  },
  pinPrompt: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: themeTokens.brand.primary,
    marginBottom: 10,
  },
  successBody: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    padding: 20,
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.xl,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
    marginTop: 12,
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: themeTokens.brand.primary,
    marginVertical: 10,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: themeTokens.radius.md,
    padding: 14,
    gap: 8,
    marginVertical: 14,
  },
  rRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rLabel: {
    fontSize: 12,
    color: themeTokens.colors.textMuted,
  },
  rVal: {
    fontSize: 12,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
  },
  aiRewardRow: {
    backgroundColor: '#FFF8CE',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  aiRewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
    textAlign: 'center',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  receiptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.brand.primary,
  },
  doneBtn: {
    backgroundColor: themeTokens.brand.yellow,
    width: '100%',
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 10,
  },
  doneText: {
    fontSize: 15,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
});
