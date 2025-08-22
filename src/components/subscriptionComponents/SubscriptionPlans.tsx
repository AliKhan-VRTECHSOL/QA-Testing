import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Pressable, Image } from 'react-native';

import { Text, HiLightedText } from '..';
import { ThemeColors } from '../../theme/colors';
import { Icons } from '../../assets/Icons';
import { useTheme } from '../../context/themeContext';

// TODO: API Integration Required
// Call: GET /subscription/packages
// Send: No data required
// Expect: { packages: SubscriptionPackage[] }
// Handle: Update plans data from API response

const Plans = [
  {
    id: '1',
    type: 'starter',
    price: '$5 per week',
    description: 'Starter Subscription',
    highlightDescription: {},
    exclusiveOffer: 'Free',
    exclusiveDescription: 'for 1 week',
    highlightExclusiveDescription: { '1': [0] },
  },
  {
    id: '2',
    type: 'standard',
    price: '$10 per month',
    description: 'Standard Subscription',
    highlightDescription: {},
    exclusiveOffer: 'Free',
    exclusiveDescription: 'for 1 week',
    highlightExclusiveDescription: { '1': [0] },
  },
  {
    id: '3',
    type: 'standard',
    price: '$100 per annum',
    description: 'It’s 15% more affordable!',
    highlightDescription: {
      '15%': [0],
    },
    exclusiveOffer: 'Free',
    exclusiveDescription: 'for the next 2 weeks',
    highlightExclusiveDescription: { '2': [0] },
  },
  {
    id: '4',
    type: 'standard',
    price: '$55 charged every 6 months',
    description: 'Standard Extended',
    exclusiveDescription: 'for the next 2 weeks',
    highlightExclusiveDescription: { '2': [0] },
    exclusiveOffer: 'Free',
    highlightDescription: {},
  },
];

interface ComponentProps {
  onPress: (item: any) => void;
  selectedPlan?: any;
}

const SubscriptionPlans: React.FC<ComponentProps> = ({ onPress, selectedPlan = {} }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const renderItem = ({ item, index }) => {
    let selected = selectedPlan?.id == item?.id;
    return (
      <Pressable
        key={item?.id}
        onPress={() => onPress(item)}
        style={[styles.itemContainer, selected ? styles.itemContainerSelectedOverload : {}]}
      >
        <View style={styles.itemTextContainer}>
          <Text
            style={selected ? styles.itemPriceStyle : {}}
            textStyle='medium20'
            color={colors.textPrimary}
          >
            {item.price}
          </Text>
          <View style={styles.row}>
            {selected && item?.exclusiveOffer && (
              <View style={styles.itemExclusiveOfferContainer}>
                <Text textStyle='medium10' color={colors.white}>
                  {item.exclusiveOffer}
                </Text>
              </View>
            )}
            <HiLightedText
              highlight={selected ? item.highlightExclusiveDescription : item.highlightDescription}
            >
              {selected ? item.exclusiveDescription : item.description}
            </HiLightedText>
          </View>
        </View>
        <View
          style={[
            styles.itemCheckIconContainer,
            selected ? styles.itemCheckIconContainerSelectedOverload : {},
          ]}
        >
          <Image
            source={Icons.Check}
            style={[styles.itemCheckIcon, selected ? styles.itemCheckIconSelectedOverload : {}]}
          />
        </View>
      </Pressable>
    );
  };

  const itemSeparatorComponent = () => <View style={styles.itemSeparatorComponent} />;

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled
        data={Plans}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparatorComponent}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: 24,
        },
        itemSeparatorComponent: {
          height: 16,
        },
        contentContainerStyle: {
          paddingHorizontal: 8,
        },
        itemContainer: {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 20,
          backgroundColor: colors.subscriptionCardBGColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 2,
          borderColor: 'transparent',
        },
        itemContainerSelectedOverload: {
          borderColor: colors.primary,
        },
        itemTextContainer: {
          gap: 4,
        },
        itemPriceStyle: {
          textDecorationLine: 'line-through',
          textDecorationColor: colors.textPrimary,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        itemExclusiveOfferContainer: {
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 3,
          backgroundColor: colors.primary,
          marginRight: 8,
        },
        itemCheckIconContainer: {
          width: 24,
          height: 24,
          backgroundColor: colors.secondaryOpacity1,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        itemCheckIconContainerSelectedOverload: {
          backgroundColor: colors.primary,
        },
        itemCheckIcon: {
          width: 14,
          height: 14,
          resizeMode: 'contain',
          tintColor: 'transparent',
        },
        itemCheckIconSelectedOverload: {
          tintColor: colors.white,
        },
      }),
    [colors],
  );
};

export default SubscriptionPlans;
