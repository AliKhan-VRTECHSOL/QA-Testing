import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import {
  CustomHighlightButton,
  HiLightedText,
  OutlinedButton,
  SAScrollView,
  Text,
} from '../../../../../components';
import { useTheme } from '../../../../../context/themeContext';
import { Icons } from '../../../../../assets/Icons';
import CheckBox from '../../../../../components/CheckBox';
import { useOverlay } from '../../../../../context/OverlayContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSubscriptionStore } from '../../../../../store/subscriptionStore';

import getStyles from './styles';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const SavedOnData = [
  { txt: '8 shopping trips', hilight: { '8': [0] } },
  { txt: 'tracked 201 products', hilight: { '201': [0] } },
  { txt: 'and saved up to $4423 so far this year', hilight: { $4423: [0] } },
];

const CancelReasons = [
  'I prefer using manual shopping lists',
  'The app is too inaccurate',
  'Managing the app is too cumbersome',
  'Not enough data and reporting',
  'The subscription is too expensive',
  'I’m dissatisfied with the service',
  'Other',
];

const CancelSubscription: React.FC<ScreenProps> = ({ navigation }) => {
  const { setFadeInViewContent, setFadeInViewVisible, setFadeInViewStyle } = useOverlay();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [showReason, setShowReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const { resetSubscription } = useSubscriptionStore();

  const handleHideAlert = () => {
    setFadeInViewVisible(false);
    navigation.goBack();
  };

  const InitialComponentRender = () => (
    <>
      <Text textStyle='medium16' color={colors.textPrimary}>
        Stevie, what an amazing 16 weeks it has been! So far you’ve saved on:
      </Text>
      <View style={styles.savedOnList}>
        {SavedOnData.map((item, index) => (
          <View key={index} style={styles.savedOnItem}>
            <Image source={Icons.Check} style={styles.checkIcon} />
            <HiLightedText
              textStyle={{ textStyle: 'medium16', color: colors.textPrimary }}
              hiLightedTextStyle={{ textStyle: 'medium16' }}
              highlight={item?.hilight}
            >
              {item.txt}
            </HiLightedText>
          </View>
        ))}
      </View>
      <Text textStyle='medium16' color={colors.textPrimary}>
        along your journey of mindful spending with us, and we’ve enjoyed working together!
      </Text>
      <View style={styles.divider} />
      <HiLightedText
        textStyle={{ textStyle: 'medium16', color: colors.textPrimary }}
        hiLightedTextStyle={{ textStyle: 'medium16' }}
        highlight={{
          continue: [0],
          on: [0],
          with: [0],
          a: [0],
          standard: [0],
          'subscription?': [0],
        }}
      >
        Did you know you could continue on with a standard subscription? You’ll still receive all of
        the usual benefits you know and love on the app at a more affordable rate!
      </HiLightedText>
    </>
  );

  const ReasonComponent = () => (
    <>
      <Text textStyle='bold24' color={colors.textPrimary}>
        Before you go
      </Text>
      <Text textStyle='medium14' color={colors.textPrimary}>
        What’s your reason for cancelling?
      </Text>
      {CancelReasons.map((reason, index) => (
        <Pressable onPress={() => setSelectedReason(reason)} key={index} style={styles.reasonItem}>
          <CheckBox
            containerStyle={styles.checkBoxContainer}
            iconStyle={styles.checkBoxIcon}
            selected={reason === selectedReason}
            onPress={() => setSelectedReason(reason)}
          />
          <Text textStyle='medium16' color={colors.textPrimary}>
            {reason}
          </Text>
        </Pressable>
      ))}
    </>
  );

  const CancelledSubscriptionAlert = () => (
    <>
      <TouchableWithoutFeedback onPress={handleHideAlert}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
      <View style={styles.alertContainer}>
        <Pressable onPress={handleHideAlert} style={styles.alertCloseButton}>
          <Image source={Icons.cross} style={styles.alertCloseIcon} />
        </Pressable>
        <Text center textStyle='bold24' color={colors.textPrimary}>
          We’ve cancelled your subscription
        </Text>
        <Text center textStyle='medium16' color={colors.lightGrey}>
          You're all set to take this on solo, so it's time to say goodbye for now. Just don't
          forget about us, because we definitely won't forget you!
        </Text>
        <View style={styles.divider} />
        <View style={styles.infoCard}>
          <Image source={Icons.info} style={styles.infoIcon} />
          <Text style={styles.infoText} textStyle='medium14' color={colors.textPrimary}>
            Please note, your subscription will expire on your next billing date.
          </Text>
        </View>
        <Text
          onPress={handleHideAlert}
          textStyle='bold16'
          color={colors.primary}
          style={styles.gotItText}
        >
          Got it
        </Text>
      </View>
    </>
  );

  const handleContinueCancellation = () => {
    if (!showReason) {
      setShowReason(true);
      return;
    }
    // Reset subscription status when cancelling
    resetSubscription();
    setFadeInViewStyle({ backgroundColor: 'rgba(0,0,0,0.5)' });
    setFadeInViewContent(<CancelledSubscriptionAlert />);
    setFadeInViewVisible(true);
  };

  return (
    <SAScrollView
      removeSafeAreaInsets
      contentContainerStyle={styles.scrollContent}
      footer={
        <View style={styles.footer}>
          {!showReason && <CustomHighlightButton title='Update your subscription' />}
          <OutlinedButton
            onPress={handleContinueCancellation}
            tagColor={colors.red}
            title='Continue cancellation'
            style={{
              backgroundColor: colors.red,
              experimental_backgroundImage: '',
            }}
          />
        </View>
      }
    >
      {showReason ? <ReasonComponent /> : <InitialComponentRender />}
    </SAScrollView>
  );
};

export default CancelSubscription;
