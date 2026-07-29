import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  completed: boolean;
  checked: boolean;
  checkOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  checked: false,
  checkOnboarding: async () => {
    try {
      const value = await AsyncStorage.getItem('@app_onboarding_completed');
      set({ completed: value === 'true', checked: true });
    } catch (e) {
      console.error(e);
      set({ checked: true });
    }
  },
  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem('@app_onboarding_completed', 'true');
      set({ completed: true });
    } catch (e) {
      console.error(e);
    }
  },
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem('@app_onboarding_completed');
      set({ completed: false });
    } catch (e) {
      console.error(e);
    }
  },
}));
