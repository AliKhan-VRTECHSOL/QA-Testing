import React, { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  InteractionManager,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { ThemeColors } from '../theme/colors';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';
import { Icons } from '../assets/Icons';
import { DimensionsData } from '../utils/scaling';
import { LayoutMetrics } from '../theme/commonLayout';
import { Text } from '.';

interface InputFieldProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  smallVariant?: boolean;
  varient?: 'default' | 'withIcon';
  icon?: ImageSourcePropType;
  onPressIcon?: () => void;
  label?: string;
  iconStyle?: ImageStyle;
}

const InputField = React.forwardRef<TextInput, InputFieldProps>((props, ref) => {
  const { colors } = useTheme();
  const styles = useStyles(colors, props.smallVariant);
  const inputRef = React.useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);

  const resolvedVariant = props.icon ? 'withIcon' : props.varient || 'default';

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  useImperativeHandle(ref, () => ({
    focus: () => {
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.focus();
      });
    },
  }));

  return (
    <View style={{ gap: 10 }}>
      {props.label && (
        <Text textStyle='bold14' color={colors.lightGrey}>
          {props.label}
        </Text>
      )}
      <View style={[styles.container, props.containerStyle]}>
        <TextInput
          ref={inputRef}
          style={styles.inputField}
          placeholderTextColor={colors.lightGrey}
          keyboardType={'default'}
          returnKeyType='next'
          {...props}
          blurOnSubmit={props?.returnKeyType == 'done'}
          secureTextEntry={showPassword}
          autoCorrect={false}
          autoCapitalize='none'
          textContentType='none'
        />
        {props.secureTextEntry ? (
          <Pressable onPress={toggleShowPassword} style={styles.eyeButtonContainer}>
            <Image
              source={showPassword ? Icons.eyeOpen : Icons.eyeClosed}
              style={styles.eyeButton}
            />
          </Pressable>
        ) : null}
        {resolvedVariant === 'withIcon' && (
          <Pressable style={styles.eyeButtonContainer} onPress={props.onPressIcon}>
            <Image source={props.icon} style={[styles.eyeButton, props.iconStyle]} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

const useStyles = (colors: ThemeColors, smallVariant?: boolean) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderWidth: 1,
          flex: 1,
          borderRadius: smallVariant
            ? LayoutMetrics.input.borderRadiusSmall
            : LayoutMetrics.input.borderRadius,
          height: smallVariant
            ? LayoutMetrics.input.heightSmall
            : LayoutMetrics.input.heightDefault,
          borderColor: colors.lightGrey,
          flexDirection: 'row',
          alignItems: 'center',
          minWidth: DimensionsData.windowWidth / 2 - 24,
        },
        inputField: {
          flex: 1,
          paddingHorizontal: 16,
          fontFamily: fonts.family.medium,
          fontSize: 16,
          color: colors.textPrimary,
          height: smallVariant
            ? LayoutMetrics.input.heightSmall
            : LayoutMetrics.input.heightDefault,
        },
        eyeButtonContainer: {
          height: smallVariant
            ? LayoutMetrics.input.heightSmall
            : LayoutMetrics.input.heightDefault,
          width: smallVariant ? LayoutMetrics.input.heightSmall : LayoutMetrics.input.heightDefault,
          alignItems: 'center',
          justifyContent: 'center',
        },
        eyeButton: {
          width: '40%',
          height: '40%',
          resizeMode: 'contain',
        },
      }),
    [colors, smallVariant],
  );
};

export default InputField;
