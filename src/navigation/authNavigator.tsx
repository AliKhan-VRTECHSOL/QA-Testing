import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Greeting from '../screens/auth/Greeting';
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import VerifyPhone from '../screens/auth/VerifyPhone';
import Welcome from '../screens/auth/Welcome';
import OnBoarding from '../screens/auth/OnBoarding';

const AuthNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Greeting"
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
      }}
    >
      <Stack.Screen
        name="Greeting"
        component={Greeting}
        options={{
          statusBarStyle: 'light',
        }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyPhone" component={VerifyPhone} />
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
