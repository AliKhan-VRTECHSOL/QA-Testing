import React, { useEffect, useState } from 'react';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import { decode } from 'base-64';
import { jwtDecode } from 'jwt-decode';
import { AppleLoginProps } from './types';
import styles from './styles';

global.atob = decode;

const AppleLogin: React.FC<AppleLoginProps> = ({ onSuccess, onError }) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (appleAuth.isSupported) {
      setIsSupported(true);
      return appleAuth.onCredentialRevoked(() => {
        console.warn('Apple credential revoked');
      });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { user, fullName, email, identityToken } = response;

      const name =
        fullName?.givenName && fullName?.familyName
          ? `${fullName.givenName} ${fullName.familyName}`
          : 'unknown';

      let userEmail = email || 'unknown';
      if (identityToken) {
        const decoded = jwtDecode(identityToken);
        if (decoded?.email) {
          userEmail = decoded.email;
        }
      }

      onSuccess?.({
        platform: 'ios',
        id: user,
        name,
        email: userEmail,
        identityToken,
      });
    } catch (err: any) {
      if (err.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error('Apple Sign-In Error (iOS):', err);
        onError?.(err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <AppleButton
      style={styles.buttonContainerStyle}
      cornerRadius={25}
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={AppleButton.Type.CONTINUE}
      onPress={handleLogin}
    />
  );
};

export default AppleLogin;
