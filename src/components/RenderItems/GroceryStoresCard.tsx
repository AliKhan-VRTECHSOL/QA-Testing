import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from '..';
import { Icons } from '../../assets/Icons';
import { useFavoriteGroceryStoreStore } from '../../store/favoriteGroceryStore';
import { ThemeColors } from '../../theme/colors';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface Store {
  name: string;
  address: string;
  [key: string]: any;
}

interface GroceryStoreCardProps {
  item: Store;
  onPress?: () => void;
  colors: ThemeColors; // ⬅️ Used in styles
}

const GroceryStoreCard: React.FC<GroceryStoreCardProps> = ({ item, onPress, colors }) => {
  const styles = useStyles(colors);

  const { checkIsFavorite, addToFavorite, removeFromFavorite } = useFavoriteGroceryStoreStore();

  const photoReference = item.photos?.[0]?.photo_reference;
  const imageUrl = photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`
    : item?.icon;

  const isFavorite = checkIsFavorite(item?.place_id);

  return (
    <Pressable style={styles.groceryStoreItemContainer} onPress={onPress}>
      <View style={styles.groceryStoreImage}>
        <Image
          style={[styles.groceryStoreImage, !photoReference ? styles.imageNotFoundStyle : {}]}
          source={{ uri: imageUrl }}
        />
      </View>
      <Text textStyle='medium16' color={colors.black} numberOfLines={1}>
        {item?.name}
      </Text>
      <View style={styles.locationWrapper}>
        <Image source={Icons.locationPin} style={styles.locationPin} />
        <Text style={{ flex: 1 }} numberOfLines={1} textStyle='medium12' color={colors.primary}>
          {item?.formatted_address || item?.address}
        </Text>
      </View>
      <Pressable
        onPress={() =>
          isFavorite ? removeFromFavorite(item?.place_id) : addToFavorite(item?.place_id)
        }
        style={styles.itemHeartContainer}
      >
        <Image
          style={styles.itemHeartIcon}
          source={isFavorite ? Icons.heartFilled : Icons.heartOutline}
        />
      </Pressable>
    </Pressable>
  );
};

export default GroceryStoreCard;

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    groceryStoreItemContainer: {
      borderWidth: 1,
      borderColor: colors.gray5,
      borderRadius: 12,
      padding: 8,
      gap: 10,
      width: '48%',
    },
    groceryStoreImage: {
      width: '100%',
      height: 100,
      borderRadius: 6,
      backgroundColor: colors.gray5,
    },
    imageNotFoundStyle: {
      width: '40%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    locationWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      width: '100%',
      flexShrink: 1,
    },
    locationPin: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
    },
    itemHeartContainer: {
      position: 'absolute',
      width: 25,
      height: 25,
      top: 20,
      right: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderRadius: 100,
      overflow: 'hidden',
    },
    itemHeartIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      marginTop: 2,
    },
  });
