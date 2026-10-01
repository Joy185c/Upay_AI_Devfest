import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, Line, Text as SvgText } from 'react-native-svg';
import { themeTokens } from '../../theme/tokens';
import { UpliftSegmentDetail, UpliftQuadrant } from '../../types';
import { useAppStore } from '../../lib/store';

interface UpliftQuadrantScatterProps {
  segments: UpliftSegmentDetail[];
  onSelectQuadrant?: (quadrant: UpliftQuadrant) => void;
  width?: number;
  height?: number;
}

export const UpliftQuadrantScatter: React.FC<UpliftQuadrantScatterProps> = ({
  segments,
  onSelectQuadrant,
  width = Dimensions.get('window').width > 600 ? 540 : Dimensions.get('window').width - 48,
  height = 260,
}) => {
  const language = useAppStore((state) => state.language);
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'bn' ? 'কজ্যাল আপলিফ্ট ৪-কোয়াড্র্যান্ট কাস্টমার ম্যাট্রিক্স' : 'Causal Uplift 4-Quadrant Matrix'}
      </Text>

      <View style={[styles.matrixContainer, { width, height }]}>
        {/* Quadrant 1: Persuadables (Top Right) */}
        <TouchableOpacity
          style={[styles.quadrantBox, styles.persuadablesBox, { top: 0, left: halfW, width: halfW, height: halfH }]}
          onPress={() => onSelectQuadrant?.('persuadables')}
        >
          <Text style={[styles.quadrantTitle, { color: themeTokens.brand.primary }]}>PERSUADABLES (37%)</Text>
          <Text style={styles.quadrantSub}>High Uplift | Target Aggressively</Text>
          <Text style={styles.actionBadge}>+42.5% Avg Lift</Text>
        </TouchableOpacity>

        {/* Quadrant 2: Sure Things (Top Left) */}
        <TouchableOpacity
          style={[styles.quadrantBox, styles.sureThingsBox, { top: 0, left: 0, width: halfW, height: halfH }]}
          onPress={() => onSelectQuadrant?.('sure_things')}
        >
          <Text style={[styles.quadrantTitle, { color: themeTokens.colors.warning }]}>SURE THINGS (32%)</Text>
          <Text style={styles.quadrantSub}>Transacts Anyway | Exclude</Text>
          <Text style={styles.savingsText}>Saves ৳1.8M Waste</Text>
        </TouchableOpacity>

        {/* Quadrant 3: Lost Causes (Bottom Left) */}
        <TouchableOpacity
          style={[styles.quadrantBox, styles.lostCausesBox, { top: halfH, left: 0, width: halfW, height: halfH }]}
          onPress={() => onSelectQuadrant?.('lost_causes')}
        >
          <Text style={[styles.quadrantTitle, { color: themeTokens.colors.textMuted }]}>LOST CAUSES (23%)</Text>
          <Text style={styles.quadrantSub}>Unresponsive | Suppress</Text>
          <Text style={styles.infoText}>Low Engagement</Text>
        </TouchableOpacity>

        {/* Quadrant 4: Sleeping Dogs (Bottom Right) */}
        <TouchableOpacity
          style={[styles.quadrantBox, styles.sleepingDogsBox, { top: halfH, left: halfW, width: halfW, height: halfH }]}
          onPress={() => onSelectQuadrant?.('sleeping_dogs')}
        >
          <Text style={[styles.quadrantTitle, { color: themeTokens.colors.danger }]}>SLEEPING DOGS (8%)</Text>
          <Text style={styles.quadrantSub}>Negative Response | Do Not Disturb</Text>
          <Text style={styles.dangerText}>-14.8% Churn Risk</Text>
        </TouchableOpacity>

        {/* Axis Lines */}
        <View style={[styles.axisLineH, { top: halfH, width }]} />
        <View style={[styles.axisLineV, { left: halfW, height }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeTokens.colors.surface,
    borderRadius: themeTokens.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
    marginBottom: 10,
  },
  matrixContainer: {
    position: 'relative',
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quadrantBox: {
    position: 'absolute',
    padding: 10,
    justifyContent: 'space-between',
  },
  persuadablesBox: {
    backgroundColor: '#EBF4FF',
  },
  sureThingsBox: {
    backgroundColor: '#FEF3C7',
  },
  lostCausesBox: {
    backgroundColor: '#F3F4F6',
  },
  sleepingDogsBox: {
    backgroundColor: '#FEE2E2',
  },
  quadrantTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  quadrantSub: {
    fontSize: 9,
    color: themeTokens.colors.textSecondary,
  },
  actionBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: themeTokens.brand.primary,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  infoText: {
    fontSize: 9,
    color: themeTokens.colors.textMuted,
  },
  dangerText: {
    fontSize: 10,
    fontWeight: '700',
    color: themeTokens.colors.danger,
  },
  axisLineH: {
    position: 'absolute',
    height: 2,
    backgroundColor: themeTokens.brand.primary,
  },
  axisLineV: {
    position: 'absolute',
    width: 2,
    backgroundColor: themeTokens.brand.primary,
  },
});
