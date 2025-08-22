import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface FavoriteStoreState {
  favoriteStores: string[];
  addToFavorite: (id: string) => void;
  removeFromFavorite: (id: string) => void;
  checkIsFavorite: (id: string) => boolean;
}

export const useFavoriteGroceryStoreStore = create<FavoriteStoreState>()(
  persist(
    (set, get) => ({
      favoriteStores: [],

      addToFavorite: id => {
        const current = get().favoriteStores;
        if (!current.includes(id)) {
          set({ favoriteStores: [...current, id] });
        }
      },

      removeFromFavorite: id =>
        set({
          favoriteStores: get().favoriteStores.filter(storeID => storeID !== id),
        }),

      checkIsFavorite: id => get().favoriteStores.includes(id),
    }),
    {
      name: 'favorite-grocery-store-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
