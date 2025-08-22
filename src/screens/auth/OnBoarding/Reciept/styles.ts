import React, { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../../../context/themeContext';

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        // Footer component styles
        footerContainer: {
          alignItems: 'center',
          gap: 16,
          marginVertical: 10,
        },
        footerButton: {
          width: '47%',
        },
        confirmButton: {
          backgroundColor: colors.primary,
          experimental_backgroundImage: '',
        },

        // RenderProducts component styles
        productContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          height: 50,
          paddingHorizontal: 16,
          width: '100%',
          shadowColor: '#000',
          backgroundColor: colors.white,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 10,
        },
        productRightSection: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'space-between',
        },
        dotsIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },

        // Receipt component styles
        flatList: {
          flex: 1,
        },
        flatListContent: {
          paddingHorizontal: 5,
          paddingBottom: 100,
        },
        listHeader: {
          borderBottomWidth: 1,
          marginBottom: 10,
          alignSelf: 'flex-start',
          gap: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.white,
        },
        editIcon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
          tintColor: colors.black,
        },
        itemSeparator: {
          height: 10,
        },
        menuOptionContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 20,
        },
        optionText: {
          fontSize: 14,
          fontFamily: 'Satoshi-Regular',
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
};

export default useStyles;
