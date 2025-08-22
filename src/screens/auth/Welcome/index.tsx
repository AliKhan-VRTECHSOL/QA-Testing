import React, { useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, CustomHighlightButton } from '../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../context/themeContext';
import { ThemeColors } from '../../../theme/colors';
import { Images } from '../../../assets/images';
import { DimensionsData } from '../../../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonLayoutStyles } from '../../../theme/commonLayout';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Welcome: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Image source={Images.getStarted} style={styles.welcomeImage} />
      <View style={styles.welcomeWrapper}>
        <Text color={colors.black} textStyle={'bold20'}>
          Welcome, Jon.
        </Text>
        <Image />
      </View>
      <Text
        style={styles.detailTextStyle}
        textStyle="regular16"
        color={colors.textPrimary}
        center
      >
        Say goodbye to "did I buy milk?" moments! Join thousands using AI to
        predict what they need at the store and ditch the last-minute trips.
        {'\n\n\n'}Ready to save money and shop smarter?
      </Text>
      <CustomHighlightButton title="Let's get started!" />
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  const { top, bottom } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.white,
          alignItems: 'center',
          paddingBottom: bottom + 50,
          justifyContent: 'space-between',
          paddingHorizontal: CommonLayoutStyles.paddingHorizontal,
        },
        welcomeImage: {
          width: DimensionsData.windowWidth * 0.5,
          height: DimensionsData.windowWidth * 0.5,
          resizeMode: 'contain',
          marginTop: 'auto',
        },
        welcomeWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          marginTop: 32,
          marginBottom: 16,
        },
        detailTextStyle: {
          marginBottom: 60,
        },
      }),
    [colors],
  );
};

export default Welcome;
