import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';
import { GRID_SIZE, DIRECTIONS, spawnFood, checkCollision, Point } from './_engine';
import { AdInterstitial } from '@/components/AdInterstitial';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 64) / GRID_SIZE);

type GameState = 'SETUP' | 'PLAYING' | 'GAME_OVER';

const INITIAL_SNAKE: Point[] = [
  { x: 7, y: 7 },
  { x: 7, y: 8 },
  { x: 7, y: 9 },
];

const INITIAL_SPEED = 180;
const MIN_SPEED = 70;
const SPEED_DECREMENT = 6;
const HIGH_SCORE_KEY = '@snake_neon_high_score_v1';

export default function SnakeScreen() {
  const router = useRouter();

  // Screens and Ads States
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [showAd, setShowAd] = useState(false);

  // Snake Play States
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 7, y: 4 });
  const [direction, setDirection] = useState<Point>(DIRECTIONS.UP);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Direction queue to prevent 180 degree turns in rapid taps
  const nextDirection = useRef<Point>(DIRECTIONS.UP);

  // Load high score
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const stored = await AsyncStorage.getItem(HIGH_SCORE_KEY);
        if (stored !== null) {
          setHighScore(parseInt(stored, 10));
        }
      } catch (e) {
        console.error('Failed to load high score', e);
      }
    };
    loadHighScore();
  }, []);

  // Update high score
  const updateHighScore = async (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        await AsyncStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
      } catch (e) {
        console.error('Failed to save high score', e);
      }
    }
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const gameInterval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameInterval);
  }, [gameState, snake, direction, speed]);

  const moveSnake = () => {
    // Lock direction to the queue
    setDirection(nextDirection.current);
    const dir = nextDirection.current;

    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Check collision
    if (checkCollision(newHead, snake)) {
      setGameState('GAME_OVER');
      updateHighScore(score);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check if snake ate the food
    if (newHead.x === food.x && newHead.y === food.y) {
      const nextScore = score + 1;
      setScore(nextScore);
      setFood(spawnFood(newSnake));
      setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_DECREMENT));
    } else {
      // Remove tail segment if food is not eaten
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // Queue direction changes and prevent immediate 180-degree reverses
  const changeDirection = (newDir: Point) => {
    if (gameState !== 'PLAYING') return;

    const currentDir = direction;

    // Prevent moving straight backward
    if (newDir.x !== 0 && currentDir.x !== 0) return;
    if (newDir.y !== 0 && currentDir.y !== 0) return;

    nextDirection.current = newDir;
  };

  const handleStartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 7, y: 4 });
    setDirection(DIRECTIONS.UP);
    nextDirection.current = DIRECTIONS.UP;
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setShowAd(true);
  };

  const handleAdClose = () => {
    setShowAd(false);
    setGameState('PLAYING');
  };

  const handlePlayAgain = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 7, y: 4 });
    setDirection(DIRECTIONS.UP);
    nextDirection.current = DIRECTIONS.UP;
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setGameState('PLAYING');
  };

  // Helper to check if a cell contains snake or food
  const getCellType = (x: number, y: number) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    if (isHead) return 'HEAD';

    const isBody = snake.some((segment, idx) => idx > 0 && segment.x === x && segment.y === y);
    if (isBody) return 'BODY';

    const isFood = food.x === x && food.y === y;
    if (isFood) return 'FOOD';

    return 'EMPTY';
  };

  // Render Grid Cells
  const renderCells = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const type = getCellType(x, y);
        cells.push(
          <View 
            key={`${x}-${y}`} 
            style={[
              styles.cell,
              type === 'HEAD' && [styles.cellHead, { backgroundColor: COLORS.PRIMARY }],
              type === 'BODY' && [styles.cellBody, { backgroundColor: 'rgba(207, 188, 255, 0.65)' }],
              type === 'FOOD' && [styles.cellFood, { backgroundColor: COLORS.GRADIENT_END }],
            ]}
          />
        );
      }
    }
    return cells;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => gameState === 'SETUP' ? router.back() : setGameState('SETUP')}>
          <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>CYBER SNAKE</Text>
        <View style={styles.spacer} />
      </View>

      {/* ========================================================================= */}
      {/* 1. SETUP SCREEN */}
      {/* ========================================================================= */}
      {gameState === 'SETUP' && (
        <ScrollView contentContainerStyle={styles.setupContainer} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.radarOuterRing}>
              <View style={styles.radarInnerRing} />
              <Ionicons name="git-commit-outline" size={56} color={COLORS.PRIMARY} />
            </View>
            <Text style={[styles.logoText, { fontFamily: Fonts.rounded }]}>CYBER SNAKE</Text>
            <Text style={[styles.logoSubtext, { fontFamily: Fonts.sans }]}>DATA NODES INFILTRATION</Text>
          </View>

          {/* Description Card */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>MISSION PARAMETERS</Text>
            <Text style={[styles.cardDesc, { fontFamily: Fonts.sans }]}>
              Navigate the glowing cyber-snake to harvest data packets. Growing lengths increase tick acceleration. Avoid self-collision and system borders!
            </Text>
          </View>

          {/* Score Card */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded, marginBottom: 12 }]}>SYSTEM STATISTICS</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="trophy" size={20} color={COLORS.TERTIARY} />
                <Text style={[styles.statVal, { fontFamily: Fonts.mono, color: COLORS.TERTIARY }]}>
                  {String(highScore).padStart(2, '0')}
                </Text>
                <Text style={[styles.statLabel, { fontFamily: Fonts.sans }]}>SESSION BEST</Text>
              </View>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.launchBtn} onPress={handleStartGame}>
            <Text style={[styles.launchBtnText, { fontFamily: Fonts.rounded }]}>START DATA RUN</Text>
            <Ionicons name="power" size={18} color={COLORS.BACKGROUND} style={styles.btnIcon} />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* 2. PLAYING SCREEN */}
      {/* ========================================================================= */}
      {gameState === 'PLAYING' && (
        <View style={styles.playingContainer}>
          {/* Score Bar */}
          <View style={styles.scoreBar}>
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreLabelText, { fontFamily: Fonts.sans }]}>DATA SEGMENTS</Text>
              <Text style={[styles.scoreValText, { fontFamily: Fonts.mono, color: COLORS.PRIMARY }]}>
                {String(score).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreLabelText, { fontFamily: Fonts.sans }]}>SYSTEM BEST</Text>
              <Text style={[styles.scoreValText, { fontFamily: Fonts.mono, color: COLORS.TERTIARY }]}>
                {String(highScore).padStart(2, '0')}
              </Text>
            </View>
          </View>

          {/* Grid Board */}
          <View style={styles.gridContainer}>
            <View style={styles.boardGrid}>
              {renderCells()}
            </View>
          </View>

          {/* D-Pad Controller */}
          <View style={styles.dpadContainer}>
            {/* Row 1 */}
            <View style={styles.dpadRow}>
              <View style={styles.dpadSpacer} />
              <TouchableOpacity 
                style={styles.dpadBtn} 
                onPress={() => changeDirection(DIRECTIONS.UP)}
              >
                <Ionicons name="chevron-up" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
              <View style={styles.dpadSpacer} />
            </View>
            
            {/* Row 2 */}
            <View style={styles.dpadRow}>
              <TouchableOpacity 
                style={styles.dpadBtn} 
                onPress={() => changeDirection(DIRECTIONS.LEFT)}
              >
                <Ionicons name="chevron-back" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
              <View style={styles.dpadCenter}>
                <View style={styles.dpadCore} />
              </View>
              <TouchableOpacity 
                style={styles.dpadBtn} 
                onPress={() => changeDirection(DIRECTIONS.RIGHT)}
              >
                <Ionicons name="chevron-forward" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {/* Row 3 */}
            <View style={styles.dpadRow}>
              <View style={styles.dpadSpacer} />
              <TouchableOpacity 
                style={styles.dpadBtn} 
                onPress={() => changeDirection(DIRECTIONS.DOWN)}
              >
                <Ionicons name="chevron-down" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
              <View style={styles.dpadSpacer} />
            </View>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME OVER OVERLAY */}
      {/* ========================================================================= */}
      {gameState === 'GAME_OVER' && (
        <View style={styles.overlayContainer}>
          <View style={styles.glassPanel}>
            <Text style={[styles.outcomeTitle, { fontFamily: Fonts.rounded, color: COLORS.GRADIENT_END }]}>
              SYSTEM COLLAPSE
            </Text>

            <View style={styles.iconScope}>
              <Ionicons name="skull-outline" size={64} color={COLORS.GRADIENT_END} />
            </View>

            {/* Scores Table */}
            <View style={styles.sessionScoresCard}>
              <View style={styles.sessionRow}>
                <Text style={[styles.sessionLabel, { fontFamily: Fonts.sans }]}>DATA HARVESTED</Text>
                <Text style={[styles.sessionValue, { fontFamily: Fonts.mono, color: COLORS.PRIMARY }]}>
                  {score}
                </Text>
              </View>
              <View style={styles.sessionDivider} />
              <View style={styles.sessionRow}>
                <Text style={[styles.sessionLabel, { fontFamily: Fonts.sans }]}>SYSTEM BEST</Text>
                <Text style={[styles.sessionValue, { fontFamily: Fonts.mono, color: COLORS.TERTIARY }]}>
                  {highScore}
                </Text>
              </View>
            </View>

            {score >= highScore && score > 0 && (
              <View style={styles.newBestBadge}>
                <Text style={[styles.newBestText, { fontFamily: Fonts.mono }]}>NEW RECORD SECURED</Text>
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: COLORS.PRIMARY }]} onPress={handlePlayAgain}>
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>PLAY AGAIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGameState('SETUP')}>
              <Text style={[styles.secondaryButtonText, { fontFamily: Fonts.rounded }]}>RUN CONFIG</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
              <Text style={[styles.exitButtonText, { fontFamily: Fonts.rounded }]}>QUIT HUB</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ad Interstitial Component */}
      <AdInterstitial visible={showAd} onClose={handleAdClose} />
    </SafeAreaView>
  );
}

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
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 16,
    borderBottomColor: COLORS.GLASS_BORDER,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
  },
  spacer: {
    width: 40,
  },

  // Setup Screen
  setupContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  radarOuterRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  radarInnerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
    opacity: 0.4,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 10,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  launchBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  launchBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1.5,
  },
  btnIcon: {
    marginLeft: 6,
  },

  // Playing Screen
  playingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 12,
  },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreValText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  scoreLabelText: {
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardGrid: {
    width: SCREEN_WIDTH - 64,
    height: SCREEN_WIDTH - 64,
    maxWidth: 340,
    maxHeight: 340,
    backgroundColor: '#0F0E12',
    borderRadius: 20,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: 1,
  },
  cell: {
    width: `${100 / GRID_SIZE}%`,
    height: `${100 / GRID_SIZE}%`,
    borderColor: 'rgba(255, 255, 255, 0.015)',
    borderWidth: 0.5,
    borderRadius: 2,
  },
  cellHead: {
    borderRadius: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  cellBody: {
    borderRadius: 3,
  },
  cellFood: {
    borderRadius: 6,
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },

  // Dpad Controller
  dpadContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  dpadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dpadBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  dpadSpacer: {
    width: 60,
    height: 60,
  },
  dpadCenter: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Game Over
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    zIndex: 100,
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
  outcomeTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 24,
  },
  iconScope: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: COLORS.GLASS_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sessionScoresCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sessionLabel: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
  },
  sessionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: COLORS.GLASS_BORDER,
    marginVertical: 6,
  },
  newBestBadge: {
    backgroundColor: 'rgba(231, 195, 101, 0.1)',
    borderColor: 'rgba(231, 195, 101, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  newBestText: {
    fontSize: 11,
    color: COLORS.TERTIARY,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  exitButton: {
    width: '100%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
    letterSpacing: 0.5,
  },
});
