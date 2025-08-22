import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FlatList,
  Image,
  ImageProps,
  Pressable,
  PressableProps,
  ScrollView,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../../context/themeContext';
import { CustomHighlightButton, Text } from '../../../components';
import { Icons, BottomTabIcons } from '../../../assets/Icons';
import { LayoutMetrics } from '../../../theme/commonLayout';
import { CustomTextProps } from '../../../components/types';
import { Images } from '../../../assets/images';
import { useWishListStore } from '../../../store/wishListStore';
import WishListRenderItem from '../../../components/RenderItems/WishListRenderItem';
import RecentOrdersRenderItem from '../../../components/RenderItems/RecentOrdersRenderItem';
import { useFavoriteGroceryStoreStore } from '../../../store/favoriteGroceryStore';
import useFavoriteStores from '../../../utils/useFavoriteStores';

import useStyles from './styles';
import { useRecieptStore } from '../../../store/receiptStore';
import { useFreePlanModal } from '../../../utils/freePlanModal';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import { useTransactionStore } from '../../../store/transactionStore';
import { categoriesData, Category } from '../../../constants/categories';
import { useOverlay } from '../../../context/OverlayContext';

interface CategoryItemProps {
  item: Category;
  index: number;
  wrapperStyle?: ViewStyle;
  imageLink?: ImageProps['source'];
  onPress?: () => void;
}

