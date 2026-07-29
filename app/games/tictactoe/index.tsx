import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/gameConfig';
import { Fonts } from '@/constants/theme';

export default function TicTacToeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Ionicons name="grid-outline" size={80} color={COLORS.PRIMARY} style={styles.icon} />
        <Text style={[styles.title, { fontFamily: Fonts.rounded }]}>TIC TAC TOE</Text>
        <Text style={[styles.subtitle, { fontFamily: Fonts.sans }]}>COMING VERY SOON</Text>
        <Text style={[styles.description, { fontFamily: Fonts.sans }]}>
          Our team is crafting a state-of-the-art neon grid battle with a smart AI opponent. Check back in the next system update!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 24,
  },
  backButton: {
    marginTop: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.GLASS_FILL,
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.ACCENT_CYAN,
    marginBottom: 24,
    letterSpacing: 1.5,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
});
