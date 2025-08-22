import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '.';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ComponentProps {
  progress: number;
  title: string;
  amount: number;
  onPress: () => void;
  variant?: 'default' | 'date';
  date?: string;
}

const CategoryProgressBar: React.FC<ComponentProps> = ({
  progress,
  title,
  amount,
  onPress,
  variant = 'default',
  date,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => useStyles(colors), [colors]);

  const progressValue = useSharedValue(0);

  const handleAnimatingProgress = useCallback(() => {
    progressValue.value = withTiming(Math.min(100, Math.max(0, progress)), {
      duration: 1000,
    });
  }, [progress]);

  const progressAnimatedStyles = useAnimatedStyle(
    () => ({
      width: `${progressValue.value}%`,
    }),
    [progressValue.value],
  );

  useEffect(() => {
    handleAnimatingProgress();
  }, [progress]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.txtWrapper}>
        <Text textStyle='regular14' color={colors.textPrimary}>
          {title}
        </Text>
        <Text textStyle='regular14' color={colors.lightGrey}>
          {variant == 'default' ? '$' + amount + '-' + progress + '%' : date}
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressAnimatedStyles]} />
      </View>
      {variant !== 'default' ? (
        <Text textStyle='regular14' color={colors.lightGrey}>
          {'$' + amount + '-' + progress + '%'}
        </Text>
      ) : null}
    </Pressable>
  );
};

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    txtWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressContainer: {
      width: '100%',
      height: 6,
      borderRadius: 6,
      backgroundColor: colors.gray5,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
    },
  });

export default CategoryProgressBar;
