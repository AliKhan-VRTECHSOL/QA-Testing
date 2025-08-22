import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../../../context/themeContext';
import ErrandDayForm from '../../../../components/Forms/ErrandDayForm';
import { useErrandStore } from '../../../../store/errandStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const EditErrandDay: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { errandDay, errandInterval, setErrandDay, setErrandInterval } = useErrandStore();

  return (
    <ErrandDayForm
      errandDay={errandDay}
      errandInterval={errandInterval}
      setErrandDay={setErrandDay}
      setErrandInterval={setErrandInterval}
      onSave={() => navigation.goBack()}
      colors={colors}
      removeSafeAreaInsets
      isEditMode
    />
  );
};

export default EditErrandDay;
