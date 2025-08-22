import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../context/themeContext';

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          paddingHorizontal: 16,
          marginBottom: 20,
        },
        footerButton: {
          borderRadius: 24,
          backgroundColor: colors.primary,
          experimental_backgroundImage: '',
        },
        flatListContent: {
          paddingVertical: 10,
        },
        listEmptyContainer: {
          alignItems: 'center',
          marginVertical: 50,
        },
      }),
    [colors],
  );
};

export default useStyles;
