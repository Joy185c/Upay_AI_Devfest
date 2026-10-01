import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { themeTokens } from '../../theme/tokens';
import { useAppStore } from '../../lib/store';
import { useRouter } from 'expo-router';

export const UpayPromoCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const banners = [
    {
      id: 'b1',
      titleBn: 'ঈদ বিল পে ক্যাশব্যাক ১০%',
      titleEn: 'Eid Bill-Pay 10% Cashback',
      subtitleBn: 'ডেসকো, ডিপিডিসি ও ডেসকো বিলে ১০% ইনস্ট্যান্ট ব্যাক*',
      subtitleEn: '10% Instant cashback on DESCO & DPDC bills*',
      badge: '১০% ছাড়',
      bgColor: '#0B4DA2',
    },
    {
      id: 'b2',
      titleBn: 'অ্যাড মানি ব্যাংক বোনাস ৳৫০',
      titleEn: 'Add Money Bank Bonus ৳50',
      subtitleBn: 'সিটি ব্যাংক ও ইসলামী ব্যাংক থেকে ৫০০০ টাকা অ্যাড মানিতে ৳৫০ বোনাস!',
      subtitleEn: 'Get ৳50 bonus on ৳5,000 add money from City Bank',
      badge: '৳৫০ বোনাস',
      bgColor: '#00A859',
    },
    {
      id: 'b3',
      titleBn: 'সুপারমার্কেট ৫% ইনস্ট্যান্ট ব্যাক',
      titleEn: 'Supermarket 5% Instant Back',
      subtitleBn: 'স্বপ্ন ও মীনা বাজারে উপায় পেমেন্টে ৫% ছাড়',
      subtitleEn: '5% Instant back at Shwapno & Meena Bazar',
      badge: '৫% ব্যাক',
      bgColor: '#7C3AED',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[activeIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.bannerCard, { backgroundColor: banner.bgColor }]}
        onPress={() => router.push('/offers' as any)}
        activeOpacity={0.9}
      >
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{banner.badge}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>
            {language === 'bn' ? banner.titleBn : banner.titleEn}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {language === 'bn' ? banner.subtitleBn : banner.subtitleEn}
          </Text>

          <View style={styles.whyTag}>
            <Text style={styles.whyTagText}>
              {language === 'bn' ? '✦ ইমপ্যাক্টআইকিউ কাস্টমাইজড অফার' : '✦ ImpactIQ Personalized'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Pagination dots */}
      <View style={styles.paginationRow}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && { backgroundColor: themeTokens.brand.primary, width: 18 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  bannerCard: {
    borderRadius: themeTokens.radius.lg,
    padding: 16,
    height: 120,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 3,
  },
  badgePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: themeTokens.brand.yellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: themeTokens.radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: themeTokens.brand.primaryDark,
  },
  textContainer: {
    maxWidth: '80%',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeTokens.colors.surface,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 6,
  },
  whyTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  whyTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: themeTokens.brand.yellow,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: themeTokens.colors.borderDark,
  },
});
