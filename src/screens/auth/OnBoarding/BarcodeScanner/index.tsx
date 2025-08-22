import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text } from '../../../../components';
import Header from '../../../../components/Headers/Header';
import { StyleSheet, View, Pressable, Alert, Dimensions, SafeAreaView } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  CodeScanner,
  Code,
} from 'react-native-vision-camera';
import { useTheme } from '../../../../context/themeContext';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '../../../../utils/scaling';
import { LayoutMetrics } from '../../../../theme/commonLayout';
import { ThemeColors } from '../../../../theme/colors';
import { useRecieptStore } from '../../../../store/receiptStore';
import { UploadChannel } from '../../../../store/transactionStore';
import { generateRandomProduct } from '../../../../utils/utils';

const { width, height } = Dimensions.get('window');

interface ScannedCode {
  type: string;
  value: string;
}

const BarcodeScanner = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scannedCodes, setScannedCodes] = useState<ScannedCode[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');

  const codeScanner: CodeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',
      'ean-8',
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'upc-a',
      'upc-e',
      'pdf-417',
    ],
    onCodeScanned: useCallback(
      (codes: Code[]) => {
        if (!isScanning || codes.length === 0) return;

        const code = codes[0];
        if (code.value && code.value !== lastScannedCode) {
          setLastScannedCode(code.value);
          setIsScanning(false);

          const newScannedCode: ScannedCode = {
            type: code.type || 'unknown',
            value: code.value,
          };

          setScannedCodes(prev => [newScannedCode, ...prev]);

          // TODO: API Integration Required
          // Call: POST /onboarding/receipts/barcode
          // Send: { barcode: string, type: string }
          // Expect: { success: boolean, product: { productName: string, unitPrice: number, category: string } }
          // Handle: Show product details, navigate to AddProducts with pre-filled data

          // Simulate product scanning - generate random product details
          const simulatedProduct = generateRandomProduct();

          Alert.alert(
            'Product Found!',
            `Product: ${simulatedProduct.productName}\nPrice: $${simulatedProduct.unitPrice.toFixed(2)}\nCategory: ${simulatedProduct.category}`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  // Reset scanning state to allow another scan
                  setIsScanning(true);
                  setLastScannedCode('');
                },
              },
              {
                text: 'Add Product',
                style: 'default',
                onPress: () => {
                  // Set upload channel to BARCODE
                  useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.BARCODE);

                  // Navigate to AddProducts with pre-filled product details
                  navigation.navigate('CommonStack', {
                    screen: 'AddProducts',
                    params: {
                      type: 'add',
                      item: null,
                      index: null,
                      onUpdate: null,
                      mode: 'new',
                      preFilledProduct: simulatedProduct, // Pass pre-filled product data
                    },
                  });
                },
              },
            ],
          );
        }
      },
      [isScanning, lastScannedCode, navigation],
    ),
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleManualInput = () => {
    Alert.prompt(
      'Manual Barcode Entry',
      'Enter barcode value manually:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (value?: string) => {
            if (value && value.trim()) {
              // TODO: API Integration Required
              // Call: POST /onboarding/receipts/barcode
              // Send: { barcode: string, type: 'manual' }
              // Expect: { success: boolean, product: { productName: string, unitPrice: number, category: string } }
              // Handle: Show product details, navigate to AddProducts with pre-filled data

              // Simulate product scanning for manual input
              const simulatedProduct = generateRandomProduct();

              Alert.alert(
                'Product Found!',
                `Product: ${simulatedProduct.productName}\nPrice: $${simulatedProduct.unitPrice.toFixed(2)}\nCategory: ${simulatedProduct.category}`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                      // Reset scanning state to allow another scan
                      setIsScanning(true);
                      setLastScannedCode('');
                    },
                  },
                  {
                    text: 'Add Product',
                    style: 'default',
                    onPress: () => {
                      // Set upload channel to BARCODE
                      useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.BARCODE);

                      // Navigate to AddProducts with pre-filled product details
                      navigation.navigate('CommonStack', {
                        screen: 'AddProducts',
                        params: {
                          type: 'add',
                          item: null,
                          index: null,
                          onUpdate: null,
                          mode: 'new',
                          preFilledProduct: simulatedProduct, // Pass pre-filled product data
                        },
                      });
                    },
                  },
                ],
              );
            }
          },
        },
      ],
      'plain-text',
    );
  };

  const clearScannedCodes = () => {
    Alert.alert('Clear All Scanned Codes', 'Are you sure you want to clear all scanned barcodes?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setScannedCodes([]);
          setLastScannedCode('');
          setIsScanning(true);
        },
      },
    ]);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Header title='Barcode Scanner' />
        <View style={styles.permissionContainer}>
          <View style={[styles.messageCard, { backgroundColor: colors.white }]}>
            <Text textStyle='medium16' color={colors.textPrimary} center>
              Camera Permission Required
            </Text>
            <Text textStyle='regular14' color={colors.gray3} center style={styles.permissionText}>
              Camera permission is required to scan barcodes. Please grant access to continue.
            </Text>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={requestPermission}
            >
              <Text textStyle='medium16' color={colors.white}>
                Grant Permission
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title='Barcode Scanner' />
        <View style={styles.permissionContainer}>
          <View style={[styles.messageCard, { backgroundColor: colors.white }]}>
            <Text textStyle='medium16' color={colors.textPrimary} center>
              Camera Not Available
            </Text>
            <Text textStyle='regular14' color={colors.gray3} center style={styles.permissionText}>
              No camera device available on this device.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Barcode Scanner' />

      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />

        {/* Scanning overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <View style={styles.instructionContainer}>
            <Text textStyle='medium16' color={colors.white} center>
              {isScanning ? 'Position barcode within the frame' : 'Processing...'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.white,
        },
        cameraContainer: {
          flex: 1,
          position: 'relative',
        },
        overlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        scanArea: {
          width: width * 0.65,
          height: width * 0.65,
          position: 'relative',
        },
        corner: {
          position: 'absolute',
          width: moderateScale(30),
          height: moderateScale(30),
          borderColor: '#ffffff',
          borderWidth: moderateScale(3),
        },
        topLeft: {
          top: 0,
          left: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
        topRight: {
          top: 0,
          right: 0,
          borderLeftWidth: 0,
          borderBottomWidth: 0,
        },
        bottomLeft: {
          bottom: 0,
          left: 0,
          borderRightWidth: 0,
          borderTopWidth: 0,
        },
        bottomRight: {
          bottom: 0,
          right: 0,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        instructionContainer: {
          marginTop: verticalScale(40),
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(12),
          borderRadius: moderateScale(20),
          maxWidth: '80%',
        },
        controlsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: verticalScale(20),
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          gap: moderateScale(10),
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        },
        controlButton: {
          flex: 1,
          paddingVertical: moderateScale(12),
          borderRadius: moderateScale(25),
          alignItems: 'center',
          justifyContent: 'center',
        },
        primaryButton: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        },
        secondaryButton: {
          borderWidth: 1,
          borderColor: '#E0E0E0',
        },
        scannedCodesContainer: {
          maxHeight: verticalScale(180),
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          paddingBottom: verticalScale(20),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        },
        scannedCodesHeader: {
          paddingVertical: moderateScale(12),
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
          marginBottom: moderateScale(10),
        },
        scannedCodeCard: {
          borderWidth: 1,
          borderRadius: moderateScale(10),
          padding: moderateScale(12),
          marginBottom: moderateScale(8),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        scannedCodeValue: {
          marginTop: moderateScale(4),
        },
        moreItemsText: {
          marginTop: moderateScale(8),
        },
        permissionContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: LayoutMetrics.padding.horizontal,
        },
        messageCard: {
          padding: moderateScale(24),
          borderRadius: moderateScale(10),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          width: '100%',
          alignItems: 'center',
        },
        permissionText: {
          marginTop: moderateScale(12),
          marginBottom: moderateScale(20),
          lineHeight: moderateScale(20),
        },
      }),
    [colors],
  );
};

export default BarcodeScanner;
