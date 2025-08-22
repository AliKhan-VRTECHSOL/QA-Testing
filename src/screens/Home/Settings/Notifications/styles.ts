import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingVertical: 10,
    },
    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      borderBottomWidth: 1,
      borderColor: colors.gray5,
      borderRadius: 10,
      padding: 10,
    },
  });
