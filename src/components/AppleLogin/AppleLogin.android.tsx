import React, { useEffect, useState } from 'react';
import {
  AppleButton,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import { Image } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuid } from 'uuid';
import { AppleLoginProps } from './types';
import { DimensionsData } from '../../utils/scaling';
import styles from './styles';

const appleLogoBlack = require('./apple_logo_white.webp');

const AppleLogin: React.FC<AppleLoginProps> = ({ onSuccess, onError }) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    setIsSupported(appleAuthAndroid.isSupported);
  }, []);

  const handleLogin = async () => {
    try {
      const rawNonce = uuid();
      const state = uuid();

      appleAuthAndroid.configure({
        clientId: 'com.example.client-android',
        redirectUri: 'https://example.com/auth/callback',
        scope: appleAuthAndroid.Scope.ALL,
        responseType: appleAuthAndroid.ResponseType.ALL,
        nonce: rawNonce,
        state,
      });

      const response = await appleAuthAndroid.signIn();

      const decoded = response.id_token ? jwtDecode(response.id_token) : {};

      onSuccess?.({
        platform: 'android',
        id: response.user,
        email: (decoded as any)?.email || 'unknown',
        name: (decoded as any)?.name || 'unknown',
        idToken: response.id_token,
        code: response.code,
      });
    } catch (err: any) {
      console.error('Apple Sign-In Error (Android):', err);
      onError?.(err);
    }
  };

  if (!isSupported) return null;

  return (
    <AppleButton
      style={styles.buttonContainerStyle}
      cornerRadius={25}
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={AppleButton.Type.CONTINUE}
      textStyle={styles.textStyle}
      onPress={handleLogin}
      leftView={<Image source={appleLogoBlack} style={styles.logoStyle} />}
    />
  );
};

export default AppleLogin;
