import React, { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { CustomHighlightButton, OutlinedButton, SAScrollView, Text } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { useStyles } from './styles';
import { useFavoriteGroceryStoreStore } from '../../../../store/favoriteGroceryStore';
import useFavoriteStores from '../../../../utils/useFavoriteStores';
import GroceryStoreCard from '../../../../components/RenderItems/GroceryStoresCard';
import { Images } from '../../../../assets/images';
import { DimensionsData } from '../../../../utils/scaling';

const ShoppingPreferences = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { favoriteStores } = useFavoriteGroceryStoreStore();
  const [prefferedStores, setPrefferedStores] = useState([]);

  const { getFavoriteStores } = useFavoriteStores(favoriteStores);

  useEffect(() => {
    (async () => {
      const storesData = await getFavoriteStores();
      setPrefferedStores(storesData);
    })();
  }, [getFavoriteStores]);

  const Footer = () => {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          marginVertical: 10,
        }}
      >
        <OutlinedButton
          title='Add another store'
          onPress={() => {
            navigation.navigate('AddStore');
          }}
        />
      </View>
    );
  };

  const ItemSeparatorComponent = () => (
    <View
      style={{
        height: 13,
      }}
    />
  );

  return (
    <SAScrollView
      removeSafeAreaInsets
      footer={prefferedStores.length == 0 ? undefined : <Footer />}
    >
      {prefferedStores.length == 0 ? (
        <View
          style={{
            alignItems: 'center',
            gap: 24,
            marginTop: DimensionsData.windowHeight / 2 - 300,
          }}
        >
          <Image
            source={Images.noPreference}
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
            }}
          />
          <Text center textStyle='bold20' color={colors.textPrimary}>
            No Shopping{'\n'}Preferences Added
          </Text>
          <CustomHighlightButton
            onPress={() => {
              navigation.navigate('AddStore');
            }}
            title='Add Preferences'
            smallVariant
            style={{
              width: 200,
            }}
          />
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={prefferedStores}
          renderItem={({ item, index }) => <GroceryStoreCard item={item} colors={colors} />}
          ItemSeparatorComponent={ItemSeparatorComponent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperStyle}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
    </SAScrollView>
  );
};

export default ShoppingPreferences;
