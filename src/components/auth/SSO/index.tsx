import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemeColors } from '../../../theme/colors';
import { useTheme } from '../../../context/themeContext';
import { Text } from '../..';
import { Icons } from '../../../assets/Icons';
import { Images } from '../../../assets/images';
import AppleLogin from '../../AppleLogin';
import { AppleButtonType } from '@invertase/react-native-apple-authentication';

const SSO = ({
  appleButtonTextType = AppleButtonType.CONTINUE,
}: {
  appleButtonTextType?: AppleButtonType;
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View>
      <View style={styles.linedTextContainer}>
        <Text style={styles.linedText} textStyle='regular12' color={colors.textPrimary}>
          OR CONTINUE WITH
        </Text>
      </View>

      <View style={styles.rowButtonsContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            flex: 1,
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.lightGrey,
            borderRadius: 100,
            height: 50,
          }}
        >
          {/* TODO: API Integration Required */}
          {/* Call: POST /auth/social-login */}
          {/* Send: { provider: 'facebook', token: string } */}
          {/* Expect: { token: string, user: { id: string, email: string, name: string, phone: string } } */}
          {/* Handle: Store token, user data, navigate to VerifyPhone on success */}
          <Image
            source={Icons.FacebookIcon}
            style={{
              width: 17,
              height: 17,
              resizeMode: 'contain',
            }}
          />
          <Text textStyle='bold16' color={colors.lightGrey}>
            Facebook
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            flex: 1,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: colors.lightGrey,
            borderRadius: 100,
          }}
        >
          {/* TODO: API Integration Required */}
          {/* Call: POST /auth/social-login */}
          {/* Send: { provider: 'google', token: string } */}
          {/* Expect: { token: string, user: { id: string, email: string, name: string, phone: string } } */}
          {/* Handle: Store token, user data, navigate to VerifyPhone on success */}
          <Image
            source={Images.googleLogo}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
          <Text textStyle='bold16' color={colors.lightGrey}>
            Google
          </Text>
        </View>
        <AppleLogin buttonTextType={appleButtonTextType} />
      </View>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        linedTextContainer: {
          height: 1,
          width: '100%',
          experimental_backgroundImage: `linear-gradient(90deg, ${colors.white} 0%, ${colors.black} 50%,${colors.white} 100%)`,
          overflow: 'visible',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 32,
        },
        linedText: {
          position: 'absolute',
          backgroundColor: 'white',
          paddingHorizontal: 10,
        },
        rowButtonsContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 26,
        },
      }),
    [colors],
  );
};

export default SSO;
