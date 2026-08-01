import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GAME_HTML_BUNDLE } from './3d/bundle/htmlBundle.js';

export default function RunnerGameScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      
      {/* 3D Three.js WebGL game viewport rendered offline inside Native WebView */}
      <WebView
        source={{ html: GAME_HTML_BUNDLE }}
        style={styles.webview}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030308',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
