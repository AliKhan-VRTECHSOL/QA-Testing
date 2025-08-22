import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, CustomHighlightButton, SAScrollView } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { Images } from '../../../assets/images';
import { DimensionsData } from '../../../utils/scaling';
import { ThemeColors } from '../../../theme/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Greeting: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <SAScrollView contentContainerStyle={styles.container} removeSafeAreaInsets>
      <View style={styles.header}>
        <Text style={styles.headerText} textStyle='logo24' color={colors.white}>
          Shopomation
        </Text>
      </View>
      <Image resizeMode='cover' source={Images.onBoarding} style={[styles.image]} />
      <View style={styles.bottomContainer}>
        <Text center textStyle='regular16' color={colors.textPrimary}>
          Welcome to Shopomation, the app that predicts what you need before you do.
        </Text>
        <Text center textStyle='regular16' color={colors.textPrimary}>
          Never run out again. Save time & money. Shop smarter, not harder.
        </Text>
        <CustomHighlightButton
          underlayColor={colors.black}
          onPress={() => navigation.navigate('SignUp')}
          title='Get started for free'
          style={{
            marginTop: 58,
            marginBottom: 18,
          }}
        />
        <Text textStyle='medium16' color={colors.textPrimary}>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Login')}
            textStyle='medium16'
            color={colors.textPrimary}
            style={{
              textDecorationLine: 'underline',
            }}
          >
            Log in
          </Text>
        </Text>
      </View>
    </SAScrollView>
  );
};

export default Greeting;

const useStyles = (colors: ThemeColors) => {
  const { top, bottom } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: 0,
          paddingBottom: (bottom > 0 ? bottom : 50) + 20,
        },
        header: {
          height: top + 70,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: top,
          experimental_backgroundImage: colors.gradientColor,
        },
        image: {
          width: '100%',
          height: DimensionsData.screenHeight - 360 - top - bottom,
        },
        bottomContainer: {
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingHorizontal: 16,
          flex: 1,
          marginTop: 30,
        },
        headerText: {
          lineHeight: 30,
        },
      }),
    [colors],
  );
};
