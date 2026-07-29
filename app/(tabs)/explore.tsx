import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>ARCADE GUIDE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerGlow} />
          <Ionicons name="game-controller-outline" size={40} color={COLORS.PRIMARY} style={styles.bannerIcon} />
          <Text style={[styles.bannerTitle, { fontFamily: Fonts.rounded }]}>VIVID OPERATIONS</Text>
          <Text style={[styles.bannerSubtitle, { fontFamily: Fonts.sans }]}>SYSTEM DIAGNOSTICS & CONTROLS</Text>
        </View>

        {/* Section: Controls Guide */}
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}>GAME DIRECTIVES</Text>

        {/* Flappy Neon Manual Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="rocket-outline" size={24} color={COLORS.ACCENT_CYAN} />
              <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>FLAPPY NEON</Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: COLORS.ACCENT_CYAN }]}>
              <Text style={[styles.statusText, { color: COLORS.ACCENT_CYAN, fontFamily: Fonts.mono }]}>ONLINE</Text>
            </View>
          </View>
          
          <Text style={[styles.cardDescription, { fontFamily: Fonts.sans }]}>
            Control a glowing vector bird through pulsing cyber pipelines. Impulse pushes counteract system gravity.
          </Text>

          <View style={styles.controlGrid}>
            <View style={styles.controlBox}>
              <Text style={[styles.controlKey, { color: COLORS.ACCENT_CYAN, fontFamily: Fonts.mono }]}>TAP SCREEN</Text>
              <Text style={[styles.controlVal, { fontFamily: Fonts.sans }]}>Flap upward</Text>
            </View>
            <View style={styles.controlBox}>
              <Text style={[styles.controlKey, { color: COLORS.TEXT_MUTED, fontFamily: Fonts.mono }]}>RELEASE</Text>
              <Text style={[styles.controlVal, { fontFamily: Fonts.sans }]}>Dive downward</Text>
            </View>
          </View>
        </View>

        {/* Tic Tac Toe Manual Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="grid-outline" size={24} color={COLORS.TERTIARY} />
              <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>TIC TAC TOE</Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: COLORS.TEXT_MUTED }]}>
              <Text style={[styles.statusText, { color: COLORS.TEXT_MUTED, fontFamily: Fonts.mono }]}>INACTIVE</Text>
            </View>
          </View>
          
          <Text style={[styles.cardDescription, { fontFamily: Fonts.sans }]}>
            Engage in cognitive grid warfare on a neon layout. Challenge smart predictive system logic. Defend your nodes and capture lines.
          </Text>

          <View style={styles.controlGrid}>
            <View style={styles.controlBox}>
              <Text style={[styles.controlKey, { color: COLORS.TERTIARY, fontFamily: Fonts.mono }]}>TAP SLOT</Text>
              <Text style={[styles.controlVal, { fontFamily: Fonts.sans }]}>Place neon token</Text>
            </View>
            <View style={styles.controlBox}>
              <Text style={[styles.controlKey, { color: COLORS.TEXT_MUTED, fontFamily: Fonts.mono }]}>MATCH 3</Text>
              <Text style={[styles.controlVal, { fontFamily: Fonts.sans }]}>Capture node sector</Text>
            </View>
          </View>
        </View>

        {/* Section: Tech Specs */}
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}>SYSTEM HARDWARE SPECS</Text>

        <View style={styles.specCard}>
          <View style={styles.specRow}>
            <View style={styles.specLabelCol}>
              <Ionicons name="hardware-chip-outline" size={18} color={COLORS.PRIMARY} />
              <Text style={[styles.specName, { fontFamily: Fonts.sans }]}>Core Physics Engine</Text>
            </View>
            <Text style={[styles.specValue, { color: COLORS.PRIMARY, fontFamily: Fonts.mono }]}>Matter.js 2D Rigid</Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specRow}>
            <View style={styles.specLabelCol}>
              <Ionicons name="speedometer-outline" size={18} color={COLORS.PRIMARY} />
              <Text style={[styles.specName, { fontFamily: Fonts.sans }]}>Rendering Framerate</Text>
            </View>
            <Text style={[styles.specValue, { color: COLORS.PRIMARY, fontFamily: Fonts.mono }]}>60 FPS Refresh</Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specRow}>
            <View style={styles.specLabelCol}>
              <Ionicons name="git-branch-outline" size={18} color={COLORS.PRIMARY} />
              <Text style={[styles.specName, { fontFamily: Fonts.sans }]}>Routing Node</Text>
            </View>
            <Text style={[styles.specValue, { color: COLORS.PRIMARY, fontFamily: Fonts.mono }]}>Expo Router v54</Text>
          </View>

          <View style={styles.specDivider} />

          <View style={styles.specRow}>
            <View style={styles.specLabelCol}>
              <Ionicons name="save-outline" size={18} color={COLORS.PRIMARY} />
              <Text style={[styles.specName, { fontFamily: Fonts.sans }]}>State Cache Store</Text>
            </View>
            <Text style={[styles.specValue, { color: COLORS.PRIMARY, fontFamily: Fonts.mono }]}>Zustand Clients</Text>
          </View>
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
  banner: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: COLORS.SURFACE_CONTAINER,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 32,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  bannerGlow: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(207, 188, 255, 0.05)',
    filter: 'blur(30px)',
  },
  bannerIcon: {
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  bannerSubtitle: {
    fontSize: 9,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 24,
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
    letterSpacing: 1.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    lineHeight: 18,
    marginBottom: 16,
  },
  controlGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  controlBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  controlKey: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  controlVal: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  specCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  specLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specName: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  specDivider: {
    height: 1,
    backgroundColor: COLORS.GLASS_BORDER,
    marginVertical: 12,
  },
});
