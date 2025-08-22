import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import {
  CalendarStrip,
  CustomHighlightButton,
  HiLightedText,
  OutlinedButton,
  Text,
} from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { ThemeColors } from '../../../theme/colors';
import { formatDate } from '../../../utils/utils';
import { LayoutMetrics } from '../../../theme/commonLayout';
import { mockTranscationHistory } from '../../../constants';

import ReceiptSectionList from './ShopSectionList';
import Header from '../../../components/Headers/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOverlay } from '../../../context/OverlayContext';

const Shop = () => {
  const { setFadeInViewContent, setFadeInViewStyle, setFadeInViewVisible } = useOverlay();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const styles = useMemo(() => useStyles(colors, top), [colors, top]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const higlightedDate = formatDate(tomorrow, 'timeAgo', true);

  const [isShoppingMode, setIsShoppingMode] = useState(false);

  const [shopData, setShopData] = useState(() => {
    // TODO: API Integration Required
    // Call: GET /shop/checklist
    // Send: { date: string } (selected date from calendar)
    // Expect: { checklist: ChecklistItem[], stores: Store[] }
    // Handle: Update shopData with checklist items from API

    return mockTranscationHistory.map(
      ({ reciept, storeName, ...k }, kindex) =>
        ({
          collapsed: false, // Start expanded so users can see items
          data: reciept.map(item => ({ ...item, strikethrough: false, notes: '' })), // Initialize strikethrough property
          title: storeName,
          orderData: {
            ...k,
            storeName,
            reciept: reciept.map(item => ({ ...item, strikethrough: false })),
          }, // Include storeName in orderData
        } as any),
    );
  });

  const CancelShoppingModal = useMemo(() => {
    return (
      <>
        <TouchableWithoutFeedback onPress={() => setFadeInViewVisible(false)}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text textStyle='bold18' color={colors.textPrimary} style={styles.modalTitle}>
            Cancel Shopping?
          </Text>
          <Text textStyle='regular14' color={colors.gray3} style={styles.modalMessage}>
            Your current shopping list will be cleared.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <OutlinedButton
                smallVariant
                title='Cancel'
                onPress={() => {
                  setFadeInViewStyle({});
                  setFadeInViewVisible(false);
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomHighlightButton
                smallVariant
                onPress={() => {
                  setFadeInViewStyle({});
                  setFadeInViewVisible(false);
                  setIsShoppingMode(false);
                }}
                titleStyle={'bold16'}
                title='Continue'
              />
            </View>
          </View>
        </View>
      </>
    );
  }, []);

  const handleShowCancelAlert = () => {
    setFadeInViewStyle({
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    });
    setFadeInViewContent(CancelShoppingModal);
    setFadeInViewVisible(true);
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        title='Shopping Checklist'
        headerTextStyle={{ textStyle: 'bold24' }}
        hideBackKey={!isShoppingMode}
        onPress={handleShowCancelAlert}
      />
      <CalendarStrip style={styles.dateWrapperStyle} />
      <HiLightedText
        hiLightedTextStyle={{
          textStyle: 'bold16',
        }}
        textStyle={{
          textStyle: 'medium16',
          color: colors.textPrimary,
          style: {
            marginVertical: 8,
            marginHorizontal: LayoutMetrics.padding.horizontal,
          },
        }}
        highlight={{
          ...higlightedDate.split(' ').reduce((acc, k) => ({ ...acc, [k]: [0] }), {}),
        }}
      >{`${higlightedDate} to go errand date!`}</HiLightedText>
      <ReceiptSectionList
        ListSections={shopData}
        isShoppingMode={isShoppingMode}
        setIsShoppingMode={setIsShoppingMode}
      />
    </View>
  );
};

const useStyles = (colors: ThemeColors, top: number) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: top,
    },
    dateWrapperStyle: {
      left: 0,
    },
    modalContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 24,
      margin: 20,
      minWidth: 280,
      maxWidth: 320,
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    modalTitle: {
      marginBottom: 12,
    },
    modalMessage: {
      textAlign: 'center',
      marginBottom: 20,
    },
  });
};

export default Shop;
