import React, { useCallback } from 'react';

import { View, Image, StyleSheet, PressableProps } from 'react-native';

import { Text, CustomHighlightButton, HiLightedText } from '../components';
import { useOverlay } from '../context/OverlayContext';
import { Images } from '../assets/images';
import { useTheme } from '../context/themeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSubscriptionStore } from '../store/subscriptionStore';

const FadeInViewContent = ({ onPress }: { onPress: PressableProps['onPress'] }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Image source={Images.freePlanModal} style={styles.image} />
      <View style={styles.textWrapper}>
        <HiLightedText
          textStyle={{
            textStyle: 'bold22',
            color: colors.textPrimary,
            center: true,
          }}
          highlight={{
            Free: [0],
            Plan: [0],
          }}
          hiLightedTextStyle={{
            textStyle: 'bold22',
            color: colors.primary,
          }}
        >
          You’re on the Free Plan
        </HiLightedText>
        <Text center textStyle='regular16' color={colors.textPrimary}>
          Upgrade to unlock all features and get the full experience.
        </Text>
      </View>
      <CustomHighlightButton onPress={onPress} title='See Plans' />
    </View>
  );
};

export const useFreePlanModal = (navigation: NativeStackNavigationProp<any>) => {
  const { setFadeInViewStyle, setFadeInViewVisible, setFadeInViewContent } = useOverlay();
  const { colors } = useTheme();
  const { isSubscribed } = useSubscriptionStore();

  const showModal = useCallback(() => {
    // If user is already subscribed, don't show the modal
    if (isSubscribed) {
      return;
    }

    setFadeInViewStyle({
      backgroundColor: colors.white,
    });
    setFadeInViewContent(
      <FadeInViewContent
        onPress={() => {
          setFadeInViewVisible(false);
          navigation.navigate('SettingStack', {
            screen: 'ManageSubscription',
          });
        }}
      />,
    );
    setFadeInViewVisible(true);
  }, [setFadeInViewStyle, setFadeInViewVisible, setFadeInViewContent, navigation, isSubscribed]);

  return showModal;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
  image: {
    width: 150,
    height: 250,
    resizeMode: 'contain',
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
});
