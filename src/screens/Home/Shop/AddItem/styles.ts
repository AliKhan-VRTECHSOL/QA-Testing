import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../theme/colors';
import { DimensionsData } from '../../../../utils/scaling';
import fonts from '../../../../theme/fonts';
import { LayoutMetrics } from '../../../../theme/commonLayout';

const useStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      marginTop: 16,
      gap: 10,
    },
    formFieldContainer: {
      gap: 12,
    },
    qtySubtotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    qtyInputContainer: {
      borderWidth: 1,
      flex: 1,
      borderRadius: LayoutMetrics.input.borderRadiusSmall,
      height: LayoutMetrics.input.heightSmall,
      borderColor: colors.lightGrey,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: DimensionsData.windowWidth / 2 - 32,
      paddingRight: LayoutMetrics.padding.horizontal,
    },
    qtyTextInput: {
      flex: 1,
      paddingHorizontal: 16,
      fontFamily: fonts.family.medium,
      fontSize: 16,
      color: colors.textPrimary,
    },
    unitLabel: {
      fontFamily: fonts.family.medium,
      fontSize: 16,
      color: colors.lightGrey,
      marginRight: 8,
    },
    qtyButtonsContainer: {},
    arrowIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
    },
    arrowUpIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      transform: [{ rotate: '180deg' }],
    },
    footer: {
      alignItems: 'center',
      gap: 10,
      marginVertical: 10,
    },
    saveAndAddButton: {
      marginBottom: 16,
      backgroundColor: colors.gray5,
      experimental_backgroundImage: '',
    },
    addProductButton: {
      backgroundColor: colors.primary,
      experimental_backgroundImage: '',
    },
  });
};

export default useStyles;
