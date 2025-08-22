import { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import QuickActionButton from '../QuickActionButton';
import { handleCSVUpload, openImagePicker } from '../../utils/media';
import { Icons } from '../../assets/Icons';
import { useRecieptStore } from '../../store/receiptStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/themeContext';
import BottomSheet from '../BottomSheet';
import { CustomHighlightButton, OutlinedButton, Text } from '..';
import { DimensionsData } from '../../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { uploadProfileImage } from '../../api/demoApi';
import { useOverlay } from '../../context/OverlayContext';
import LoadingScreen from '../LoadingScreen';
import { generateRandomProduct, generateRandomReceipt } from '../../utils/utils';
import { UploadChannel } from '../../store/transactionStore';

// Constants
const CONSTANTS = {
  PROGRESS: {
    TOTAL_STEPS: 100,
    STEP_DELAY: 15,
    ALERT_DELAY: 200,
    ERROR_ALERT_DELAY: 100,
  },
  DIMENSIONS: {
    IMAGE_SIZE: (DimensionsData.windowWidth - 78) / 3,
    BUTTON_SIZE: 24,
    ICON_SIZE: 16,
  },
  STORES: {
    DEFAULT: 'Downtown',
  },
} as const;

// Types
interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  smallScreenVariant?: boolean;
  handleCloseSheet?: () => void;
  mode?: 'new' | 'append';
  fromOnboarding?: boolean;
}

interface ReceiptData {
  storeBranch: string;
  category: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  unit: string;
}

interface DuplicateItem {
  productName: string;
  storeBranch: string;
}

interface ReceiptUploadItem {
  key: string;
  label: string;
  icon: any;
  onPress: () => void;
}

