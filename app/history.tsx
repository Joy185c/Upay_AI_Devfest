import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import {
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Store,
  Landmark,
  TrendingUp,
  Zap,
} from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { Transaction } from '../types';
import { formatCurrency, translations } from '../i18n';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'statement' | 'summary'>('statement');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const { language, transactions, balance, loadDemoState, resetDemoState } = useAppStore();
  const t = translations[language];

  useEffect(() => {
    loadDemoState();
  }, [loadDemoState]);

  const typeFilters = [
    { id: 'all', label: t.all },
    { id: 'send_money', label: t.sendMoney },
    { id: 'recharge', label: t.mobileRecharge },
    { id: 'cash_out', label: t.cashOut },
    { id: 'add_money', label: t.addMoney },
    { id: 'pay_bill', label: t.payBill },
  ];

  // Helper for type icon
  const renderTxIcon = (type: Transaction['type'], status: Transaction['status']) => {
    if (status === 'failed') {
      return <XCircle size={18} color={themeTokens.colors.danger} />;
    }
    switch (type) {
      case 'add_money':
        return <ArrowDownLeft size={18} color={themeTokens.colors.success} />;
      case 'send_money':
        return <ArrowUpRight size={18} color={themeTokens.brand.primary} />;
      case 'recharge':
        return <Smartphone size={18} color="#8B5CF6" />;
      case 'cash_out':
        return <Store size={18} color="#D97706" />;
      case 'pay_bill':
        return <Zap size={18} color="#00A859" />;
      default:
        return <Landmark size={18} color={themeTokens.brand.primary} />;
    }
  };

  // Filtered transaction list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && tx.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = (tx.titleEn || '').toLowerCase().includes(query) || (tx.titleBn || '').toLowerCase().includes(query);
        const matchCounterparty = (tx.counterparty || '').toLowerCase().includes(query);
        const matchId = (tx.id || '').toLowerCase().includes(query);
        const matchAmount = tx.amount.toString().includes(query);
        const matchNote = (tx.note || '').toLowerCase().includes(query);

        if (!matchTitle && !matchCounterparty && !matchId && !matchAmount && !matchNote) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedType, selectedStatus, searchQuery]);

  // Group transactions by date header
  const groupedTransactions = useMemo(() => {
    const groups: { [dateHeader: string]: Transaction[] } = {};

    filteredTransactions.forEach((tx) => {
      let header = 'Earlier';
      if (tx.timestamp) {
        if (tx.timestamp.includes('Oct 2026') || tx.timestamp.includes('Today')) {
          header = 'Today';
        } else if (tx.timestamp.includes('Sep 2026') || tx.timestamp.includes('Yesterday')) {
          header = 'Yesterday';
        } else {
          const parts = tx.timestamp.split(',');
          header = parts[parts.length - 1]?.trim() || 'Earlier';
        }
      }
      if (!groups[header]) {
        groups[header] = [];
      }
      groups[header].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  // Calculate summary metrics
  const totalSpent = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === 'success' && tx.type !== 'add_money')
      .reduce((acc, tx) => acc + (tx.total || (tx.amount + (tx.fee || 0))), 0);
  }, [transactions]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === 'success' && tx.type === 'add_money')
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const handleResetData = async () => {
    await resetDemoState();
    setSelectedType('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{t.history}</Text>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: themeTokens.brand.primary }]}
            onPress={() => router.push('/insights' as any)}
            accessibilityLabel="View Insights"
          >
            <TrendingUp size={14} color={themeTokens.colors.surface} />
            <Text style={[styles.resetBtnText, { color: themeTokens.colors.surface }]}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetData}
            accessibilityLabel="Reset Demo Data"
          >
            <RotateCcw size={14} color={themeTokens.brand.primaryDark} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'statement' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('statement')}
          accessibilityLabel="Statement Tab"
        >
          <Text style={[styles.segmentText, activeTab === 'statement' && styles.activeSegmentText]}>
            {t.statementTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'summary' && styles.activeSegmentBtn]}
          onPress={() => setActiveTab('summary')}
          accessibilityLabel="Summary Tab"
        >
          <Text style={[styles.segmentText, activeTab === 'summary' && styles.activeSegmentText]}>
            {t.summaryTab}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'statement' ? (
        <>
          {/* Search Box */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBox}>
              <Search size={16} color={themeTokens.colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search recipient, Trx ID, amount..."
                placeholderTextColor={themeTokens.colors.textMuted}
                accessibilityLabel="Search Transactions"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={themeTokens.colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Type Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterBar}
            contentContainerStyle={styles.filterContent}
          >
            {typeFilters.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.chip, selectedType === f.id && styles.activeChip]}
                onPress={() => setSelectedType(f.id)}
                accessibilityLabel={`Filter by ${f.label}`}
              >
                <Text style={[styles.chipText, selectedType === f.id && styles.activeChipText]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Status Filter Row */}
          <View style={styles.statusFilterRow}>
            <Text style={styles.statusFilterLabel}>Status:</Text>
            {(['all', 'success', 'failed'] as const).map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.statusPill, selectedStatus === st && styles.activeStatusPill]}
                onPress={() => setSelectedStatus(st)}
              >
                <Text style={[styles.statusPillText, selectedStatus === st && styles.activeStatusPillText]}>
                  {st.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transaction List Grouped by Date */}
          <ScrollView style={styles.txListScroll} contentContainerStyle={styles.txListContent}>
            {Object.keys(groupedTransactions).length > 0 ? (
              Object.entries(groupedTransactions).map(([dateGroup, groupItems]) => (
                <View key={dateGroup} style={styles.groupSection}>
                  <Text style={styles.groupHeader}>{dateGroup}</Text>
                  {groupItems.map((tx) => {
                    const isIncome = tx.type === 'add_money';
                    const isFailed = tx.status === 'failed';

                    return (
                      <TouchableOpacity
                        key={tx.id}
                        style={styles.txRow}
                        onPress={() => setSelectedTx(tx)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Transaction ${tx.id}`}
                      >
                        <View style={[styles.iconCircle, isFailed && styles.failedIconCircle]}>
                          {renderTxIcon(tx.type, tx.status)}
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
                          <Text
                            style={[
                              styles.txAmount,
                              isIncome && styles.incomeAmount,
                              isFailed && styles.failedAmount,
                            ]}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount, language)}
                          </Text>
                          {isFailed ? (
                            <View style={styles.statusBadgeFail}>
                              <Text style={styles.statusBadgeTextFail}>FAILED</Text>
                            </View>
                          ) : (
                            <Text style={styles.txCharge}>Charge: ৳{(tx.fee || 0).toFixed(2)}</Text>
                          )}
                          <ChevronRight size={14} color={themeTokens.colors.textMuted} />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            ) : (
              /* Empty State */
              <View style={styles.emptyCard}>
                <Filter size={36} color={themeTokens.colors.textMuted} />
                <Text style={styles.emptyTitle}>No Transactions Found</Text>
                <Text style={styles.emptySubtitle}>Try changing your search keywords or active filters.</Text>
                <TouchableOpacity
                  style={styles.clearFiltersBtn}
                  onPress={() => {
                    setSelectedType('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        /* Summary View */
        <ScrollView style={styles.summaryContainer} contentContainerStyle={styles.summaryContent}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>
              {language === 'bn' ? 'মোট লেনদেন সামারি' : 'Wallet Transaction Summary'}
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Current Primary Balance</Text>
              <Text style={styles.summaryValueBold}>{formatCurrency(balance, language)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</Text>
              <Text style={styles.summaryValue}>৳{totalSpent.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{language === 'bn' ? 'মোট প্রাপ্তি' : 'Total Added'}</Text>
              <Text style={[styles.summaryValue, { color: themeTokens.colors.success }]}>
                ৳{totalReceived.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Transaction Count</Text>
              <Text style={styles.summaryValue}>{transactions.length}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Transaction Receipt</Text>
                <TouchableOpacity onPress={() => setSelectedTx(null)}>
                  <X size={20} color={themeTokens.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetBody}>
                {selectedTx.status === 'success' ? (
                  <CheckCircle2 size={44} color={themeTokens.colors.success} />
                ) : (
                  <XCircle size={44} color={themeTokens.colors.danger} />
                )}

                <Text style={styles.modalAmount}>
                  {selectedTx.type === 'add_money' ? '+' : '-'}{formatCurrency(selectedTx.amount, language)}
                </Text>
                <Text style={styles.modalTxTitle}>
                  {language === 'bn' ? selectedTx.titleBn : selectedTx.titleEn}
                </Text>

                <View style={styles.detailBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Status</Text>
                    <Text
                      style={[
                        styles.dVal,
                        {
                          color: selectedTx.status === 'success' ? themeTokens.colors.success : themeTokens.colors.danger,
                          fontWeight: '800',
                        },
                      ]}
                    >
                      {selectedTx.status.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Trx ID</Text>
                    <Text style={styles.dVal}>{selectedTx.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Counterparty / Target</Text>
                    <Text style={styles.dVal}>{selectedTx.counterparty}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Base Amount</Text>
                    <Text style={styles.dVal}>৳{selectedTx.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Service Fee</Text>
                    <Text style={styles.dVal}>৳{(selectedTx.fee || 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Total Deduction/Credit</Text>
                    <Text style={[styles.dVal, { fontWeight: '900' }]}>
                      ৳{(selectedTx.total || selectedTx.amount + (selectedTx.fee || 0)).toFixed(2)}
                    </Text>
                  </View>
                  {selectedTx.balanceAfter !== undefined && (
                    <View style={styles.detailRow}>
                      <Text style={styles.dLabel}>Wallet Balance After</Text>
                      <Text style={[styles.dVal, { color: themeTokens.brand.primary, fontWeight: '900' }]}>
                        ৳{selectedTx.balanceAfter.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.dLabel}>Timestamp</Text>
                    <Text style={styles.dVal}>{selectedTx.timestamp}</Text>
                  </View>
                  {selectedTx.note ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.dLabel}>Note</Text>
                      <Text style={styles.dVal}>{selectedTx.note}</Text>
                    </View>
                  ) : null}

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
  container: { flex: 1, backgroundColor: themeTokens.colors.creamBg },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 10,
  },
  pageTitle: { fontSize: 24, fontWeight: '900', color: themeTokens.brand.primaryDark },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
  },
  resetBtnText: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primaryDark },
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#EAEFF5',
    borderRadius: themeTokens.radius.full,
    padding: 3,
    marginBottom: 8,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, borderRadius: themeTokens.radius.full, alignItems: 'center' },
  activeSegmentBtn: { backgroundColor: themeTokens.brand.yellow },
  segmentText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeSegmentText: { color: themeTokens.brand.primaryDark, fontWeight: '900' },
  searchBarContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: themeTokens.colors.textPrimary, paddingVertical: 4 },
  filterBar: { maxHeight: 38, marginBottom: 6 },
  filterContent: { paddingHorizontal: 16, gap: 6 },
  chip: {
    backgroundColor: themeTokens.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  activeChip: { backgroundColor: themeTokens.brand.yellow, borderColor: themeTokens.brand.yellow },
  chipText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeChipText: { color: themeTokens.brand.primaryDark },
  statusFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  statusFilterLabel: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: themeTokens.radius.sm,
    backgroundColor: '#EAEFF5',
  },
  activeStatusPill: { backgroundColor: themeTokens.brand.primary },
  statusPillText: { fontSize: 10, fontWeight: '800', color: themeTokens.colors.textSecondary },
  activeStatusPillText: { color: themeTokens.colors.surface },
  txListScroll: { flex: 1 },
  txListContent: { paddingHorizontal: 16, paddingBottom: 30 },
  groupSection: { marginBottom: 12 },
  groupHeader: { fontSize: 12, fontWeight: '800', color: themeTokens.colors.textMuted, marginBottom: 6, marginTop: 4 },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeTokens.colors.surface,
    padding: 12,
    borderRadius: themeTokens.radius.md,
    marginBottom: 6,
    gap: 10,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedIconCircle: { backgroundColor: '#FEE2E2' },
  txMainInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  txTitle: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF8CE',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiBadgeText: { fontSize: 9, fontWeight: '800', color: themeTokens.brand.primaryDark },
  txSub: { fontSize: 11, color: themeTokens.colors.textSecondary, marginTop: 2 },
  txTime: { fontSize: 10, color: themeTokens.colors.textMuted, marginTop: 2 },
  txRightCol: { alignItems: 'flex-end', gap: 2 },
  txAmount: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  incomeAmount: { color: themeTokens.colors.success },
  failedAmount: { color: themeTokens.colors.danger, textDecorationLine: 'line-through' },
  txCharge: { fontSize: 10, color: themeTokens.colors.textMuted },
  statusBadgeFail: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBadgeTextFail: { fontSize: 9, fontWeight: '900', color: themeTokens.colors.danger },
  emptyCard: {
    backgroundColor: themeTokens.colors.surface,
    padding: 30,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  emptySubtitle: { fontSize: 12, color: themeTokens.colors.textMuted, textAlign: 'center' },
  clearFiltersBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    marginTop: 6,
  },
  clearFiltersText: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primaryDark },
  summaryContainer: { flex: 1 },
  summaryContent: { padding: 16 },
  summaryCard: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  summaryCardTitle: { fontSize: 15, fontWeight: '800', color: themeTokens.brand.primary },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  summaryLabel: { fontSize: 13, color: themeTokens.colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  summaryValueBold: { fontSize: 16, fontWeight: '900', color: themeTokens.brand.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: themeTokens.colors.surface,
    borderTopLeftRadius: themeTokens.radius.xl,
    borderTopRightRadius: themeTokens.radius.xl,
    padding: 20,
    minHeight: 400,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.colors.textPrimary },
  sheetBody: { alignItems: 'center' },
  modalAmount: { fontSize: 28, fontWeight: '900', color: themeTokens.brand.primary, marginTop: 8 },
  modalTxTitle: { fontSize: 13, fontWeight: '700', color: themeTokens.colors.textSecondary, marginBottom: 14 },
  detailBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: themeTokens.radius.md,
    padding: 14,
    gap: 10,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dLabel: { fontSize: 12, color: themeTokens.colors.textMuted },
  dVal: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textPrimary },
  whyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8CE',
    padding: 10,
    borderRadius: themeTokens.radius.sm,
    marginTop: 6,
  },
  whyText: { fontSize: 11, fontWeight: '700', color: themeTokens.brand.primaryDark, flex: 1 },
});
