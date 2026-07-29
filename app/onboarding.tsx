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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    step: '01 / 04 • INITIALIZING',
    title: 'VIVID ARCADE',
    subtitle: 'RETRO FUTURE IS LIVE',
    description: 'Welcome to the next generation of high-fidelity cyber-punk arcade gaming directly on your device.',
    icon: 'game-controller-outline' as const,
    color: COLORS.PRIMARY,
    glow: 'rgba(207, 188, 255, 0.25)',
  },
  {
    step: '02 / 04 • SYS LOADING',
    title: 'NEON PIPELINES',
    subtitle: 'FLY & DODGE',
    description: 'Fly through cyber-grid pipelines in Flappy Neon, or challenge smart AIs in our classic board games.',
    icon: 'rocket-outline' as const,
    color: COLORS.ACCENT_CYAN,
    glow: 'rgba(0, 245, 255, 0.25)',
  },
  {
    step: '03 / 04 • LOG DATA',
    title: 'HIGH GLORY',
    subtitle: 'PERSONAL BESTS',
    description: 'Your scores, best attempts, and stats are saved locally so you can track your progression and sys rank.',
    icon: 'trophy-outline' as const,
    color: COLORS.TERTIARY,
    glow: 'rgba(231, 195, 101, 0.25)',
  },
  {
    step: '04 / 04 • ONLINE STATUS',
    title: 'SYS READINESS',
    subtitle: 'WALKTHROUGH COMPLETE',
    description: 'Ready to play? Toggle sounds or haptics anytime inside settings. Let\'s boot up the arcade systems.',
    icon: 'shield-checkmark-outline' as const,
    color: COLORS.GRADIENT_END,
    glow: 'rgba(236, 72, 153, 0.25)',
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

  const activeSlide = ONBOARDING_SLIDES[currentSlide];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Neon Glow Blooms */}
      <View style={[styles.glowBloom1, { backgroundColor: activeSlide.color }]} />
      <View style={[styles.glowBloom2, { backgroundColor: activeSlide.color }]} />

      {/* Grid Pattern Overlay */}
      <View style={styles.gridOverlay} />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={[styles.stepText, { color: activeSlide.color, fontFamily: Fonts.mono }]}>
          {activeSlide.step}
        </Text>
        {currentSlide < ONBOARDING_SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipButtonText, { fontFamily: Fonts.rounded }]}>SKIP</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.TEXT_MUTED} style={styles.skipIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {/* Radar Icon Scope */}
        <View style={[styles.radarOuterRing, { borderColor: activeSlide.color, shadowColor: activeSlide.color }]}>
          <View style={[styles.radarInnerRing, { borderColor: activeSlide.color }]} />
          <View style={styles.iconWrapper}>
            <Ionicons name={activeSlide.icon} size={56} color={activeSlide.color} />
          </View>
        </View>

        {/* Slide Texts */}
        <View style={styles.textContainer}>
          <Text style={[styles.slideSubtitle, { color: activeSlide.color, fontFamily: Fonts.sans }]}>
            {activeSlide.subtitle}
          </Text>
          <Text style={[styles.slideTitle, { fontFamily: Fonts.rounded }]}>
            {activeSlide.title}
          </Text>
          <Text style={[styles.slideDescription, { fontFamily: Fonts.sans }]}>
            {activeSlide.description}
          </Text>
        </View>
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                currentSlide === i 
                  ? { backgroundColor: activeSlide.color, width: 24 } 
                  : { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
              ]} 
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: activeSlide.color, shadowColor: activeSlide.color }]} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>
            {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'BOOT SYSTEMS' : 'CONTINUE'}
          </Text>
          <Ionicons 
            name={currentSlide === ONBOARDING_SLIDES.length - 1 ? 'power' : 'chevron-forward'} 
            size={18} 
            color={COLORS.BACKGROUND} 
            style={styles.btnIcon} 
          />
        </TouchableOpacity>

        {/* Back Button (Below Primary) */}
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={[styles.backButtonText, { fontFamily: Fonts.sans }]}>PREVIOUS INDEX</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'space-between',
  },
  // Glowing ambient blooms
  glowBloom1: {
    position: 'absolute',
    top: -150,
    left: -150,
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.12,
    filter: 'blur(80px)',
  },
  glowBloom2: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.08,
    filter: 'blur(80px)',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.015,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    // Mocking grids using relative transparency
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
  },
  stepText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipButtonText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  skipIcon: {
    marginLeft: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  // Cyber scope styling
  radarOuterRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 6,
  },
  radarInnerRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    opacity: 0.5,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  slideSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    alignItems: 'center',
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
  primaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1.5,
  },
  btnIcon: {
    marginLeft: 6,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
