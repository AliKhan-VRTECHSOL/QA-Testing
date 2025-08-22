import React, { useMemo, useCallback } from 'react';
import { View, Image, Pressable, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../../screens/Home/HomeScreen';
import Shop from '../../screens/Home/Shop';
import History from '../../screens/Home/History';
import Settings from '../../screens/Home/Settings';

import { BottomTabIcons } from '../../assets/Icons';
import { Text } from '../../components';
import { useTheme } from '../../context/themeContext';
import { ThemeColors } from '../../theme/colors';
import { LayoutMetrics } from '../../theme/commonLayout';

type TabIconKey = 'Home' | 'Shop' | 'add' | 'History' | 'Settings';

const TabIcons: Record<'true' | 'false', Record<TabIconKey, any>> = {
  false: {
    Home: BottomTabIcons.home,
    Shop: BottomTabIcons.shop,
    add: BottomTabIcons.add,
    History: BottomTabIcons.history,
    Settings: BottomTabIcons.setting,
  },
  true: {
    Home: BottomTabIcons.homeFilled,
    Shop: BottomTabIcons.shopFilled,
    add: BottomTabIcons.add,
    History: BottomTabIcons.historyFilled,
    Settings: BottomTabIcons.settingFilled,
  },
};

const ScreensData: {
  name: TabIconKey;
  component: React.ComponentType<any>;
  options?: any;
}[] = [
  {
    name: 'Home',
    component: HomeScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Shop',
    component: Shop,
    options: {
      title: 'Shopping Checklist',
      headerShown: false,
    },
  },
  {
    name: 'History',
    component: History,
    options: {
      title: 'Transaction History',
    },
  },
  {
    name: 'Settings',
    component: Settings,
    options: {
      title: 'Settings',
    },
  },
];

const Tab = createBottomTabNavigator();

const HomeTab = () => (
  <Tab.Navigator
    initialRouteName='Home'
    screenOptions={{
      tabBarShowLabel: false,
      header: props => <CustomHeader {...props} />,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    {ScreensData.map(({ name, component, options }) => (
      <Tab.Screen key={name} name={name} component={component} options={options} />
    ))}
  </Tab.Navigator>
);

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const routesWithAdd = [...state.routeNames];
  const insertIndex = 2;
  if (!routesWithAdd.includes('add')) {
    routesWithAdd.splice(insertIndex, 0, 'add');
  }

  return (
    <View style={styles.container}>
      {routesWithAdd.map((routeName, idx) => {
        const isFocused = state.routeNames[state.index] === routeName;

        const handlePress = useCallback(() => {
          if (routeName === 'add') {
            navigation.navigate('AddReceipt');
            return;
          }
          const targetRoute = state.routes.find(r => r.name === routeName);
          if (!targetRoute) return;
          const event = navigation.emit({
            type: 'tabPress',
            target: targetRoute.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        }, [isFocused, navigation, routeName, state.routes]);

        if (routeName == 'add') {
          return (
            <View style={styles.item}>
              <Pressable onPress={handlePress} style={styles.addItemContainer}>
                <Image
                  source={
                    TabIcons[isFocused.toString() as 'true' | 'false'][routeName as TabIconKey]
                  }
                  style={styles.itemIcon}
                />
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable key={routeName} onPress={handlePress} style={styles.item}>
            <Image
              source={TabIcons[isFocused.toString() as 'true' | 'false'][routeName as TabIconKey]}
              style={styles.itemIcon}
            />
            <Text
              textStyle={isFocused ? 'bold14' : 'regular14'}
              color={isFocused ? colors.primary : colors.lightGrey}
            >
              {routeName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const CustomHeader: React.FC = ({ options: { title }, navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.headerContainer}>
      <Text textStyle='bold24' color={colors.textPrimary}>
        {title}
      </Text>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  const { bottom, top } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: bottom + 75,
          backgroundColor: colors.white,
          flexDirection: 'row',
          paddingBottom: bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 10,
        } as ViewStyle,
        item: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        addItemContainer: {
          width: 56,
          height: 56,
          experimental_backgroundImage: colors.gradientColor,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
        },
        itemIcon: {
          width: 24,
          height: 24,
        } as ImageStyle,
        headerContainer: {
          backgroundColor: colors.white,
          paddingTop: top + 10,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          paddingBottom: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
      }),
    [colors, bottom],
  );
};

export default HomeTab;
