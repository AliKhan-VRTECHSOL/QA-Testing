import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import { CustomHighlightButton, SAScrollView, Text } from '../../../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CardData, CardForm } from '../../../../../components/subscriptionComponents';
import { useTheme } from '../../../../../context/themeContext';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const AddEditCard: React.FC<ScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardExpiryDate: '',
    cardSecurityCode: '',
    nameOnCard: '',
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.edit ? 'Update Card' : 'Add New Card',
    });
    if (route?.params?.edit) {
      const { cardData } = route?.params;
      setCardData(cardData);
    }
  }, [navigation, route]);

  return (
    <SAScrollView
      removeSafeAreaInsets
      IndividualkeyboardVerticalOffset={Platform.select({
        android: -25,
        ios: -35,
      })}
      contentContainerStyle={{
        paddingVertical: 20,
        gap: 20,
      }}
      footer={
        <CustomHighlightButton
          title='Update'
          style={{
            marginVertical: 10,
            alignSelf: 'center',
          }}
          onPress={() => {
            // TODO: API Integration Required
            // Call: POST /payment/add-method (if !route?.params?.edit)
            // Call: PUT /settings/payment-method (if route?.params?.edit)
            // Send: {
            //   cardNumber: string,
            //   nameOnCard: string,
            //   cardExpiryDate: string,
            //   cardSecurityCode: string
            // }
            // Expect: { success: boolean, message: string, paymentMethodId: string }
            // Handle: Show success message, navigate back on success
          }}
        />
      }
    >
      <CardForm cardData={cardData} setCardData={setCardData} />
      <Text
        textStyle='medium16'
        color={colors.red}
        style={{
          textDecorationLine: 'underline',
          textDecorationColor: colors.red,
          alignSelf: 'center',
          paddingVertical: 2,
        }}
      >
        Delete this Card
      </Text>
    </SAScrollView>
  );
};

export default AddEditCard;
