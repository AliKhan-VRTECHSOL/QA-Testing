import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ErrandDayForm from '../../../../components/Forms/ErrandDayForm';
import { useErrandStore } from '../../../../store/errandStore';
import { useTheme } from '../../../../context/themeContext';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const AddErrandDayScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { errandDay, errandInterval, setErrandDay, setErrandInterval } = useErrandStore();

  return (
    <ErrandDayForm
      errandDay={errandDay}
      errandInterval={errandInterval}
      setErrandDay={setErrandDay}
      setErrandInterval={setErrandInterval}
      onSave={() => navigation.navigate('AddLocation')}
      isEditMode={false}
      colors={colors}
      removeSafeAreaInsets
    />
  );
};

export default AddErrandDayScreen;
