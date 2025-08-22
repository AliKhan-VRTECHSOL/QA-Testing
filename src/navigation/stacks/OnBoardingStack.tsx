import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainerRef, useNavigationContainerRef } from '@react-navigation/native';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PersonalInfo from '../../screens/auth/OnBoarding/PersonalInfo';
import AddErrandDay from '../../screens/auth/OnBoarding/AddErrandDay';
import AddLocation from '../../screens/auth/OnBoarding/AddLocation';
import ScanPurchase from '../../screens/auth/OnBoarding/ScanPurchase';

import Header from '../../components/Headers/Header';
import { useTheme } from '../../context/themeContext';
import { DimensionsData } from '../../utils/scaling';
import Welcome from '../../screens/auth/Welcome';
import { useKeyboardStatus } from '../../utils/useKeyboardStatus';

type OnboardingStackParamList = {
  PersonalInfo: undefined;
  AddErrandDay: undefined;
  AddLocation: undefined;
  ScanPurchase: {
    mode?: 'new' | 'append';
    fromOnboarding?: boolean;
  };
  Welcome: undefined;
};

type ScreenKey = keyof OnboardingStackParamList;

interface CustomHeaderProps {
  route: ScreenKey;
  navigation: NativeStackNavigationProp<OnboardingStackParamList>;
}

const Screens: Record<
  ScreenKey,
  {
    progress: number;
    headerTitle: string;
    headerVariant?: string;
    hideHeader?: boolean;
  }
> = {
  PersonalInfo: { progress: 10, headerTitle: 'Getting Started' },
  AddErrandDay: { progress: 25, headerTitle: 'Getting Started' },
  AddLocation: { progress: 45, headerTitle: 'Getting Started' },
  ScanPurchase: {
    progress: 65,
    headerTitle: 'Scan Your Purchases',
    headerVariant: 'titleLeft',
  },
  Welcome: {
    progress: 100,
    headerTitle: 'Welcom Onboard',
    hideHeader: true,
  },
};

const ScreensData = [
  { name: 'PersonalInfo', component: PersonalInfo },
  { name: 'AddErrandDay', component: AddErrandDay },
  { name: 'AddLocation', component: AddLocation },
  { name: 'ScanPurchase', component: ScanPurchase },
  { name: 'Welcome', component: Welcome },
] as const;

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnBoardingStack: React.FC = () => {
  const navigationRef = useNavigationContainerRef<OnboardingStackParamList>();
  const [currentRouteName, setCurrentRouteName] = useState<ScreenKey>('PersonalInfo');
  const [currentRouteNavigation, setCurrentRouteNavigation] = useState(null);

  const handleStateChange = () => {
    const current = navigationRef.getCurrentRoute()?.name as ScreenKey;
    if (current && current !== currentRouteName) {
      setCurrentRouteName(current);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader route={currentRouteName} navigation={currentRouteNavigation} />

      <Stack.Navigator
        initialRouteName='PersonalInfo'
        screenOptions={{
          header: props => {
            setCurrentRouteName(props.route.name);
            setCurrentRouteNavigation(props.navigation);
          },
        }}
      >
        {ScreensData.map(({ name, component }) => (
          <Stack.Screen key={name} name={name} component={component} />
        ))}
      </Stack.Navigator>

      <NavigationListener onStateChange={handleStateChange} navigationRef={navigationRef} />
    </View>
  );
};

interface NavigationListenerProps {
  onStateChange: () => void;
  navigationRef: NavigationContainerRef<OnboardingStackParamList>;
}

const NavigationListener: React.FC<NavigationListenerProps> = ({
  onStateChange,
  navigationRef,
}) => {
  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', onStateChange);
    return unsubscribe;
  }, [navigationRef, onStateChange]);

  return null;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ route, navigation }) => {
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressValue = useMemo(() => Screens[route]?.progress ?? 0, [route]);
  const isKeyboardVisible = useKeyboardStatus();

  const headerConfig = useMemo(() => {
    const isAddLocationWithKeyboard = route === 'AddLocation' && isKeyboardVisible;

    if (isAddLocationWithKeyboard) {
      return {
        title: 'Location',
        variant: 'titleLeft',
      };
    }

    const screenConfig = Screens[route] || {};

    return {
      title: screenConfig.headerTitle,
      variant: screenConfig.headerVariant || 'default',
    };
  }, [route, isKeyboardVisible]);

  const styles = useStyles(progressWidth);

  const handleUpdateProgress = useCallback(() => {
    Animated.timing(progressWidth, {
      toValue: (DimensionsData.windowWidth / 100) * progressValue,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressValue]);

  useEffect(() => {
    handleUpdateProgress();
  }, [handleUpdateProgress]);

  return (
    <View style={styles.headerWrapper}>
      {!Screens[route]?.hideHeader && (
        <Header
          useThisNavigation={navigation}
          title={headerConfig.title}
          variant={headerConfig.variant || undefined}
        />
      )}
      <View style={styles.headerProgressContainer}>
        <Animated.View style={styles.headerProgress} />
      </View>
    </View>
  );
};

const useStyles = (progressBarWidth: number) => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        headerWrapper: {
          minHeight: top,
          paddingTop: top,
          backgroundColor: colors.white,
        },
        headerProgressContainer: {
          position: 'absolute',
          left: 0,
          right: 0,
          height: 5,
          bottom: 0,
        },
        headerProgress: {
          height: '100%',
          width: progressBarWidth,
          backgroundColor: colors.primary,
          experimental_backgroundImage: colors.gradientColor,
        },
      }),
    [colors, progressBarWidth],
  );
};

export default OnBoardingStack;
