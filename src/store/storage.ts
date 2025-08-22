import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const zustandStorage: StateStorage = {
  getItem: async name => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name, value) => {
    if (typeof value !== 'string') {
      console.warn(`[Zustand Storage] setItem expected string but got ${typeof value}`);
    }
    await AsyncStorage.setItem(name, value); // value should already be a string!
  },
  removeItem: async name => {
    await AsyncStorage.removeItem(name);
  },
};
