import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { Alert, SectionListData } from 'react-native';

export interface Receipt {
  receiptId: string;
  storeBranch: string;
  category: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  unit: string;
}

interface ReceiptState {
  receipts: Receipt[];
  receiptQueue: Receipt[][]; // Queue of receipts grouped by store
  currentQueuePosition: number; // Track current position in queue
  totalReceiptsInQueue: number; // Track total original receipts in queue
  currentUploadChannel: string; // Track current upload channel
  addReceipt: (receipt: Omit<Receipt, 'receiptId'>) => Omit<Receipt, 'receiptId'> | void;
  setReceipts: (receipts: Receipt[]) => void;
  removeReceipt: (receiptId: string) => void;
  clearReceipts: () => void;
  updateReceipt: (receipt: Receipt) => void;
  groupAndSortReceipts: () => SectionListData<Receipt>[];
  updateStoreBranch: (oldStoreBranch: string, newStoreBranch: string) => void;
  addToQueue: (receipts: Receipt[]) => void;
  addProductToQueue: (receipt: Receipt) => void;
  getNextFromQueue: () => Receipt[] | null;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  getQueueLength: () => number;
  getCurrentQueuePosition: () => number;
  setCurrentQueuePosition: (position: number) => void;
  incrementQueuePosition: () => void;
  getTotalReceiptsInQueue: () => number;
  setTotalReceiptsInQueue: (total: number) => void;
  setCurrentUploadChannel: (channel: string) => void;
  getCurrentUploadChannel: () => string;
}

