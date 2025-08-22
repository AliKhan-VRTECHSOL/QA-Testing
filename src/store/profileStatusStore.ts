import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

export enum ProfileStatus {
  PROSPECT = 'PROSPECT', // registered
  PROFILE_COMPLETE = 'PROFILE_COMPLETE', // personal details added
  TRANSACTIONS_UPLOADING = 'TRANSACTIONS_UPLOADING', // uploading
  MANIFEST_INITIALIZED = 'MANIFEST_INITIALIZED', // triaged for shopping
  ONBOARDING_COMPLETE = 'ONBOARDING_COMPLETE', // first shop complete
}

interface ProfileStatusState {
  profileStatus: ProfileStatus;
  isLoggedIn: boolean;
  setProfileStatus: (status: ProfileStatus) => void;
  resetProfileStatus: () => void;
  setLoggedIn: () => void;
  setLoggedOut: () => void;
}

export const useProfileStatusStore = create<ProfileStatusState>()(
  persist(
    set => ({
      profileStatus: ProfileStatus.PROSPECT,
      isLoggedIn: false,
      setProfileStatus: (profileStatus: ProfileStatus) => set({ profileStatus }),
      resetProfileStatus: () => set({ profileStatus: ProfileStatus.PROSPECT }),
      setLoggedIn: () => set({ isLoggedIn: true }),
      setLoggedOut: () =>
        set({
          isLoggedIn: false,
          profileStatus: ProfileStatus.PROSPECT,
        }),
    }),
    {
      name: 'profile-status-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
