import { useErrandStore } from './errandStore';
import { useFavoriteGroceryStoreStore } from './favoriteGroceryStore';
import { useProfileStatusStore } from './profileStatusStore';
import { useRecieptStore } from './receiptStore';
import { useWishListStore } from './wishListStore';
import { useSubscriptionStore } from './subscriptionStore';
import { useTransactionStore } from './transactionStore';

export const initializeStores = async () => {
  await Promise.all([
    useErrandStore.persist.rehydrate(),
    useFavoriteGroceryStoreStore.persist.rehydrate(),
    useProfileStatusStore.persist.rehydrate(),
    useRecieptStore.persist.rehydrate(),
    useWishListStore.persist.rehydrate(),
    useSubscriptionStore.persist.rehydrate(),
    useTransactionStore.persist.rehydrate(),
  ]);
};
