import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';

export default function SettingsScreen() {
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  // Mocked state toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>SETTINGS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Audio Preferences Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>AUDIO PREFERENCES</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Ionicons name="volume-medium-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.settingLabel, { fontFamily: Fonts.sans }]}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#333', true: COLORS.PRIMARY }}
              thumbColor={soundEnabled ? '#FFF' : '#aaa'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Ionicons name="musical-notes-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.settingLabel, { fontFamily: Fonts.sans }]}>Background Music</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: '#333', true: COLORS.PRIMARY }}
              thumbColor={musicEnabled ? '#FFF' : '#aaa'}
            />
          </View>
        </View>

        {/* Haptic & Theme Preferences Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>SYSTEM PREFERENCES</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelCol}>
              <Ionicons name="phone-portrait-outline" size={20} color={COLORS.ACCENT_CYAN} />
              <Text style={[styles.settingLabel, { fontFamily: Fonts.sans }]}>Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: '#333', true: COLORS.ACCENT_CYAN }}
              thumbColor={hapticsEnabled ? '#FFF' : '#aaa'}
            />
          </View>
        </View>

        {/* Info & Support Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: Fonts.rounded }]}>ABOUT & TUTORIALS</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={resetOnboarding}>
            <View style={styles.actionButtonLeft}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.TERTIARY} />
              <Text style={[styles.actionButtonText, { fontFamily: Fonts.sans }]}>Replay Onboarding</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        {/* System Credits */}
        <View style={styles.creditsContainer}>
          <Text style={[styles.creditsText, { fontFamily: Fonts.mono }]}>VIVID ARCADE HUB V1.0.0</Text>
          <Text style={[styles.creditsSubtext, { fontFamily: Fonts.sans }]}>Build: 2026.07.29</Text>
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
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GLASS_BORDER,
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
    fontWeight: '500',
  },
  creditsContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  creditsText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  creditsSubtext: {
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});
