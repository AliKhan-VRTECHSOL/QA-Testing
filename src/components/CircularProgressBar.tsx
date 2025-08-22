import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/themeContext';
import { Text } from '.';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressBar = ({ size = 100, strokeWidth = 10, progress = 0, totalAmount }) => {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progressValue.value),
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke={colors.gray5}
          fill='none'
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <AnimatedCircle
          stroke={colors.primary}
          fill='none'
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap='round'
          animatedProps={animatedProps}
          rotation='-90'
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View
        style={{
          width: size - 20,
          height: size - 20,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
          position: 'absolute',
          alignSelf: 'center',
          top: 10,
        }}
      >
        <Text textStyle='bold12' color={colors.black}>
          {Math.round(progress * 100)}%
        </Text>
        <Text textStyle='medium10' color={colors.gray3}>
          ${totalAmount}
        </Text>
      </View>
    </View>
  );
};

export default CircularProgressBar;
