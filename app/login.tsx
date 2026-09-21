import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLuxuryTheme, hexToRgba } from '../src/theme/luxury';
import { Button } from '../src/components/Button';
import { BrandIcon } from '../src/components/BrandIcon';
import { GoogleIcon } from '../src/components/GoogleIcon';
import { authService } from '../src/services/auth';
import { useUserStore } from '../src/store/userStore';
import { LiquidBackground, LiquidGlassCard } from '../src/components/LiquidGlass';
import { ThemeSwitcher } from '../src/components/ThemeSwitcher';

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { palette, isDark } = useLuxuryTheme();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputContainerDynamic = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(240, 235, 255, 0.65)',
    borderColor: isDark ? 'rgba(168, 85, 247, 0.22)' : 'rgba(124, 58, 237, 0.25)',
  };

  // Responsive breakpoints
  const isSmallDevice = width < 375 || height < 700;
  const isTablet = width >= 640;

  const handleEmailAuth = async () => {
    setErrorMessage(null);
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await authService.signUpWithEmailPassword(trimmedEmail, trimmedPassword);
        useUserStore.getState().setOnboardingComplete(false);
        if (name.trim()) {
          useUserStore.getState().setUserProfile({ name: name.trim() });
        }
        router.replace('/onboarding/step1-sex');
      } else {
        await authService.signInWithEmailPassword(trimmedEmail, trimmedPassword);
        const hasProfile = await authService.checkUserProfileExists();
        const isComplete = useUserStore.getState().isOnboardingComplete;

        if (hasProfile && isComplete) {
          router.replace('/(tabs)/dashboard');
        } else {
          router.replace('/onboarding/step1-sex');
        }
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      const hasProfile = await authService.checkUserProfileExists();
      const isComplete = useUserStore.getState().isOnboardingComplete;

      if (hasProfile && isComplete) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/onboarding/step1-sex');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await authService.signInWithEmailPassword('guest@fitai.app', 'guest123');
      useUserStore.getState().setOnboardingComplete(false);
      useUserStore.getState().setUserProfile({ name: 'Guest' });
      router.replace('/onboarding/step1-sex');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Guest sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiquidBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Controls: Theme Switcher */}
        <View style={styles.topControlRow}>
          <ThemeSwitcher variant="compact" size={40} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              {
                paddingHorizontal: isSmallDevice ? 18 : isTablet ? 36 : 24,
                paddingVertical: isSmallDevice ? 16 : 28,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.contentCard, { maxWidth: isTablet ? 480 : 420 }]}>
              {/* Header: Logo & Titles */}
              <View style={[styles.headerSection, { marginBottom: isSmallDevice ? 18 : 24 }]}>
                <BrandIcon
                  size={isSmallDevice ? 54 : 64}
                  style={{ marginBottom: isSmallDevice ? 10 : 14 }}
                />
                <Text
                  style={[
                    styles.headline,
                    {
                      fontSize: isSmallDevice ? 24 : 28,
                      color: palette.textPrimary,
                    },
                  ]}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </Text>
                <Text
                  style={[
                    styles.subheadline,
                    {
                      color: palette.textSecondary,
                    },
                  ]}
                >
                  {isSignUp
                    ? 'Start your personalized AI training & nutrition journey'
                    : 'Log in to continue your fitness and wellness goals'}
                </Text>
              </View>

              {/* Glass Card Container */}
              <LiquidGlassCard borderRadius={26} style={styles.glassContainer}>
                {/* Segmented Control */}
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsSignUp(false);
                      setErrorMessage(null);
                    }}
                    style={[
                      styles.segment,
                      !isSignUp && styles.segmentActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: !isSignUp ? '#FFFFFF' : palette.textMuted },
                      ]}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsSignUp(true);
                      setErrorMessage(null);
                    }}
                    style={[
                      styles.segment,
                      isSignUp && styles.segmentActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: isSignUp ? '#FFFFFF' : palette.textMuted },
                      ]}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Error Banner */}
                {errorMessage && (
                  <View
                    style={[
                      styles.errorBanner,
                      {
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                      },
                    ]}
                  >
                    <Ionicons name="alert-circle" size={18} color="#EF4444" />
                    <Text style={styles.errorText}>
                      {errorMessage}
                    </Text>
                  </View>
                )}

                {/* Form Section */}
                <View style={styles.formSection}>
                  {isSignUp && (
                    <View style={[styles.inputContainer, inputContainerDynamic]}>
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={palette.textMuted}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: palette.textPrimary }]}
                        placeholder="Full name"
                        placeholderTextColor={palette.textMuted}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                      />
                    </View>
                  )}

                  <View style={[styles.inputContainer, inputContainerDynamic]}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={palette.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: palette.textPrimary }]}
                      placeholder="Email address"
                      placeholderTextColor={palette.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={[styles.inputContainer, inputContainerDynamic]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={palette.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: palette.textPrimary }]}
                      placeholder="Password"
                      placeholderTextColor={palette.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={palette.textMuted}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Primary Action Button */}
                  <Button
                    label={isSignUp ? 'Create Account' : 'Log In'}
                    onPress={handleEmailAuth}
                    loading={loading}
                    size="lg"
                    style={styles.primaryButton}
                  />

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={[styles.dividerText, { color: palette.textMuted }]}>
                      or
                    </Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Sign In */}
                  <Button
                    label="Continue with Google"
                    onPress={handleGoogleSignIn}
                    variant="secondary"
                    size="lg"
                    leading={<GoogleIcon size={18} />}
                    style={styles.googleButton}
                  />

                  {/* Guest / Demo Access */}
                  <Button
                    label="Explore as Guest"
                    onPress={handleGuestSignIn}
                    variant="ghost"
                    size="sm"
                    style={{ marginTop: 6 }}
                  />
                </View>
              </LiquidGlassCard>

              {/* Footer Notice */}
              <View style={styles.footerSection}>
                <Text style={[styles.footerText, { color: palette.textMuted }]}>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topControlRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 6,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    width: '100%',
    alignItems: 'stretch',
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 18,
  },
  glassContainer: {
    padding: 20,
    width: '100%',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.4)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  errorText: {
    color: '#F87171',
    marginLeft: 8,
    flex: 1,
    fontSize: 12.5,
    lineHeight: 16,
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.22)',
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 6,
  },
  primaryButton: {
    marginTop: 6,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
  },
  footerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11.5,
    lineHeight: 16,
    maxWidth: 300,
  },
});
