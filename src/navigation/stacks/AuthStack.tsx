import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Greeting from '../../screens/auth/Greeting';
import Login from '../../screens/auth/Login';
import SignUp from '../../screens/auth/SignUp';
import VerifyPhone from '../../screens/auth/VerifyPhone';
import OnBoardingStack from './OnBoardingStack';
import Subscription from '../../screens/auth/Subscription';

const AuthStack: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName='Greeting'
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
      }}
    >
      <Stack.Screen
        name='Greeting'
        component={Greeting}
        options={{
          statusBarStyle: 'light',
        }}
      />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='OnBoardingStack' component={OnBoardingStack} />
      <Stack.Screen name='VerifyPhone' component={VerifyPhone} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Subscription' component={Subscription} />
    </Stack.Navigator>
  );
};

export default AuthStack;
