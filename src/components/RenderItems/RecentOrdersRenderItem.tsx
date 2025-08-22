import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Text, StatusBadge } from '../index';
import { useTheme } from '../../context/themeContext';
import { Icons } from '../../assets/Icons';
import { formatDate } from '../../utils/utils';
import { TranscationItemType } from '../../constants';

interface RecentOrdersRenderItemProps {
  item: TranscationItemType;
  index: number;
  onPress: (item: TranscationItemType) => void;
}

const RecentOrdersRenderItem: React.FC<RecentOrdersRenderItemProps> = ({
  item,
  index,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => onPress(item)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text textStyle='medium14' color={colors.black}>
          {formatDate(item.newDate, 'shortDate')}
          <Text textStyle='regular14' style={{ marginLeft: 8 }} color={colors.gray3}>
            {'  ' + formatDate(item.newDate, 'timeAgo')}
          </Text>
        </Text>
        <Image source={Icons.arrowRight} style={{ height: 16, width: 16, resizeMode: 'contain' }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Image source={Icons.products} style={{ height: 16, width: 16, resizeMode: 'contain' }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text textStyle='bold16' color={colors.black} numberOfLines={1}>
              {item.storeName}
            </Text>
            <Text textStyle='regular14' color={colors.gray3}>
              {item.reciept.length} items
            </Text>
          </View>
        </View>
        <Text textStyle='bold16' color={colors.black}>
          ${parseFloat(item.subTotal).toFixed(2)}
        </Text>
      </View>

      <StatusBadge
        bgColor={
          item?.orderStatus === 'Estimated'
            ? colors.estimated
            : item?.orderStatus === 'Confirmed'
            ? colors.confirmed
            : colors.primary
        }
        textColor={
          item?.orderStatus === 'Estimated'
            ? colors.estimatedText
            : item?.orderStatus === 'Confirmed'
            ? colors.confirmedText
            : colors.white
        }
      >
        {item?.orderStatus}
      </StatusBadge>
    </Pressable>
  );
};

export default RecentOrdersRenderItem;
