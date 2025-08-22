import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../theme/colors';
import { DimensionsData } from '../../../../utils/scaling';
import { LayoutMetrics } from '../../../../theme/commonLayout';

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    orderDetailImage: {
      width: DimensionsData.screenWidth,
      height: 80,
      resizeMode: 'cover',
    },
    contentContainerStyle: {
      paddingHorizontal: 0,
      flexGrow: 1,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 8,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      minWidth: 80,
      justifyContent: 'center',
    },
    cameraIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    dateUploadSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    itemsTitle: {
      marginVertical: 10,
    },
    itemsContainer: {
      marginTop: 8,
      backgroundColor: colors.white,
    },
    orderItemContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: LayoutMetrics.padding.horizontal,
      width: '100%',
    },
    orderItemLeft: {
      flex: 1,
    },
    itemDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    itemPriceContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4,
      minWidth: 80,
    },
    subtotalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray5,
    },
    purchaseAgainButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
      marginTop: 32,
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.primary,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    historyArrowIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      tintColor: colors.primary,
    },
    receiptsSection: {
      marginTop: 24,
    },
    receiptContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.lightGrey,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    receiptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    receiptTotal: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.lightGrey,
    },
    footerContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 24,
      alignItems: 'center',
      gap: 14,
      flexWrap: 'wrap',
    },
  });

export default useStyles;
