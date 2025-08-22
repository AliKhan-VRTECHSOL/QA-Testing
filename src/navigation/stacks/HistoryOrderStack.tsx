import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrderDetail from '../../screens/Home/History/OrderDetail';
import OrderItemDetail from '../../screens/Home/History/OrderItemDetail';

const HistoryOrderStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='OrderDetail' component={OrderDetail} />
      <Stack.Screen name='OrderItemDetail' component={OrderItemDetail} />
    </Stack.Navigator>
  );
};

export default HistoryOrderStack;
