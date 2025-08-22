import { ThemeColors } from '../../../../theme/colors';
import { StyleSheet } from 'react-native';
import { LayoutMetrics } from '../../../../theme/commonLayout';

export const useStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: 16,
    },
    columnWrapperStyle: {
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    contentContainerStyle: {
      paddingTop: 10,
    },
  });
};
