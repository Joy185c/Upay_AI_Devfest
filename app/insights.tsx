import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Download,
  FileText,
  AlertTriangle,
  SlidersHorizontal,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  Database,
  X,
} from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { formatCurrency, translations } from '../i18n';
import {
  TimePeriod,
  filterTransactions,
  calculateSummaryMetrics,
  calculateCategoryBreakdown,
  calculateDailySpendingTrend,
  calculateTopRecipients,
  calculateMonthlySpendingProgress,
} from '../utils/insightUtils';
import { ExportService } from '../services/exportService';
import { SeedService } from '../services/seedService';
import { useRouter } from 'expo-router';

export default function InsightsScreen() {
  const [period, setPeriod] = useState<TimePeriod>('30d');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [monthlyLimitInput, setMonthlyLimitInput] = useState<string>('25000');
  const [monthlyLimit, setMonthlyLimit] = useState<number>(25000);
  const [showLimitEditModal, setShowLimitEditModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState<string>('');

  const { language, transactions, loadDemoState } = useAppStore();
  const t = translations[language];
  const router = useRouter();

  useEffect(() => {
    loadDemoState();
  }, [loadDemoState]);

  // Pure memoized filtering
  const filteredData = useMemo(() => {
    return filterTransactions(transactions, {
      period,
      type: selectedType,
      status: selectedStatus,
      searchQuery,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    });
  }, [transactions, period, selectedType, selectedStatus, searchQuery, minAmount, maxAmount]);

  // Memoized analytics selectors
  const summary = useMemo(() => calculateSummaryMetrics(filteredData), [filteredData]);
  const categories = useMemo(() => calculateCategoryBreakdown(filteredData), [filteredData]);
  const dailyTrend = useMemo(() => calculateDailySpendingTrend(filteredData, period === '7d' ? 7 : 30), [filteredData, period]);
  const topRecipients = useMemo(() => calculateTopRecipients(filteredData, 5), [filteredData]);
  const monthlyProgress = useMemo(() => calculateMonthlySpendingProgress(transactions, monthlyLimit), [transactions, monthlyLimit]);

  const handleSeedDemoData = async () => {
    const res = await SeedService.seedDemoDataToStorage(105);
    await loadDemoState();
    setSeedSuccessMsg(`Successfully seeded ${res.transactions.length} transactions across 90 days!`);
    setTimeout(() => setSeedSuccessMsg(''), 4000);
  };

  const handleExportCSV = () => {
    ExportService.exportToCSV(filteredData, `Upay_Statement_${period}.csv`);
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF(filteredData, `upay BD Account Statement (${period.toUpperCase()})`);
  };

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insights & Analytics</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)} accessibilityLabel="Advanced Filters">
          <SlidersHorizontal size={20} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Seed Banner Notice if triggered */}
        {seedSuccessMsg ? (
          <View style={styles.successNoticeBox}>
            <Sparkles size={16} color="#00A859" />
            <Text style={styles.successNoticeText}>{seedSuccessMsg}</Text>
          </View>
        ) : null}

        {/* Export & Demo Seed Action Buttons Bar */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV} accessibilityLabel="Export CSV">
            <Download size={14} color={themeTokens.brand.primaryDark} />
            <Text style={styles.exportBtnText}>CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF} accessibilityLabel="Export PDF">
            <FileText size={14} color={themeTokens.brand.primaryDark} />
            <Text style={styles.exportBtnText}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.seedBtn} onPress={handleSeedDemoData} accessibilityLabel="Seed 100+ Transactions">
            <Database size={14} color={themeTokens.colors.surface} />
            <Text style={styles.seedBtnText}>Seed 100+ Demo Txs</Text>
          </TouchableOpacity>
        </View>

        {/* Time Period Selector Bar */}
        <View style={styles.periodPillRow}>
          {(['7d', '30d', 'all'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodPill, period === p && styles.activePeriodPill]}
              onPress={() => setPeriod(p)}
              accessibilityLabel={`Select period ${p}`}
            >
              <Text style={[styles.periodPillText, period === p && styles.activePeriodPillText]}>
                {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monthly Budget Limit & Warning Card */}
        <View style={[styles.budgetCard, monthlyProgress.isWarning && styles.budgetCardWarning]}>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetTitleRow}>
              <TrendingUp size={18} color={monthlyProgress.isWarning ? themeTokens.colors.danger : themeTokens.brand.primary} />
              <Text style={styles.budgetTitle}>Monthly Spending Limit</Text>
            </View>
            <TouchableOpacity onPress={() => setShowLimitEditModal(true)}>
              <Text style={styles.editLimitLink}>Set Limit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.budgetAmountRow}>
            <Text style={styles.budgetSpentText}>৳{monthlyProgress.spentAmount.toFixed(2)}</Text>
            <Text style={styles.budgetLimitText}>/ ৳{monthlyLimit.toFixed(2)}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, monthlyProgress.percentage)}%` },
                monthlyProgress.isWarning && { backgroundColor: themeTokens.colors.danger },
              ]}
            />
          </View>

          {monthlyProgress.isWarning ? (
            <View style={styles.warningAlertBox}>
              <AlertTriangle size={16} color={themeTokens.colors.danger} />
              <Text style={styles.warningAlertText}>
                ⚠️ Warning: You have reached {monthlyProgress.percentage}% of your monthly budget limit!
              </Text>
            </View>
          ) : (
            <Text style={styles.budgetRemainingText}>
              Remaining Budget: ৳{monthlyProgress.remainingBudget.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Summary Metrics (2x2 Grid) */}
        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Total Sent</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <ArrowUpRight size={16} color={themeTokens.colors.danger} />
              </View>
            </View>
            <Text style={styles.metricValue}>৳{summary.totalSent.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Total Received</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#E6F8F0' }]}>
                <ArrowDownLeft size={16} color={themeTokens.colors.success} />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: themeTokens.colors.success }]}>
              ৳{summary.totalReceived.toFixed(2)}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Total Fees</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF8CE' }]}>
                <Receipt size={16} color={themeTokens.brand.primaryDark} />
              </View>
            </View>
            <Text style={styles.metricValue}>৳{summary.totalFees.toFixed(2)}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>Transactions</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#EBF4FF' }]}>
                <Sparkles size={16} color={themeTokens.brand.primary} />
              </View>
            </View>
            <Text style={styles.metricValue}>{summary.txCount}</Text>
          </View>
        </View>

        {/* Chart 1: Category Breakdown Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category</Text>

          {categories.length > 0 ? (
            <View style={styles.categoryList}>
              {categories.map((cat) => (
                <View key={cat.type} style={styles.catRow}>
                  <View style={styles.catInfoRow}>
                    <View style={[styles.catColorDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catName}>{language === 'bn' ? cat.labelBn : cat.labelEn}</Text>
                    <Text style={styles.catCount}>({cat.count} txs)</Text>
                    <Text style={styles.catAmount}>৳{cat.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.catBarTrack}>
                    <View style={[styles.catBarFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No category spending data for selected period.</Text>
          )}
        </View>

        {/* Chart 2: Daily Spending Trend SVG Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Spending Trend (BDT)</Text>
          {dailyTrend.length > 0 ? (
            <View style={styles.svgContainer}>
              <Svg height="160" width="100%" viewBox="0 0 320 140">
                {/* Horizontal grid lines */}
                <Line x1="0" y1="30" x2="320" y2="30" stroke="#E2E8F0" strokeDasharray="4" />
                <Line x1="0" y1="70" x2="320" y2="70" stroke="#E2E8F0" strokeDasharray="4" />
                <Line x1="0" y1="110" x2="320" y2="110" stroke="#E2E8F0" />

                {/* Bars for daily spending trend */}
                {dailyTrend.slice(-10).map((pt, idx) => {
                  const maxVal = Math.max(...dailyTrend.map((d) => d.sentAmount), 1000);
                  const barHeight = Math.min(90, (pt.sentAmount / maxVal) * 90);
                  const xPos = idx * 30 + 10;
                  const yPos = 110 - barHeight;

                  return (
                    <React.Fragment key={pt.dateKey}>
                      <Rect
                        x={xPos}
                        y={yPos}
                        width="18"
                        height={Math.max(4, barHeight)}
                        fill={themeTokens.brand.primary}
                        rx="4"
                      />
                      <SvgText
                        x={xPos + 9}
                        y="126"
                        fontSize="8"
                        fill="#64748B"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {pt.dateLabel.split(' ')[0]}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          ) : (
            <Text style={styles.noDataText}>No trend data available.</Text>
          )}
        </View>

        {/* Top 5 Frequent Recipients */}
        <View style={styles.chartCard}>
          <View style={styles.topRecHeader}>
            <Award size={18} color={themeTokens.brand.primaryDark} />
            <Text style={styles.chartTitle}>Top Transacted Recipients</Text>
          </View>

          {topRecipients.length > 0 ? (
            <View style={styles.recipientList}>
              {topRecipients.map((rec, idx) => (
                <View key={rec.counterparty} style={styles.recRow}>
                  <View style={styles.recRankBadge}>
                    <Text style={styles.recRankText}>#{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recName}>{rec.counterparty}</Text>
                    <Text style={styles.recSub}>{rec.count} transactions</Text>
                  </View>
                  <Text style={styles.recAmount}>৳{rec.totalAmount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No recipient data available.</Text>
          )}
        </View>

        {/* Filtered Ledger Quick View */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Filtered Ledger ({filteredData.length} Items)</Text>
          <View style={styles.miniLedgerList}>
            {filteredData.slice(0, 5).map((tx) => (
              <View key={tx.id} style={styles.miniLedgerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniTitle}>{language === 'bn' ? tx.titleBn : tx.titleEn}</Text>
                  <Text style={styles.miniSub}>{tx.counterparty} • {tx.timestamp}</Text>
                </View>
                <Text
                  style={[
                    styles.miniAmount,
                    tx.type === 'add_money' && { color: themeTokens.colors.success },
                    tx.status === 'failed' && { color: themeTokens.colors.danger },
                  ]}
                >
                  {tx.type === 'add_money' ? '+' : '-'}৳{tx.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Limit Modal */}
      {showLimitEditModal && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Monthly Limit</Text>
                <TouchableOpacity onPress={() => setShowLimitEditModal(false)}>
                  <X size={20} color={themeTokens.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Monthly Limit (BDT):</Text>
              <TextInput
                style={styles.modalInput}
                value={monthlyLimitInput}
                onChangeText={setMonthlyLimitInput}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  const parsed = parseFloat(monthlyLimitInput);
                  if (!isNaN(parsed) && parsed > 0) {
                    setMonthlyLimit(parsed);
                  }
                  setShowLimitEditModal(false);
                }}
              >
                <Text style={styles.saveBtnText}>Save Limit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Advanced Filter Modal */}
      {showFilterModal && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Advanced Filters</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <X size={20} color={themeTokens.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 360 }}>
                <Text style={styles.inputLabel}>Search Query:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Counterparty, ID, note..."
                />

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>Min Amount (BDT):</Text>
                <TextInput
                  style={styles.modalInput}
                  value={minAmount}
                  onChangeText={setMinAmount}
                  keyboardType="numeric"
                  placeholder="0"
                />

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>Max Amount (BDT):</Text>
                <TextInput
                  style={styles.modalInput}
                  value={maxAmount}
                  onChangeText={setMaxAmount}
                  keyboardType="numeric"
                  placeholder="50000"
                />

                <Text style={[styles.inputLabel, { marginTop: 10 }]}>Status Filter:</Text>
                <View style={styles.filterChipRow}>
                  {(['all', 'success', 'failed'] as const).map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.fChip, selectedStatus === st && styles.fChipActive]}
                      onPress={() => setSelectedStatus(st)}
                    >
                      <Text style={[styles.fChipText, selectedStatus === st && styles.fChipTextActive]}>
                        {st.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.saveBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  scrollContent: { padding: 16, paddingBottom: 36 },
  successNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6F8F0',
    padding: 10,
    borderRadius: themeTokens.radius.md,
    marginBottom: 12,
  },
  successNoticeText: { fontSize: 12, fontWeight: '800', color: '#00A859', flex: 1 },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
  },
  exportBtnText: { fontSize: 12, fontWeight: '900', color: themeTokens.brand.primaryDark },
  seedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: themeTokens.brand.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    marginLeft: 'auto',
  },
  seedBtnText: { fontSize: 12, fontWeight: '800', color: themeTokens.colors.surface },
  periodPillRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodPill: {
    flex: 1,
    backgroundColor: themeTokens.colors.surface,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  activePeriodPill: { backgroundColor: themeTokens.brand.yellow, borderColor: themeTokens.brand.yellow },
  periodPillText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activePeriodPillText: { color: themeTokens.brand.primaryDark, fontWeight: '900' },
  budgetCard: {
    backgroundColor: themeTokens.colors.surface,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    marginBottom: 14,
    gap: 8,
  },
  budgetCardWarning: { borderColor: themeTokens.colors.danger, backgroundColor: '#FEF2F2' },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  budgetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  budgetTitle: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  editLimitLink: { fontSize: 11, fontWeight: '800', color: themeTokens.brand.primary },
  budgetAmountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  budgetSpentText: { fontSize: 24, fontWeight: '900', color: themeTokens.brand.primaryDark },
  budgetLimitText: { fontSize: 14, fontWeight: '700', color: themeTokens.colors.textMuted },
  progressBarTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: themeTokens.brand.primary, borderRadius: 4 },
  warningAlertBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  warningAlertText: { fontSize: 11, fontWeight: '800', color: themeTokens.colors.danger },
  budgetRemainingText: { fontSize: 11, color: themeTokens.colors.textSecondary, fontWeight: '600' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  metricCard: {
    width: '48%',
    backgroundColor: themeTokens.colors.surface,
    padding: 12,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    justifyContent: 'space-between',
  },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  metricLabel: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textMuted },
  iconCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 16, fontWeight: '900', color: themeTokens.colors.textPrimary },
  chartCard: {
    backgroundColor: themeTokens.colors.surface,
    padding: 16,
    borderRadius: themeTokens.radius.lg,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    marginBottom: 14,
  },
  chartTitle: { fontSize: 14, fontWeight: '800', color: themeTokens.brand.primaryDark, marginBottom: 12 },
  categoryList: { gap: 10 },
  catRow: { gap: 4 },
  catInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catColorDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textPrimary, flex: 1 },
  catCount: { fontSize: 10, color: themeTokens.colors.textMuted },
  catAmount: { fontSize: 12, fontWeight: '800', color: themeTokens.colors.textPrimary },
  catBarTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 3 },
  noDataText: { fontSize: 12, color: themeTokens.colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginVertical: 12 },
  svgContainer: { alignItems: 'center', marginTop: 8 },
  topRecHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recipientList: { gap: 8 },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  recRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: themeTokens.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recRankText: { fontSize: 10, fontWeight: '900', color: themeTokens.brand.primaryDark },
  recName: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
  recSub: { fontSize: 10, color: themeTokens.colors.textMuted },
  recAmount: { fontSize: 13, fontWeight: '800', color: themeTokens.brand.primary },
  miniLedgerList: { gap: 8 },
  miniLedgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  miniTitle: { fontSize: 12, fontWeight: '800', color: themeTokens.colors.textPrimary },
  miniSub: { fontSize: 10, color: themeTokens.colors.textMuted },
  miniAmount: { fontSize: 12, fontWeight: '800', color: themeTokens.colors.textPrimary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.xl,
    padding: 20,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: themeTokens.brand.primaryDark },
  inputLabel: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textMuted },
  modalInput: {
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: '#F8FAFC',
  },
  saveBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.md,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { fontSize: 14, fontWeight: '900', color: themeTokens.brand.primaryDark },
  filterChipRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  fChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: themeTokens.radius.sm, backgroundColor: '#EAEFF5' },
  fChipActive: { backgroundColor: themeTokens.brand.primary },
  fChipText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  fChipTextActive: { color: themeTokens.colors.surface },
});
