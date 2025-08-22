import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text, StatusBadge } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { Icons, BottomTabIcons } from '../../../assets/Icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWishListStore } from '../../../store/wishListStore';
import { useTransactionStore } from '../../../store/transactionStore';
import { formatDate } from '../../../utils/utils';
import useStyles from './styles';
import ListHeaderComponent from './ListHeader';
import { useOverlay } from '../../../context/OverlayContext';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const History: React.FC<ScreenProps> = ({ navigation }) => {
  const { setFadeInViewStyle, setFadeInViewContent, setFadeInViewVisible } = useOverlay();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 days');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDateRange, selectedType, selectedStore, selectedStatus]);

  const { wishList, addWishList } = useWishListStore();
  const { transactions } = useTransactionStore();

  // TODO: API Integration Required
  // Call: GET /transactions
  // Send: {
  //   page: number,
  //   limit: number,
  //   dateRange?: string,
  //   type?: string,
  //   store?: string,
  //   status?: string
  // }
  // Expect: { transactions: Transaction[], totalPages: number, currentPage: number }
  // Handle: Update transactions in store, handle pagination

  const filteredData = useMemo(() => {
    let filtered = [...transactions];

    const now = new Date();
    const getDateFromRange = (range: string) => {
      switch (range) {
        case 'Last 30 days':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'Last 90 days':
          return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '6 months':
          return new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        case '1 year':
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    };

    const startDate = getDateFromRange(selectedDateRange);
    filtered = filtered.filter(item => new Date(item.newDate) >= startDate);

    if (selectedType !== 'All') {
      filtered = filtered.filter(item => {
        switch (selectedType) {
          case 'Estimated':
            return item.orderStatus === 'Estimated';
          case 'Confirmed':
            return item.orderStatus === 'Confirmed';

          default:
            return true;
        }
      });
    }

    return filtered;
  }, [selectedDateRange, selectedType, transactions]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(0, currentPage * itemsPerPage);

  const checkIfAllProductsInChecklist = useCallback(
    (item: any) => {
      if (!wishList || wishList.length === 0) return false;

      const transactionProducts = item.reciept.map((product: any) => product.productName);

      const wishListProducts = wishList.flatMap(f => f.receipts).map(k => k.productName);

      return transactionProducts.every((product: string) => wishListProducts.includes(product));
    },
    [wishList],
  );

  const SuccessModal = useMemo(() => {
    return (
      <>
        <TouchableWithoutFeedback onPress={() => setFadeInViewVisible(false)}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text textStyle='bold18' color={colors.textPrimary} style={styles.modalTitle}>
            Success!
          </Text>
          <Text textStyle='regular14' color={colors.gray3} style={styles.modalMessage}>
            {successMessage}
          </Text>
          <Pressable
            style={styles.modalButton}
            onPress={() => {
              setFadeInViewStyle({});
              setFadeInViewVisible(false);
            }}
          >
            <Text textStyle='bold14' color={colors.white}>
              OK
            </Text>
          </Pressable>
        </View>
      </>
    );
  }, [successMessage]);

  console.log('filteredData', filteredData);
  const handleAddToShoppingList = useCallback(
    (item: any) => {
      addWishList({
        receipts: item.reciept,
        date: item.newDate,
      });

      setSuccessMessage('Products have been added to your Shopping Checklist');
      setFadeInViewStyle({
        backgroundColor: 'rgba(0,0,0,0.5)',
      });
      setFadeInViewContent(SuccessModal);
      setFadeInViewVisible(true);
    },
    [addWishList],
  );

  const statistics = useMemo(() => {
    const totalOrders = filteredData.length;
    const totalAmount = filteredData.reduce((sum, item) => sum + parseFloat(item.subTotal), 0);
    const estimatedOrders = filteredData.filter(item => item.orderStatus === 'Estimated').length;
    const confirmedOrders = filteredData.filter(item => item.orderStatus === 'Confirmed').length;

    return {
      totalOrders,
      totalAmount,
      estimatedOrders,
      confirmedOrders,
    };
  }, [filteredData]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const allProductsInChecklist = checkIfAllProductsInChecklist(item);

      return (
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate('HistoryOrderStack', {
              screen: 'OrderDetail',
              params: {
                orderData: item,
              },
            })
          }
        >
          <View style={styles.rowBetween}>
            <Text textStyle='medium14' color={colors.black}>
              {formatDate(item.newDate, 'shortDate')}
              <Text textStyle='regular14' style={{ marginLeft: 8 }} color={colors.gray3}>
                {'  ' + formatDate(item.newDate, 'timeAgo')}
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
          <View style={{ gap: 12 }}>
            <View style={styles.rowSpaced}>
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
              {!allProductsInChecklist && (
                <Pressable
                  style={styles.purchaseAgainButton}
                  onPress={() => {
                    handleAddToShoppingList(item);
                  }}
                >
                  <Image source={Icons.historyArrow} style={styles.historyArrowIcon} />
                  <Text textStyle='bold14'>Re-add to Shopping List</Text>
                </Pressable>
              )}
            </View>
            {allProductsInChecklist && (
              <StatusBadge bgColor={colors.primary} textColor={colors.white}>
                Included in Checklist
              </StatusBadge>
            )}
          </View>
        </Pressable>
      );
    },
    [navigation, colors, styles, checkIfAllProductsInChecklist, handleAddToShoppingList],
  );

  // Empty state component
  const EmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image source={BottomTabIcons.history} style={styles.emptyIcon} />
        <Text textStyle='bold16' color={colors.gray3} style={styles.emptyTitle}>
          No orders found
        </Text>
        <Text textStyle='regular14' color={colors.gray3} style={styles.emptySubtitle}>
          Try adjusting your filters or check back later
        </Text>
      </View>
    ),
    [colors, styles],
  );

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  return (
    <View style={styles.mainContainer}>
      <ListHeaderComponent
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        statistics={statistics}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={item => item.orderId}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default History;
