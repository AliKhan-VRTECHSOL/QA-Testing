import React, { useMemo, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text, CustomHighlightButton, SAScrollView } from '../../../components';
import { Images } from '../../../assets/images';
import { DimensionsData } from '../../../utils/scaling';
import { CommonLayoutStyles } from '../../../theme/commonLayout';
import { ThemeColors } from '../../../theme/colors';
import { Icons } from '../../../assets/Icons';
import { useTheme } from '../../../context/themeContext';
import PhoneInputField from '../../../components/PhoneInputField';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppleLogin from '../../../components/AppleLogin';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Login: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  return (
    <SAScrollView removeSafeAreaInsets>
      <View style={styles.topContainer}>
        <Image
          source={Images.LoginGradientBG}
          style={styles.topBgGradientImg}
        />
        <Image source={Images.LoginVegetable} style={styles.topBgGradientImg} />
        <View style={styles.logoContainer}>
          <Image source={Icons.Logo} style={styles.logo} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text textStyle="bold30" color={colors.textPrimary}>
          Welcome!{'\n'}
          <Text textStyle="medium16" color={colors.lightGrey}>
            Login your account and buy product.
          </Text>
        </Text>

        <PhoneInputField
          value={phoneNumber}
          setValue={setPhoneNumber}
          setIsPhoneValid={setIsPhoneValid}
        />
        <CustomHighlightButton
          title="Sign In"
          disabled={isPhoneValid}
          showActivityIndicator={false}
          onPress={() => navigation.navigate('Welcome')}
        />
        <View style={styles.linedTextContainer}>
          <Text
            style={styles.linedText}
            textStyle="regular12"
            color={colors.lightGrey}
          >
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
            <Image
              source={Icons.FacebookIcon}
              style={{
                width: 17,
                height: 17,
                resizeMode: 'contain',
              }}
            />
            <Text textStyle="bold16" color={colors.lightGrey}>
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
            <Image
              source={Images.googleLogo}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
            <Text textStyle="bold16" color={colors.lightGrey}>
              Google
            </Text>
          </View>
          <AppleLogin />
        </View>
        <Text center textStyle="medium16" color={colors.lightGrey}>
          Don't have an account?{' '}
          <Text
            onPress={() => navigation.replace('OnBoarding')}
            textStyle="bold16"
            style={styles.register}
          >
            Register
          </Text>
        </Text>
      </View>
    </SAScrollView>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        topContainer: {
          height: DimensionsData.screenHeight - 450,
          paddingHorizontal: CommonLayoutStyles.paddingHorizontal,
          left: -CommonLayoutStyles.paddingHorizontal,
          width: DimensionsData.windowWidth,
        },
        topBgGradientImg: {
          maxHeight: DimensionsData.screenHeight / 2,
          maxWidth: DimensionsData.windowWidth,
          resizeMode: 'contain',
          position: 'absolute',
          bottom: 0,
        },
        logoContainer: {
          width: 90,
          height: 90,
          borderRadius: 45,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: 'auto',
          marginBottom: CommonLayoutStyles.paddingHorizontal,
          backgroundColor: colors.secondaryOpacity1,
        },
        logo: {
          width: 55,
          height: 55,
          resizeMode: 'contain',
        },
        bottomContainer: {
          gap: 20,
        },
        linedTextContainer: {
          height: 1,
          width: '100%',
          experimental_backgroundImage: `linear-gradient(90deg, ${colors.white} 0%, ${colors.black} 50%,${colors.white} 100%)`,
          overflow: 'visible',
          justifyContent: 'center',
          alignItems: 'center',
        },
        linedText: {
          position: 'absolute',
          backgroundColor: 'white',
          paddingHorizontal: 10,
        },
        rowButtonsContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        },
        register: {
          textDecorationLine: 'underline',
          textDecorationColor: colors.primary,
        },
      }),
    [colors],
  );
};

export default Login;
