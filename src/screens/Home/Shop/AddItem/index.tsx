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
import debounce from 'lodash/debounce';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const AddItem = ({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}) => {
  const { storeBranch, onAdd } = route.params;
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [selectedStore, setSelectedStore] = useState<string>(storeBranch);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [subTotal, setSubTotal] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('each');

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

  const handleAddItem = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    const receiptData = {
      storeBranch: selectedStore,
      category: selectedCategory,
      productName,
      unit: selectedUnit,
      unitPrice: parseFloat(unitPrice.replace('$', '')),
      quantity: qty,
      subTotal: parseFloat(subTotal),
    };

    try {
      if (onAdd) {
        onAdd(receiptData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error in handleAddItem:', error);
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
    selectedUnit,
    navigation,
  ]);

  const Footer = () => (
    <View style={styles.footer}>
      <CustomHighlightButton
        title='Save'
        onPress={handleAddItem}
        disabled={!isFormValid || isSubmitting}
      />
    </View>
  );

  return (
    <SAScrollView
      IndividualkeyboardVerticalOffset={-30}
      header={<Header title='Add New Item' variant='titleLeft' />}
      footer={<Footer />}
    >
      <View style={styles.container}>
        <DropDownModal
          title='Store Branch'
          smallVariant
          selectedValue={selectedStore}
          setSelectedValue={setSelectedStore}
          options={['Store 1', 'Store 2', 'Store 3', storeBranch]}
        />
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

export default AddItem;
