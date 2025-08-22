import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import { SAScrollView, Text, CustomHighlightButton, OutlinedButton } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import SearchDropdown from '../../../../components/SearchDropdown';
import { Icons } from '../../../../assets/Icons';
import { DimensionsData } from '../../../../utils/scaling';
import useStyles from './styles';
import { useKeyboardStatus } from '../../../../utils/useKeyboardStatus';
import GroceryStoreCard from '../../../../components/RenderItems/GroceryStoresCard';
import { useOverlay } from '../../../../context/OverlayContext';
import { useFavoriteGroceryStoreStore } from '../../../../store/favoriteGroceryStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface Store {
  name: string;
  address: string;
  [key: string]: any;
}

const AddLocation: React.FC<ScreenProps> = ({ navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const { setShowAnnouncement, setOnPressAcknowledgeButtonFunction } = useOverlay();
  const { addToFavorite } = useFavoriteGroceryStoreStore();
  const styles = useStyles(colors);
  const [selectAddress, setSelectAddress] = useState<string>('');
  const [stores, setStores] = useState<Store[]>([]);
  const isKeyboardVisible = useKeyboardStatus();
  const topViewScale = useSharedValue(1);

  const handleScaleTopView = useCallback(() => {
    topViewScale.value = withTiming(isKeyboardVisible ? 0 : 1, {
      duration: 200,
    });
  }, [isKeyboardVisible]);

  const topViewAnimatedStyle = useAnimatedStyle(
    () => ({
      marginTop: interpolate(topViewScale.value, [0, 1], [-126, 0]),
      opacity: topViewScale.value,
    }),
    [topViewScale.value],
  );

  useEffect(() => {
    handleScaleTopView();
  }, [isKeyboardVisible]);

  const handleAddressSelected = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          address + ' store',
        )}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      console.log(json);
      setStores(json?.results || []);
    } catch (error) {
      console.error('Google Maps store search error:', error);
      setStores([]);
    }
  };

  const groceryStoreRenderItem = ({ item, index }: { item: Store; index: number }) => {
    return (
      <GroceryStoreCard
        item={item}
        colors={colors}
        onPress={() => {
          // Add the store to favorites when selected during onboarding
          addToFavorite(item.place_id);
          // Show a brief success message
          setShowAnnouncement(true);
          setOnPressAcknowledgeButtonFunction(() => {
            setShowAnnouncement(false);
          });
        }}
      />
    );
  };

  const ItemSeparatorComponent = () => (
    <View
      style={{
        height: 13,
      }}
    />
  );

  const ListEmptyComponent = useCallback(() => {
    if (selectAddress.length > 0) {
      return (
        <View
          style={{
            marginVertical: 20,
          }}
        >
          <Text center color={colors.lightGrey} textStyle='bold18'>
            No store found for the location
          </Text>
        </View>
      );
    } else return null;
  }, [selectAddress]);

  const storeListAvailableHeight = useMemo(() => {
    if (selectAddress.length == 0) return 0;
    const header = Platform.OS === 'ios' ? 120 : 85;
    const contentOffset = 348;
    return DimensionsData.screenHeight - bottom - header - contentOffset;
  }, [DimensionsData.screenHeight, bottom, Platform.OS, selectAddress]);

  const handleNavigate = () => {
    // TODO: API Integration Required
    // Call: POST /onboarding/location
    // Send: { address: string, preferredStores: string[] }
    // Expect: { success: boolean, message: string }
    // Handle: Navigate to ScanPurchase on success, show error on failure

    setShowAnnouncement(true);
    setOnPressAcknowledgeButtonFunction(() => {
      navigation.navigate('ScanPurchase');
    });
  };

  return (
    <SAScrollView
      keyboardShouldPersistTaps='handled'
      scrollEnabled={false}
      contentContainerStyle={styles.contentContainer}
      removeSafeAreaInsets
      footer={
        <View style={styles.footerContainer}>
          <CustomHighlightButton
            title='Next'
            disabled={selectAddress.length == 0}
            onPress={handleNavigate}
          />
          <Text
            style={styles.skipButton}
            textStyle='medium12'
            color={colors.gray3}
            onPress={handleNavigate}
          >
            Skip For Now
          </Text>
        </View>
      }
    >
      <Text center textStyle='regular16' color={colors.textPrimary}>
        To personalise your shopping predictions, tell us where you usually buy groceries:
      </Text>
      <Animated.View style={[styles.topViewWrapper, topViewAnimatedStyle]}>
        <OutlinedButton title='Use my current location' />
        <Text textStyle='regular16' color={colors.textPrimary}>
          or
        </Text>
      </Animated.View>
      <SearchDropdown
        selectAddress={selectAddress}
        setSelectAddress={setSelectAddress}
        onAddressSelected={handleAddressSelected}
        useGoogleMaps={true}
        rightIcon={Icons.Search}
      />
      <View
        style={{
          height: storeListAvailableHeight,
          width: '100%',
        }}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={stores}
          renderItem={groceryStoreRenderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperStyle}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item, idx) => item.place_id || item.id || idx.toString()}
        />
      </View>
    </SAScrollView>
  );
};

export default AddLocation;
