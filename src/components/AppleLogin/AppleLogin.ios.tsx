import React, { useEffect, useState } from 'react';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { decode } from 'base-64';
import { jwtDecode } from 'jwt-decode';
import { AppleLoginProps } from './types';
import styles from './styles';
import fonts from '../../theme/fonts';

global.atob = decode;

const AppleLogin: React.FC<AppleLoginProps> = ({ onSuccess, onError, buttonTextType }) => {
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

      // TODO: API Integration Required
      // Call: POST /auth/social-login
      // Send: { provider: 'apple', token: identityToken, user: { id: user, name: name, email: userEmail } }
      // Expect: { token: string, user: { id: string, email: string, name: string, phone: string } }
      // Handle: Store token, user data, navigate to VerifyPhone on success

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
      buttonType={buttonTextType}
      onPress={handleLogin}
      textStyle={{
        fontSize: 12,
        fontFamily: fonts.family.medium,
      }}
    />
  );
};

export default AppleLogin;
