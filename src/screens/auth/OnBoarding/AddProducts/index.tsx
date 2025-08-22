import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  CustomHighlightButton,
  DropDownModal,
  InputField,
  SAScrollView,
  Text,
} from '../../../../components';
import Header from '../../../../components/Headers/Header';
import { View, TextInput, Image, Pressable } from 'react-native';
import { useTheme } from '../../../../context/themeContext';
import { Icons } from '../../../../assets/Icons';
import useStyles from './styles';
import { useRecieptStore } from '../../../../store/receiptStore';
import { UploadChannel } from '../../../../store/transactionStore';
import { useOverlay } from '../../../../context/OverlayContext';
import debounce from 'lodash/debounce';

const AddProducts = ({ navigation, route }: { navigation: any; route: any }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { showAlert } = useOverlay();
  const { type, item, index, onUpdate, mode = 'new', preFilledProduct } = route.params;
  const [selectedStore, setSelectedStore] = useState<string>(() => {
    if (type === 'edit') {
      return item.storeBranch;
    }
    if (mode === 'append') {
      // In append mode, get the current store from receipt store
      const currentReceipts = useRecieptStore.getState().receipts;
      console.log('AddProducts - Current receipts:', currentReceipts);
      if (currentReceipts.length > 0) {
        console.log('AddProducts - Setting store to:', currentReceipts[0].storeBranch);
        return currentReceipts[0].storeBranch;
      } else {
        // If no current receipts, try to get from queue
        const { receiptQueue, currentQueuePosition } = useRecieptStore.getState();
        console.log(
          'AddProducts - No current receipts, checking queue:',
          receiptQueue,
          'position:',
          currentQueuePosition,
        );
        if (
          receiptQueue.length > 0 &&
          receiptQueue[currentQueuePosition] &&
          receiptQueue[currentQueuePosition].length > 0
        ) {
          const storeFromQueue = receiptQueue[currentQueuePosition][0].storeBranch;
          console.log('AddProducts - Found store from queue:', storeFromQueue);
          return storeFromQueue;
        }
      }
    }
    return '';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    type === 'edit' ? item.category : preFilledProduct?.category || '',
  );
  const [productName, setProductName] = useState<string>(
    type === 'edit' ? item.productName : preFilledProduct?.productName || '',
  );
  const [unitPrice, setUnitPrice] = useState<string>(
    type === 'edit'
      ? `$${item.unitPrice.toFixed(2)}`
      : preFilledProduct
      ? `$${preFilledProduct.unitPrice.toFixed(2)}`
      : '',
  );
  const [qty, setQty] = useState<number>(
    type === 'edit' ? item.quantity : preFilledProduct?.quantity || 1,
  );
  const [subTotal, setSubTotal] = useState<string>(
    type === 'edit'
      ? item.subTotal.toString()
      : preFilledProduct
      ? preFilledProduct.subTotal.toString()
      : '',
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>(
    type === 'edit' ? item.unit : preFilledProduct?.unit || 'each',
  );

  const isFormValid =
    selectedStore &&
    selectedCategory &&
    productName &&
    unitPrice &&
    !isNaN(parseFloat(unitPrice.replace('$', ''))) &&
    qty > 0 &&
    subTotal &&
    !isNaN(parseFloat(subTotal));

  const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const decrementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedIncrementTap = useRef(
    debounce(() => {
      setQty(prev => prev + 1);
    }, 200),
  ).current;

  const debouncedDecrementTap = useRef(
    debounce(() => {
      setQty(prev => (prev > 1 ? prev - 1 : 1));
    }, 200),
  ).current;

  const handleIncrementPressIn = useCallback(() => {
    if (incrementIntervalRef.current) return;
    incrementIntervalRef.current = setInterval(() => {
      setQty(prev => prev + 1);
    }, 150);
  }, []);

  const handleIncrementPressOut = useCallback(() => {
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  }, []);

  const handleDecrementPressIn = useCallback(() => {
    if (decrementIntervalRef.current) return;
    decrementIntervalRef.current = setInterval(() => {
      setQty(prev => (prev > 1 ? prev - 1 : 1));
    }, 150);
  }, []);

  const handleDecrementPressOut = useCallback(() => {
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (incrementIntervalRef.current) clearInterval(incrementIntervalRef.current);
      if (decrementIntervalRef.current) clearInterval(decrementIntervalRef.current);
      debouncedIncrementTap.cancel();
      debouncedDecrementTap.cancel();
    };
  }, [debouncedIncrementTap, debouncedDecrementTap]);

  useEffect(() => {
    if (subTotal && !isNaN(parseFloat(subTotal)) && qty) {
      const calculatedUnitedPrice = (parseFloat(subTotal) / qty).toFixed(2);
      setUnitPrice(`$${calculatedUnitedPrice}`);
    } else {
      setUnitPrice('');
    }
  }, [qty, subTotal]);

  // Update store if not set initially but becomes available in append mode
  useEffect(() => {
    if (mode === 'append' && !selectedStore) {
      const currentReceipts = useRecieptStore.getState().receipts;
      if (currentReceipts.length > 0) {
        console.log('AddProducts - Updating store from receipts:', currentReceipts[0].storeBranch);
        setSelectedStore(currentReceipts[0].storeBranch);
      } else {
        // Try to get from queue
        const { receiptQueue, currentQueuePosition } = useRecieptStore.getState();
        if (
          receiptQueue.length > 0 &&
          receiptQueue[currentQueuePosition] &&
          receiptQueue[currentQueuePosition].length > 0
        ) {
          const storeFromQueue = receiptQueue[currentQueuePosition][0].storeBranch;
          console.log('AddProducts - Updating store from queue:', storeFromQueue);
          setSelectedStore(storeFromQueue);
        }
      }
    }
  }, [mode]); // Removed selectedStore from dependencies to prevent infinite loop

  // Additional effect to ensure store is set when component mounts in append mode
  useEffect(() => {
    if (mode === 'append' && !selectedStore) {
      // Small delay to ensure store state is available
      const timer = setTimeout(() => {
        const currentReceipts = useRecieptStore.getState().receipts;
        if (currentReceipts.length > 0) {
          console.log(
            'AddProducts - Component mount: Setting store to:',
            currentReceipts[0].storeBranch,
          );
          setSelectedStore(currentReceipts[0].storeBranch);
        } else {
          // Try to get from queue
          const { receiptQueue, currentQueuePosition } = useRecieptStore.getState();
          if (
            receiptQueue.length > 0 &&
            receiptQueue[currentQueuePosition] &&
            receiptQueue[currentQueuePosition].length > 0
          ) {
            const storeFromQueue = receiptQueue[currentQueuePosition][0].storeBranch;
            console.log('AddProducts - Component mount: Setting store from queue:', storeFromQueue);
            setSelectedStore(storeFromQueue);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []); // Run only on mount

  const handleSaveAndAdd = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    const receiptData = {
      storeBranch: selectedStore,
      category: selectedCategory,
      productName: productName,
      unit: selectedUnit,
      unitPrice: parseFloat(unitPrice.replace('$', '')),
      quantity: qty,
      subTotal: parseFloat(subTotal),
      receiptId: item?.receiptId,
    };

    try {
      if (type === 'edit') {
        useRecieptStore.getState().updateReceipt(receiptData);
        navigation.navigate('CommonStack', {
          screen: 'Reciept',
          params: {
            type: 'edit',
            fromOnboarding: true, // Onboarding flow
          },
        });
      } else {
        // Check if this is from barcode scanner (has preFilledProduct and BARCODE upload channel)
        const currentUploadChannel = useRecieptStore.getState().getCurrentUploadChannel();
        const isFromBarcode = preFilledProduct && currentUploadChannel === UploadChannel.BARCODE;

        if (mode === 'append') {
          // Append mode: Add directly to current receipts (same behavior as append receipt)
          useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.FORM_FILLING);
          const result = useRecieptStore.getState().addReceipt(receiptData);

          // Check if duplicate was found
          if (result) {
            showAlert({
              heading: 'Duplicate Product',
              description: `"${receiptData.productName}" already exists in ${receiptData.storeBranch}.`,
              type: 'warning',
              showOKButton: true,
              okButtonText: 'OK',
              onOK: () => {
                // Do nothing - just close the alert
              },
            });
            return; // Don't clear form or proceed with navigation
          }
        } else {
          // New mode: Add to queue with smart grouping
          if (isFromBarcode) {
            // Add to queue for barcode flow
            useRecieptStore.getState().addProductToQueue(receiptData);
          } else {
            // Set upload channel for manually added products and add to queue
            useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.FORM_FILLING);
            useRecieptStore.getState().addProductToQueue(receiptData);
          }
        }

        // In append mode, don't clear the store branch since we're adding to the same receipt
        if (mode !== 'append') {
          setSelectedStore('');
        }
        setSelectedCategory('');
        setProductName('');
        setSelectedUnit('');
        setUnitPrice('');
        setQty(1);
        setSubTotal('');
      }
    } catch (error) {
      console.error('Error in handleSaveAndAdd:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isFormValid,
    isSubmitting,
    selectedStore,
    selectedCategory,
    productName,
    unitPrice,
    qty,
    subTotal,
    type,
    item,
    navigation,
  ]);

  const handleAddProduct = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    const receiptData = {
      storeBranch: selectedStore,
      category: selectedCategory,
      productName: productName,
      unit: selectedUnit,
      unitPrice: parseFloat(unitPrice.replace('$', '')),
      quantity: qty,
      subTotal: parseFloat(subTotal),
      receiptId: item?.receiptId,
    };

    try {

      if (onUpdate) {
        onUpdate(receiptData);
        navigation.goBack();
      } else {
        if (type === 'edit') {
          console.log('receiptData', receiptData);
          useRecieptStore.getState().updateReceipt(receiptData);
        } else {
          console.log('Adding receipt to store:', receiptData);

          // Check if this is from barcode scanner (has preFilledProduct and BARCODE upload channel)
          const currentUploadChannel = useRecieptStore.getState().getCurrentUploadChannel();
          const isFromBarcode = preFilledProduct && currentUploadChannel === UploadChannel.BARCODE;

          if (mode === 'append') {
            // Append mode: Add directly to current receipts (same behavior as append receipt)
            console.log('=== About to call addReceipt ===');
            useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.FORM_FILLING);
            const result = useRecieptStore.getState().addReceipt(receiptData);
            console.log('=== addReceipt called ===');

            // Check if duplicate was found
            if (result) {
              showAlert({
                heading: 'Duplicate Product',
                description: `"${receiptData.productName}" already exists in ${receiptData.storeBranch}.`,
                type: 'warning',
                showOKButton: true,
                okButtonText: 'OK',
                onOK: () => {
                  // Do nothing - just close the alert
                },
              });
              return; // Don't proceed with navigation
            }
          } else {
            // New mode: Add to queue with smart grouping
            if (isFromBarcode) {
              // Add to queue for barcode flow
              useRecieptStore.getState().addProductToQueue(receiptData);
            } else {
              // Set upload channel for manually added products and add to queue
              useRecieptStore.getState().setCurrentUploadChannel(UploadChannel.FORM_FILLING);
              useRecieptStore.getState().addProductToQueue(receiptData);
            }
          }
        }
        // Navigate back to Receipt screen properly
        navigation.navigate('CommonStack', {
          screen: 'Reciept',
          params: {
            type: 'add',
            fromOnboarding: true, // Onboarding flow
          },
        });
      }
      // In append mode, don't clear the store branch since we're adding to the same receipt
      if (mode !== 'append') {
        setSelectedStore('');
      }
      setSelectedCategory('');
      setProductName('');
      setSelectedUnit('');
      setUnitPrice('');
      setQty(1);
      setSubTotal('');
    } catch (error) {
      console.error('Error in handleAddProduct:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isFormValid,
    isSubmitting,
    selectedStore,
    selectedCategory,
    productName,
    unitPrice,
    qty,
    subTotal,
    type,
    item,
    navigation,
  ]);

  const Footer = () => (
    <View style={styles.footer}>
      {onUpdate == null && (
        <CustomHighlightButton
          icon={Icons.add}
          title={type === 'add' ? 'Save and add another product' : 'Update and add another product'}
          onPress={handleSaveAndAdd}
          disabled={!isFormValid || isSubmitting}
        />
      )}
      <CustomHighlightButton
        title={type === 'add' ? 'Save' : 'Update Product'}
        onPress={handleAddProduct}
        disabled={!isFormValid || isSubmitting}
      />
    </View>
  );

  return (
    <SAScrollView
      IndividualkeyboardVerticalOffset={-30}
      header={
        <Header title={type === 'edit' ? 'Edit Product' : 'Add New Product'} variant='titleLeft' />
      }
      footer={<Footer />}
    >
      <View style={styles.container}>
        {mode === 'append' ? (
          <View style={styles.formFieldContainer}>
            <Text textStyle='medium14' color={colors.lightGrey}>
              {'Store Branch'}
            </Text>
            <InputField
              editable={false}
              placeholder='Store Branch'
              placeholderTextColor={colors.gray3}
              containerStyle={{
                borderRadius: 100,
                height: 48,
                backgroundColor: colors.disabled,
              }}
              value={selectedStore}
              onChangeText={() => {}}
            />
          </View>
        ) : (
          <DropDownModal
            title='Store Branch'
            smallVariant
            selectedValue={selectedStore}
            setSelectedValue={setSelectedStore}
            options={['Store 1', 'Store 2', 'Store 3']}
          />
        )}
        <DropDownModal
          title='Category'
          smallVariant
          selectedValue={selectedCategory}
          setSelectedValue={setSelectedCategory}
          options={[
            'Fruits',
            'Vegetables',
            'Dairy',
            'Meat',
            'Bakery',
            'Frozen',
            'Canned',
            'Snacks',
            'Beverages',
            'Household',
            'Personal Care',
            'Other',
          ]}
        />
        <View style={styles.formFieldContainer}>
          <Text textStyle='medium14' color={colors.lightGrey}>
            {'Product name'}
          </Text>
          <InputField
            placeholder='Enter product name'
            placeholderTextColor={colors.gray3}
            containerStyle={{ borderRadius: 100, height: 48 }}
            value={productName}
            onChangeText={setProductName}
          />
        </View>
        <View style={styles.formFieldContainer}>
          <DropDownModal
            title='Unit'
            smallVariant
            selectedValue={selectedUnit}
            setSelectedValue={setSelectedUnit}
            options={['kg', 'g', 'each']}
          />
          <Text textStyle='medium14' color={colors.lightGrey}>
            {'Unit Price'}
          </Text>
          <InputField
            editable={false}
            placeholder='Unit price'
            placeholderTextColor={colors.gray3}
            containerStyle={{
              borderRadius: 100,
              height: 48,
              backgroundColor: colors.disabled,
            }}
            value={unitPrice}
            onChangeText={setUnitPrice}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.qtySubtotalRow}>
          <View style={styles.formFieldContainer}>
            <Text textStyle='medium14' color={colors.lightGrey}>
              {'Qty'}
            </Text>
            <View style={styles.qtyInputContainer}>
              <TextInput
                style={styles.qtyTextInput}
                value={qty.toString() + ' ' + selectedUnit}
                keyboardType='numeric'
                placeholder='0'
                onChangeText={text => {
                  const value = parseInt(text) || 0;
                  setQty(value > 0 ? value : 1);
                }}
                autoCapitalize='none'
                autoComplete='off'
                textContentType='none'
              />
              <View style={styles.qtyButtonsContainer}>
                <Pressable
                  onPressIn={handleIncrementPressIn}
                  onPressOut={handleIncrementPressOut}
                  onPress={debouncedIncrementTap}
                >
                  <Image source={Icons.arrowDown} style={styles.arrowUpIcon} />
                </Pressable>
                <Pressable
                  onPressIn={handleDecrementPressIn}
                  onPressOut={handleDecrementPressOut}
                  onPress={debouncedDecrementTap}
                >
                  <Image source={Icons.arrowDown} style={styles.arrowIcon} />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.formFieldContainer}>
            <Text textStyle='medium14' color={colors.lightGrey}>
              {'Sub Total'}
            </Text>
            <InputField
              placeholder='Enter sub total'
              placeholderTextColor={colors.gray3}
              containerStyle={{ borderRadius: 100, height: 48 }}
              value={subTotal}
              onChangeText={setSubTotal}
              keyboardType='numeric'
              returnKeyType='done'
            />
          </View>
        </View>
      </View>
    </SAScrollView>
  );
};

export default AddProducts;
