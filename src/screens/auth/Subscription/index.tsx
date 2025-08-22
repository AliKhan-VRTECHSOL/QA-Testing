import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { useTheme } from '../../../context/themeContext';
import { CustomHighlightButton, SAScrollView, Text } from '../../../components';
import Header from '../../../components/Headers/Header';
import { StatusBarContainerHeigt } from './constants';
import AnimatedProgressHeader from './AnimatedProgressHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSubscriptionStore } from '../../../store/subscriptionStore';
import {
  CardData,
  CardForm,
  SubscriptionPlans,
  SubscriptionSuccessCard,
} from '../../../components/subscriptionComponents';

const ScreenTitles = {
  0: 'Subscription',
  1: 'Payment',
  2: 'Payment Successful',
};

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Subscription: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);

  const [selectedPlan, setSelectedPlan] = useState({});

  const [cardData, setCardData] = useState<CardData>({
    cardExpiryDate: '',
    cardNumber: '',
    cardSecurityCode: '',
    nameOnCard: '',
  });

  const { setIsSubscribed, setSubscriptionType } = useSubscriptionStore();

  const FirstStep = useCallback(
    () => (
      <>
        <SubscriptionPlans
          selectedPlan={selectedPlan}
          onPress={subscriptionOffer => {
            setSelectedPlan(subscriptionOffer);
            console.log('Selected Subscription Offer', subscriptionOffer);
          }}
        />
        {selectedPlan?.id !== undefined ? (
          <CustomHighlightButton onPress={() => setStep(1)} title='Next' bgColor={colors.primary} />
        ) : null}
        <Text
          onPress={() => {
            navigation.replace('OnBoardingStack', {
              screen: 'Welcome',
            });
          }}
          textStyle='medium12'
          color={colors.gray3}
          style={styles.skip}
        >
          Skip For Now
        </Text>
      </>
    ),
    [selectedPlan, setSelectedPlan, setStep],
  );

  return (
    <SAScrollView
      IndividualkeyboardVerticalOffset={Platform.select({
        android: -25,
        ios: -35,
      })}
      header={
        <Header
          title={ScreenTitles[step]}
          variant='titleLeft'
          hideBackKey={step == 0 || step == 2}
          onPress={() => {
            if (step == 1) {
              setStep(0);
            }
          }}
        />
      }
      footer={<AnimatedProgressHeader step={step} />}
      contentContainerStyle={{
        paddingTop: StatusBarContainerHeigt + 5,
        gap: 24,
      }}
    >
      {
        [
          <FirstStep />,
          <>
            <Text textStyle='medium14' color={colors.textPrimary} center>
              <Text textStyle='medium14' color={colors.primary}>
                {selectedPlan?.price}
              </Text>{' '}
              An update to your current subscription will be reflected on your next billing date.
            </Text>
            <CardForm cardData={cardData} setCardData={setCardData} />
            <Text color={colors.gray3} center textStyle='medium12'>
              Cancel anytime after your first two months
            </Text>

            <CustomHighlightButton
              title='Subscribe'
              bgColor={colors.primary}
              onPress={() => {
                setIsSubscribed(true);
                setSubscriptionType(selectedPlan?.type || 'starter');
                setStep(2);
              }}
            />
          </>,
          <SubscriptionSuccessCard
            onPressGotoDashboard={() => {
              navigation.replace('OnBoardingStack', {
                screen: 'Welcome',
              });
            }}
          />,
        ][step]
      }
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  skip: {
    alignSelf: 'center',
    marginTop: 24,
    textDecorationLine: 'underline',
  },
});

export default Subscription;
