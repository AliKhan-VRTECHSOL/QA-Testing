import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarStrip, CustomHighlightButton, DropDownModal, SAScrollView, Text } from '..';
import { ThemeColors } from '../../theme/colors';
import { Intervals } from '../../constants';
import {
  getEnumKeyFromLabel,
  getHumanReadableEnums,
  getSingleHumanReadableEnum,
} from '../../utils/utils';

interface Props {
  errandDay: string;
  errandInterval: string;
  setErrandDay: (day: string) => void;
  setErrandInterval: (interval: string) => void;
  onSave: () => void;
  isEditMode?: boolean;
  colors: ThemeColors;
  header?: ReactNode;
  removeSafeAreaInsets?: boolean;
}

const ErrandDayForm: React.FC<Props> = ({
  errandDay,
  errandInterval,
  setErrandDay,
  setErrandInterval,
  onSave,
  isEditMode = false,
  colors,
  header,
  removeSafeAreaInsets,
}) => {
  const isDisabled = useMemo(() => !(errandDay && errandInterval), [errandDay, errandInterval]);

  return (
    <SAScrollView
      header={header}
      scrollEnabled={false}
      removeSafeAreaInsets={removeSafeAreaInsets}
      footer={
        <CustomHighlightButton
          title={isEditMode ? 'Save' : 'Save and next'}
          style={styles.buttonStyle}
          disabled={isDisabled}
          onPress={() => {
            // TODO: API Integration Required
            // Call: POST /onboarding/errands
            // Send: { errandDay: string, errandInterval: string }
            // Expect: { success: boolean, message: string }
            // Handle: Navigate to next screen on success, show error on failure

            onSave();
          }}
        />
      }
    >
      <View style={styles.textWrapper}>
        <Text textStyle='bold24' color={colors.textPrimary}>
          When do you run errands?
        </Text>
        {!isEditMode && (
          <Text textStyle='regular16' color={colors.textPrimary}>
            You can change this later.
          </Text>
        )}
      </View>

      <CalendarStrip />

      <View style={styles.dropDownWrapper}>
        <DropDownModal
          title='Select Errands Day'
          selectedValue={errandDay}
          setSelectedValue={setErrandDay}
          options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
        />
        <DropDownModal
          title='Select Errands Interval'
          selectedValue={getSingleHumanReadableEnum(errandInterval)}
          setSelectedValue={selectedOption =>
            setErrandInterval(getEnumKeyFromLabel(Intervals, selectedOption)!)
          }
          options={getHumanReadableEnums(Intervals)}
        />
      </View>
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
  },
  buttonStyle: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  dropDownWrapper: {
    gap: 16,
    marginTop: 16,
  },
});

export default ErrandDayForm;
