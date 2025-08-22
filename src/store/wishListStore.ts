import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

export interface Receipt {
  storeBranch: string;
  category: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

interface WishLlist {
  receipts: Receipt[];
  date: string;
  uploadChannel?: string; // Track how the receipts were uploaded
}

interface ReceiptState {
  wishList: WishLlist[];
  addWishList: (wishList: WishLlist) => void;
  removeWishList: (index: number) => void;
  updateWishList: (index: number, wishlist: WishLlist) => void;
  clearWishList: () => void;
}

export const useWishListStore = create<ReceiptState>()(
  persist(
    (set, get) => ({
      wishList: [],
      addWishList: wishlist => {
        set({ wishList: [...get().wishList, wishlist] });
      },
      updateWishList: (index, wishlist) => {
        set({
          wishList: get().wishList.map((item, i) => (i === index ? wishlist : item)),
        });
      },
      removeWishList: index =>
        set({
          wishList: get().wishList.filter((_, i) => i !== index),
        }),
      clearWishList: () => set({ wishList: [] }),
    }),
    {
      name: 'wishList-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
