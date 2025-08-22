import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../theme/colors';
import { DimensionsData } from '../../../../utils/scaling';

export const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    columnWrapperStyle: {
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    contentContainerStyle: {
      paddingTop: 10,
    },
  });
