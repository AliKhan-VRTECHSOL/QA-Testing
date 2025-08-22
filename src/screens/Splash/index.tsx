import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../context/themeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DimensionsData } from '../../utils/scaling';
import { useProfileStatusStore } from '../../store/profileStatusStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Splash: React.FC<ScreenProps> = ({ navigation }) => {
  const styles = useStyles();
  const { isLoggedIn } = useProfileStatusStore();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(isLoggedIn ? 'HomeStack' : 'AuthStack');
    }, 4500);
  }, []);

  return (
    <LottieView
      autoPlay
      source={require('../../assets/lottieFiles/Splash.json')}
      speed={2}
      style={styles.lottieView}
      loop={false}
    />
  );
};

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        lottieView: {
          backgroundColor: colors.splashBackground,
          width: DimensionsData.windowWidth,
          height: DimensionsData.screenHeight,
        },
      }),
    [colors],
  );
};

export default Splash;
