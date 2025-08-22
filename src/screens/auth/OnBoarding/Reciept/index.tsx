import { Image, FlatList, View, Alert } from 'react-native';
import { CalendarStrip, CustomHighlightButton, SAScrollView, Text } from '../../../../components';
import Header from '../../../../components/Headers/Header';
import { Icons } from '../../../../assets/Icons';
import { useTheme } from '../../../../context/themeContext';
import useStyles from './styles';
import { useRecieptStore } from '../../../../store/receiptStore';
import { useWishListStore } from '../../../../store/wishListStore';
import { useTransactionStore, UploadChannel } from '../../../../store/transactionStore';
import { useMemo, useState, useEffect } from 'react';
import { useProfileStatusStore } from '../../../../store/profileStatusStore';
import EditableListHeader from './EditableListHeader';
import { DimensionsData } from '../../../../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useOverlay } from '../../../../context/OverlayContext';

interface ReceiptItem {
  productName: string;
  unitPrice: number;
  receiptId: string;
}

interface FooterProps {
  navigation: any;
  selectedDate: Date;
  type: string;
  index: number;
}

interface RenderProductsProps {
  item: ReceiptItem;
  index: number;
  navigation: any;
}

const Footer = ({
  navigation,
  selectedDate,
  type,
  index,
  onAppendReceipt,
  route,
  currentReceiptData,
}: FooterProps & { onAppendReceipt: () => void; route: any; currentReceiptData: any[] }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const {
    receipts,
    groupAndSortReceipts,
    getNextFromQueue,
    removeFromQueue,
    getQueueLength,
    incrementQueuePosition,
  } = useRecieptStore();
  const { isLoggedIn } = useProfileStatusStore();

  // Check if there's a queue (for processing multiple receipts)
  const hasQueue = getQueueLength() > 0;

  return (
    <View style={styles.footerContainer}>
      {hasQueue || type === 'edit' ? (
        // Show original buttons when there's a queue to process
        <>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              width: '100%',
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <CustomHighlightButton
              title='Add Product'
              icon={Icons.add}
              iconTintColor={colors?.textPrimary}
              style={styles.footerButton}
              onPress={() => {
                if (type === 'edit') {
                  // Edit mode: Add product to current receipt
                  navigation.navigate('CommonStack', {
                    screen: 'AddProducts',
                    params: {
                      type: 'add',
                      item: null,
                      index: null,
                      onUpdate: null,
                      mode: 'append', // Always append in edit mode
                    },
                  });
                } else if (type === 'add' && route?.params?.fromOnboarding === true) {
                  // Onboarding flow: Navigate to AddProducts with append mode
                  navigation.navigate('CommonStack', {
                    screen: 'AddProducts',
                    params: {
                      type: 'add',
                      item: null,
                      index: null,
                      onUpdate: null,
                      mode: 'append',
                    },
                  });
                } else {
                  // Home stack: Navigate to AddProducts with append mode
                  navigation.navigate('CommonStack', {
                    screen: 'AddProducts',
                    params: {
                      type: 'add',
                      item: null,
                      index: null,
                      onUpdate: null,
                      mode: 'append',
                    },
                  });
                }
              }}
            />
            <CustomHighlightButton
              title='Append Receipt'
              style={styles.footerButton}
              icon={Icons.scanner}
              iconTintColor={colors?.textPrimary}
              onPress={() => {
                // Navigate to AppendScreen for append functionality
                navigation.navigate('CommonStack', {
                  screen: 'AppendScreen',
                  params: {
                    mode: 'append',
                    fromOnboarding: route?.params?.fromOnboarding !== false,
                  },
                });
              }}
            />
          </View>
          <CustomHighlightButton
            title={
              type === 'add'
                ? `Confirm (${
                    currentReceiptData.length > 0 ? currentReceiptData[0].data.length : 0
                  })`
                : 'Update'
            }
            style={styles.confirmButton}
            disabled={receipts.length == 0}
            onPress={() => {
              if (type === 'add') {
                // Add current receipts to wishlist
                const uploadChannel = useRecieptStore.getState().getCurrentUploadChannel();
                groupAndSortReceipts().forEach(f => {
                  useWishListStore.getState().addWishList({
                    receipts: [...f.data],
                    date: selectedDate.toISOString(),
                    uploadChannel: uploadChannel || UploadChannel.FORM_FILLING,
                  });
                });

                // Remove current receipt from queue and increment position
                removeFromQueue(0);
                incrementQueuePosition();

                // Check if there are more receipts in queue
                const nextReceipts = getNextFromQueue();
                if (nextReceipts && nextReceipts.length > 0) {
                  // Load next receipt from queue
                  useRecieptStore.getState().clearReceipts();
                  useRecieptStore.getState().setReceipts([...nextReceipts]);
                } else {
                  // No more receipts in queue, clear queue and reset count, then navigate to wishlist
                  useRecieptStore.getState().clearReceipts();
                  useRecieptStore.getState().clearQueue(); // Clear the queue completely
                  navigation.navigate('CommonStack', {
                    screen: 'Wishlist',
                  });
                }
              } else {
                useWishListStore.getState().updateWishList(index, {
                  receipts: receipts,
                  date: selectedDate.toISOString(),
                });
                navigation.navigate('Wishlist');
              }
            }}
          />
        </>
      ) : (
        // Show new buttons when there's no queue (coming from Wishlist or all receipts processed)
        <>
          <CustomHighlightButton
            title='Add Another Receipt'
            style={styles.confirmButton}
            onPress={() => {
              // Navigate to AppendScreen for a new receipt
              navigation.navigate('CommonStack', {
                screen: 'AppendScreen',
                params: {
                  mode: 'new', // New receipt, not append
                  fromOnboarding: route?.params?.fromOnboarding !== false,
                },
              });
            }}
          />
          <CustomHighlightButton
            title='Proceed to Wishlist'
            style={styles.confirmButton}
            onPress={() => {
              // Navigate back to Wishlist
              navigation.navigate('CommonStack', {
                screen: 'Wishlist',
              });
            }}
          />
        </>
      )}
    </View>
  );
};

