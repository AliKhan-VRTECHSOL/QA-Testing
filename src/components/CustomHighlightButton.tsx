import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../context/themeContext';
import { DimensionsData } from '../utils/scaling';
import { Text } from '.';
import { LayoutMetrics } from '../theme/commonLayout';
import { textStyles } from './Text';

type CustomHighlightButtonProps = {
  title: string;
  underlayColor?: string;
  showActivityIndicator?: boolean;
  titleColor?: string;
  variant?: 'default' | 'withIcon' | 'outlined';
  icon?: ImageSourcePropType;
  smallVariant?: boolean;
  bgColor?: string;
  iconSize?: number;
  titleStyle?: keyof typeof textStyles;
  iconTintColor?: string;
};

type Props = CustomHighlightButtonProps & PressableProps;

const CustomHighlightButton: React.FC<Props> = ({
  title,
  underlayColor,
  showActivityIndicator,
  titleColor,
  variant,
  icon,
  smallVariant = false,
  bgColor,
  iconSize,
  titleStyle,
  iconTintColor,
  ...rest
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const resolvedVariant = icon ? 'withIcon' : variant || 'default';

  const buttonStyle = (pressed: boolean) =>
    useMemo(() => {
      const sizeStyle = smallVariant
        ? Object.assign({}, styles.button, styles.buttonSmallOverload)
        : styles.button;
      const backgroundColor = bgColor
        ? Object.assign({}, styles.buttonOverload, {
            backgroundColor: bgColor,
          })
        : {};
      const compositeButonStyle = Object.assign({}, sizeStyle, backgroundColor, rest.style);
      if (rest.disabled) {
        return Object.assign(
          {},
          compositeButonStyle,
          styles.buttonOverload,
          styles.disabledColorOverload,
        );
      } else if (pressed) {
        return Object.assign(
          {},
          compositeButonStyle,
          styles.buttonOverload,
          styles.underlayColorOverload,
        );
      } else return compositeButonStyle;
    }, [styles, pressed, rest.disabled, resolvedVariant, smallVariant, bgColor, rest.style]);

  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        buttonStyle(pressed),
        resolvedVariant === 'withIcon' && {
          backgroundColor: colors.disabled,
          experimental_backgroundImage: '',
        },
      ]}
    >
      {showActivityIndicator ? (
        <Animated.View
          style={{
            transform: [{ scale: 0.7 }],
          }}
        >
          <ActivityIndicator color={colors.white} size={'large'} />
        </Animated.View>
      ) : resolvedVariant === 'withIcon' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={icon}
            style={{
              width: iconSize || 24,
              height: iconSize || 24,
              resizeMode: 'contain',
              tintColor: iconTintColor || colors.gray3,
            }}
          />
          <Text
            textStyle={titleStyle || 'medium16'}
            color={titleColor || (rest.disabled ? colors.gray3 : colors.black)}
          >
            {title}
          </Text>
        </View>
      ) : (
        <Text
          textStyle={titleStyle || 'black16'}
          color={titleColor || (rest.disabled ? colors.gray3 : colors.white)}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const useStyles = (colors: ThemeColors) =>
  useMemo(
    () =>
      StyleSheet.create({
        button: {
          height: LayoutMetrics.button.height,
          width: DimensionsData.windowWidth - LayoutMetrics.padding.horizontal * 2,
          borderRadius: LayoutMetrics.button.borderRadius,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          experimental_backgroundImage: colors.gradientColor,
        },
        buttonSmallOverload: {
          height: LayoutMetrics.button.heightSmall,
          borderRadius: LayoutMetrics.button.borderRadiusSmall,
          width: '100%',
        },
        buttonOverload: {
          experimental_backgroundImage: '',
        },
        underlayColorOverload: {
          backgroundColor: colors.black,
        },
        disabledColorOverload: {
          backgroundColor: colors.gray5,
        },
      }),
    [colors],
  );

export default CustomHighlightButton;
