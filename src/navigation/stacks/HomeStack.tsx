import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTab from '../Tabs/HomeTab';
import AddReceipt from '../../screens/Home/AddReceipt';
import SettingStack from './SettingStack';
import HistoryOrderStack from './HistoryOrderStack';
import CategoriesStack from './CategoriesStack';
import AddItem from '../../screens/Home/Shop/AddItem';

const HomeStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName='HomeTab'
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
      }}
    >
      <Stack.Screen name='HomeTab' component={HomeTab} />
      <Stack.Screen name='SettingStack' component={SettingStack} />
      <Stack.Screen name='HistoryOrderStack' component={HistoryOrderStack} />
      <Stack.Screen name='CategoriesStack' component={CategoriesStack} />
      <Stack.Screen name='AddItem' component={AddItem} />
      <Stack.Screen
        name='AddReceipt'
        component={AddReceipt}
        options={{
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