const CategoryRenderItem: React.FC<CategoryItemProps> = ({
  item,
  index,
  wrapperStyle = {},
  imageLink,
  onPress,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <Pressable onPress={onPress} style={styles.categoriesItemContainer}>
      <View style={[styles.categoryImageWrapper, wrapperStyle]}>
        <Image
          style={imageLink ? styles.specialCategoryImage : styles.categoryImage}
          source={imageLink ? imageLink : item.icon}
        />
      </View>
      <Text center textStyle='medium14' color={colors.textPrimary}>
        {item.name}
      </Text>
    </Pressable>
  );
};

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const HomeScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { wishList, clearWishList } = useWishListStore();
  const { clearReceipts } = useRecieptStore();
  const { favoriteStores } = useFavoriteGroceryStoreStore();
  const [preferredStores, setPreferredStores] = useState<any[]>([]);
  const showModal = useFreePlanModal(navigation);
  const { isSubscribed } = useSubscriptionStore();
  const { getRecentTransactions } = useTransactionStore();

  // Get recent orders (most recent 3 transactions)
  const recentOrders = useMemo(() => {
    return getRecentTransactions(3);
  }, [getRecentTransactions]);

  const { getFavoriteStores } = useFavoriteStores(favoriteStores);

  useEffect(() => {
    clearWishList();
    clearReceipts();
  }, []);

  const handleOrderPress = useCallback(
    (item: any) => {
      navigation.navigate('HistoryOrderStack', {
        screen: 'OrderDetail',
        params: {
          orderData: item,
        },
      });
    },
    [navigation],
  );

  useEffect(() => {
    // TODO: API Integration Required
    // Call: GET /home
    // Send: No data required
    // Expect: { preferredStores: Store[], categories: Category[], recentTransactions: Transaction[] }
    // Handle: Update stores, categories, and transactions in respective stores

    (async () => {
      const storesData = await getFavoriteStores();
      setPreferredStores(storesData);
    })();
  }, [getFavoriteStores]);

  const groceryStoreRenderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <Pressable style={styles.groceryStoreItemContainer}>
        <Image
          style={styles.groceryStoreImage}
          source={{
            uri: item?.photos?.[0]?.photo_reference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
              : item?.icon || Images.groceryStoreImages[index % 2 ? 0 : 1],
          }}
        />
        <Text textStyle='medium16' color={colors.black}>
          {item?.name || 'Woolworths Metro'}
        </Text>
        <View style={styles.locationWrapper}>
          <Image source={Icons.locationPin} style={styles.locationPin} />
          <Text
            style={{
              flex: 1,
            }}
            numberOfLines={1}
            textStyle='medium12'
            color={colors.primary}
          >
            {item?.formatted_address || '73 Belmore Rd, Randwicks 73 Belmore Rd, Randwicks'}
          </Text>
        </View>
      </Pressable>
    );
  };

  const ItemSeparatorComponent = () => (
    <View
      style={{
        width: 13,
      }}
    />
  );

  const GroceryStoresSection = () => {
    if (preferredStores.length === 0) {
      return (
        <View>
          <HeadingRow textStyle='bold22' title='Grocery Stores' buttonTag='' />
          <View
            style={{
              alignItems: 'center',
              gap: 16,
              paddingVertical: 40,
              paddingHorizontal: LayoutMetrics.padding.horizontal,
            }}
          >
            <Image
              source={Images.noPreference}
              style={{
                width: 80,
                height: 80,
                resizeMode: 'contain',
              }}
            />
            <Text center textStyle='medium16' color={colors.textPrimary}>
              No preferred stores added
            </Text>
            <CustomHighlightButton
              onPress={() =>
                navigation.navigate('HomeStack', {
                  screen: 'SettingStack',
                  params: { screen: 'AddStore' },
                })
              }
              title='Add Store'
              smallVariant
              style={{
                width: 150,
              }}
            />
          </View>
        </View>
      );
    }

    return (
      <View>
        <HeadingRow
          textStyle='bold22'
          title='Grocery Stores'
          buttonTag='See all'
          onPressButton={() =>
            navigation.navigate('SettingStack', { screen: 'ShoppingPreferences' })
          }
        />
        <FlatList
          data={preferredStores}
          renderItem={groceryStoreRenderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorComponent}
          contentContainerStyle={{
            paddingHorizontal: LayoutMetrics.padding.horizontal,
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.rowSpaced}>
          <View>
            <Text textStyle='black22' color={colors.white}>
              Hi Jon
            </Text>
            <View style={styles.row}>
              <Text textStyle='medium14' color={colors.white}>
                120 Rainbow St,Randwick
              </Text>
              <Pressable>
                <Image style={styles.nameCaretDown} source={Icons.arrowDown} />
              </Pressable>
            </View>
          </View>
          <Image style={styles.notificationIcon} source={Icons.bellIcon} />
        </View>
        <View style={styles.row}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInputField}
              placeholder='Search something here...'
              placeholderTextColor={colors.white}
              autoCapitalize='none'
              autoComplete='off'
              textContentType='none'
            />
            <Image source={Icons.Search} style={styles.searchIcon} />
          </View>
          <Pressable style={styles.filterButtonContainer}>
            <Image source={Icons.filter} style={styles.filterIcon} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContentContainerStyle}
      >
        <GroceryStoresSection />
        <View>
          <HeadingRow
            title='Categories'
            buttonTag='View all'
            onPressButton={() => {
              if (isSubscribed) {
                navigation.navigate('CategoriesStack', {
                  screen: 'Categories',
                });
              } else {
                showModal();
              }
            }}
          />
          <FlatList
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <CategoryRenderItem
                    onPress={() =>
                      navigation.navigate('CategoriesStack', {
                        screen: 'SubCategoryReport',
                        params: { item: categoriesData[0] },
                      })
                    }
                    imageLink={Icons.refreshIcon}
                    wrapperStyle={{
                      backgroundColor: colors.primary,
                    }}
                    item={categoriesData[0]}
                    index={0}
                  />
                  <CategoryRenderItem
                    onPress={() =>
                      navigation.navigate('CategoriesStack', {
                        screen: 'SubCategoryReport',
                        params: { item: categoriesData[1] },
                      })
                    }
                    imageLink={Icons.dollarIcon}
                    wrapperStyle={{
                      borderWidth: 5,
                      borderColor: colors.error,
                    }}
                    item={categoriesData[1]}
                    index={1}
                  />
                </View>
              );
            }}
            data={categoriesData.slice(2, 6)}
            renderItem={({ item, index }) => (
              <CategoryRenderItem
                item={item}
                index={index + 2}
                onPress={() => {
                  navigation.navigate('CategoriesStack', {
                    screen: 'SubCategoryReport',
                    params: { item },
                  });
                }}
              />
            )}
            horizontal
            ItemSeparatorComponent={ItemSeparatorComponent}
            contentContainerStyle={{
              paddingHorizontal: LayoutMetrics.padding.horizontal,
            }}
          />
        </View>
        <View>
          <HeadingRow
            title='Your orders'
            buttonTag='History'
            onPressButton={() => navigation.navigate('History')}
          />
          {recentOrders.length > 0 ? (
            <FlatList
              data={recentOrders}
              contentContainerStyle={{
                padding: LayoutMetrics.padding.horizontal,
              }}
              renderItem={({ item, index }) => (
                <RecentOrdersRenderItem item={item} index={index} onPress={handleOrderPress} />
              )}
              keyExtractor={item => item.orderId}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                gap: 16,
                paddingVertical: 40,
                paddingHorizontal: LayoutMetrics.padding.horizontal,
              }}
            >
              <Image
                source={BottomTabIcons.history}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: 'contain',
                }}
              />
              <Text center textStyle='medium16' color={colors.textPrimary}>
                No recent orders
              </Text>
              <Text center textStyle='regular14' color={colors.lightGrey}>
                Your order history will appear here
              </Text>
            </View>
          )}
        </View>
        <View>
          <HeadingRow title='Add your receipts' />
          <View style={styles.addReceiptCardContainer}>
            <View style={styles.addReceiptTagWrapper}>
              <Text textStyle='bold16' color={colors.textPrimary}>
                Predict your next grocery run
              </Text>
              <Image source={Icons.aiICon} style={styles.aiIcon} />
              <Text textStyle='bold14' color={colors.primary}>
                AI
              </Text>
            </View>
            <Text
              style={styles.addReceiptDescription}
              textStyle='regular16'
              color={colors.lightGrey}
            >
              Simply take a photo or upload your receipt
            </Text>
            <CustomHighlightButton
              onPress={() => navigation.navigate('AddReceipt')}
              title='Upload receipts'
              smallVariant
              bgColor={colors.primary}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

interface HeadingRowProps extends CustomTextProps {
  title: string;
  buttonTag?: string;
  onPressButton?: PressableProps['onPress'];
}

const HeadingRow: React.FC<HeadingRowProps> = ({ title, buttonTag, onPressButton, ...props }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: LayoutMetrics.padding.horizontal,
        paddingVertical: 10,
      }}
    >
      <Text color={colors.black} {...props} textStyle={props.textStyle || 'black22'}>
        {title}
      </Text>
      {buttonTag ? (
        <Pressable
          onPress={onPressButton}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Text
            style={{
              textDecorationLine: 'underline',
              textDecorationColor: colors.primary,
            }}
            textStyle='medium14'
            color={colors.primary}
          >
            {buttonTag}
          </Text>
          <Image
            style={{
              height: 14,
              width: 14,
              resizeMode: 'contain',
            }}
            source={Icons.arrowRight}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

export default HomeScreen;
