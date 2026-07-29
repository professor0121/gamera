import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, STRINGS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';


export default function HomeScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);

  // Re-fetch high score whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadHighScore = async () => {
        try {
          const stored = await AsyncStorage.getItem(STRINGS.HIGH_SCORE_STORAGE_KEY);
          if (stored !== null) {
            setHighScore(parseInt(stored, 10));
          }
        } catch (e) {
          console.error('Failed to load high score', e);
        }
      };
      loadHighScore();
    }, [])
  );

  const launchFlappy = () => {
    router.push('/games/flappy' as Href);
  };

  const launchTicTacToe = () => {
    router.push('/games/tictactoe' as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Profile Area */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={COLORS.PRIMARY} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.welcomeText, { fontFamily: Fonts.sans }]}>Welcome Back,</Text>
            <Text style={[styles.usernameText, { fontFamily: Fonts.rounded }]}>Player One</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hub Banner */}
        <View style={styles.bannerPanel}>
          <Text style={[styles.bannerTitle, { fontFamily: Fonts.rounded }]}>GAME HUB</Text>
          <Text style={[styles.bannerSubtitle, { fontFamily: Fonts.sans }]}>Vivid Arcade Live</Text>
        </View>

        {/* Section Title */}
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}>ALL GAMES</Text>

        {/* Flappy Neon Game Card */}
        <View style={styles.gameCard}>
          <View style={styles.gameCardGlow} />
          <View style={styles.cardHeader}>
            <View style={styles.titleCol}>
              <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>
                {STRINGS.GAME_TITLE}
              </Text>
              <Text style={[styles.cardSubtitle, { fontFamily: Fonts.sans }]}>
                {STRINGS.GAME_SUBTITLE}
              </Text>
            </View>
            <View style={styles.statsBadge}>
              <Ionicons name="trophy" size={14} color={COLORS.TERTIARY} style={styles.badgeIcon} />
              <Text style={[styles.badgeText, { fontFamily: Fonts.mono }]}>
                {String(highScore).padStart(2, '0')}
              </Text>
            </View>
          </View>

          <Text style={[styles.cardDesc, { fontFamily: Fonts.sans }]}>
            {STRINGS.CHALLENGE_DESC}
          </Text>

          <TouchableOpacity style={styles.playButton} onPress={launchFlappy}>
            <Text style={[styles.playButtonText, { fontFamily: Fonts.rounded }]}>
              {STRINGS.PLAY_NOW}
            </Text>
            <Ionicons name="play-forward" size={16} color={COLORS.TEXT_ON_PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Tic Tac Toe Game Card */}
        <View style={styles.gameCard}>
          <View style={[styles.gameCardGlow, { backgroundColor: 'rgba(0, 245, 255, 0.04)' }]} />
          <View style={styles.cardHeader}>
            <View style={styles.titleCol}>
              <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>
                TIC TAC TOE
              </Text>
              <Text style={[styles.cardSubtitle, { fontFamily: Fonts.sans }]}>
                Classic Grid Battle
              </Text>
            </View>
            <View style={activeBadgeStyles.activeBadge}>
              <Text style={[activeBadgeStyles.activeText, { fontFamily: Fonts.mono }]}>NEW</Text>
            </View>
          </View>
          <Text style={[styles.cardDesc, { fontFamily: Fonts.sans }]}>
            Challenge the smart minimax AI algorithm or play head-to-head with a friend on a sleek neon grid.
          </Text>
          <TouchableOpacity style={[styles.playButton, { backgroundColor: COLORS.ACCENT_CYAN, shadowColor: 'rgba(0, 245, 255, 0.4)' }]} onPress={launchTicTacToe}>
            <Text style={[styles.playButtonText, { fontFamily: Fonts.rounded, color: COLORS.BACKGROUND }]}>
              {STRINGS.PLAY_NOW}
            </Text>
            <Ionicons name="play-forward" size={16} color={COLORS.BACKGROUND} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const activeBadgeStyles = StyleSheet.create({
  activeBadge: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeText: {
    fontSize: 10,
    color: COLORS.ACCENT_CYAN,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: COLORS.SURFACE,
    borderBottomColor: COLORS.GLASS_BORDER,
    borderBottomWidth: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGlow: {
    borderRadius: 24,
    padding: 2,
    backgroundColor: 'rgba(207, 188, 255, 0.15)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE_CONTAINER,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.PRIMARY,
    borderWidth: 1.5,
  },
  profileInfo: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  bannerPanel: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: COLORS.SURFACE_CONTAINER,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
    marginBottom: 16,
  },
  gameCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  gameCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 195, 101, 0.1)',
    borderColor: 'rgba(231, 195, 101, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.TERTIARY,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    lineHeight: 18,
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY_GLOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_ON_PRIMARY,
    marginRight: 6,
    letterSpacing: 0.5,
  },
  disabledCard: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.TEXT_MUTED,
  },
});
