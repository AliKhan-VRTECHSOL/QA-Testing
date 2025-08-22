import React, { SetStateAction, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemeColors } from '../../../theme/colors';
import { useTheme } from '../../../context/themeContext';
import HeaderSpaced from '../../../components/Headers/HeaderSpaced';
import AppleLogin from '../../../components/AppleLogin';
import {
  Text,
  CustomHighlightButton,
  InputField,
  SAScrollView,
} from '../../../components';
import { emailRegex } from '../../../constants/regex';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icons } from '../../../assets/Icons';
import CheckBox from '../../../components/CheckBox';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const SignUp: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleUpdateInputFields = (
    newText: string,
    setNewText: SetStateAction<any>,
  ) => {
    setNewText(newText.trim());
  };

  const isFormValidated = useMemo(
    () =>
      !(
        firstName.length !== 0 &&
        lastName.length !== 0 &&
        emailRegex.test(email)
      ),
    [firstName, lastName, email],
  );

  return (
    <SAScrollView
      contentContainerStyle={styles.contentContainerStyle}
      header={<HeaderSpaced title="Sign Up" />}
    >
      <AppleLogin />
      <View style={styles.rowFieldsWrapper}>
        <InputField
          placeholder={'First name'}
          value={firstName}
          onChangeText={newText =>
            handleUpdateInputFields(newText, setFirstName)
          }
        />
        <InputField
          placeholder={'Last name'}
          value={lastName}
          onChangeText={newText =>
            handleUpdateInputFields(newText, setLastName)
          }
        />
      </View>
      <InputField
        placeholder={'Email address'}
        keyboardType={'email-address'}
        value={email}
        onChangeText={newText => handleUpdateInputFields(newText, setEmail)}
      />
      <CustomHighlightButton
        title="Sign Up"
        showActivityIndicator={false}
        disabled={isFormValidated}
        onPress={() => navigation.navigate('VerifyPhone')}
      />
      <View
        style={{
          flexDirection: 'row',
          gap: 7,
        }}
      >
        <CheckBox selected={agreeTerms} setSelected={setAgreeTerms} />
        <Text textStyle="medium12" color={colors.lightGrey}>
          By signing up you agree to our{' '}
          <Text
            onPress={() => Alert.alert('Terms of User')}
            textStyle="bold12"
            color={colors.lightGrey}
          >
            Terms of Use
          </Text>{' '}
          and{'\n'}
          <Text
            onPress={() => Alert.alert('Privacy Notice')}
            textStyle="bold12"
            color={colors.lightGrey}
          >
            Privacy Notice.
          </Text>
        </Text>
      </View>
    </SAScrollView>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainerStyle: {
          gap: 16,
          paddingTop: 24,
          paddingHorizontal: 16,
        },
        rowFieldsWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        },
      }),
    [colors],
  );
};

export default SignUp;
