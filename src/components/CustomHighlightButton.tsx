import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../context/themeContext';
import { DimensionsData } from '../utils/scaling';
import { Text } from '.';

type CustomHighlightButtonProps = {
  title: string;
  underlayColor?: string;
  showActivityIndicator?: boolean;
};

type Props = CustomHighlightButtonProps & PressableProps;

const CustomHighlightButton: React.FC<Props> = ({
  title,
  underlayColor,
  showActivityIndicator,
  ...rest
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = useMemo(() => {
    if (rest.disabled) {
      return Object.assign(
        {},
        styles.button,
        styles.buttonOverload,
        styles.disabledColorOverload,
      );
    } else if (showActivityIndicator == undefined && isPressed) {
      return Object.assign(
        {},
        styles.button,
        styles.buttonOverload,
        styles.underlayColorOverload,
      );
    } else return styles.button;
  }, [styles, isPressed, rest.disabled]);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={buttonStyle}
      {...rest}
    >
      {showActivityIndicator ? (
        <Animated.View
          style={{
            transform: [{ scale: 0.7 }],
          }}
        >
          <ActivityIndicator color={colors.white} size={'large'} />
        </Animated.View>
      ) : (
        <Text
          textStyle="black16"
          color={rest.disabled ? colors.gray3 : colors.white}
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
          height: 56,
          width: DimensionsData.windowWidth - 32,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          experimental_backgroundImage: colors.gradientColor,
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
