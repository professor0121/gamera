import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';

const ONBOARDING_SLIDES = [
  {
    title: 'WELCOME',
    subtitle: 'VIVID ARCADE HUB',
    description: 'Your premium destination for high-fidelity cyber-punk arcade gaming directly on your device.',
    icon: 'game-controller-outline' as const,
    color: COLORS.PRIMARY,
  },
  {
    title: 'AWESOME GAMES',
    subtitle: 'CYBER PIPELINES',
    description: 'Fly through cyber-grid pipelines in Flappy Neon, or challenge smart AIs in classic grid battles.',
    icon: 'rocket-outline' as const,
    color: COLORS.ACCENT_CYAN,
  },
  {
    title: 'HIGH SCORES',
    subtitle: 'GLORY TRACKING',
    description: 'Your scores, best attempts, and stats are saved locally so you can track your progression.',
    icon: 'trophy-outline' as const,
    color: COLORS.TERTIARY,
  },
  {
    title: 'INFO CENTER',
    subtitle: 'ARCADE SETTINGS',
    description: 'Need help or want to review this walkthrough again? Simply tap the Info icon in the dashboard header.',
    icon: 'information-circle-outline' as const,
    color: COLORS.GRADIENT_END,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const router = useRouter();

  const handleNext = async () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      await completeOnboarding();
      router.replace('/');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.overlayContainer}>
        <View style={styles.glassPanel}>
          {/* Slide Header */}
          <Text style={[styles.onboardingTitle, { color: ONBOARDING_SLIDES[currentSlide].color, fontFamily: Fonts.rounded }]}>
            {ONBOARDING_SLIDES[currentSlide].title}
          </Text>
          <Text style={[styles.onboardingSubtitle, { fontFamily: Fonts.sans }]}>
            {ONBOARDING_SLIDES[currentSlide].subtitle}
          </Text>

          {/* Glowing Icon Container */}
          <View style={[styles.iconContainer, { borderColor: ONBOARDING_SLIDES[currentSlide].color, shadowColor: ONBOARDING_SLIDES[currentSlide].color }]}>
            <Ionicons 
              name={ONBOARDING_SLIDES[currentSlide].icon} 
              size={64} 
              color={ONBOARDING_SLIDES[currentSlide].color} 
            />
          </View>

          {/* Slide Description */}
          <Text style={[styles.onboardingDesc, { fontFamily: Fonts.sans }]}>
            {ONBOARDING_SLIDES[currentSlide].description}
          </Text>

          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  currentSlide === i 
                    ? { backgroundColor: ONBOARDING_SLIDES[currentSlide].color, width: 20 } 
                    : { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                ]} 
              />
            ))}
          </View>

          {/* Controls Row */}
          <View style={styles.buttonRow}>
            {currentSlide > 0 ? (
              <TouchableOpacity 
                style={styles.onboardingSecondaryButton} 
                onPress={handleBack}
              >
                <Text style={[styles.secondaryButtonText, { fontFamily: Fonts.rounded }]}>
                  BACK
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.onboardingSecondaryButton} 
                onPress={handleSkip}
              >
                <Text style={[styles.secondaryButtonText, { fontFamily: Fonts.rounded, color: COLORS.TEXT_MUTED }]}>
                  SKIP
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.onboardingPrimaryButton, { backgroundColor: ONBOARDING_SLIDES[currentSlide].color }]} 
              onPress={handleNext}
            >
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded, color: COLORS.BACKGROUND }]}>
                {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'START' : 'NEXT'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: 24,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 360,
    padding: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(20, 18, 24, 0.95)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  onboardingTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  onboardingDesc: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
    minHeight: 60,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  onboardingPrimaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  onboardingSecondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
});
