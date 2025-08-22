import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: 'column',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.white,
    },
    addItemButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginVertical: 12,
      borderWidth: 2,
      borderColor: colors.gray5,
      borderStyle: 'dashed',
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.white,
    },
    addItemContainer: {
      paddingVertical: 8,
    },
    letsShopContainer: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: colors.white,
    },
    letsShopButton: {
      borderRadius: 25,
      height: 50,
    },
    menuContent: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: colors.white,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 0,
      minWidth: 140,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 10,
    },
    menuItem: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGrey,
    },
    confirmationContent: {
      paddingVertical: 16,
      paddingBottom: 50,
      // flex: 1,
    },
    scrollableList: {
      // flex: 1,
      marginBottom: 16,
    },
    scrollableListContent: {
      paddingBottom: 8,
    },
    unselectedItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.lightGrey,
      paddingHorizontal: 40,
    },
    confirmationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%',
    },
    confirmationButton: {
      flex: 1,
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    finalizeButton: {
      backgroundColor: colors.primary,
    },
  });

export default useStyles;
