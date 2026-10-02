import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Lock, Mail, User, ShieldCheck } from 'lucide-react-native';
import { themeTokens } from '../../theme/tokens';
import { BrandMark } from '../../components/ui/BrandMark';
import { AuthService } from '../../services/authService';
import { loginSchema, signUpSchema } from '../../utils/validationSchemas';
import { useAppStore } from '../../lib/store';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { language, setAuthenticated } = useAppStore();
  const router = useRouter();

  const handleAuthSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate with Zod Schema
        const validation = signUpSchema.safeParse({ fullName, email, phone, password });
        if (!validation.success) {
          setErrorMessage(validation.error.issues[0].message);
          setIsLoading(false);
          return;
        }

        const res = await AuthService.signUpWithEmail({
          email,
          password,
          fullName,
          phone,
        });

        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Registration successful! Please check your email to verify account.');
          setIsSignUp(false);
        }
      } else {
        // Validate with Zod Schema
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          setErrorMessage(validation.error.issues[0].message);
          setIsLoading(false);
          return;
        }

        const res = await AuthService.signInWithEmail({ email, password });
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setAuthenticated(true);
          router.replace('/home');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const res = await AuthService.signInWithGoogle();
    if (res.error) {
      setErrorMessage(res.error);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <BrandMark size="sm" showWordmark={true} />
        <TouchableOpacity
          style={styles.modeTab}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage('');
          }}
        >
          <Text style={styles.modeTabText}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isSignUp ? 'Create Upay Account' : 'Sign In to Upay BD'}</Text>
          <Text style={styles.cardSubtitle}>
            {isSignUp
              ? 'Enter your details to create an authenticated mobile wallet.'
              : 'Sign in with your registered email or Google account.'}
          </Text>

          {isSignUp && (
            <>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputRow}>
                <User size={18} color={themeTokens.brand.primary} />
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="RAFIQUL ISLAM"
                />
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Mobile Number</Text>
              <View style={styles.inputRow}>
                <User size={18} color={themeTokens.brand.primary} />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                />
              </View>
            </>
          )}

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Email Address</Text>
          <View style={styles.inputRow}>
            <Mail size={18} color={themeTokens.brand.primary} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="user@example.com"
            />
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Password</Text>
          <View style={styles.inputRow}>
            <Lock size={18} color={themeTokens.brand.primary} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
            onPress={handleAuthSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={themeTokens.brand.primaryDark} />
            ) : (
              <Text style={styles.primaryBtnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>

          {/* Google OAuth Button */}
          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={isLoading}>
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>
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
  modeTab: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: themeTokens.radius.full,
  },
  modeTabText: { fontSize: 12, fontWeight: '800', color: themeTokens.brand.primary },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: themeTokens.colors.surface,
    padding: 20,
    borderRadius: themeTokens.radius.xl,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: themeTokens.brand.primaryDark, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: themeTokens.colors.textSecondary, marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.textMuted, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    borderRadius: themeTokens.radius.md,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  textInput: { flex: 1, fontSize: 14, fontWeight: '700', color: themeTokens.colors.textPrimary, paddingVertical: 10 },
  errorText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.danger, textAlign: 'center', marginVertical: 10 },
  successText: { fontSize: 12, fontWeight: '700', color: themeTokens.colors.success, textAlign: 'center', marginVertical: 10 },
  primaryBtn: {
    backgroundColor: themeTokens.brand.yellow,
    paddingVertical: 14,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { fontSize: 15, fontWeight: '900', color: themeTokens.brand.primaryDark },
  googleBtn: {
    borderWidth: 1,
    borderColor: themeTokens.colors.border,
    paddingVertical: 12,
    borderRadius: themeTokens.radius.lg,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#F8FAFC',
  },
  googleBtnText: { fontSize: 13, fontWeight: '800', color: themeTokens.colors.textPrimary },
});
