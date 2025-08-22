import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NavigatorHeader from '../../components/Headers/NavigatorHeader';

import EditProfile from '../../screens/Home/Settings/EditProfile';
import ShoppingPreferences from '../../screens/Home/Settings/ShoppingPrefernces';
import EditErrandDay from '../../screens/Home/Settings/EditErrandDay';
import PrivacyPolicy from '../../screens/Home/Settings/PrivacyPolicy';
import Notifications from '../../screens/Home/Settings/Notifications';
import ChangePassword from '../../screens/Home/Settings/ChangePassword';
import AddStore from '../../screens/Home/Settings/AddStore';
import ManageSubscription from '../../screens/Home/Settings/ManageSubscription';
import CancelSubscription from '../../screens/Home/Settings/ManageSubscription/CancelSubscription';
import AddEditCard from '../../screens/Home/Settings/ManageSubscription/AddEditCard';

const ScreensData = [
  {
    name: 'EditProfile',
    component: EditProfile,
    options: {
      headerTitle: 'Edit Profile',
    },
  },
  {
    name: 'ManageSubscription',
    component: ManageSubscription,
    options: {
      headerTitle: 'Manage Subscription',
    },
  },
  {
    name: 'Notifications',
    component: Notifications,
    options: {
      headerTitle: 'Notifications',
    },
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
    options: {
      headerTitle: 'Change Password',
    },
  },
  {
    name: 'EditErrandDay',
    component: EditErrandDay,
    options: {
      headerTitle: 'Edit Errands',
    },
    initialParams: {
      isHomeStack: true,
    },
  },
  {
    name: 'ShoppingPreferences',
    component: ShoppingPreferences,
    options: {
      headerTitle: 'Add/Edit Shopping Preferences',
    },
  },
  {
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    options: {
      headerTitle: 'Privacy Policy',
    },
  },
  {
    name: 'AddStore',
    component: AddStore,
    options: {
      headerTitle: 'Add Store',
    },
  },
  {
    name: 'CancelSubscription',
    component: CancelSubscription,
    options: {
      headerTitle: 'Cancel Subscription',
    },
  },
  {
    name: 'AddEditCard',
    component: AddEditCard,
    options: {
      headerTitle: 'Update Card',
    },
  },
];

const SettingStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: props => <NavigatorHeader {...props} />,
      }}
    >
      {ScreensData.map(k => (
        <Stack.Screen
          name={k?.name}
          component={k?.component}
          options={k?.options}
          initialParams={k?.initialParams}
        />
      ))}
    </Stack.Navigator>
  );
};

export default SettingStack;
