import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { UpayHeader } from '../components/customer/UpayHeader';
import { UpayServiceGrid } from '../components/customer/UpayServiceGrid';
import { UpayPromoCarousel } from '../components/customer/UpayPromoCarousel';
import { UpayPaymentsGrid } from '../components/customer/UpayPaymentsGrid';
import { UpayFloatingElements } from '../components/customer/UpayFloatingElements';
import { themeTokens } from '../theme/tokens';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <UpayHeader />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Service Grid */}
        <UpayServiceGrid />

        {/* ImpactIQ Targeted Banners */}
        <UpayPromoCarousel />

        {/* upay Payments (Utility, Gov, Charity) */}
        <UpayPaymentsGrid />
      </ScrollView>

      {/* Floating Buttons: upay Card, upay Offer, Spin Wheel */}
      <UpayFloatingElements />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeTokens.colors.creamBg,
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
