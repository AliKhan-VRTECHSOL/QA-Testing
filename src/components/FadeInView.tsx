import React, { useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  cancelAnimation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

interface FadeInViewProps {
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

const FadeInView: React.FC<FadeInViewProps> = ({ isVisible, children, duration = 300, style }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const opacity = useSharedValue(isVisible ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration });
    } else {
      opacity.value = withTiming(0, { duration }, finished => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }

    return () => cancelAnimation(opacity);
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  return <Animated.View style={[styles.fill, style, animatedStyle]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});

export default FadeInView;
