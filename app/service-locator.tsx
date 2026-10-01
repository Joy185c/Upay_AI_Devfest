import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, MapPin, Store, Landmark, ShieldCheck } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useAppStore } from '../lib/store';
import { useRouter } from 'expo-router';

export default function ServiceLocatorScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'agent' | 'merchant' | 'atm'>('all');
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const locations = [
    { id: '1', name: 'Dhaka Fresh Mart (Merchant)', type: 'merchant', dist: '0.4 km', address: 'Gulshan 2, Dhaka' },
    { id: '2', name: 'Rahim Telecom (Agent)', type: 'agent', dist: '0.8 km', address: 'Banani Road 11, Dhaka' },
    { id: '3', name: 'City Bank ATM (ATM)', type: 'atm', dist: '1.2 km', address: 'Gulshan Avenue, Dhaka' },
  ];

  const filtered = locations.filter((loc) => activeTab === 'all' || loc.type === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Locator</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Map Simulation Banner */}
      <View style={styles.mapSimBox}>
        <MapPin size={48} color={themeTokens.brand.yellow} />
        <Text style={styles.mapText}>Interactive Dhaka Region Map</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {['all', 'agent', 'merchant', 'atm'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.activeTab]}
            onPress={() => setActiveTab(t as any)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {filtered.map((loc) => (
          <View key={loc.id} style={styles.card}>
            <MapPin size={22} color={themeTokens.brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{loc.name}</Text>
              <Text style={styles.addr}>{loc.address}</Text>
            </View>
            <Text style={styles.dist}>{loc.dist}</Text>
          </View>
        ))}
      </ScrollView>
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
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  mapSimBox: {
    height: 140,
    backgroundColor: themeTokens.brand.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: { fontSize: 14, fontWeight: '700', color: themeTokens.brand.yellow, marginTop: 6 },
  tabBar: { flexDirection: 'row', backgroundColor: themeTokens.colors.surface, padding: 6, gap: 6 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: themeTokens.brand.yellow },
  tabText: { fontSize: 11, fontWeight: '700', color: themeTokens.colors.textSecondary },
  activeTabText: { color: themeTokens.brand.primaryDark, fontWeight: '900' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: themeTokens.colors.surface,
    padding: 14,
    borderRadius: themeTokens.radius.md,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  name: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary },
  addr: { fontSize: 11, color: themeTokens.colors.textMuted },
  dist: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primary },
});
