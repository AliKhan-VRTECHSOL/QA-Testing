import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, CustomHighlightButton } from '../../../components';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text textStyle="medium24" color={colors.white}>
          Shopomation
        </Text>
      </View>
      <Image
        resizeMode="cover"
        source={Images.onBoarding}
        style={styles.image}
      />
      <View style={styles.bottomContainer}>
        <Text center textStyle="regular16" color={colors.textPrimary}>
          Welcome to Shopomation, the app that predicts what you need before you
          do.
        </Text>
        <Text center textStyle="regular16" color={colors.textPrimary}>
          Never run out again. Save time & money. Shop smarter, not harder.
        </Text>
        <CustomHighlightButton
          underlayColor={colors.black}
          onPress={() => navigation.navigate('OnBoarding')}
          title="Get started for free"
        />
        <Text textStyle="medium16" color={colors.textPrimary}>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Login')}
            textStyle="medium16"
            color={colors.textPrimary}
          >
            Log in
          </Text>
        </Text>
      </View>
    </View>
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
          paddingBottom: bottom,
        },
        header: {
          height: top + 70,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 20,
          experimental_backgroundImage: colors.gradientColor,
        },
        image: {
          width: '100%',
          height: DimensionsData.screenHeight - 350 - top - bottom,
        },
        bottomContainer: {
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingHorizontal: 16,
          flex: 1,
        },
      }),
    [colors],
  );
};
