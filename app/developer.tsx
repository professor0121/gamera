import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, DEV_CONSTANTS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkillBarProps {
  label: string;
  percentage: number;
  color: string;
}

function SkillBar({ label, percentage, color }: SkillBarProps) {
  return (
    <View style={styles.skillContainer}>
      <View style={styles.skillHeader}>
        <Text style={[styles.skillLabel, { fontFamily: Fonts.sans }]}>{label}</Text>
        <Text style={[styles.skillPercentage, { color, fontFamily: Fonts.mono }]}>{percentage}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function DeveloperScreen() {
  const router = useRouter();

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.rounded }]}>DEV PROFILE</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.glowBloom} />
          
          {/* Avatar Rings */}
          <View style={styles.avatarScope}>
            <View style={styles.avatarRingOuter} />
            <View style={styles.avatarRingInner} />
            <View style={styles.avatarIconWrapper}>
              <Ionicons name="code-slash" size={48} color={COLORS.PRIMARY} />
            </View>
          </View>

          {/* Dev Info */}
          <Text style={[styles.devAlias, { fontFamily: Fonts.rounded }]}>{DEV_CONSTANTS.ALIAS}</Text>
          <Text style={[styles.devTitle, { fontFamily: Fonts.mono }]}>{DEV_CONSTANTS.ROLE}</Text>
          <Text style={[styles.devBio, { fontFamily: Fonts.sans }]}>
            {DEV_CONSTANTS.BIO}
          </Text>
        </View>

        {/* Section: Diagnostic Skills */}
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}>SYSTEM COMPETENCY</Text>

        <View style={styles.card}>
          {DEV_CONSTANTS.SKILLS.map((skill) => (
            <SkillBar
              key={skill.label}
              label={skill.label}
              percentage={skill.percentage}
              color={skill.color}
            />
          ))}
        </View>

        {/* Section: Matrix Communications */}
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.rounded }]}>MATRIX CHANNELS</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.channelRow} onPress={() => handleOpenURL(DEV_CONSTANTS.GITHUB_URL)}>
            <View style={styles.channelLeft}>
              <Ionicons name="logo-github" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.channelText, { fontFamily: Fonts.sans }]}>GitHub Repository</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.channelRow} onPress={() => handleOpenURL(DEV_CONSTANTS.LINKEDIN_URL)}>
            <View style={styles.channelLeft}>
              <Ionicons name="logo-linkedin" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.channelText, { fontFamily: Fonts.sans }]}>LinkedIn Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.channelRow} onPress={() => handleOpenURL(DEV_CONSTANTS.GMAIL_URL)}>
            <View style={styles.channelLeft}>
              <Ionicons name="mail-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.channelText, { fontFamily: Fonts.sans }]}>Matrix Mail Signal</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.channelRow} onPress={() => handleOpenURL(DEV_CONSTANTS.INSTAGRAM_URL)}>
            <View style={styles.channelLeft}>
              <Ionicons name="logo-instagram" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.channelText, { fontFamily: Fonts.sans }]}>Instagram Portal</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_MUTED} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 24,
    padding: 28,
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: COLORS.GLASS_GLOW_SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  glowBloom: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(207, 188, 255, 0.04)',
    filter: 'blur(30px)',
  },
  avatarScope: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.PRIMARY,
    opacity: 0.6,
  },
  avatarRingInner: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
    opacity: 0.3,
  },
  avatarIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  devAlias: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
  },
  devTitle: {
    fontSize: 10,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  devBio: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
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
    marginBottom: 32,
  },
  skillContainer: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillLabel: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  skillPercentage: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelText: {
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
});