const RenderProducts = ({ item, index, navigation }: RenderProductsProps) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const menuOptionsCustomStyles = useMemo(
    () => ({
      optionsContainer: {
        width: 120,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      },
      optionText: {
        fontSize: 14,
        fontFamily: 'Satoshi-Regular',
        color: colors.textPrimary,
      },
    }),
    [colors],
  );
  return (
    <View style={styles.productContainer}>
      <Text textStyle='medium16' color={colors.black}>
        {item.productName}
      </Text>
      <View style={styles.productRightSection}>
        <Text textStyle='medium16' color={colors.black}>
          ${item.unitPrice}
        </Text>
        <Menu>
          <MenuTrigger>
            <Image source={Icons.dots} style={styles.dotsIcon} />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsCustomStyles}>
            <MenuOption
              onSelect={() => {
                navigation.navigate('CommonStack', {
                  screen: 'AddProducts',
                  params: {
                    type: 'edit',
                    item: item,
                    index: index,
                    onUpdate: null,
                  },
                });
              }}
            >
              <View style={styles.menuOptionContainer}>
                <Image source={Icons.edit} style={styles.editIcon} />
                <Text textStyle='medium16' color={colors.black}>
                  Edit
                </Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                useRecieptStore.getState().removeReceipt(item?.receiptId);
                console.log(`Delete ${item.productName}`);
              }}
            >
              <View style={styles.menuOptionContainer}>
                <Image
                  source={Icons.delete}
                  style={[styles.editIcon, { tintColor: colors.error || '#FF4444' }]}
                />
                <Text textStyle='medium16' color={colors.error || '#FF4444'}>
                  Delete
                </Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

