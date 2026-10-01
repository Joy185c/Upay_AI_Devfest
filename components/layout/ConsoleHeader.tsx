import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity, Sparkles } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { useRouter } from 'expo-router';

interface ConsoleHeaderProps {
  title: string;
  subtitle?: string;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ title, subtitle }) => {
  const [viewMode, setViewMode] = useState<'incremental' | 'gross'>('incremental');
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>

      <View style={styles.rightGroup}>
        {/* Gross vs Incremental Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'incremental' && styles.activeToggleBtn]}
            onPress={() => setViewMode('incremental')}
          >
            <Sparkles size={12} color={viewMode === 'incremental' ? themeTokens.brand.primaryDark : themeTokens.colors.textMuted} />
            <Text style={[styles.toggleText, viewMode === 'incremental' && styles.activeToggleText]}>
              True Incremental
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'gross' && styles.activeToggleBtn]}
            onPress={() => setViewMode('gross')}
          >
            <Text style={[styles.toggleText, viewMode === 'gross' && styles.activeToggleText]}>
              Gross
            </Text>
          </TouchableOpacity>
        </View>

        {/* Command Center Quick Access Button */}
        <TouchableOpacity
          style={styles.ccQuickBtn}
          onPress={() => router.push('/console/command-center' as any)}
        >
          <Activity size={16} color={themeTokens.brand.primary} />
          <Text style={styles.ccQuickText}>Command Center</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: themeTokens.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: themeTokens.colors.textPrimary,
  },
  subtitleText: {
    fontSize: 12,
    color: themeTokens.colors.textSecondary,
    marginTop: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: themeTokens.radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
  },
  activeToggleBtn: {
    backgroundColor: themeTokens.brand.yellow,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: themeTokens.colors.textSecondary,
  },
  activeToggleText: {
    color: themeTokens.brand.primaryDark,
    fontWeight: '800',
  },
  ccQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(11, 77, 162, 0.2)',
  },
  ccQuickText: {
    fontSize: 12,
    fontWeight: '800',
    color: themeTokens.brand.primary,
  },
});
