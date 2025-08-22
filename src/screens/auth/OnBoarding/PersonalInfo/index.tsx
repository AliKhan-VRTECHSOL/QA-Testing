import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SAScrollView, Text, InputField, CustomHighlightButton } from '../../../../components';
import { useTheme } from '../../../../context/themeContext';
import { useProfileStatusStore, ProfileStatus } from '../../../../store/profileStatusStore';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const PersonalInfo: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { setProfileStatus } = useProfileStatusStore();

  const lastNameRef = useRef<TextInput>(null);
  const occupationRef = useRef<TextInput>(null);
  const referralRef = useRef<TextInput>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [referral, setReferral] = useState('');

  const validation = useMemo(
    () => !(firstName.length != 0 && lastName.length != 0),
    [firstName, lastName],
  );

  const handleSubmitForm = useCallback(() => {
    if (validation) {
      return;
    }

    // TODO: API Integration Required
    // Call: POST /onboarding/personal-info
    // Send: { firstName: string, lastName: string, occupation?: string, referral?: string }
    // Expect: { success: boolean, message: string }
    // Handle: Set profile status, navigate to AddErrandDay on success, show error on failure

    setProfileStatus(ProfileStatus.PROFILE_COMPLETE);
    navigation.navigate('AddErrandDay');
  }, [validation]);

  return (
    <SAScrollView
      removeSafeAreaInsets
      footer={
        <CustomHighlightButton
          title='Save and next'
          onPress={handleSubmitForm}
          style={styles.buttonStyle}
          disabled={validation}
        />
      }
    >
      <View style={styles.textWrapper}>
        <Text textStyle='bold24' color={colors.textPrimary}>
          Let's get you started
        </Text>
        <Text textStyle='regular16' color={colors.textPrimary}>
          Fill in your profile information
        </Text>
      </View>
      <View style={styles.inputFieldWrapper}>
        <View style={styles.rowSpaced}>
          <InputField
            placeholder='First Name'
            value={firstName}
            onChangeText={setFirstName}
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />
          <InputField
            placeholder='Last Name'
            ref={lastNameRef}
            value={lastName}
            onChangeText={setLastName}
            onSubmitEditing={() => occupationRef.current?.focus()}
          />
        </View>
        <InputField
          placeholder='Occupation (Optional)'
          ref={occupationRef}
          value={occupation}
          onChangeText={setOccupation}
          onSubmitEditing={() => referralRef.current?.focus()}
        />
        <InputField
          placeholder='Referral (Optional)'
          ref={referralRef}
          value={referral}
          onChangeText={setReferral}
          onSubmitEditing={handleSubmitForm}
          returnKeyType='done'
        />
      </View>
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  inputFieldWrapper: {
    gap: 16,
    marginTop: 50,
  },
  rowSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonStyle: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  textWrapper: {
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
  },
});

export default PersonalInfo;
