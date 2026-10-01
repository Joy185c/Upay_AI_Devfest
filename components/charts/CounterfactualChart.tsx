import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { themeTokens } from '../../theme/tokens';
import { CampaignTimeSeriesPoint } from '../../types';

interface CounterfactualChartProps {
  data: CampaignTimeSeriesPoint[];
  width?: number;
  height?: number;
}

export const CounterfactualChart: React.FC<CounterfactualChartProps> = ({
  data,
  width = Dimensions.get('window').width > 600 ? 540 : Dimensions.get('window').width - 48,
  height = 220,
}) => {
  if (!data || data.length === 0) return null;

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.treatedActual), ...data.map((d) => d.upperConfidence)) * 1.1;
  const minVal = 0;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Paths
  const treatedPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.treatedActual)}`).join(' ');
  const controlPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.controlBaseline)}`).join(' ');

  // Shaded area between treated & control (True Incremental Impact)
  const areaPath = `${treatedPath} ${data
    .slice()
    .reverse()
    .map((d, i) => `L ${getX(data.length - 1 - i)} ${getY(d.controlBaseline)}`)
    .join(' ')} Z`;

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: themeTokens.brand.primary }]} />
          <Text style={styles.legendText}>Treated Actual</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: themeTokens.colors.textMuted }]} />
          <Text style={styles.legendText}>Control Baseline (Counterfactual)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: themeTokens.brand.yellow }]} />
          <Text style={styles.legendText}>Shaded = True Incremental Impact</Text>
        </View>
      </View>

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="incrementalGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={themeTokens.brand.yellow} stopOpacity="0.45" />
            <Stop offset="1" stopColor={themeTokens.brand.yellow} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = paddingTop + chartHeight * ratio;
          const val = Math.round((maxVal * (1 - ratio)) / 1000);
          return (
            <React.Fragment key={i}>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={themeTokens.colors.border}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 4}
                fontSize={10}
                fill={themeTokens.colors.textMuted}
                textAnchor="end"
              >
                ৳{val}k
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Shaded Incremental Area */}
        <Path d={areaPath} fill="url(#incrementalGradient)" />

        {/* Lines */}
        <Path d={controlPath} stroke={themeTokens.colors.textMuted} strokeWidth={2} strokeDasharray="5 5" fill="none" />
        <Path d={treatedPath} stroke={themeTokens.brand.primary} strokeWidth={3} fill="none" />

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <React.Fragment key={i}>
            <Circle cx={getX(i)} cy={getY(d.treatedActual)} r={4} fill={themeTokens.brand.primary} />
            <SvgText
              x={getX(i)}
              y={height - 10}
              fontSize={10}
              fill={themeTokens.colors.textSecondary}
              textAnchor="middle"
            >
              {d.date}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
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
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: themeTokens.colors.textSecondary,
    fontWeight: '500',
  },
});