const Reciept = ({ navigation, route }: { navigation: any; route: any }) => {
  const { colors } = useTheme();
  const {
    receipts,
    getNextFromQueue,
    getQueueLength,
    clearQueue,
    getCurrentQueuePosition,
    receiptQueue,
    currentQueuePosition,
    getTotalReceiptsInQueue,
    totalReceiptsInQueue,
  } = useRecieptStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const styles = useStyles();
  const { type, index } = route.params;
  const { top, bottom } = useSafeAreaInsets();
  const { showAlert } = useOverlay();
  // Get current receipt data for display
  const currentReceiptData = useMemo(() => {
    if (receipts.length === 0) return [];

    // Group current receipts by store (should be only one store)
    const grouped: Record<string, any[]> = {};
    receipts.forEach(receipt => {
      if (!grouped[receipt.storeBranch]) {
        grouped[receipt.storeBranch] = [];
      }
      grouped[receipt.storeBranch].push(receipt);
    });

    return Object.entries(grouped).map(([storeName, items]) => ({
      title: storeName,
      data: items.sort((a, b) => a.productName.localeCompare(b.productName)),
    }));
  }, [receipts]);

  // Get queue position for header - only show for add mode, not edit mode
  const queuePosition = useMemo(() => {
    if (type === 'edit') return ''; // No queue numbering for edit mode
    const totalInQueue = totalReceiptsInQueue;
    if (totalInQueue === 0) return '';
    const currentPosition = currentQueuePosition + 1;
    return ` (${currentPosition}/${totalInQueue})`;
  }, [type, totalReceiptsInQueue, currentQueuePosition]);

  // Initialize receipt from queue if needed
  useEffect(() => {
    if (type === 'add') {
      const currentReceipts = useRecieptStore.getState().receipts;

      // Only initialize if there are no current receipts AND we have a queue
      if (currentReceipts.length === 0 && getQueueLength() > 0) {
        // Reset queue position when starting fresh
        useRecieptStore.getState().setCurrentQueuePosition(0);

        const nextReceipts = getNextFromQueue();
        if (nextReceipts && nextReceipts.length > 0) {
          useRecieptStore.getState().setReceipts([...nextReceipts]);
        }
      } else if (currentReceipts.length === 0 && getQueueLength() === 0) {
        // If no queue and no current receipts, try to load last transaction from transaction history
        const { transactions } = useTransactionStore.getState();
        if (transactions.length > 0) {
          const lastTransaction = transactions[transactions.length - 1];
          // Use receipts directly from transaction
          if (lastTransaction.reciept && lastTransaction.reciept.length > 0) {
            useRecieptStore.getState().setReceipts([...lastTransaction.reciept]);
          }
        }
      }
    }
  }, [type, getQueueLength, getNextFromQueue]); // Removed receipts from dependencies to prevent interference

  // Handle back navigation with queue confirmation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      // Only show confirmation if there are receipts in the queue that need protection
      const queueLength = getQueueLength();

      // Show confirmation only if there are receipts in the queue
      // This prevents the dialog when coming from Wishlist (where queue is empty)
      if (queueLength > 0) {
        e.preventDefault();

        // Show confirmation dialog
        showAlert({
          heading: 'Receipts in Queue',
          description:
            'You have receipts in the queue. If you exit now, they will be cleared. Are you sure?',
          type: 'warning',
          showCancelButton: true,
          continueButtonText: 'Exit',
          showContinueButton: true,
          onContinue: () => {
            clearQueue();
            navigation.dispatch(e.data.action);
          },
        });
      }
    });

    return unsubscribe;
  }, [navigation, getQueueLength, clearQueue]);
  return (
    <SAScrollView
      scrollEnabled={false}
      header={<Header title={`Receipt${queuePosition}`} variant='titleLeft' />}
      footer={
        <Footer
          navigation={navigation}
          selectedDate={selectedDate}
          type={type}
          index={index}
          route={route}
          currentReceiptData={currentReceiptData}
          onAppendReceipt={() => {}} // No longer needed
        />
      }
    >
      <CalendarStrip onDateSelected={setSelectedDate} style={{}} />
      <View
        style={{
          height: DimensionsData.screenHeight - top - bottom - 272,
        }}
      >
        <FlatList
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={() => (
            <View
              style={{
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Image source={Icons.products} style={{ width: 60, height: 60 }} />
              <Text textStyle='bold16' color={colors.black}>
                No products added
              </Text>
            </View>
          )}
          data={currentReceiptData.length > 0 ? currentReceiptData[0].data : []}
          keyExtractor={(item: any, index: number) => item.receiptId || `item-${index}`}
          renderItem={({ item, index }: { item: any; index: number }) => (
            <RenderProducts
              key={`product-${item.receiptId || index}`}
              item={item}
              index={index}
              navigation={navigation}
            />
          )}
          ListHeaderComponent={() =>
            currentReceiptData.length > 0 ? (
              <EditableListHeader title={currentReceiptData[0].title} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SAScrollView>
  );
};

export default Reciept;
