import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../theme/colors';
import { LayoutMetrics } from '../../../../theme/commonLayout';

export const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingBottom: 50,
      paddingHorizontal: 0,
    },
    descriptionText: {
      marginTop: 10,
      width: '80%',
      marginLeft: LayoutMetrics.padding.horizontal,
    },
    uploadLaterButton: {
      backgroundColor: colors.gray5,
      experimental_backgroundImage: '',
      marginTop: 30,
      alignSelf: 'center',
    },
  });
