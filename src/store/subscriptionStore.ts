import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface SubscriptionState {
  isSubscribed: boolean;
  subscriptionType: 'free' | 'starter' | 'standard' | null;
  subscriptionExpiryDate: string | null;
  setIsSubscribed: (isSubscribed: boolean) => void;
  setSubscriptionType: (type: 'free' | 'starter' | 'standard') => void;
  setSubscriptionExpiryDate: (date: string) => void;
  resetSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    set => ({
      isSubscribed: false,
      subscriptionType: 'free',
      subscriptionExpiryDate: null,
      setIsSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
      setSubscriptionType: (subscriptionType: 'free' | 'starter' | 'standard') => set({ subscriptionType }),
      setSubscriptionExpiryDate: (subscriptionExpiryDate: string) => set({ subscriptionExpiryDate }),
      resetSubscription: () => set({
        isSubscribed: false,
        subscriptionType: 'free',
        subscriptionExpiryDate: null
      }),
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
