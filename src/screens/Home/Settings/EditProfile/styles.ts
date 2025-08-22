import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    mainContainer: {
      marginTop: 20,
      gap: 10,
      width: '100%',
    },
    headerContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
    },
    avatarOuter: {
      height: 140,
      width: 140,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
      marginBottom: 12,
    },
    avatarInner: {
      height: '100%',
      width: '100%',
      borderWidth: 1,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    avatarImage: {
      height: '100%',
      width: '100%',
      borderRadius: 100,
    },
  });
