import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { Receipt } from './receiptStore';

export interface TransactionItem {
  orderId: string;
  newDate: string;
  storeName: string;
  subTotal: string;
  orderStatus: string;
  inWishlist: boolean;
  reciept: Receipt[];
  uploadChannel: string;
}

export enum UploadChannel {
  BARCODE = 'BARCODE',
  CSV = 'CSV',
  PHOTOS = 'PHOTOS',
  FORM_FILLING = 'FORM_FILLING',
}

export const UploadChannelDescription = {
  BARCODE: 'Uploaded Using Barcode Scanner',
  CSV: 'Uploaded Using CSV file',
  PHOTOS: 'Uploaded Using Camera',
  FORM_FILLING: 'Uploaded manually',
};

interface TransactionState {
  transactions: TransactionItem[];
  addTransaction: (transaction: Omit<TransactionItem, 'orderId'>) => void;
  setTransactions: (transactions: TransactionItem[]) => void;
  removeTransaction: (orderId: string) => void;
  clearTransactions: () => void;
  updateTransaction: (transaction: TransactionItem) => void;
  getRecentTransactions: (limit?: number) => TransactionItem[];
  toggleWishlist: (orderId: string) => void;
  createTransactionsFromWishlist: (wishlistItems: any[]) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction: Omit<TransactionItem, 'orderId'>) => {
        const orderId = `#AB${Math.floor(Math.random() * 1000)}`;
        set({
          transactions: [
            {
              ...transaction,
              orderId,
            },
            ...get().transactions,
          ],
        });
      },

      setTransactions: (transactions: TransactionItem[]) => set({ transactions }),

      removeTransaction: (orderId: string) =>
        set({
          transactions: get().transactions.filter(t => t.orderId !== orderId),
        }),

      clearTransactions: () => set({ transactions: [] }),

      updateTransaction: (updatedTransaction: TransactionItem) =>
        set({
          transactions: get().transactions.map(t =>
            t.orderId === updatedTransaction.orderId ? { ...t, ...updatedTransaction } : t,
          ),
        }),

      getRecentTransactions: (limit: number = 3) => {
        return get().transactions
          .sort((a, b) => new Date(b.newDate).getTime() - new Date(a.newDate).getTime())
          .slice(0, limit);
      },

      toggleWishlist: (orderId: string) =>
        set({
          transactions: get().transactions.map(t =>
            t.orderId === orderId ? { ...t, inWishlist: !t.inWishlist } : t,
          ),
        }),

      createTransactionsFromWishlist: (wishlistItems: any[]) => {
        wishlistItems.forEach(item => {
          // Group receipts by store
          const groupedReceipts = item.receipts.reduce((acc: any, receipt: Receipt) => {
            if (!acc[receipt.storeBranch]) {
              acc[receipt.storeBranch] = [];
            }
            acc[receipt.storeBranch].push(receipt);
            return acc;
          }, {});

          // Create transaction for each store
          Object.entries(groupedReceipts).forEach(([storeName, receipts]) => {
            const totalAmount = (receipts as Receipt[]).reduce((sum, receipt) => sum + receipt.subTotal, 0);

            get().addTransaction({
              newDate: item.date,
              storeName,
              subTotal: totalAmount.toFixed(2),
              orderStatus: 'Estimated',
              inWishlist: false,
              reciept: receipts as Receipt[],
              uploadChannel: item.uploadChannel || UploadChannel.FORM_FILLING,
            });
          });
        });
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
