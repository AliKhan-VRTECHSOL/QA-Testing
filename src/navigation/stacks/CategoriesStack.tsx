import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Categories from '../../screens/Home/Categories';
import SubCategoryReport from '../../screens/Home/Categories/SubCategoryReport';

const CategoriesStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Categories' component={Categories} />
      <Stack.Screen name='SubCategoryReport' component={SubCategoryReport} />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
