import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface ErrandState {
  errandDay: string;
  errandInterval: string;
  setErrandDay: (errandDay: string) => void;
  setErrandInterval: (errandInterval: string) => void;
  reset: () => void;
}

export const useErrandStore = create<ErrandState>()(
  persist(
    (set, get) => ({
      errandDay: '',
      errandInterval: '',
      setErrandDay: errandDay => set({ errandDay }),
      setErrandInterval: errandInterval => set({ errandInterval }),
      reset: () => set({ errandDay: '', errandInterval: '' }),
    }),
    {
      name: 'errand-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
