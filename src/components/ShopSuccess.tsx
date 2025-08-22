import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '../context/themeContext';
import { useOverlay } from '../context/OverlayContext';
import { CustomHighlightButton, Text } from '.';
import { Images } from '../assets/images';

const ShopSuccess: React.FC = () => {
  const { colors } = useTheme();
  const { setFadeInViewVisible } = useOverlay();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          flex: 1,
        }}
      >
        <Image
          source={Images.shopSuccess}
          style={{
            width: 250,
            height: 200,
            resizeMode: 'contain',
          }}
        />
        <Text center textStyle='black20' color={colors.black}>
          We saved your checklist 💪
        </Text>
        <Text center textStyle='regular16' color={colors.textPrimary}>
          You can edit your order anytime before it has been confirmed and approved.{'\n\n'}Happy
          shopping!
        </Text>
        <Text
          style={{
            textDecorationLine: 'underline',
            textDecorationColor: colors.primary,
          }}
          textStyle='regular16'
        >
          View order
        </Text>
      </View>
      <CustomHighlightButton
        onPress={() => setFadeInViewVisible(false)}
        bgColor={colors.secondaryOpacity1}
        titleColor={colors.primary}
        title='Back to home'
      />
    </View>
  );
};

export default ShopSuccess;
