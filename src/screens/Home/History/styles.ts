import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../theme/colors';
import { LayoutMetrics } from '../../../theme/commonLayout';

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        mainContainer: {
          flex: 1,
          backgroundColor: colors.white,
        },
        container: {
          backgroundColor: colors.white,
        },
        contentContainer: {
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          paddingBottom: 150,
          paddingTop: 10,
        },
        listHeader: {
          gap: 12,
          backgroundColor: colors.white,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          paddingTop: 16,
        },
        rowSpaced: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        filterIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.primary,
        },
        purchaseAgainButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        },
        historyArrowIcon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
        },
        emptyContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 60,
        },
        emptyIcon: {
          width: 64,
          height: 64,
          resizeMode: 'contain',
          tintColor: colors.gray3,
          marginBottom: 16,
        },
        emptyTitle: {
          marginBottom: 8,
        },
        emptySubtitle: {
          textAlign: 'center',
          paddingHorizontal: 32,
        },
        modalContainer: {
          backgroundColor: colors.white,
          borderRadius: 12,
          padding: 24,
          margin: 20,
          minWidth: 280,
          maxWidth: 320,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
        },
        modalTitle: {
          marginBottom: 12,
        },
        modalMessage: {
          textAlign: 'center',
          marginBottom: 20,
        },
        modalButton: {
          backgroundColor: colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          minWidth: 80,
          alignItems: 'center',
        },
        card: {
          backgroundColor: colors.white,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: colors.gray3,
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 2,
          gap: 12,
        },
        rowBetween: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        arrow: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
        },
        iconAndText: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        iconCircle: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.secondaryOpacity1,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        },
        icon: {
          width: 16,
          height: 16,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default useStyles;
