import React, { ReactNode, useMemo } from 'react';
import { Pressable, View, Image, StyleSheet } from 'react-native';
import { Text } from '..';
import { formatDate } from '../../utils/utils';
import { useTheme } from '../../context/themeContext';
import { Icons } from '../../assets/Icons';
import { useRecieptStore } from '../../store/receiptStore';
import { useNavigation } from '@react-navigation/native';

const WishListRenderItem = ({
  item,
  index,
  bottomComponent,
  onPress,
}: {
  item: any;
  index: number;
  bottomComponent?: ReactNode;
  onPress?: () => void;
}) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.card}
      onPress={
        onPress
          ? onPress
          : () => {
              useRecieptStore.getState().setReceipts(item.receipts);
              navigation.navigate('Reciept', {
                type: 'edit',
                index: index,
                fromOnboarding: true // Onboarding flow
              });
            }
      }
    >
      <View style={styles.rowBetween}>
        <Text textStyle='medium14' color={colors.black}>
          {formatDate(item.date, 'shortDate')}
          <Text textStyle='regular14' style={{ marginLeft: 8 }} color={colors.gray3}>
            {'  ' + formatDate(item.date, 'timeAgo')}
          </Text>
        </Text>
        <Image source={Icons.arrowRight} style={styles.arrow} />
      </View>
      <View style={styles.rowBetween}>
        <View style={styles.iconAndText}>
          <View style={styles.iconCircle}>
            <Image source={Icons.products} style={styles.icon} resizeMode='contain' />
          </View>
          <View>
            <Text textStyle='bold16' color={colors.black}>
              {item.receipts[0].storeBranch}
            </Text>
            <Text textStyle='regular14' color={colors.gray3}>
              {item.receipts.length} items
            </Text>
          </View>
        </View>
        <Text textStyle='bold16' color={colors.black}>
          $
          {item.totalAmount
            ? item.totalAmount.toFixed(2)
            : item.receipts.reduce((acc: number, curr: any) => acc + curr.subTotal, 0).toFixed(2)}
        </Text>
      </View>
      {bottomComponent}
    </Pressable>
  );
};

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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

export default WishListRenderItem;
