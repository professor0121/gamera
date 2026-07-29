import React, { useState, useEffect } from 'react';
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

import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';
import { checkWinner, findBestMove } from './_engine';
import { AdInterstitial } from '@/components/AdInterstitial';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GameMode = 'AI' | 'PLAYER';
type Difficulty = 'EASY' | 'IMPOSSIBLE';
type SymbolType = 'X' | 'O';
type ScreenState = 'SETUP' | 'PLAYING' | 'GAME_OVER';

export default function TicTacToeScreen() {
  const router = useRouter();

  // Screen State
  const [screenState, setScreenState] = useState<ScreenState>('SETUP');
  const [showAd, setShowAd] = useState(false);

  // Game Settings Configuration
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [difficulty, setDifficulty] = useState<Difficulty>('IMPOSSIBLE');
  const [playerSymbol, setPlayerSymbol] = useState<SymbolType>('X');
  
  // Game Play states
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<SymbolType>('X');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Winner states
  const [winner, setWinner] = useState<string | null>(null); // 'X', 'O', 'DRAW', or null
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);

  // Score keeping during active session
  const [scores, setScores] = useState({
    player1: 0, // In AI mode: User
    player2: 0, // In AI mode: AI
    ties: 0,
  });

  const aiSymbol: SymbolType = playerSymbol === 'X' ? 'O' : 'X';

  // Trigger AI move if it's the AI's turn
  useEffect(() => {
    if (screenState !== 'PLAYING' || gameMode !== 'AI' || currentTurn !== aiSymbol || winner) {
      return;
    }

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const bestMove = findBestMove(board, aiSymbol, playerSymbol, difficulty);
      if (bestMove !== -1) {
        makeMove(bestMove, aiSymbol);
      }
      setIsAiThinking(false);
    }, 600); // 600ms latency to simulate "thinking" for a professional feel

    return () => clearTimeout(timer);
  }, [currentTurn, board, screenState, gameMode]);

  // Execute a slot move
  const makeMove = (index: number, symbol: SymbolType) => {
    const nextBoard = [...board];
    nextBoard[index] = symbol;
    setBoard(nextBoard);

    // Check winner
    const check = checkWinner(nextBoard);
    if (check.winner) {
      setWinner(check.winner);
      setWinningCombo(check.combo);
      
      // Update scores
      setScores(prev => {
        if (check.winner === 'DRAW') {
          return { ...prev, ties: prev.ties + 1 };
        }
        if (gameMode === 'AI') {
          return check.winner === playerSymbol
            ? { ...prev, player1: prev.player1 + 1 }
            : { ...prev, player2: prev.player2 + 1 };
        } else {
          return check.winner === 'X'
            ? { ...prev, player1: prev.player1 + 1 }
            : { ...prev, player2: prev.player2 + 1 };
        }
      });
      
      setScreenState('GAME_OVER');
      return;
    }

    // Switch turn
    setCurrentTurn(symbol === 'X' ? 'O' : 'X');
  };

  // Handler for grid cell click
  const handleCellPress = (index: number) => {
    if (screenState !== 'PLAYING' || board[index] !== null || isAiThinking || winner) {
      return;
    }

    // In AI mode, verify it's the player's turn
    if (gameMode === 'AI' && currentTurn !== playerSymbol) {
      return;
    }

    makeMove(index, currentTurn);
  };

  const handleStartGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCombo(null);
    setCurrentTurn('X'); // X always plays first
    setShowAd(true);
  };

  const handleAdClose = () => {
    setShowAd(false);
    setScreenState('PLAYING');
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCombo(null);
    setCurrentTurn('X');
    setScreenState('PLAYING');
  };

  const handleResetScores = () => {
    setScores({ player1: 0, player2: 0, ties: 0 });
  };

  const handleExitToSetup = () => {
    setScreenState('SETUP');
    handleResetScores();
  };

  const getStatusText = () => {
    if (isAiThinking) {
      return 'AI IS COGNITING...';
    }
    
    if (gameMode === 'AI') {
      return currentTurn === playerSymbol ? 'YOUR TURN' : 'AI TURN';
    } else {
      return currentTurn === 'X' ? 'PLAYER 1 TURN (X)' : 'PLAYER 2 TURN (O)';
    }
  };

  const getOutcomeText = () => {
    if (winner === 'DRAW') {
      return 'GRID STALEMATE';
    }

    if (gameMode === 'AI') {
      return winner === playerSymbol ? 'SYSTEM CAPTURED! YOU WIN!' : 'AI VICTORIOUS';
    } else {
      return winner === 'X' ? 'PLAYER 1 VICTORIOUS' : 'PLAYER 2 VICTORIOUS';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => screenState === 'SETUP' ? router.back() : handleExitToSetup()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>NEON GRID</Text>
        <TouchableOpacity 
          style={[styles.resetScoreBtn, screenState !== 'PLAYING' && { opacity: 0 }]} 
          onPress={handleResetScores}
          disabled={screenState !== 'PLAYING'}
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      {/* ========================================================================= */}
      {/* 1. SETUP SCREEN */}
      {/* ========================================================================= */}
      {screenState === 'SETUP' && (
        <ScrollView contentContainerStyle={styles.setupContainer} showsVerticalScrollIndicator={false}>
          {/* Decorative Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.radarOuterRing}>
              <View style={styles.radarInnerRing} />
              <Ionicons name="grid-outline" size={56} color={COLORS.PRIMARY} />
            </View>
            <Text style={[styles.logoText, { fontFamily: Fonts.rounded }]}>NEON BATTLE</Text>
            <Text style={[styles.logoSubtext, { fontFamily: Fonts.sans }]}>COGNITIVE GRID STAGE</Text>
          </View>

          {/* Mode Selector */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>SELECT OPERATION MODE</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity 
                style={[styles.toggleBtn, gameMode === 'AI' && { backgroundColor: COLORS.PRIMARY }]} 
                onPress={() => setGameMode('AI')}
              >
                <Ionicons name="hardware-chip-outline" size={18} color={gameMode === 'AI' ? COLORS.BACKGROUND : COLORS.PRIMARY} />
                <Text style={[styles.toggleText, { fontFamily: Fonts.rounded, color: gameMode === 'AI' ? COLORS.BACKGROUND : COLORS.TEXT_PRIMARY }]}>VERSUS AI</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, gameMode === 'PLAYER' && { backgroundColor: COLORS.PRIMARY }]} 
                onPress={() => setGameMode('PLAYER')}
              >
                <Ionicons name="people-outline" size={18} color={gameMode === 'PLAYER' ? COLORS.BACKGROUND : COLORS.PRIMARY} />
                <Text style={[styles.toggleText, { fontFamily: Fonts.rounded, color: gameMode === 'PLAYER' ? COLORS.BACKGROUND : COLORS.TEXT_PRIMARY }]}>PASS & PLAY</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Versus AI Configuration */}
          {gameMode === 'AI' && (
            <>
              {/* Difficulty Select */}
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>AI ALGORITHM COMPLEXITY</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity 
                    style={[
                      styles.toggleBtn, 
                      difficulty === 'EASY' && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                    ]} 
                    onPress={() => setDifficulty('EASY')}
                  >
                    <Text style={[
                      styles.toggleText, 
                      { fontFamily: Fonts.rounded, color: difficulty === 'EASY' ? COLORS.BACKGROUND : '#4CAF50' }
                    ]}>EASY MODE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.toggleBtn, 
                      difficulty === 'IMPOSSIBLE' && { backgroundColor: '#FF3B30', borderColor: '#FF3B30' }
                    ]} 
                    onPress={() => setDifficulty('IMPOSSIBLE')}
                  >
                    <Text style={[
                      styles.toggleText, 
                      { fontFamily: Fonts.rounded, color: difficulty === 'IMPOSSIBLE' ? COLORS.BACKGROUND : '#FF3B30' }
                    ]}>IMPOSSIBLE (MINIMAX)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Symbol Select */}
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>CHOOSE YOUR MATRIX NODE</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, playerSymbol === 'X' && { backgroundColor: COLORS.ACCENT_CYAN, borderColor: COLORS.ACCENT_CYAN }]} 
                    onPress={() => setPlayerSymbol('X')}
                  >
                    <Text style={[
                      styles.toggleText, 
                      { fontFamily: Fonts.rounded, color: playerSymbol === 'X' ? COLORS.BACKGROUND : COLORS.ACCENT_CYAN }
                    ]}>PLAY AS X</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, playerSymbol === 'O' && { backgroundColor: COLORS.GRADIENT_END, borderColor: COLORS.GRADIENT_END }]} 
                    onPress={() => setPlayerSymbol('O')}
                  >
                    <Text style={[
                      styles.toggleText, 
                      { fontFamily: Fonts.rounded, color: playerSymbol === 'O' ? COLORS.BACKGROUND : COLORS.GRADIENT_END }
                    ]}>PLAY AS O</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Launch Button */}
          <TouchableOpacity style={[styles.launchBtn, { shadowColor: COLORS.PRIMARY }]} onPress={handleStartGame}>
            <Text style={[styles.launchBtnText, { fontFamily: Fonts.rounded }]}>START BATTLE GRID</Text>
            <Ionicons name="power-outline" size={20} color={COLORS.BACKGROUND} style={styles.btnIcon} />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ========================================================================= */}
      {/* 2. PLAYING SCREEN */}
      {/* ========================================================================= */}
      {screenState === 'PLAYING' && (
        <View style={styles.playingContainer}>
          {/* Mode Info Bar */}
          <View style={styles.infoBar}>
            <Text style={[styles.infoBarText, { fontFamily: Fonts.mono }]}>
              {gameMode === 'AI' ? `VERSUS AI • ${difficulty}` : 'LOCAL CO-OP'}
            </Text>
          </View>

          {/* Turn Indicator */}
          <View style={styles.turnCard}>
            <Text style={[
              styles.turnText, 
              { 
                fontFamily: Fonts.rounded,
                color: currentTurn === 'X' ? COLORS.ACCENT_CYAN : COLORS.GRADIENT_END 
              }
            ]}>
              {getStatusText()}
            </Text>
          </View>

          {/* Grid Layout */}
          <View style={styles.gridContainer}>
            <View style={styles.boardGrid}>
              {board.map((cell, index) => {
                const isWinningCell = winningCombo?.includes(index);
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.cell,
                      index % 3 !== 2 && styles.borderRight,
                      index < 6 && styles.borderBottom,
                      isWinningCell && { backgroundColor: cell === 'X' ? 'rgba(0, 245, 255, 0.15)' : 'rgba(236, 72, 153, 0.15)' }
                    ]}
                    onPress={() => handleCellPress(index)}
                    activeOpacity={0.7}
                  >
                    {cell === 'X' && (
                      <Ionicons 
                        name="close-outline" 
                        size={64} 
                        color={COLORS.ACCENT_CYAN} 
                        style={styles.cellIcon}
                      />
                    )}
                    {cell === 'O' && (
                      <Ionicons 
                        name="ellipse-outline" 
                        size={52} 
                        color={COLORS.GRADIENT_END} 
                        style={styles.cellIcon}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Scoreboard */}
          <View style={styles.scoreBoardCard}>
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreLabel, { fontFamily: Fonts.sans }]}>
                {gameMode === 'AI' ? (playerSymbol === 'X' ? 'YOU (X)' : 'YOU (O)') : 'P1 (X)'}
              </Text>
              <Text style={[styles.scoreValue, { fontFamily: Fonts.mono, color: COLORS.ACCENT_CYAN }]}>
                {String(scores.player1).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreLabel, { fontFamily: Fonts.sans }]}>TIES</Text>
              <Text style={[styles.scoreValue, { fontFamily: Fonts.mono, color: COLORS.TEXT_MUTED }]}>
                {String(scores.ties).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreLabel, { fontFamily: Fonts.sans }]}>
                {gameMode === 'AI' ? (aiSymbol === 'X' ? 'AI (X)' : 'AI (O)') : 'P2 (O)'}
              </Text>
              <Text style={[styles.scoreValue, { fontFamily: Fonts.mono, color: COLORS.GRADIENT_END }]}>
                {String(scores.player2).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME OVER OVERLAY */}
      {/* ========================================================================= */}
      {screenState === 'GAME_OVER' && (
        <View style={styles.overlayContainer}>
          <View style={styles.glassPanel}>
            <Text style={[
              styles.outcomeTitle, 
              { 
                fontFamily: Fonts.rounded,
                color: winner === 'DRAW' ? COLORS.TEXT_PRIMARY : (winner === 'X' ? COLORS.ACCENT_CYAN : COLORS.GRADIENT_END)
              }
            ]}>
              {getOutcomeText()}
            </Text>

            {/* Winning Path Indicator */}
            {winner !== 'DRAW' && (
              <View style={styles.iconScope}>
                <Ionicons 
                  name={winner === 'X' ? 'close-outline' : 'ellipse-outline'} 
                  size={64} 
                  color={winner === 'X' ? COLORS.ACCENT_CYAN : COLORS.GRADIENT_END} 
                />
              </View>
            )}

            {/* Scores Table */}
            <View style={styles.sessionScoresCard}>
              <View style={styles.sessionRow}>
                <Text style={[styles.sessionLabel, { fontFamily: Fonts.sans }]}>
                  {gameMode === 'AI' ? 'YOUR SCORE' : 'PLAYER 1 (X)'}
                </Text>
                <Text style={[styles.sessionValue, { fontFamily: Fonts.mono, color: COLORS.ACCENT_CYAN }]}>
                  {scores.player1}
                </Text>
              </View>
              <View style={styles.sessionDivider} />
              <View style={styles.sessionRow}>
                <Text style={[styles.sessionLabel, { fontFamily: Fonts.sans }]}>TIES</Text>
                <Text style={[styles.sessionValue, { fontFamily: Fonts.mono }]}>{scores.ties}</Text>
              </View>
              <View style={styles.sessionDivider} />
              <View style={styles.sessionRow}>
                <Text style={[styles.sessionLabel, { fontFamily: Fonts.sans }]}>
                  {gameMode === 'AI' ? 'AI SCORE' : 'PLAYER 2 (O)'}
                </Text>
                <Text style={[styles.sessionValue, { fontFamily: Fonts.mono, color: COLORS.GRADIENT_END }]}>
                  {scores.player2}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: COLORS.PRIMARY }]} onPress={handlePlayAgain}>
              <Text style={[styles.primaryButtonText, { fontFamily: Fonts.rounded }]}>PLAY AGAIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleExitToSetup}>
              <Text style={[styles.secondaryButtonText, { fontFamily: Fonts.rounded }]}>CHANGE SETTINGS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
              <Text style={[styles.exitButtonText, { fontFamily: Fonts.rounded }]}>QUIT GRID</Text>
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
  resetScoreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Setup Styles
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
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.GLASS_BORDER,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: 'bold',
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

  // Playing Styles
  playingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 12,
  },
  infoBar: {
    alignItems: 'center',
    marginBottom: 12,
  },
  infoBarText: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  turnCard: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: 24,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: 1.5,
    borderRightColor: COLORS.GLASS_BORDER,
  },
  borderBottom: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.GLASS_BORDER,
  },
  cellIcon: {
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scoreBoardCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 24,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.GLASS_BORDER,
  },

  // Game Over Overlay Styles
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
    marginBottom: 24,
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
