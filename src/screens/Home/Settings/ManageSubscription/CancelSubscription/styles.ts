import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../../theme/colors';

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingVertical: 24,
      gap: 24,
    },
    footer: {
      marginVertical: 10,
      gap: 10,
      paddingHorizontal: 16,
    },
    savedOnList: {
      gap: 16,
    },
    savedOnItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    checkIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      width: '100%',
      backgroundColor: colors.lightGrey,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    checkBoxContainer: {
      width: 24,
      height: 24,
      backgroundColor: colors.gray5,
      borderColor: colors.gray5,
    },
    checkBoxIcon: {
      width: 14,
      height: 14,
    },
    alertContainer: {
      padding: 24,
      backgroundColor: 'white',
      marginTop: 'auto',
      marginBottom: 'auto',
      borderRadius: 24,
      marginHorizontal: 24,
      gap: 20,
      paddingBottom: 50,
    },
    alertCloseButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      backgroundColor: colors.gray5,
    },
    alertCloseIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
    infoCard: {
      backgroundColor: colors.subscriptionCardBGColor,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    infoIcon: {
      tintColor: colors.primary,
      width: 16,
      height: 16,
      opacity: 1,
    },
    infoText: {
      flexShrink: 1,
    },
    gotItText: {
      alignSelf: 'center',
      paddingVertical: 2,
      marginVertical: 2,
      textDecorationLine: 'underline',
      textDecorationColor: colors.primary,
    },
  });

export default getStyles;
