import { Image, Pressable, StyleSheet, View } from 'react-native';
import { LayoutMetrics } from '../theme/commonLayout';
import { Images } from '../assets/images';
import { Text } from '.';
import { useOverlay } from '../context/OverlayContext';
import { useTheme } from '../context/themeContext';
import { Icons } from '../assets/Icons';
import React, { useMemo } from 'react';

const OrderCompleteMessage: React.FC = () => {
  const { setFadeInViewVisible } = useOverlay();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <Image source={Images.orderEditSuccess} style={styles.image} />

      <View style={styles.textContainer}>
        <Text center textStyle='black20' color={colors.textPrimary}>
          Your order has been updated!
        </Text>
        <Text center textStyle='medium16' color={colors.lightGrey}>
          We will send you a confirmation text once your order has been approved by the merchant.
        </Text>
      </View>

      <Pressable onPress={() => setFadeInViewVisible(false)} style={styles.button}>
        <Image source={Icons.Check} style={styles.checkIcon} />
      </Pressable>
    </View>
  );
};

const useStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 50,
          backgroundColor: colors.white,
        },
        image: {
          width: 256,
          height: 256,
          resizeMode: 'contain',
        },
        textContainer: {
          paddingHorizontal: LayoutMetrics.padding.horizontal,
        },
        button: {
          width: LayoutMetrics.button.height,
          height: LayoutMetrics.button.height,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          experimental_backgroundImage: colors.gradientColor,
        },
        checkIcon: {
          width: 28,
          height: 28,
          tintColor: 'white',
        },
      }),
    [colors],
  );

export default OrderCompleteMessage;
