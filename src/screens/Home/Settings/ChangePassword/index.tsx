import React, { useState } from 'react';
import {
  CustomHighlightButton,
  InputField,
  OutlinedButton,
  SAScrollView,
  Text,
  PhoneInputField,
  VerificationInput,
} from '../../../../components';
import { View } from 'react-native';
import { useTheme } from '../../../../context/themeContext';

const ChangePassword = () => {
  const { colors } = useTheme();
  const [isEmail, setIsEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verification, setVerification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const validateForm = () => {
    if (isMobile) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!isEmail.trim()) {
        return false;
      }
      if (!emailRegex.test(isEmail)) {
        return false;
      }
    } else {
      if (!phoneNumber.trim()) {
        return false;
      }
      if (!isPhoneValid) {
        return false;
      }
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!currentPassword.trim()) {
      return false;
    }
    if (!newPassword.trim()) {
      return false;
    }
    if (newPassword.length < 6) {
      return false;
    }
    if (newPassword !== confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      setVerification(true);
    }
  };

  const handleOtpComplete = (code: string) => {
    setOtp(code);
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate verification
    if (code.length === 6) {
      setOtpVerified(true);
    }
  };

  const handleChangePassword = () => {
    if (validatePasswordForm()) {
      setVerification(false);
      setOtpVerified(false);
      setOtp('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const getFooterButton = () => {
    if (!verification) {
      return (
        <CustomHighlightButton disabled={!validateForm()} title='Send OTP' onPress={handleSave} />
      );
    } else if (verification && !otpVerified) {
      return (
        <CustomHighlightButton
          disabled={otp.length !== 6}
          title='Verify OTP'
          onPress={() => handleOtpComplete(otp)}
        />
      );
    } else {
      return (
        <CustomHighlightButton
          disabled={!validatePasswordForm()}
          title='Change Password'
          onPress={handleChangePassword}
        />
      );
    }
  };

  return (
    <SAScrollView
      removeSafeAreaInsets
      footer={
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}>
          <OutlinedButton
            title={isMobile ? 'Use email' : 'Use mobile number'}
            onPress={() => {
              setIsMobile(!isMobile);
            }}
          />
          {getFooterButton()}
        </View>
      }
    >
      {!verification ? (
        <View style={{ marginTop: 28, gap: 16 }}>
          {isMobile ? (
            <InputField
              smallVariant
              label='Email'
              placeholder='Enter your Email'
              value={isEmail}
              onChangeText={setIsEmail}
            />
          ) : (
            <PhoneInputField
              value={phoneNumber}
              setValue={setPhoneNumber}
              setIsPhoneValid={setIsPhoneValid}
              smallVariant
              title='Phone Number'
            />
          )}
        </View>
      ) : !otpVerified ? (
        <View style={{ marginTop: 28, gap: 16 }}>
          <Text textStyle='regular16' color={colors.textPrimary}>
            Enter the 6-digit code we sent to {phoneNumber}
          </Text>
          <View>
            <Text textStyle='bold14' color={colors.gray3}>
              Verification Code
            </Text>
            <VerificationInput value={otp} onCodeComplete={handleOtpComplete} length={6} />
          </View>
        </View>
      ) : (
        <View style={{ gap: 16, marginTop: 28 }}>
          <InputField
            smallVariant
            label='Current Password'
            secureTextEntry
            placeholder='Enter your current password'
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <InputField
            smallVariant
            label='New Password'
            secureTextEntry
            placeholder='Enter your new password'
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <InputField
            smallVariant
            label='Confirm Password'
            secureTextEntry
            placeholder='Confirm your new password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      )}
    </SAScrollView>
  );
};

export default ChangePassword;
