// Patient login screen for SmritiYog mobile app.
// Login using UID (6-digit numeric) + password.
// Language selector sets the patient's preferred language.

import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { useAuth } from '@/lib/auth-context';
import { spacing, radius, typography, fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { LANGUAGES, LANGUAGE_NAMES, type Language } from '@/i18n/languages';
import { useLanguage } from '@/i18n/language-context';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    if (!uid.trim()) {
      setError('Please enter your UID.');
      return;
    }
    if (uid.trim().length !== 6 || !/^\d{6}$/.test(uid.trim())) {
      setError('UID must be exactly 6 digits.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(uid.trim(), password);
      // Set the language after successful login
      setGlobalLanguage(selectedLang);
      // Redirect to main screen
      router.replace('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Branding */}
        <View style={styles.branding}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <AppText variant="h2" color="onPrimary">
              S
            </AppText>
          </View>
          <AppText variant="h1" style={styles.title}>
            SmritiYog
          </AppText>
          <AppText variant="body" color="secondary">
            Care for what matters.
          </AppText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <AppText variant="h3" style={styles.formTitle}>
            Patient Login
          </AppText>
          <AppText variant="body" color="muted" style={styles.formSubtitle}>
            Enter your UID and password to continue.
          </AppText>

          {/* Error */}
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.danger + '15' }]}>
              <AppText variant="caption" color="onDanger">
                {error}
              </AppText>
            </View>
          ) : null}

          {/* UID Input */}
          <View style={styles.field}>
            <AppText variant="label" style={styles.label}>
              Patient UID
            </AppText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: error ? colors.danger : colors.border,
                  color: colors['text.primary'],
                },
              ]}
              placeholder="e.g. 483921"
              placeholderTextColor={colors['text.muted']}
              keyboardType="number-pad"
              maxLength={6}
              value={uid}
              onChangeText={(text) => {
                setUid(text.replace(/[^0-9]/g, ''));
                setError('');
              }}
              autoComplete="off"
              autoFocus
            />
          </View>

          {/* Password Input */}
          <View style={styles.field}>
            <AppText variant="label" style={styles.label}>
              Password
            </AppText>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: error ? colors.danger : colors.border,
                    color: colors['text.primary'],
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors['text.muted']}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                autoComplete="off"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={[styles.eyeBtn, { backgroundColor: colors['surface.warm'] }]}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <AppText variant="body" color="muted">
                  {showPassword ? '🙈' : '👁'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Selector */}
          <View style={styles.field}>
            <AppText variant="label" style={styles.label}>
              Preferred Language
            </AppText>
            <TouchableOpacity
              style={[
                styles.input,
                styles.langBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowLangPicker(!showLangPicker)}
              activeOpacity={0.7}>
              <AppText variant="body" color="primary">
                {LANGUAGE_NAMES[selectedLang]}
              </AppText>
              <AppText variant="body" color="muted">
                {showLangPicker ? '▲' : '▼'}
              </AppText>
            </TouchableOpacity>

            {showLangPicker && (
              <View style={[styles.langList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langItem,
                      selectedLang === lang && { backgroundColor: colors.primary + '10' },
                    ]}
                    onPress={() => {
                      setSelectedLang(lang);
                      setShowLangPicker(false);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selectedLang === lang }}>
                    <AppText
                      variant="body"
                      color={selectedLang === lang ? 'primary' : 'secondary'}>
                      {LANGUAGE_NAMES[lang]}
                    </AppText>
                    {selectedLang === lang && (
                      <AppText variant="body" color="primary">
                        ✓
                      </AppText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginBtn,
              {
                backgroundColor: loading ? colors.primary + '80' : colors.primary,
              },
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} size="small" />
            ) : (
              <AppText variant="label" color="onPrimary">
                Log In
              </AppText>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <AppText variant="caption" color="muted" style={styles.footer}>
          SmritiYog — Cognitive Health Companion
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  branding: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
    gap: spacing.sm,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.lg,
  },
  formTitle: {
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    marginLeft: spacing.xs,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.fontSize,
    fontFamily: fontFamily.regular,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 4,
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langList: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  loginBtn: {
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing['3xl'],
  },
});
