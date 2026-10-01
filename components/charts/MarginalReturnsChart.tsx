import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { themeTokens } from '../../theme/tokens';

interface MarginalReturnsChartProps {
  data: { spendBDT: number; incrementalRevenueBDT: number }[];
  recommendedSpendBDT?: number;
  width?: number;
  height?: number;
}

export const MarginalReturnsChart: React.FC<MarginalReturnsChartProps> = ({
  data,
  recommendedSpendBDT = 3960000,
  width = Dimensions.get('window').width > 600 ? 540 : Dimensions.get('window').width - 48,
  height = 200,
}) => {
  if (!data || data.length === 0) return null;

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxSpend = Math.max(...data.map((d) => d.spendBDT));
  const maxRev = Math.max(...data.map((d) => d.incrementalRevenueBDT)) * 1.1;

  const getX = (spend: number) => paddingLeft + (spend / maxSpend) * chartWidth;
  const getY = (rev: number) => paddingTop + chartHeight - (rev / maxRev) * chartHeight;

  const curvePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.spendBDT)} ${getY(d.incrementalRevenueBDT)}`).join(' ');

  const recX = getX(recommendedSpendBDT);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diminishing Returns & Optimal Budget Point</Text>

      <Svg width={width} height={height}>
        {/* Recommended spend vertical line */}
        <Line
          x1={recX}
          y1={paddingTop}
          x2={recX}
          y2={height - paddingBottom}
          stroke={themeTokens.colors.success}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Circle cx={recX} cy={getY(15400000)} r={6} fill={themeTokens.colors.success} />
        
        <SvgText
          x={recX + 8}
          y={paddingTop + 15}
          fontSize={10}
          fontWeight="bold"
          fill={themeTokens.colors.success}
        >
          Optimal Spend: ৳3.96M
        </SvgText>

        {/* Curve */}
        <Path d={curvePath} stroke={themeTokens.brand.primary} strokeWidth={3} fill="none" />

        {/* Data points */}
        {data.map((d, i) => (
          <React.Fragment key={i}>
            <Circle cx={getX(d.spendBDT)} cy={getY(d.incrementalRevenueBDT)} r={3} fill={themeTokens.brand.primary} />
            <SvgText
              x={getX(d.spendBDT)}
              y={height - 10}
              fontSize={9}
              fill={themeTokens.colors.textMuted}
              textAnchor="middle"
            >
              ৳{(d.spendBDT / 1000000).toFixed(0)}M
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
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: themeTokens.colors.textPrimary,
    marginBottom: 8,
  },
});
