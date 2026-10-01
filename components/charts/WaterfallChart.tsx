import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { themeTokens } from '../../theme/tokens';
import { WaterfallItem } from '../../types';
import { formatCurrency } from '../../i18n';
import { useAppStore } from '../../lib/store';

interface WaterfallChartProps {
  data: WaterfallItem[];
  width?: number;
  height?: number;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  width = Dimensions.get('window').width > 600 ? 540 : Dimensions.get('window').width - 48,
  height = 240,
}) => {
  const language = useAppStore((state) => state.language);
  if (!data || data.length === 0) return null;

  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 65;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barWidth = Math.min(65, (chartWidth / data.length) - 12);

  const maxVal = 20000000; // ৳20M
  const getY = (val: number) => paddingTop + chartHeight - (Math.abs(val) / maxVal) * chartHeight;
  const getBarHeight = (val: number) => (Math.abs(val) / maxVal) * chartHeight;

  let currentCumulative = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'bn' ? 'কজ্যাল ক্যাসকেড ওয়াটারফল (গ্রস বনাম নেট)' : 'Causal Decomposition Waterfall'}
      </Text>

      <Svg width={width} height={height}>
        {data.map((item, index) => {
          const isNegative = item.amount < 0;
          const isTotal = item.isTotal;
          const x = paddingLeft + index * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;

          let y = 0;
          let bHeight = getBarHeight(item.amount);

          if (index === 0) {
            y = getY(item.amount);
            currentCumulative = item.amount;
          } else if (isTotal) {
            y = getY(item.amount);
          } else {
            if (isNegative) {
              y = getY(currentCumulative);
              currentCumulative += item.amount;
            } else {
              currentCumulative += item.amount;
              y = getY(currentCumulative);
            }
          }

          let color = themeTokens.brand.primary;
          if (isNegative) color = themeTokens.colors.danger;
          if (isTotal) color = themeTokens.brand.yellow;

          const labelText = (Math.abs(item.amount) / 1000000).toFixed(1) + 'M';

          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(4, bHeight)}
                fill={color}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fontSize={10}
                fontWeight="bold"
                fill={themeTokens.colors.textPrimary}
                textAnchor="middle"
              >
                {isNegative ? '-' : ''}৳{labelText}
              </SvgText>

              <SvgText
                x={x + barWidth / 2}
                y={height - paddingBottom + 16}
                fontSize={9}
                fill={themeTokens.colors.textSecondary}
                textAnchor="middle"
              >
                {language === 'bn' ? item.stageBn : item.stage}
              </SvgText>
            </React.Fragment>
          );
        })}
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
