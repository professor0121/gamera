import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS, STRINGS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';

export default function StatsScreen() {
  const [highScore, setHighScore] = useState(0);

  // Fetch the high score dynamically on screen focus
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

  // Calculate Rank based on score
  const getRank = (score: number) => {
    if (score === 0) return 'NOVICE';
    if (score < 5) return 'RECRUIT';
    if (score < 15) return 'GRID RUNNER';
    if (score < 30) return 'CYBER MASTER';
    return 'ARCADE LEGEND';
  };

  const getRankColor = (score: number) => {
    if (score === 0) return COLORS.TEXT_MUTED;
    if (score < 5) return COLORS.PRIMARY;
    if (score < 15) return COLORS.ACCENT_CYAN;
    if (score < 30) return COLORS.GRADIENT_END;
    return COLORS.TERTIARY;
  };

  // Mock global leaderboard, inserting user dynamically
  const leaderboardData = [
    { name: 'CYBER_PUNKER', score: 99, rank: 1, isUser: false },
    { name: 'GRID_RUNNER', score: 85, rank: 2, isUser: false },
    { name: 'NEON_FLAPPER', score: 64, rank: 3, isUser: false },
    { name: 'PLAYER_ONE (YOU)', score: highScore, rank: 4, isUser: true },
    { name: 'RETRO_KID', score: 12, rank: 5, isUser: false },
  ].sort((a, b) => b.score - a.score);

  // Recalculate rank numbering after sort
  const sortedLeaderboard = leaderboardData.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>ARCADE STATS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardGlow} />
          <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>PERFORMANCE INDEX</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="trophy" size={28} color={COLORS.TERTIARY} />
              <Text style={[styles.statValue, { fontFamily: Fonts.mono }]}>{String(highScore).padStart(2, '0')}</Text>
              <Text style={[styles.statLabel, { fontFamily: Fonts.sans }]}>HIGH SCORE</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Ionicons name="ribbon" size={28} color={getRankColor(highScore)} />
              <Text style={[styles.statValue, { fontSize: 16, marginTop: 12, color: getRankColor(highScore), fontFamily: Fonts.rounded }]}>
                {getRank(highScore)}
              </Text>
              <Text style={[styles.statLabel, { fontFamily: Fonts.sans }]}>SYS RANK</Text>
            </View>
          </View>
        </View>

        {/* Global Leaderboard Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded, marginBottom: 16 }]}>GLOBAL LEADERBOARD</Text>
          
          {sortedLeaderboard.map((player) => (
            <View 
              key={player.name} 
              style={[
                styles.leaderboardRow, 
                player.isUser && { backgroundColor: 'rgba(207, 188, 255, 0.08)', borderColor: COLORS.PRIMARY }
              ]}
            >
              <View style={styles.leaderboardLeft}>
                <Text style={[
                  styles.leaderboardRank, 
                  { fontFamily: Fonts.mono, color: player.rank === 1 ? COLORS.TERTIARY : COLORS.TEXT_MUTED }
                ]}>
                  {String(player.rank).padStart(2, '0')}
                </Text>
                <Text style={[
                  styles.leaderboardName, 
                  { fontFamily: Fonts.sans, color: player.isUser ? COLORS.PRIMARY : COLORS.TEXT_PRIMARY }
                ]}>
                  {player.name}
                </Text>
              </View>
              <Text style={[
                styles.leaderboardScore, 
                { fontFamily: Fonts.mono, color: player.isUser ? COLORS.PRIMARY : COLORS.TEXT_PRIMARY }
              ]}>
                {String(player.score).padStart(2, '0')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 16,
    backgroundColor: COLORS.SURFACE,
    borderBottomColor: COLORS.GLASS_BORDER,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(231, 195, 101, 0.06)',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.GLASS_BORDER,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardRank: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 16,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: '600',
  },
  leaderboardScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
