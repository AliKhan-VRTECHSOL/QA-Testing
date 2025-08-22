import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import fonts from '../theme/fonts';
import { Icons } from '../assets/Icons';

interface ComponentProps {
  value: string;
  setValue: SetStateAction<any>;
  setIsPhoneValid: SetStateAction<any>;
}

const PhoneInputField: React.FC<ComponentProps> = ({
  value,
  setValue,
  setIsPhoneValid,
}) => {
  const [number, setNumber] = useState('');
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const phoneInput = useRef<PhoneInput>(null);

  const validatePhoneNumber = useCallback(() => {
    const isValid = !(phoneInput.current?.isValidNumber(value) ?? false);
    setIsPhoneValid(isValid);
  }, [value, setIsPhoneValid]);

  const maxLength = useMemo(() => {
    const isValid = phoneInput.current?.isValidNumber(value) ?? false;
    if (isValid) {
      return number.length;
    } else return number.length + 1;
  }, [value, number]);

  useEffect(() => {
    validatePhoneNumber();
  }, [validatePhoneNumber]);

  return (
    <PhoneInput
      ref={phoneInput}
      onChangeText={setNumber}
      onChangeFormattedText={setValue}
      placeholder="Phone number"
      textInputProps={{
        placeholderTextColor: colors.lightGrey,
        maxLength: maxLength,
      }}
      textInputStyle={styles.phoneInputStyle}
      layout="second"
      defaultCode="AU"
      containerStyle={styles.phoneContainerStyle}
      textContainerStyle={styles.phoneTextContainerStyle}
      codeTextStyle={styles.phoneCodeStyle}
      renderDropdownImage={
        <Image source={Icons.ChevronDown} style={styles.phoneIcon} />
      }
    />
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        phoneInputStyle: {
          fontSize: 16,
          fontFamily: fonts.family.medium,
          color: colors.black,
          paddingHorizontal: 16,
          height: '100%',
        },
        phoneContainerStyle: {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: colors.lightGrey,
          height: 56,
          width: '100%',
        },
        phoneTextContainerStyle: {
          backgroundColor: colors.white,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          borderLeftWidth: 1,
          borderColor: colors.lightGrey,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
        phoneCodeStyle: {
          fontSize: 16,
          fontFamily: fonts.family.medium,
          marginRight: 0,
          lineHeight: 19,
        },
        phoneIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default PhoneInputField;
