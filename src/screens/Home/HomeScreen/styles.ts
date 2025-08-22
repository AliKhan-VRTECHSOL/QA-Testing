import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeColors } from '../../../theme/colors';
import { LayoutMetrics } from '../../../theme/commonLayout';
import fonts from '../../../theme/fonts';
import { DimensionsData } from '../../../utils/scaling';

const useStyles = (colors: ThemeColors) => {
  const { top, bottom } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        mainContainer: {
          flex: 1,
          backgroundColor: colors.white,
        },
        mainContentContainerStyle: {
          paddingBottom: bottom,
        },
        headerContainer: {
          backgroundColor: colors.primary,
          padding: LayoutMetrics.padding.horizontal,
          paddingTop: top + 20,
          gap: 20,
        },
        rowSpaced: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        nameCaretDown: {
          width: 16,
          height: 16,
          tintColor: colors.white,
          resizeMode: 'contain',
        },
        notificationIcon: {
          width: 28,
          height: 28,
          resizeMode: 'contain',
        },
        searchWrapper: {
          borderRadius: LayoutMetrics.input.borderRadiusSmall,
          height: LayoutMetrics.input.heightSmall,
          backgroundColor: colors.primaryLowOpacity,
          overflow: 'hidden',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        searchInputField: {
          flex: 1,
          height: '100%',
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          color: colors.white,
          fontFamily: fonts.family.medium,
          fontSize: 16,
        },
        searchIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
          tintColor: colors.white,
          marginRight: LayoutMetrics.padding.horizontal,
        },
        filterButtonContainer: {
          borderRadius: LayoutMetrics.input.borderRadiusSmall,
          height: LayoutMetrics.input.heightSmall,
          width: LayoutMetrics.input.heightSmall,
          backgroundColor: colors.primaryLowOpacity,
          alignItems: 'center',
          justifyContent: 'center',
        },
        filterIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
        },
        groceryStoreItemContainer: {
          width: (DimensionsData.windowWidth - 32) / 2,
          height: 170,
          borderWidth: 1,
          borderColor: colors.gray5,
          borderRadius: 12,
          padding: 8,
          gap: 10,
        },
        groceryStoreImage: {
          flex: 1,
          width: '100%',
          borderRadius: 6,
        },
        locationWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          width: '100%',
          flexShrink: 1,
        },
        locationPin: {
          width: 14,
          height: 14,
          resizeMode: 'contain',
        },
        categoriesItemContainer: {
          width: 100,
          alignItems: 'center',
          padding: 10,
          gap: 8,
        },
        categoryImageWrapper: {
          width: 64,
          height: 64,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.imageBGColor,
        },
        specialCategoryImage: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
        categoryImage: {
          width: 48,
          height: 48,
          resizeMode: 'contain',
        },
        addReceiptCardContainer: {
          margin: LayoutMetrics.padding.horizontal,
          padding: LayoutMetrics.padding.horizontal,
          borderWidth: 1,
          borderColor: colors.gray5,
          borderRadius: 16,
          marginTop: 6,
        },
        addReceiptTagWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
        },
        aiIcon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
        },
        addReceiptDescription: {
          marginTop: 4,
          marginBottom: LayoutMetrics.padding.horizontal,
        },
      }),
    [colors],
  );
};

export default useStyles;
