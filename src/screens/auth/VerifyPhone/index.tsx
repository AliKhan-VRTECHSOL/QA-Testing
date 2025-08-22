import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SAScrollView, Text, CustomHighlightButton } from '../../../components';
import HeaderSpaced from '../../../components/Headers/HeaderSpaced';
import { useTheme } from '../../../context/themeContext';
import VerificationInput from '../../../components/VerificationInput';
import PhoneInputField from '../../../components/PhoneInputField';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const VerifyPhone: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [otp, setOtp] = useState('');
  const [verification, setVerification] = useState(false);

  const handleSendOtp = () => {
    setVerification(true);
  };

  const onCodeComplete = (otp: string) => {
    setOtp(otp);
    navigation.navigate('Login');
  };

  return (
    <SAScrollView
      contentContainerStyle={styles.contentContainer}
      header={<HeaderSpaced title="Complete account setup" />}
    >
      <Text textStyle="bold24" color={colors.textPrimary}>
        Verify your phone number
      </Text>
      <Text center textStyle="regular16" color={colors.textPrimary}>
        {verification
          ? 'Enter the 6-digit code we sent to'
          : "One last step to unlock personalised shopping magic! We'll send a confirmation code to your phone number to verify your account."}
        {verification && (
          <Text center textStyle="bold16" color={colors.textPrimary}>
            {'\n' + phoneNumber}
          </Text>
        )}
      </Text>

      {verification ? (
        <View style={{ width: '100%' }}>
          <VerificationInput value={otp} onCodeComplete={onCodeComplete} />
        </View>
      ) : (
        <PhoneInputField
          value={phoneNumber}
          setValue={setPhoneNumber}
          setIsPhoneValid={setIsPhoneValid}
        />
      )}

      {verification ? (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text>Resend Code</Text>
          <Text>Change my Phone</Text>
        </View>
      ) : (
        <CustomHighlightButton
          title="Send confirmation code"
          showActivityIndicator={false}
          disabled={isPhoneValid}
          onPress={handleSendOtp}
        />
      )}
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    gap: 20,
    paddingTop: 40,
  },
});
export default VerifyPhone;
