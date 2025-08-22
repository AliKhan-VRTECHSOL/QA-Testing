import React, { SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

import { useTheme } from '../../../context/themeContext';
import Header from '../../../components/Headers/Header';
import { Text, CustomHighlightButton, InputField, SAScrollView } from '../../../components';
import { emailRegex } from '../../../constants/regex';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogoHeaderDescription, SSO } from '../../../components/auth';
import { AppleButton } from '@invertase/react-native-apple-authentication';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Login: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdateInputFields = (newText: string, setNewText: SetStateAction<any>) => {
    setNewText(newText.trim());
  };

  const isFormValidated = useMemo(
    () => !(password.length !== 0 && emailRegex.test(email)),
    [password, email],
  );

  const handleLogin = useCallback(() => {
    if (isFormValidated) {
      return;
    }
    
    // TODO: API Integration Required
    // Call: POST /auth/login
    // Send: { email: string, password: string }
    // Expect: { token: string, user: { id: string, email: string, name: string, phone: string } }
    // Handle: Store token in secure storage, store user data, navigate to VerifyPhone on success
    
    navigation.navigate('VerifyPhone');
  }, [isFormValidated]);

  return (
    <SAScrollView
      contentContainerStyle={styles.contentContainerStyle}
      header={<Header title='Login' />}
    >
      <LogoHeaderDescription
        title='Welcome Back !'
        highlightTitle={{
          Back: [0],
          '!': [0],
        }}
        subTitle='Shopping with Automation; Shopomation'
      />
      <InputField
        ref={emailRef}
        placeholder={'Email address'}
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
        onSubmitEditing={handleLogin}
        returnKeyType='done'
      />
      {/* <Text
        onPress={() => Alert.alert('Terms of User')}
        textStyle="medium12"
        color={colors.lightGrey}
      >
        Forgot your username or password?
      </Text> */}
      <CustomHighlightButton
        title='Login'
        showActivityIndicator={false}
        disabled={isFormValidated}
        onPress={handleLogin}
      />
      <SSO appleButtonTextType={AppleButton.Type.SIGN_IN} />
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 16,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
});

export default Login;
