import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

export const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 20,
      gap: 10,
      flex: 1,
    },
    avatarOuter: {
      height: 100,
      width: 100,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
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
      height: '70%',
      width: '70%',
      borderRadius: 100,
      resizeMode: 'contain',
    },
    profilePressable: {
      width: '100%',
      height: 50,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
      borderColor: colors.gray5,
      borderBottomWidth: 1,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    iconUser: {
      height: 20,
      width: 20,
    },
    iconArrow: {
      height: 18,
      width: 18,
      resizeMode: 'contain',
      // tintColor will be set inline due to dynamic color
    },
    buttonText: {
      flexShrink: 1,
    },
    // Delte account styles

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
    divider: {
      height: StyleSheet.hairlineWidth,
      width: '100%',
      backgroundColor: colors.lightGrey,
    },
  });
