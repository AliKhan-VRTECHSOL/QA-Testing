import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddProducts from '../../screens/auth/OnBoarding/AddProducts';
import BarcodeScanner from '../../screens/auth/OnBoarding/BarcodeScanner';
import Wishlist from '../../screens/auth/OnBoarding/Wishlist';
import MapScreen from '../../screens/auth/OnBoarding/AddLocation/MapScreen';
import Reciept from '../../screens/auth/OnBoarding/Reciept';
import ScanPurchase from '../../screens/auth/OnBoarding/ScanPurchase';
import AppendScreen from '../../screens/auth/OnBoarding/AppendScreen';
import CSVMapping from '../../screens/auth/OnBoarding/CSVMapping';
import Header from '../../components/Headers/Header';

const CommonStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
      }}
    >
      <Stack.Screen
        name='ScanPurchase'
        component={ScanPurchase}
        options={{
          headerShown: true,
          header: ({ route }) => (
            <Header
              title="Scan Your Purchases"
              variant="titleLeft"
            />
          ),
        }}
      />
      <Stack.Screen
        name='AppendScreen'
        component={AppendScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='CSVMapping'
        component={CSVMapping}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='AddProducts'
        initialParams={{ type: 'add', item: null, index: null, onUpdate: null }}
        component={AddProducts}
      />
      <Stack.Screen name='BarcodeScanner' component={BarcodeScanner} />
      <Stack.Screen name='Reciept' initialParams={{ type: 'add' }} component={Reciept} />
      <Stack.Screen name='Wishlist' component={Wishlist} />
      <Stack.Screen name='MapScreen' component={MapScreen} />
    </Stack.Navigator>
  );
};

export default CommonStack;
