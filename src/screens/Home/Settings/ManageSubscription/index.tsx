import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHighlightButton, SAScrollView, Text } from '../../../../components';
import { SubscriptionPlans, CardData } from '../../../../components/subscriptionComponents';
import { useTheme } from '../../../../context/themeContext';
import SavedCard from '../../../../components/subscriptionComponents/SavedCard';
import { useSubscriptionStore } from '../../../../store/subscriptionStore';
import { View } from 'react-native';
interface SubscriptionPlan {
  id: string;
  type: 'starter' | 'standard';
  price: string;
  description: string;
}

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const ManageSubscription: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionPlan | {}>({});
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const { isSubscribed, subscriptionType, setIsSubscribed, setSubscriptionType } = useSubscriptionStore();
  return (
    <SAScrollView
      removeSafeAreaInsets
      contentContainerStyle={{
        paddingVertical: 20,
        gap: 20,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text textStyle='medium18' color={colors.textPrimary}>
          Current subscription
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>

          {isSubscribed && (
            <Text
              onPress={() => {
                navigation.navigate('CancelSubscription');
              }}
              style={{
                textDecorationLine: 'underline',
                textDecorationColor: colors.red,
              }}
              textStyle='medium16'
              color={colors.red}
            >
              Cancel subscription
            </Text>
          )}
        </View>
      </View>

      <View style={{
        backgroundColor: colors.subscriptionCardBGColor,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View>
          <Text textStyle='medium16' color={colors.textPrimary}>
            {isSubscribed ? (subscriptionType === 'starter' ? 'Starter Plan' : 'Standard Plan') : 'No active subscription'}
          </Text>
          <Text textStyle='regular14' color={colors.lightGrey} style={{ marginTop: 4 }}>
            {isSubscribed ? 'Active subscription' : 'Free Tier'}
          </Text>
        </View>
        {!isSubscribed && (
          <CustomHighlightButton
            title='Reactivate'
            onPress={() => {
              setShowSubscriptionPlans(true);
            }}
            style={{
              width: 120,
              height:40
            }}
            smallVariant
            bgColor={colors.success}
          />
        )}
      </View>

      {showSubscriptionPlans ? (
        <>
          <SubscriptionPlans
            selectedPlan={selectedSubscription}
            onPress={(subscription: any) => setSelectedSubscription(subscription)}
          />
          <CustomHighlightButton
            disabled={!('id' in selectedSubscription)}
            onPress={() => {
              // TODO: API Integration Required
              // Call: POST /subscription/buy (if !isSubscribed)
              // Call: PUT /settings/subscription (if isSubscribed)
              // Send: { packageId: string, paymentMethodId: string }
              // Expect: { success: boolean, subscriptionId: string }
              // Handle: Update subscription status, show success message

              if (!isSubscribed) {
                setIsSubscribed(true);
                setSubscriptionType(('type' in selectedSubscription ? selectedSubscription.type : 'starter') as 'starter' | 'standard');
              } else {
                // Update existing subscription
                setSubscriptionType(('type' in selectedSubscription ? selectedSubscription.type : 'starter') as 'starter' | 'standard');
              }
              setShowSubscriptionPlans(false);
            }}
            style={{
              width: '100%',
            }}
            title={isSubscribed ? 'Update Plan' : 'Buy Subscription'}
          />
          <Text
            onPress={() => {
              setShowSubscriptionPlans(false);
              setSelectedSubscription({});
            }}
            style={{
              textDecorationLine: 'underline',
              textDecorationColor: colors.textPrimary,
              marginVertical: 10,
              paddingVertical: 2,
              alignSelf: 'center',
            }}
            textStyle='medium16'
            color={colors.textPrimary}
          >
            Cancel
          </Text>
        </>
      ): <Text
      onPress={() => {
        setShowSubscriptionPlans(true);
      }}
      style={{
        alignSelf:'center',
        textDecorationLine: 'underline',
        textDecorationColor: colors.primary,
      }}
      textStyle='medium16'
      color={colors.primary}
    >
      View Plans
    </Text>}

      <Text textStyle='medium18' color={colors.textPrimary}>
        Payment info
      </Text>
      <SavedCard
        cardType='VISA'
        title='WA ending in 4444'
        expiryDate='10/2020'
        onPressUpdate={() =>
          navigation.navigate('AddEditCard', {
            edit: true,
            cardData: {
              cardNumber: '4111111111111111',
              nameOnCard: 'John Doe',
              cardExpiryDate: '12/26',
              cardSecurityCode: '123',
            },
          })
        }
      />
      <Text
        onPress={() =>
          navigation.navigate('AddEditCard', {
            edit: false,
          })
        }
        style={{
          textDecorationLine: 'underline',
          textDecorationColor: colors.textPrimary,
          marginVertical: 10,
          paddingVertical: 2,
          alignSelf: 'center',
        }}
        textStyle='medium14'
        color={colors.textPrimary}
      >
        Add new card
      </Text>

      <Text textStyle='medium18' color={colors.textPrimary}>
        Redeem promo code
      </Text>
      <View style={{
        backgroundColor: colors.subscriptionCardBGColor,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text textStyle='regular16' color={colors.lightGrey}>
          Enter promo code
        </Text>

      </View>
      <CustomHighlightButton
          title='Redeem'

          onPress={() => {
            // Handle promo code redemption
          }}
          smallVariant
          bgColor={colors.primary}
        />
    </SAScrollView>
  );
};

export default ManageSubscription;
