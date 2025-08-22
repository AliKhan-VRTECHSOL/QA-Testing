import React, { useCallback, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import {
  CustomHighlightButton,
  DropDownModal,
  OutlinedButton,
  SAScrollView,
  Text,
} from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';
import SearchDropdown from '../../../../components/SearchDropdown';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GroceryStoreCard from '../../../../components/RenderItems/GroceryStoresCard';
import { Icons } from '../../../../assets/Icons';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const STORE_NAMES = ['Aldi', 'Woolworths', 'Coles', 'IGA', 'Costco', 'Kmart', 'Target', 'Big W'];
const STORE_BRANCHES = Array.from({ length: 10 }, (_, i) => `Store ${i + 1}`);

const AddStore: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [addManually, setAddManually] = useState(false);
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [storeBranch, setStoreBranch] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectAddress, setSelectAddress] = useState('');

  const toggleAddMode = () => setAddManually(prev => !prev);

  const handleAddressSelected = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          `${address} store`,
        )}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      setStores(json?.results || []);
    } catch (error) {
      console.error('Google Maps store search error:', error);
      setStores([]);
    }
  };

  const renderStoreItem = ({ item }) => <GroceryStoreCard item={item} colors={colors} />;

  const ItemSeparatorComponent = () => <View style={{ height: 13 }} />;

  const ListEmptyComponent = useCallback(() => {
    if (!selectAddress) return null;
    return (
      <View style={{ marginVertical: 20 }}>
        <Text center color={colors.lightGrey} textStyle='bold18'>
          No store found for the location
        </Text>
      </View>
    );
  }, [selectAddress, colors.lightGrey]);

  const renderAutoSearchUI = () => (
    <View style={styles.mainContainer}>
      <Text textStyle='bold24' color={colors.textPrimary}>
        Preferences
      </Text>
      <View style={{ gap: 10, marginTop: 30, width: '100%' }}>
        <Text textStyle='black16' color={colors.lightGrey}>
          Location
        </Text>
        <SearchDropdown
          selectAddress={selectAddress}
          setSelectAddress={setSelectAddress}
          onAddressSelected={handleAddressSelected}
          smallVariant
          rightIcon={Icons.locationPinFilled}
          useGoogleMaps
        />
      </View>

      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={item => item.place_id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );

  const renderManualAddUI = () => (
    <View style={styles.mainContainer}>
      <Text textStyle='bold24' color={colors.textPrimary}>
        Store Details
      </Text>
      <View style={{ gap: 10, marginTop: 30, width: '100%' }}>
        <DropDownModal
          selectedValue={storeName}
          setSelectedValue={setStoreName}
          options={STORE_NAMES}
          smallVariant
          title='Store Name'
        />
        <DropDownModal
          selectedValue={storeBranch}
          setSelectedValue={setStoreBranch}
          options={STORE_BRANCHES}
          smallVariant
          title='Store Branch'
        />
        <SearchDropdown
          title='Store Location'
          smallVariant
          selectAddress={searchAddress}
          setSelectAddress={setSearchAddress}
          useGoogleMaps
        />
      </View>
    </View>
  );

  return (
    <SAScrollView
      removeSafeAreaInsets
      IndividualkeyboardVerticalOffset={Platform.select({
        android: -25,
        ios: -35,
      })}
      footer={
        <View style={{ gap: 10, marginVertical: 10, paddingHorizontal: 16 }}>
          <OutlinedButton
            title={!addManually ? 'Add Manually' : 'Add By Searching'}
            onPress={toggleAddMode}
          />
          {addManually ? (
            <CustomHighlightButton onPress={() => navigation.goBack()} title='Save' />
          ) : null}
        </View>
      }
    >
      {addManually ? renderManualAddUI() : renderAutoSearchUI()}
    </SAScrollView>
  );
};

export default AddStore;
