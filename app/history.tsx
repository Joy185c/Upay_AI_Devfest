import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { mockTransactions } from '../data/seededData';
import { Transaction } from '../types';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<'statement' | 'summary'>('statement');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const language = useAppStore((state) => state.language);
  const t = translations[language];

  const filters = [
    { id: 'all', label: t.all },
    { id: 'send_money', label: t.sendMoney },
    { id: 'recharge', label: t.mobileRecharge },
    { id: 'pay_bill', label: t.payBill },
    { id: 'add_money', label: t.addMoney },
  ];

  const filteredTxList = mockTransactions.filter((tx) => {
    if (selectedFilter === 'all') return true;
    return tx.type === selectedFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{t.history}</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'statement' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('statement')}
        >
          <Text style={[styles.segmentText, activeTab === 'statement' && styles.activeSegmentText]}>
            {t.statementTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'summary' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.segmentText, activeTab === 'summary' && styles.activeSegmentText]}>
            {t.summaryTab}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'statement' ? (
        <>
          {/* Horizontal Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterBar}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.chip, selectedFilter === f.id && styles.activeChip]}
                onPress={() => setSelectedFilter(f.id)}
              >
                <Text style={[styles.chipText, selectedFilter === f.id && styles.activeChipText]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transaction List */}
          <ScrollView style={styles.txListScroll} contentContainerStyle={styles.txListContent}>
            {filteredTxList.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.txRow}
                onPress={() => setSelectedTx(tx)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>u</Text>
                </View>

                <View style={styles.txMainInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.txTitle}>
                      {language === 'bn' ? tx.titleBn : tx.titleEn}
                    </Text>
                    {tx.impactIQSponsored && (
                      <View style={styles.aiBadge}>
                        <Sparkles size={10} color={themeTokens.brand.primary} />
                        <Text style={styles.aiBadgeText}>ImpactIQ</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.txSub}>{tx.counterparty}</Text>
                  <Text style={styles.txTime}>{tx.timestamp}</Text>
                </View>

                <View style={styles.txRightCol}>
                  <Text style={styles.txAmount}>{formatCurrency(tx.amount, language)}</Text>
                  <Text style={styles.txCharge}>{t.charge}: ৳0.00</Text>
                  <ChevronRight size={16} color={themeTokens.colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        /* Summary Tab view */
        <ScrollView style={styles.summaryContainer} contentContainerStyle={styles.summaryContent}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>
              {language === 'bn' ? 'মোট লেনদেন সামারি' : 'Total Transaction Summary'}
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</Text>
              <Text style={styles.summaryValue}>{formatCurrency(7300, language)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'bn' ? 'মোট প্রাপ্তি' : 'Total Received'}</Text>
              <Text style={styles.summaryValue}>{formatCurrency(5350, language)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'bn' ? 'মোট ক্যাশব্যাক অর্জিত' : 'Total Cashback Earned'}</Text>
              <Text style={[styles.summaryValue, { color: themeTokens.colors.success }]}>
                {formatCurrency(350, language)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {language === 'bn' ? 'লেনদেনের বিবরণ' : 'Transaction Details'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedTx(null)}>
                  <X size={20} color={themeTokens.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetBody}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={36} color={themeTokens.colors.success} />
                </View>
                <Text style={styles.modalAmount}>{formatCurrency(selectedTx.amount, language)}</Text>
                <Text style={styles.modalTxTitle}>
                  {language === 'bn' ? selectedTx.titleBn : selectedTx.titleEn}
                </Text>

                <View style={styles.detailBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Trx ID</Text>
                    <Text style={styles.dVal}>{selectedTx.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Time</Text>
                    <Text style={styles.dVal}>{selectedTx.timestamp}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Fee</Text>
                    <Text style={styles.dVal}>৳0.00</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Status</Text>
                    <Text style={[styles.dVal, { color: themeTokens.colors.success, fontWeight: '800' }]}>SUCCESS</Text>
                  </View>

                  {selectedTx.whyOfferReasonBn && (
                    <View style={styles.whyBox}>
                      <Sparkles size={14} color={themeTokens.brand.primary} />
                      <Text style={styles.whyText}>
                        {language === 'bn' ? selectedTx.whyOfferReasonBn : selectedTx.whyOfferReasonEn}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: themeTokens.brand.primaryDark,
  },
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#EAEFF5',
    borderRadius: themeTokens.radius.full,
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: themeTokens.radius.full,
    alignItems: 'center',
  },
  activeSegmentBtn: {
    backgroundColor: themeTokens.brand.yellow,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.colors.textSecondary,
  },
  activeSegmentText: {
    color: themeTokens.brand.primaryDark,
    fontWeight: '900',
  },
  filterBar: {
    maxHeight: 40,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: themeTokens.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  activeChip: {
    backgroundColor: themeTokens.brand.yellow,
    borderColor: themeTokens.brand.yellow,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: themeTokens.colors.textSecondary,
  },
  activeChipText: {
    color: themeTokens.brand.primaryDark,
  },
  txListScroll: {
    flex: 1,
  },
  txListContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    padding: 14,
    borderRadius: themeTokens.radius.md,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  txMainInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF8CE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  txSub: {
    fontSize: 11,
    color: themeTokens.colors.textSecondary,
    marginTop: 2,
  },
  txTime: {
    fontSize: 10,
    color: themeTokens.colors.textMuted,
    marginTop: 2,
  },
  txRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  txCharge: {
    fontSize: 10,
    color: themeTokens.colors.textMuted,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  summaryCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  summaryLabel: {
    fontSize: 13,
    color: themeTokens.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: themeTokens.colors.surface,
    borderTopLeftRadius: themeTokens.radius.xl,
    borderTopRightRadius: themeTokens.radius.xl,
    padding: 20,
    minHeight: 380,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  sheetBody: {
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: themeTokens.brand.primary,
  },
  modalTxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: themeTokens.colors.textSecondary,
    marginBottom: 16,
  },
  detailBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: themeTokens.radius.md,
    padding: 14,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dLabel: {
    fontSize: 12,
    color: themeTokens.colors.textMuted,
  },
  dVal: {
    fontSize: 12,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
  },
  whyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8CE',
    padding: 10,
    borderRadius: themeTokens.radius.sm,
    marginTop: 6,
  },
  whyText: {
    fontSize: 11,
    fontWeight: '700',
    color: themeTokens.brand.primaryDark,
    flex: 1,
  },
});
