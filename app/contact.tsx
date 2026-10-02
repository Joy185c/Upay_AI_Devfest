import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, Headphones, Mail, PhoneCall, Send, CheckCircle2 } from 'lucide-react-native';
import { themeTokens } from '../theme/tokens';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (subject && message) {
      setSubmitted(true);
      setSubject('');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <ArrowLeft size={22} color={themeTokens.brand.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support & Contact</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <Headphones size={24} color={themeTokens.brand.primary} />
            <Text style={styles.cardTitle}>Upay BD Support Team</Text>
          </View>

          <Text style={styles.paragraph}>
            Have questions about account security, transaction history, or wallet features? Get in touch with our team.
          </Text>

          <View style={styles.contactItem}>
            <Mail size={18} color={themeTokens.brand.primary} />
            <Text style={styles.contactText}>support@upaybd.example.com</Text>
          </View>

          <View style={styles.contactItem}>
            <PhoneCall size={18} color={themeTokens.brand.primary} />
            <Text style={styles.contactText}>16268 (Hotline 24/7)</Text>
          </View>

          <Text style={styles.sectionHeading}>Send us a Message</Text>

          {submitted ? (
            <View style={styles.successBanner}>
              <CheckCircle2 size={20} color={themeTokens.colors.success} />
              <Text style={styles.successMessage}>Your ticket has been logged successfully. We will reply via email!</Text>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.textInput}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Question about PIN security"
              />

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Message</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                placeholder="Describe your issue or query..."
              />

              <TouchableOpacity
                style={[styles.submitBtn, (!subject || !message) && styles.disabledBtn]}
                onPress={handleSubmit}
                disabled={!subject || !message}
              >
                <Send size={16} color={themeTokens.brand.primaryDark} />
                <Text style={styles.submitBtnText}>Submit Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: themeTokens.colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.xl,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    gap: 12,
  },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: themeTokens.brand.primaryDark },
  paragraph: { fontSize: 13, color: themeTokens.colors.textSecondary, lineHeight: 18 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  contactText: { fontSize: 14, fontWeight: '700', color: themeTokens.colors.textPrimary },
  sectionHeading: { fontSize: 14, fontWeight: '800', color: themeTokens.colors.textPrimary, marginTop: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textMuted },
  textInput: {
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
    fontWeight: '600',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    marginTop: 14,
  },
  disabledBtn: { opacity: 0.5 },
  submitBtnText: { fontSize: 14, fontWeight: '900', color: themeTokens.brand.primaryDark },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: themeTokens.radius.md,
    padding: 12,
    marginTop: 10,
  },
  successMessage: { flex: 1, fontSize: 12, fontWeight: '700', color: '#166534' },
});