const UploadReceiptList: React.FC<ScreenProps> = ({
  navigation,
  smallScreenVariant = false,
  handleCloseSheet,
  mode = 'new',
  fromOnboarding = true,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const { setShowLoading, setProgress, showLoading, progress, showAlert } = useOverlay();
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        separator: {
          height: StyleSheet.hairlineWidth,
          marginHorizontal: 0,
          opacity: 1,
        },
        imageContainer: {
          borderRadius: 8,
          width: CONSTANTS.DIMENSIONS.IMAGE_SIZE,
          height: CONSTANTS.DIMENSIONS.IMAGE_SIZE,
          backgroundColor: colors.gray5,
        },
        image: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          borderRadius: 8,
        },
        removeButton: {
          position: 'absolute',
          width: CONSTANTS.DIMENSIONS.BUTTON_SIZE,
          height: CONSTANTS.DIMENSIONS.BUTTON_SIZE,
          borderRadius: CONSTANTS.DIMENSIONS.BUTTON_SIZE / 2,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          top: -5,
          right: -5,
        },
        removeIcon: {
          width: CONSTANTS.DIMENSIONS.ICON_SIZE,
          height: CONSTANTS.DIMENSIONS.ICON_SIZE,
          resizeMode: 'contain',
        },
        buttonContainer: {
          flexDirection: 'row',
          gap: 16,
          width: DimensionsData.windowWidth,
          alignSelf: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          marginVertical: 10,
        },
        button: {
          width: '48%',
        },
        flatListContainer: {
          maxHeight: DimensionsData.windowHeight * 0.5,
        },
        columnWrapper: {
          flexWrap: 'wrap',
          gap: 16,
          paddingTop: 16,
        },
        contentContainer: smallScreenVariant
          ? { gap: 0, paddingTop: 0 }
          : {
              gap: 20,
              paddingTop: 52,
              paddingHorizontal: 16,
              paddingBottom: 10,
            },
      }),
    [colors, smallScreenVariant],
  );

  // Helper Functions
  const checkSheet = () => {
    handleCloseSheet && handleCloseSheet();
  };

  const navigateToScreen = (screen: string, params?: any) => {
    checkSheet();
    navigation.navigate('CommonStack', { screen, params });
  };

  const getCurrentStore = (): string => {
    const currentReceipts = useRecieptStore.getState().receipts;
    if (currentReceipts.length > 0) {
      return currentReceipts[0].storeBranch;
    }

    const { receiptQueue, currentQueuePosition } = useRecieptStore.getState();
    if (receiptQueue.length > 0 && receiptQueue[currentQueuePosition]?.length > 0) {
      return receiptQueue[currentQueuePosition][0].storeBranch;
    }

    return CONSTANTS.STORES.DEFAULT;
  };

  const generateReceiptId = (index: number): string => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}-${index}`;
  };

  const simulateProgress = async (): Promise<void> => {
    for (let i = 0; i <= CONSTANTS.PROGRESS.TOTAL_STEPS; i++) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, CONSTANTS.PROGRESS.STEP_DELAY));
    }
  };

  const processAppendMode = (selectedImages: any[]): DuplicateItem[] => {
    const duplicates: DuplicateItem[] = [];
    const currentStore = getCurrentStore();

    console.log('UploadReceiptList - Append mode, selectedImages:', selectedImages.length);
    console.log('UploadReceiptList - Found current store from receipts:', currentStore);

    selectedImages.forEach((image, index) => {
      const receipts = generateRandomReceipt();
      console.log(
        `UploadReceiptList - Generated ${receipts.length} receipts for image ${index + 1}`,
      );

      receipts.forEach(receipt => {
        const receiptWithSameStore = { ...receipt, storeBranch: currentStore };
        console.log('UploadReceiptList - Adding receipt to same store:', receiptWithSameStore);

        const result = useRecieptStore.getState().addReceipt(receiptWithSameStore);
        if (result) {
          duplicates.push({
            productName: result.productName,
            storeBranch: result.storeBranch,
          });
        }
      });
    });

    return duplicates;
  };

  const processNewMode = (selectedImages: any[]): void => {
    selectedImages.forEach((image, index) => {
      const products = generateRandomReceipt(index);
      const receipts = products.map(product => ({
        ...product,
        receiptId: generateReceiptId(index),
      }));
      useRecieptStore.getState().addToQueue(receipts);
    });
  };

  const handleDuplicates = (duplicates: DuplicateItem[]): void => {
    if (duplicates.length === 0) return;

    setTimeout(() => {
      const duplicateList = duplicates
        .map((dup, index) => `${index + 1}. ${dup.productName} (${dup.storeBranch})`)
        .join('\n');

      showAlert({
        heading: 'Duplicate Products Found',
        description: `The following products already exist in your receipt:\n\n${duplicateList}`,
        type: 'warning',
        showOKButton: true,
        okButtonText: 'OK',
        onOK: () => {
          // Alert is dismissed, no additional navigation needed
        },
      });
    }, CONSTANTS.PROGRESS.ALERT_DELAY);
  };

  const handleNavigation = (): void => {
    setSelectedImages([]);
    checkSheet();
    navigation.navigate('CommonStack', {
      screen: 'Reciept',
      params: {
        type: 'add',
        fromOnboarding: fromOnboarding,
      },
    });
  };

  const handleError = (error: any): void => {
    console.log('error in handleUploadImages UploadReceiptList', error);
    setShowLoading(false);

    setTimeout(() => {
      showAlert({
        heading: 'Upload Error',
        description: 'An error occurred while processing your receipts. Please try again.',
        type: 'error',
        showOKButton: true,
        okButtonText: 'OK',
        onOK: () => {
          setSelectedImages([]);
          checkSheet();
        },
      });
    }, CONSTANTS.PROGRESS.ERROR_ALERT_DELAY);
  };

  // Event Handlers
  const handleImagePicker = useCallback(async () => {
    const images = await openImagePicker(true);
    if (!images) return;
    setSelectedImages(prev => [...prev, ...images]);
  }, []);

  const handleBarcodeScan = async () => {
    navigateToScreen('BarcodeScanner');
  };

  const handleAddProduct = async () => {
    if (mode === 'new') {
      useRecieptStore.getState().clearReceipts();
    }
    navigateToScreen('AddProducts', {
      type: 'add',
      item: null,
      index: null,
      onUpdate: null,
      mode: mode,
    });
  };

  const handleUploadImages = async () => {
    console.log('UploadReceiptList - handleUploadImages called with mode:', mode);
    console.log('UploadReceiptList - fromOnboarding:', fromOnboarding);

    setShowLoading(true);
    setProgress(0);
    useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.PHOTOS);

    // TODO: API Integration Required
    // Call: POST /onboarding/receipts/upload-photo (if mode === 'new' && fromOnboarding)
    // Call: POST /onboarding/receipts/append/upload-photo (if mode === 'append' && fromOnboarding)
    // Call: POST /upload/receipts/upload-photo (if mode === 'new' && !fromOnboarding)
    // Call: POST /upload/receipts/append/upload-photo (if mode === 'append' && !fromOnboarding)
    // Send: FormData with { images: File[], mode: 'new' | 'append' }
    // Expect: { success: boolean, receipts: Receipt[], duplicates?: DuplicateItem[] }
    // Handle: Add receipts to store, show duplicates warning, navigate to Receipt screen

    try {
      await simulateProgress();

      let duplicates: DuplicateItem[] = [];

      if (mode === 'append') {
        duplicates = processAppendMode(selectedImages);
      } else {
        processNewMode(selectedImages);
      }

      setShowLoading(false);
      handleNavigation();
      handleDuplicates(duplicates);
    } catch (error) {
      handleError(error);
    }
  };

  // Memoized Data
  const receiptUploadData: ReceiptUploadItem[] = useMemo(
    () => [
      {
        key: 'upload',
        label: 'Upload photos',
        icon: Icons.scanner,
        onPress: handleImagePicker,

      },
      {
        key: 'barcode',
        label: 'Barcode',
        icon: Icons.barcode,
        onPress: handleBarcodeScan,
      },
      {
        key: 'csv',
        label: 'CSV',
        icon: Icons.folder,
        onPress: () => handleCSVUpload(navigation, checkSheet),
      },
      {
        key: 'add',
        label: 'Add product',
        icon: Icons.add,
        onPress: handleAddProduct,
      },
    ],
    [handleImagePicker, handleBarcodeScan, handleAddProduct, navigation],
  );

  // Render Functions
  const renderItem = useCallback(
    ({ item }: { item: ReceiptUploadItem }) => (
      <QuickActionButton
        icon={item.icon}
        label={item.label}
        onPress={item.onPress}
        variant={smallScreenVariant ? 'small' : 'default'}
      />
    ),
    [smallScreenVariant],
  );

  const ItemSeparatorComponent = useCallback(
    () =>
      smallScreenVariant ? (
        <View style={[styles.separator, { backgroundColor: colors.lightGrey }]} />
      ) : null,
    [smallScreenVariant, colors.lightGrey, styles.separator],
  );

  const imagePreviewRenderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.uri }} style={styles.image} />
        <Pressable
          onPress={() => setSelectedImages(prev => prev.filter((f, findex) => findex !== index))}
          style={styles.removeButton}
        >
          <Image source={Icons.minus} style={styles.removeIcon} />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={receiptUploadData}
        style={smallScreenVariant ? { height: '100%' } : {}}
        renderItem={renderItem}
        scrollEnabled={!smallScreenVariant}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={item => item.key}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />

      <BottomSheet
        visible={selectedImages.length !== 0}
        heading='Selected Photos'
        onClose={() => setSelectedImages([])}
        maxHeight={DimensionsData.windowHeight * 0.7}
        contentContainerStyle={{
          paddingBottom: bottom,
        }}
      >
        <FlatList
          data={selectedImages}
          numColumns={3}
          renderItem={imagePreviewRenderItem}
          style={styles.flatListContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.buttonContainer}>
          <OutlinedButton
            title='Add More'
            smallVariant
            onPress={handleImagePicker}
            style={styles.button}
          />
          <CustomHighlightButton
            onPress={handleUploadImages}
            title={`Proceed (${selectedImages.length})`}
            smallVariant
            style={styles.button}
          />
        </View>
        <LoadingScreen isVisible={showLoading} progress={progress} />
      </BottomSheet>
    </>
  );
};

export default UploadReceiptList;
