import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, STRINGS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';
import {
  setupInitialEntities,
  PhysicsSystem,
  JumpSystem,
  ObstacleSystem,
} from './_engine';
import { AdInterstitial } from '@/components/AdInterstitial';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export default function FlappyNeonGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('START');
  const [showAd, setShowAd] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameEngineRef = useRef<any>(null);

  // Load high score
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const storedScore = await AsyncStorage.getItem(STRINGS.HIGH_SCORE_STORAGE_KEY);
        if (storedScore !== null) {
          setHighScore(parseInt(storedScore, 10));
        }
      } catch (e) {
        console.error('Failed to load game data', e);
      }
    };
    loadGameData();
  }, []);

  // Update high score
  const updateHighScore = async (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        await AsyncStorage.setItem(STRINGS.HIGH_SCORE_STORAGE_KEY, newScore.toString());
      } catch (e) {
        console.error('Failed to save high score', e);
      }
    }
  };

  const handleEvent = (e: any) => {
    if (e.type === 'score') {
      setScore(prev => {
        const next = prev + 1;
        updateHighScore(next);
        return next;
      });
    } else if (e.type === 'game_over') {
      setGameState('GAME_OVER');
      updateHighScore(score);
    }
  };

  const startGame = () => {
    setScore(0);
    if (gameEngineRef.current) {
      gameEngineRef.current.swap(setupInitialEntities());
    }
    setShowAd(true);
  };

  const handleAdClose = () => {
    setShowAd(false);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    setScore(0);
    if (gameEngineRef.current) {
      gameEngineRef.current.swap(setupInitialEntities());
    }
    setGameState('PLAYING');
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  };

  const exitGame = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[PhysicsSystem, JumpSystem, ObstacleSystem]}
        entities={setupInitialEntities()}
        running={gameState === 'PLAYING'}
        onEvent={handleEvent}
      />

      {/* --- HUD --- */}
      {gameState === 'PLAYING' && (
        <View style={styles.hudContainer}>
          <TouchableOpacity style={styles.hudPauseButton} onPress={togglePause}>
            <Ionicons name="pause" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>

          <View style={styles.hudScoreContainer}>
            <Text style={[styles.hudLabel, { fontFamily: Fonts.rounded }]}>
              {STRINGS.SCORE_LABEL}
            </Text>
            <Text style={[styles.hudScoreText, { fontFamily: Fonts.mono }]}>
              {String(score).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.hudBestContainer}>
            <Text style={[styles.hudLabel, { fontFamily: Fonts.rounded }]}>
              {STRINGS.BEST_LABEL}
            </Text>
            <Text style={[styles.hudBestText, { fontFamily: Fonts.mono }]}>
              {String(highScore).padStart(2, '0')}
            </Text>
          </View>
        </View>
      )}

      {/* --- Start Screen Overlay --- */}
      {gameState === 'START' && (
        <View style={styles.overlayContainer}>
          <View style={styles.glassPanel}>
            <Text style={[styles.gameTitle, { fontFamily: Fonts.rounded }]}>
              {STRINGS.GAME_TITLE}
            </Text>
            <Text style={[styles.gameSubtitle, { fontFamily: Fonts.sans }]}>
              {STRINGS.GAME_SUBTITLE}
            </Text>

            <View style={styles.startBadge}>
              <Text style={[styles.startBadgeLabel, { fontFamily: Fonts.rounded }]}>
                {STRINGS.BEST_LABEL}
              </Text>
              <Text style={[styles.startBadgeValue, { fontFamily: Fonts.mono }]}>
                {String(highScore).padStart(2, '0')}
              </Text>
            </View>

            <Text style={[styles.instructionText, { fontFamily: Fonts.mono }]}>
              {STRINGS.START_INSTRUCTION}
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.PLAY_NOW}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
              <Text style={[styles.exitButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.EXIT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- Pause Menu Overlay --- */}
      {gameState === 'PAUSED' && (
        <View style={styles.overlayContainer}>
          <View style={styles.glassPanel}>
            <Text style={[styles.overlayTitle, { fontFamily: Fonts.rounded }]}>
              {STRINGS.PAUSE_TITLE}
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={togglePause}>
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.RESUME}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={restartGame}>
              <Text style={[styles.secondaryButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.RESTART}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
              <Text style={[styles.exitButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.EXIT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- Game Over Overlay --- */}
      {gameState === 'GAME_OVER' && (
        <View style={styles.overlayContainer}>
          <View style={styles.glassPanel}>
            <Text style={[styles.gameOverTitle, { fontFamily: Fonts.rounded }]}>
              {STRINGS.GAME_OVER}
            </Text>

            <View style={styles.scoresCard}>
              <View style={styles.scoresRow}>
                <Text style={[styles.scoresLabel, { fontFamily: Fonts.rounded }]}>
                  {STRINGS.SCORE_LABEL}
                </Text>
                <Text style={[styles.scoresVal, { fontFamily: Fonts.mono }]}>
                  {String(score).padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.scoresRow}>
                <Text style={[styles.scoresLabel, { fontFamily: Fonts.rounded }]}>
                  {STRINGS.BEST_LABEL}
                </Text>
                <Text style={[styles.scoresVal, { fontFamily: Fonts.mono }]}>
                  {String(highScore).padStart(2, '0')}
                </Text>
              </View>
            </View>

            {score >= highScore && score > 0 && (
              <View style={styles.newBestBadge}>
                <Text style={[styles.newBestText, { fontFamily: Fonts.mono }]}>
                  NEW BEST!
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={restartGame}>
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.RESTART}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
              <Text style={[styles.exitButtonText, { fontFamily: Fonts.rounded }]}>
                {STRINGS.EXIT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ad Interstitial Component */}
      <AdInterstitial visible={showAd} onClose={handleAdClose} />
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  gameContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  hudContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  hudPauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  hudScoreContainer: {
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  hudBestContainer: {
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  hudLabel: {
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  hudScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  hudBestText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TERTIARY,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.75)',
    zIndex: 20,
  },
  glassPanel: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 360,
    padding: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(20, 18, 24, 0.85)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.PRIMARY,
    letterSpacing: -1,
    textAlign: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  gameSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  startBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 195, 101, 0.1)',
    borderColor: 'rgba(231, 195, 101, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  startBadgeLabel: {
    fontSize: 11,
    color: COLORS.TERTIARY,
    fontWeight: 'bold',
    marginRight: 6,
  },
  startBadgeValue: {
    fontSize: 14,
    color: COLORS.TERTIARY,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.ACCENT_CYAN,
    letterSpacing: 2,
    marginBottom: 32,
    shadowColor: COLORS.ACCENT_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY_GLOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_ON_PRIMARY,
    letterSpacing: 1,
  },
  secondaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  exitButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
    letterSpacing: 0.5,
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFB4AB',
    marginBottom: 24,
    letterSpacing: -0.5,
    shadowColor: '#FFB4AB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  scoresCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  scoresLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scoresVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GLASS_BORDER,
    marginVertical: 6,
  },
  newBestBadge: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: COLORS.ACCENT_CYAN,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 24,
    shadowColor: COLORS.ACCENT_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  newBestText: {
    fontSize: 11,
    color: COLORS.ACCENT_CYAN,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
