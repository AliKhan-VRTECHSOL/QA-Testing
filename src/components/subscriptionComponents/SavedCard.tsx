import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { useTheme } from '../../context/themeContext';
import { Text } from '..';
import { Images } from '../../assets/images';

interface ComponentProps {
  cardType: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  title: string;
  expiryDate: string;
  onPressUpdate: () => void;
}

const Card = {
  VISA: Images.visa,
  MASTERCARD: Images.mastercard,
  AMEX: Images.amex,
  DISCOVER: Images.discover,
};

const SavedCard: React.FC<ComponentProps> = ({ cardType, title, expiryDate, onPressUpdate }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: colors.subscriptionCardBGColor,
        borderRadius: 20,
      }}
    >
      <Image
        source={Card[cardType]}
        style={{
          width: 43,
          height: 43,
          resizeMode: 'contain',
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text textStyle='medium14' color={colors.textPrimary}>
          {title}
        </Text>
        <Text textStyle='regular12' color={colors.textPrimary}>
          Expires : {expiryDate}
        </Text>
      </View>
      <Pressable
        onPress={onPressUpdate}
        style={{
          height: 35,
          borderRadius: 35,
          width: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.primary,
        }}
      >
        <Text textStyle='medium12' color={colors.primary}>
          Update
        </Text>
      </Pressable>
    </View>
  );
};

export default SavedCard;
