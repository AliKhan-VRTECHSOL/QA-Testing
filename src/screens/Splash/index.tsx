import React, { useEffect, useMemo } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const Splash: React.FC<ScreenProps> = ({ navigation }) => {
  const styles = useStyles();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('AuthNavigator');
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
          flex: 1,
          backgroundColor: colors.splashBackground,
        },
      }),
    [colors],
  );
};

export default Splash;
