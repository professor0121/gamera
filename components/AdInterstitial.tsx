import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, AD_CONSTANTS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AdInterstitialProps {
  visible: boolean;
  onClose: () => void;
}

export function AdInterstitial({ visible, onClose }: AdInterstitialProps) {
  const [countdown, setCountdown] = useState(AD_CONSTANTS.COUNTDOWN_DURATION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCountdown(AD_CONSTANTS.COUNTDOWN_DURATION);
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const handleCtaPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Mock Installation Successful! Launching Spatial Racer.');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Grid Overlay */}
      <View style={styles.gridOverlay} />
      
      {/* Background Glow Blooms */}
      <View style={styles.glowBloom} />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.sponsorBadge}>
          <Text style={[styles.sponsorText, { fontFamily: Fonts.mono }]}>SPONSORED</Text>
        </View>
        <View style={styles.countdownBadge}>
          <Text style={[styles.countdownText, { fontFamily: Fonts.mono }]}>
            {countdown > 0 ? `CLOSE IN ${countdown}S` : 'AD READY'}
          </Text>
        </View>
      </View>

      {/* Ad Content */}
      <View style={styles.content}>
        {/* Holographic HUD scope representing the racing game */}
        <View style={styles.hudScope}>
          <View style={styles.hudRing1} />
          <View style={styles.hudRing2} />
          <Ionicons name="speedometer" size={64} color={COLORS.GRADIENT_END} />
        </View>

        <Text style={[styles.adSubtitle, { fontFamily: Fonts.sans }]}>
          {AD_CONSTANTS.SUBTITLE}
        </Text>
        <Text style={[styles.adTitle, { fontFamily: Fonts.rounded }]}>
          {AD_CONSTANTS.TITLE}
        </Text>
        <Text style={[styles.adDescription, { fontFamily: Fonts.sans }]}>
          {AD_CONSTANTS.DESCRIPTION}
        </Text>

        {/* CTA Install Button */}
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={handleCtaPress}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.BACKGROUND} />
          ) : (
            <>
              <Text style={[styles.ctaButtonText, { fontFamily: Fonts.rounded }]}>
                {AD_CONSTANTS.CTA}
              </Text>
              <Ionicons name="download-outline" size={18} color={COLORS.BACKGROUND} style={styles.ctaIcon} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Skip Button Footer */}
      <View style={styles.footer}>
        {countdown > 0 ? (
          <View style={styles.skipButtonDisabled}>
            <Text style={[styles.skipButtonTextDisabled, { fontFamily: Fonts.rounded }]}>
              SKIP AD ({countdown}s)
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.skipButtonActive} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipButtonTextActive, { fontFamily: Fonts.rounded }]}>
              SKIP AD
            </Text>
            <Ionicons name="play-forward" size={16} color={COLORS.TEXT_PRIMARY} style={styles.skipIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070609',
    justifyContent: 'space-between',
    zIndex: 9999, // Render on top of everything else
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  glowBloom: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 4,
    left: SCREEN_WIDTH / 4,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.GRADIENT_END,
    opacity: 0.15,
    filter: 'blur(60px)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  sponsorBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sponsorText: {
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  countdownBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countdownText: {
    fontSize: 9,
    color: COLORS.GRADIENT_END,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  hudScope: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: COLORS.GRADIENT_END,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  hudRing1: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: COLORS.GRADIENT_END,
    opacity: 0.5,
  },
  hudRing2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.GRADIENT_END,
    opacity: 0.3,
  },
  adSubtitle: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  adTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  adDescription: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 240,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.GRADIENT_END,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  ctaIcon: {
    marginLeft: 6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    paddingHorizontal: 32,
  },
  skipButtonDisabled: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  skipButtonTextDisabled: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  skipButtonActive: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  skipButtonTextActive: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  skipIcon: {
    marginLeft: 6,
  },
});
