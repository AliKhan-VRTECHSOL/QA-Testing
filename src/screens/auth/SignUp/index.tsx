import React, { SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '../../../context/themeContext';
import Header from '../../../components/Headers/Header';
import {
  Text,
  CustomHighlightButton,
  InputField,
  SAScrollView,
  HiLightedText,
} from '../../../components';
import { emailRegex } from '../../../constants/regex';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CheckBox from '../../../components/CheckBox';
import { LogoHeaderDescription, SSO } from '../../../components/auth';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { ProfileStatus, useProfileStatusStore } from '../../../store/profileStatusStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const SignUp: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { setProfileStatus } = useProfileStatusStore();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [agreeTerms, setAgreeTerms] = useState(true);

  const handleUpdateInputFields = (newText: string, setNewText: SetStateAction<any>) => {
    setNewText(newText.trim());
  };

  const isFormValidated = useMemo(
    () =>
      !(
        (
          password.length !== 0 &&
          confirmPassword.length !== 0 &&
          emailRegex.test(email) &&
          password === confirmPassword
        )
        // &&agreeTerms
      ),
    [password, confirmPassword, email],
  );

  const handleSignUp = useCallback(() => {
    if (isFormValidated) {
      return;
    }

    // TODO: API Integration Required
    // Call: POST /auth/signup
    // Send: { email: string, password: string, confirmPassword: string }
    // Expect: { success: boolean, message: string, user: { id: string, email: string } }
    // Handle: Set profile status, navigate to OnBoardingStack on success, show error on failure

    setProfileStatus(ProfileStatus.PROSPECT);
    navigation.navigate('OnBoardingStack');
  }, [isFormValidated]);

  return (
    <SAScrollView
      contentContainerStyle={styles.contentContainerStyle}
      header={<Header title='Sign Up' />}
    >
      <LogoHeaderDescription title='Get Started!' subTitle='Register your account and join us.' />
      <InputField
        ref={emailRef}
        placeholder={'Email Address'}
        keyboardType={'email-address'}
        value={email}
        onChangeText={newText => handleUpdateInputFields(newText, setEmail)}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <InputField
        ref={passwordRef}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <InputField
        ref={confirmPasswordRef}
        placeholder={'Confirm Password'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onSubmitEditing={handleSignUp}
        secureTextEntry
        returnKeyType='done'
      />

      <CustomHighlightButton
        title='Sign Up'
        showActivityIndicator={false}
        disabled={isFormValidated}
        onPress={handleSignUp}
      />
      <HiLightedText
        highlight={{
          Log: [0],
          'in.': [0],
        }}
        textStyle={{
          textStyle: 'medium12',
          color: colors.textPrimary,
          style: {
            alignSelf: 'center',
            marginVertical: 10,
          },
        }}
        hiLightedTextStyle={{
          textStyle: 'bold12',
          color: colors.primary,
          style: {
            textDecorationLine: 'underline',
            textDecorationColor: colors.primary,
          },
          onPress: () => navigation.replace('Login'),
        }}
      >
        Already have an account? Log in.
      </HiLightedText>
      <View style={styles.checBoxContainer}>
        {/* <CheckBox selected={agreeTerms} setSelected={setAgreeTerms} /> */}
        <Text textStyle='medium12' color={colors.textPrimary}>
          By signing up you agree to our{' '}
          <Text
            onPress={() => Alert.alert('Terms of User')}
            textStyle='bold12'
            color={colors.textPrimary}
          >
            Terms of Use
          </Text>{' '}
          and{'\n'}
          <Text
            onPress={() => Alert.alert('Privacy Notice')}
            textStyle='bold12'
            color={colors.textPrimary}
          >
            Privacy Notice.
          </Text>
        </Text>
      </View>
      <SSO appleButtonTextType={AppleButton.Type.SIGN_IN} />
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 16,
    paddingTop: 24,
  },
  checBoxContainer: {
    flexDirection: 'row',
    // gap: 7,
    paddingLeft: 16,
  },
});

export default SignUp;