export const useRecieptStore = create<ReceiptState>()(
  persist(
    (set, get) => ({
      receipts: [],
      receiptQueue: [],
      currentQueuePosition: 0,
      totalReceiptsInQueue: 0,
      currentUploadChannel: '',
      addReceipt: (receipt: Omit<Receipt, 'receiptId'>) => {
        console.log('=== addReceipt function called ===');
        console.log('Adding receipt:', receipt);
        console.log('Current receipts:', get().receipts);

        const exists = get().receipts.some(
          r =>
            r.productName.trim().toLowerCase() === receipt.productName.trim().toLowerCase() &&
            r.storeBranch.trim().toLowerCase() === receipt.storeBranch.trim().toLowerCase(),
        );

        console.log('Duplicate check - exists:', exists);
        console.log('Product name to add:', receipt.productName.trim().toLowerCase());
        console.log('Store branch to add:', receipt.storeBranch.trim().toLowerCase());
        get().receipts.forEach((r, index) => {
          console.log(
            `Existing product ${index}:`,
            r.productName.trim().toLowerCase(),
            'in store:',
            r.storeBranch.trim().toLowerCase(),
          );
        });

        if (exists) {
          console.log(
            'Duplicate product detected:',
            receipt.productName,
            'in store:',
            receipt.storeBranch,
          );

          return receipt; // stop here
        }

        const newReceipts = [
          ...get().receipts,
          {
            ...receipt,
            receiptId:
              typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`, // fallback for older RN versions
          },
        ];

        console.log('Setting new receipts:', newReceipts);
        set({
          receipts: newReceipts,
        });
        console.log('Receipts after set:', get().receipts);
      },
      setReceipts: receipt => set({ receipts: receipt }),
      removeReceipt: (receiptId: string) =>
        set({
          receipts: get().receipts.filter(r => r.receiptId !== receiptId),
        }),
      updateReceipt: (updatedReceipt: Receipt) =>
        set({
          receipts: get().receipts.map(r =>
            r.receiptId === updatedReceipt.receiptId ? { ...r, ...updatedReceipt } : r,
          ),
        }),
      groupAndSortReceipts: () => {
        const grouped: Record<string, Receipt[]> = {};
        get().receipts.forEach(receipt => {
          if (!grouped[receipt.storeBranch]) {
            grouped[receipt.storeBranch] = [];
          }
          grouped[receipt.storeBranch].push(receipt);
        });

        return Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b)) // sort branches
          .map(([branch, items]) => ({
            title: branch,
            data: items.sort((a, b) => a.productName.localeCompare(b.productName)),
          }));
      },
      updateStoreBranch: (oldStoreBranch: string, newStoreBranch: string) => {
        // Update current receipts
        const updatedReceipts = get().receipts.map(receipt =>
          receipt.storeBranch === oldStoreBranch
            ? { ...receipt, storeBranch: newStoreBranch }
            : receipt,
        );

        // Update receipts in queue
        const updatedQueue = get().receiptQueue.map(queueGroup =>
          queueGroup.map(receipt =>
            receipt.storeBranch === oldStoreBranch
              ? { ...receipt, storeBranch: newStoreBranch }
              : receipt,
          ),
        );

        set({
          receipts: updatedReceipts,
          receiptQueue: updatedQueue,
        });
      },
      clearReceipts: () => set({ receipts: [] }),
      addToQueue: (receipts: Receipt[]) => {
        const currentQueue = get().receiptQueue;
        const newQueue = [...currentQueue, receipts];
        set({
          receiptQueue: newQueue,
          totalReceiptsInQueue: newQueue.length, // Set total when adding to queue
        });
      },
      addProductToQueue: (receipt: Receipt) => {
        const currentQueue = get().receiptQueue;
        const currentReceipts = get().receipts;

        // First, check if there's already a receipt group in the queue with the same store
        const existingStoreIndex = currentQueue.findIndex(
          group => group.length > 0 && group[0].storeBranch === receipt.storeBranch,
        );

        if (existingStoreIndex !== -1) {
          // Add to existing store group in queue
          const updatedQueue = [...currentQueue];
          updatedQueue[existingStoreIndex] = [...updatedQueue[existingStoreIndex], receipt];
          set({
            receiptQueue: updatedQueue,
            totalReceiptsInQueue: updatedQueue.length,
          });
        } else if (currentReceipts.length > 0) {
          // Check if there's a matching store in current receipts
          const matchingReceipt = currentReceipts.find(r => r.storeBranch === receipt.storeBranch);

          if (matchingReceipt) {
            // Add to current receipts (same store)
            set({
              receipts: [
                ...currentReceipts,
                {
                  ...receipt,
                  receiptId:
                    typeof crypto !== 'undefined' && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `${Date.now()}-${Math.random()}`,
                },
              ],
            });
          } else {
            // Create new store group in queue
            const newQueue = [...currentQueue, [receipt]];
            set({
              receiptQueue: newQueue,
              totalReceiptsInQueue: newQueue.length,
            });
          }
        } else {
          // No current receipts, create new store group in queue
          const newQueue = [...currentQueue, [receipt]];
          set({
            receiptQueue: newQueue,
            totalReceiptsInQueue: newQueue.length,
          });
        }
      },
      getNextFromQueue: () => {
        const queue = get().receiptQueue;
        return queue.length > 0 ? queue[0] : null;
      },
      removeFromQueue: (index: number) => {
        set({
          receiptQueue: get().receiptQueue.filter((_, i) => i !== index),
        });
      },
      clearQueue: () => set({ receiptQueue: [], currentQueuePosition: 0, totalReceiptsInQueue: 0 }),
      getQueueLength: () => get().receiptQueue.length,
      getCurrentQueuePosition: () => get().currentQueuePosition,
      setCurrentQueuePosition: (position: number) => set({ currentQueuePosition: position }),
      incrementQueuePosition: () => set({ currentQueuePosition: get().currentQueuePosition + 1 }),
      getTotalReceiptsInQueue: () => get().totalReceiptsInQueue,
      setTotalReceiptsInQueue: (total: number) => set({ totalReceiptsInQueue: total }),
      setCurrentUploadChannel: (channel: string) => set({ currentUploadChannel: channel }),
      getCurrentUploadChannel: () => get().currentUploadChannel,
    }),
    {
      name: 'receipt-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
