import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash';
import AuthStack from './stacks/AuthStack';
import HomeStack from './stacks/HomeStack';
import CommonStack from './stacks/CommonStack';
import AddStore from '../screens/Home/Settings/AddStore';

const MainNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Splash'
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
          statusBarTranslucent: true,
          navigationBarTranslucent: true,
          statusBarStyle: 'dark',
        }}
      >
        <Stack.Screen
          name={'Splash'}
          component={Splash}
          options={{
            statusBarStyle: 'light',
          }}
        />
        <Stack.Screen name='AuthStack' component={AuthStack} />
        <Stack.Screen name='HomeStack' component={HomeStack} />
        <Stack.Screen name='CommonStack' component={CommonStack} />
        <Stack.Screen name='AddStore' component={AddStore} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNav;
