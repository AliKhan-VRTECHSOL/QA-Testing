import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../theme/colors';
import { LayoutMetrics } from '../../../../theme/commonLayout';

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          alignItems: 'center',
          gap: 20,
          paddingTop: 20,
        },
        topViewWrapper: {
          width: '100%',
          alignItems: 'center',
          gap: 20,
          height: 96,
        },
        footerContainer: {
          marginVertical: 10,
          alignItems: 'center',
          gap: 24,
        },
        skipButton: {
          textDecorationLine: 'underline',
          textDecorationColor: colors.gray3,
        },
        gradientBorderContainer: {
          height: LayoutMetrics.button.height,
          borderRadius: 24,
          experimental_backgroundImage: colors.gradientColor,
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: 1,
        },
        gradientBorderInnerContainer: {
          height: LayoutMetrics.button.height - 2,
          backgroundColor: colors.white,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
        },
        groceryStoreItemContainer: {
          borderWidth: 1,
          borderColor: colors.gray5,
          borderRadius: 12,
          padding: 8,
          gap: 10,
          width: '48%',
        },
        groceryStoreImage: {
          width: '100%',
          height: 100,
          borderRadius: 6,
          backgroundColor: colors.gray5,
        },
        imageNotFoundStyle: {
          width: '40%',
          resizeMode: 'contain',
          alignSelf: 'center',
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
        columnWrapperStyle: {
          justifyContent: 'space-between',
        },
        contentContainerStyle: {
          paddingVertical: 10,
        },
        itemHeartContainer: {
          position: 'absolute',
          width: 25,
          height: 25,
          top: 20,
          right: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
          borderRadius: 100,
          overflow: 'hidden',
        },
        itemHeartIcon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
          marginTop: 2,
        },
      }),
    [colors],
  );
};

export default useStyles;
