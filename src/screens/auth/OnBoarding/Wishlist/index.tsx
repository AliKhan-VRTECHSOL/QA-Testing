import React from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SAScrollView from '../../../../components/SAScrollView';
import Header from '../../../../components/Headers/Header';
import CustomHighlightButton from '../../../../components/CustomHighlightButton';
import { Icons } from '../../../../assets/Icons';
import useStyles from './styles';
import Text from '../../../../components/Text';
import { useTheme } from '../../../../context/themeContext';
import { useWishListStore } from '../../../../store/wishListStore';
import WishListRenderItem from '../../../../components/RenderItems/WishListRenderItem';
import { useRecieptStore } from '../../../../store/receiptStore';
import { useTransactionStore } from '../../../../store/transactionStore';
import { CommonActions } from '@react-navigation/native';
import { useProfileStatusStore, ProfileStatus } from '../../../../store/profileStatusStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ComponentProps {
  navigation: NativeStackNavigationProp<any>;
}

const Footer: React.FC<ComponentProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { wishList } = useWishListStore();
  const { createTransactionsFromWishlist } = useTransactionStore();
  const { setProfileStatus, isLoggedIn, setLoggedIn } = useProfileStatusStore();
  return (
    <View style={styles.footerContainer}>
      <CustomHighlightButton
        title={`Upload Transactions (${wishList.length})`}
        bgColor={colors.primary}
        onPress={() => {
          // Create transactions from wishlist
          createTransactionsFromWishlist(wishList);

          setProfileStatus(ProfileStatus.MANIFEST_INITIALIZED);
          if (isLoggedIn) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeStack',
                  },
                ],
              }),
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'AuthStack',
                    state: {
                      index: 0,
                      routes: [
                        {
                          name: 'Subscription',
                        },
                      ],
                    },
                  },
                ],
              }),
            );
            setLoggedIn();
          }
        }}
      />
    </View>
  );
};

const SwipeableRow = ({
  children,
  onDelete,
  onEdit,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  onEdit: () => void;
}) => {
  const renderRightActions = () => (
    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
      <Pressable
        style={{
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 5,
        }}
        onPress={onEdit}
      >
        <Image source={Icons.edited} style={{ width: 30, height: 30 }} />
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 5,
        }}
        onPress={onDelete}
      >
        <Image source={Icons.delete} style={{ width: 30, height: 30 }} />
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
      {children}
    </Swipeable>
  );
};

const RenderItem = ({ item, navigation, index }: { item: any; navigation: any; index: number }) => {
  const { removeWishList } = useWishListStore();

  const handleDelete = () => {
    removeWishList(index);
  };
  const handleEdit = () => {
    useRecieptStore.getState().setReceipts(item.receipts);
    navigation.navigate('CommonStack', {
      screen: 'Reciept',
      params: {
        type: 'edit',
        index: index,
        fromOnboarding: true // Onboarding flow
      },
    });
  };
  return (
    <SwipeableRow onDelete={handleDelete} onEdit={handleEdit}>
      <WishListRenderItem item={item} index={index} />
    </SwipeableRow>
  );
};

const Wishlist = ({ navigation }: { navigation: any; route: any }) => {
  const { wishList } = useWishListStore();
  const { isLoggedIn } = useProfileStatusStore();
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <SAScrollView
      header={<Header title='Wishlist' variant='titleLeft' />}
      footer={<Footer navigation={navigation} />}
    >
      <View>
        <FlatList
          style={{ width: '100%' }}
          contentContainerStyle={styles.flatListContent}
          data={wishList}
          renderItem={({ item, index }) => (
            <RenderItem item={item} navigation={navigation} index={index} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.listEmptyContainer}>
              <Text textStyle='bold16' color={colors.black}>
                No wishlist found
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View>
              <CustomHighlightButton
                onPress={() => {
                  useRecieptStore.getState().clearReceipts();
                  // Always navigate to AppendScreen for "Add new receipt" functionality
                  navigation.navigate('CommonStack', {
                    screen: 'AppendScreen',
                    params: {
                      mode: 'new',
                      fromOnboarding: isLoggedIn ? false : true
                    },
                  });
                }}
                icon={Icons.add}
                title='Add new receipt'
              />
            </View>
          )}
          keyExtractor={item => item.date.toString()}
        />
      </View>
    </SAScrollView>
  );
};

export default Wishlist;
