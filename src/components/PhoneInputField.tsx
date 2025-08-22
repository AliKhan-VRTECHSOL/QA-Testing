import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import fonts from '../theme/fonts';
import { Icons } from '../assets/Icons';
import { LayoutMetrics } from '../theme/commonLayout';
import { Text } from '.';

interface ComponentProps {
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  setIsPhoneValid: Dispatch<SetStateAction<any>>;
  title?: string;
  smallVariant?: boolean;
}

const PhoneInputField: React.FC<ComponentProps> = ({
  value,
  setValue,
  setIsPhoneValid,
  title,
  smallVariant,
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
    <View style={{ gap: 10, width: '100%' }}>
      {title && (
        <Text textStyle='bold14' color={colors.lightGrey}>
          {title}
        </Text>
      )}
      <PhoneInput
        ref={phoneInput}
        onChangeText={setNumber}
        onChangeFormattedText={setValue}
        placeholder='Phone number'
        textInputProps={{
          placeholderTextColor: colors.lightGrey,
          maxLength: maxLength,
          ...(Platform.OS == 'android'
            ? {
                selectionColor: colors.secondaryOpacity1,
                cursorColor: colors.black,
                selectionHandleColor: colors.primary,
              }
            : {
                selectionColor: colors.primary,
              }),
        }}
        textInputStyle={smallVariant ? styles.smallPhoneInputStyle : styles.phoneInputStyle}
        layout='second'
        defaultCode='AU'
        containerStyle={smallVariant ? styles.smallPhoneContainerStyle : styles.phoneContainerStyle}
        textContainerStyle={
          smallVariant ? styles.smallPhoneTextContainerStyle : styles.phoneTextContainerStyle
        }
        codeTextStyle={smallVariant ? styles.smallPhoneCodeStyle : styles.phoneCodeStyle}
        renderDropdownImage={
          <Image
            source={Icons.ChevronDown}
            style={smallVariant ? styles.smallPhoneIcon : styles.phoneIcon}
          />
        }
      />
    </View>
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
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          height: '100%',
        },
        smallPhoneInputStyle: {
          fontSize: 16,
          fontFamily: fonts.family.medium,
          color: colors.black,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          height: '100%',
        },
        phoneContainerStyle: {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderRadius: LayoutMetrics.input.borderRadius,
          borderColor: colors.lightGrey,
          height: LayoutMetrics.input.heightDefault,
          width: '100%',
        },
        smallPhoneContainerStyle: {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderRadius: LayoutMetrics.input.borderRadiusSmall,
          borderColor: colors.lightGrey,
          height: LayoutMetrics.input.heightSmall,
          width: '100%',
        },
        phoneTextContainerStyle: {
          backgroundColor: colors.white,
          borderTopRightRadius: LayoutMetrics.input.borderRadius,
          borderBottomRightRadius: LayoutMetrics.input.borderRadius,
          borderLeftWidth: 1,
          borderColor: colors.lightGrey,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
        smallPhoneTextContainerStyle: {
          backgroundColor: colors.white,
          borderTopRightRadius: LayoutMetrics.input.borderRadiusSmall,
          borderBottomRightRadius: LayoutMetrics.input.borderRadiusSmall,
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
        smallPhoneCodeStyle: {
          fontSize: 16,
          fontFamily: fonts.family.medium,
          marginRight: 0,
          lineHeight: 17,
        },
        phoneIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
        smallPhoneIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default PhoneInputField;
