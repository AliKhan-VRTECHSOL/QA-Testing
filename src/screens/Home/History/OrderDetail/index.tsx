import React, { useMemo, useCallback, useState } from 'react';
import { View, Image, ActivityIndicator, Pressable } from 'react-native';
import { SAScrollView, Text, CustomHighlightButton } from '../../../../components';
import Header from '../../../../components/Headers/Header';
import { useTheme } from '../../../../context/themeContext';
import useStyles from './styles';
import { Images } from '../../../../assets/images';
import { Icons } from '../../../../assets/Icons';
import { formatDate, getUploadChannelDescription } from '../../../../utils/utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TranscationItemType } from '../../../../constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { DimensionsData } from '../../../../utils/scaling';
import { runOnJS } from 'react-native-worklets';
import AuditOrder from '../../../../components/AuditComponents';
import { useOverlay } from '../../../../context/OverlayContext';
import OrderCompleteMessage from '../../../../components/OrderCompleteMessage';

interface OrderDetailProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ OrderDetail: { orderData: TranscationItemType } }, 'OrderDetail'>;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ navigation, route }) => {
  const { orderData } = route.params;
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localOrderData, setLocalOrderData] = useState(orderData.reciept);
  const [isEditing, setIsEditing] = useState(false);
  const { setFadeInViewContent, setFadeInViewVisible, setFadeInViewStyle } = useOverlay();

  const handleDeleteItem = index => {
    setLocalOrderData(prev => prev.filter((_, findex) => findex !== index));
  };

  const RenderOrderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const offset = useSharedValue(0);
      const itemStyle = useAnimatedStyle(
        () => ({
          transform: [{ translateX: offset.value }],
        }),
        [offset],
      );

      const deleteStyle = useAnimatedStyle(
        () => ({
          width: -offset.value,
        }),
        [offset],
      );

      const gesture = Gesture.Pan()
        .enabled(isEditing)
        .onBegin(() => {})
        .onUpdate(e => {
          offset.value = e.translationX;
          console.log(e);
        })
        .onEnd(e => {
          if (e.translationX < -70) {
            offset.value = withTiming(
              -DimensionsData.windowWidth,
              {
                duration: 300,
              },
              () => runOnJS(handleDeleteItem)(index),
            );
          } else {
            offset.value = withTiming(0); // Use withTiming for smooth reset
          }
        })
        .onFinalize(() => {});
      return (
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              {
                width: DimensionsData.windowWidth,
                left: -16,
                flexDirection: 'row',
              },
              itemStyle,
            ]}
          >
            <Pressable
              onPress={() => {
                navigation.navigate('HistoryOrderStack', {
                  screen: 'OrderItemDetail',
                  params: {
                    orderData: orderData,
                    item: item,
                  },
                });
              }}
              key={`${item.productName}-${index}`}
              style={[styles.orderItemContainer]}
            >
              <View style={styles.orderItemLeft}>
                <View style={styles.itemDetails}>
                  <Text textStyle='bold16' color={colors.black} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text textStyle='regular14' color={colors.lightGrey}>
                    {item.quantity} {item.unit || ''}
                  </Text>
                </View>
              </View>
              <View style={styles.itemPriceContainer}>
                <Text textStyle='bold16' color={colors.lightGrey}>
                  ${item.subTotal}
                </Text>
              </View>
            </Pressable>
            <Animated.View
              style={[
                {
                  backgroundColor: colors.error,
                  height: '100%',
                  minWidth: 120,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                },
                deleteStyle,
              ]}
            >
              <Image
                source={Icons.trash}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: colors.white,
                }}
              />
              <Text textStyle='bold16' color={colors.white}>
                Delete
              </Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      );
    },
    [colors, styles],
  );

  const HeaderComponent = useMemo(
    () => <Header title={`Order ${orderData?.orderId || 'N/A'}`} />,
    [orderData?.orderId],
  );

  const FooterComponent = useMemo(
    () =>
      isEditing ? (
        <View style={styles.footerContainer}>
          <CustomHighlightButton
            title='Approve order'
            onPress={() => {
              setFadeInViewStyle({
                backgroundColor: colors.white,
              });
              setFadeInViewContent(<OrderCompleteMessage />);
              setFadeInViewVisible(true);
              setIsEditing(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <View style={{ flex: 1 }}>
            <CustomHighlightButton
              icon={Icons.pen}
              title='Edit order'
              onPress={() => setIsEditing(true)}
              style={{ borderRadius: 50 }}
              smallVariant
              iconSize={12}
              bgColor={colors.gray5}
              titleColor={colors.primary}
              titleStyle={'bold16'}
            />
          </View>
          <AuditOrder orderData={orderData} />
        </View>
      ),
    [colors, isEditing],
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
  }, []);

  if (!orderData) {
    return (
      <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text textStyle='medium16' color={colors.lightGrey} style={{ marginTop: 16 }}>
          Loading order details...
        </Text>
      </View>
    );
  }

  return (
    <SAScrollView
      header={HeaderComponent}
      footer={FooterComponent}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={Images.banner}
          style={styles.orderDetailImage}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {!imageLoaded && (
          <View
            style={[
              styles.orderDetailImage,
              {
                position: 'absolute',
                backgroundColor: colors.gray5,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <ActivityIndicator size='small' color={colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.rowBetween}>
          <Text
            textStyle='bold24'
            color={colors.black}
            numberOfLines={2}
            style={{ flex: 1, marginRight: 16 }}
          >
            {orderData.storeName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text textStyle='bold14' color={colors.primary}>
              {orderData.orderStatus}
            </Text>
          </View>
        </View>

        <View style={styles.dateUploadSection}>
          <Text textStyle='medium12' color={colors.lightGrey}>
            {formatDate(orderData.newDate, 'shortDate')}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.uploadededBy }]}>
            <Image source={Icons.scanner} style={styles.cameraIcon} />
            <Text textStyle='bold12' color={colors.primary}>
              {getUploadChannelDescription(orderData.uploadChannel)}
            </Text>
          </View>
        </View>

        <Text textStyle='bold18' color={colors.black} style={styles.itemsTitle}>
          Your Items{' '}
          <Text textStyle='bold18' color={colors.lightGrey}>
            ({localOrderData?.length || 0})
          </Text>
        </Text>

        <View style={styles.itemsContainer}>
          {localOrderData && localOrderData.length > 0 ? (
            localOrderData.map((item: any, index: number) => (
              <RenderOrderItem item={item} index={index} />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text textStyle='regular14' color={colors.lightGrey}>
                No items found in this order
              </Text>
            </View>
          )}

          <View style={styles.subtotalContainer}>
            <Text textStyle='bold18' color={colors.black}>
              Subtotal
            </Text>
            <Text textStyle='bold18' color={colors.black}>
              ${orderData.subTotal}
            </Text>
          </View>
        </View>
      </View>
    </SAScrollView>
  );
};

export default OrderDetail;
