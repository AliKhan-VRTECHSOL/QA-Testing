import React, { useMemo, useState } from 'react';
import { GestureResponderEvent, Image, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/themeContext';
import { Text } from '.';
import { ThemeColors } from '../theme/colors';

interface QuickActionButtonProps {
  icon: any;
  label: string;
  onPress: (e?: GestureResponderEvent) => void | Promise<void>;
  delayDuration?: number;
  variant?: 'default' | 'small';
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onPress,
  delayDuration = 300,
  variant = 'default',
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [isPressed, setIsPressed] = useState(false);
  const [isQuickStop, setIsQuickStop] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  const handleExecutePress = async () => {
    setIsQuickStop(true);
    await new Promise(resolve => setTimeout(resolve, delayDuration));

    const maybePromise = onPress();
    if (maybePromise && typeof maybePromise.then === 'function') {
      try {
        await maybePromise;
      } catch (error) {
        console.warn('onPress threw an error:', error);
      }
    }
    setIsQuickStop(false);
  };

  const isSmall = variant === 'small';

  const iconTint = isPressed
    ? isSmall
      ? colors.pressedColor
      : colors.white
    : isQuickStop
    ? isSmall
      ? colors.primary
      : colors.white
    : colors.gray3;

  const labelColor = isPressed
    ? isSmall
      ? colors.pressedColor
      : colors.gray3
    : isQuickStop
    ? isSmall
      ? colors.primary
      : colors.gray3
    : isSmall
    ? colors.black
    : colors.gray3;

  return (
    <Pressable
      style={[
        styles.cardContainer,
        !isSmall && styles.cardContainerShadow,
        isSmall && styles.smallVariantCardContainer,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleExecutePress}
    >
      <View
        style={[
          isSmall ? null : styles.iconContainer,
          isPressed && !isSmall && styles.iconContainerPressed,
          isQuickStop && !isSmall && styles.iconContainerQuickStop,
        ]}
      >
        <Image source={icon} style={[styles.icon, { tintColor: iconTint }]} />
      </View>
      <Text textStyle={isSmall ? 'bold16' : 'black20'} color={labelColor}>
        {label}
      </Text>
    </Pressable>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        cardContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          backgroundColor: colors.white,
          gap: 10,
          borderRadius: 10,
          padding: 10,
        },
        cardContainerShadow: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        },
        smallVariantCardContainer: { padding: 20, justifyContent: 'center' },
        iconContainer: {
          alignItems: 'center',
          borderColor: colors.lightGrey,
          borderWidth: 1,
          borderRadius: 10,
          justifyContent: 'center',
          height: 98,
          width: 98,
        },
        icon: {
          width: 30,
          height: 30,
        },
        // Dynamic styles for pressed states
        iconContainerPressed: {
          borderColor: colors.pressedColor,
          backgroundColor: colors.pressedColor,
        },
        iconContainerQuickStop: {
          borderColor: colors.primary,
          backgroundColor: colors.primary,
        },
      }),
    [colors],
  );
};

export default QuickActionButton;
