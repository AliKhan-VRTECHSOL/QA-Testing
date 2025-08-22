import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import fonts from '../theme/fonts';

interface ScreenProps {
  isVisible: boolean;
  progress: number;
}

const ANIMATION_DURATION = 250;
const FADE_DURATION = 200;

const LoadingScreen: React.FC<ScreenProps> = ({ isVisible, progress }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Shared values for animations
  const viewOpacity = useSharedValue(0);
  const progressValue = useSharedValue(0);
  const firstCircleScale = useSharedValue(0);
  const secondCircleScale = useSharedValue(0);
  const thirdCircleScale = useSharedValue(0);

  // Animate progress counting
  const animatedProgress = useDerivedValue(() => {
    return Math.round(progressValue.value);
  });

  // Update display progress on JS thread
  useDerivedValue(() => {
    runOnJS(setDisplayProgress)(animatedProgress.value);
  });

  // Progress-based circle animations
  const updateCircleAnimations = useCallback(
    (newProgress: number) => {
      progressValue.value = withTiming(newProgress, {
        duration: ANIMATION_DURATION,
      });

      // First circle: 0-25%
      if (newProgress >= 0) {
        firstCircleScale.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }

      // Second circle: 25-50%
      if (newProgress >= 25) {
        secondCircleScale.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }

      // Third circle: 50-75%
      if (newProgress >= 50) {
        thirdCircleScale.value = withTiming(1, {
          duration: ANIMATION_DURATION,
        });
      }
    },
    [progressValue, firstCircleScale, secondCircleScale, thirdCircleScale],
  );

  // Reset animations
  const resetAnimations = useCallback(() => {
    progressValue.value = 0;
    firstCircleScale.value = 0;
    secondCircleScale.value = 0;
    thirdCircleScale.value = 0;
    setDisplayProgress(0);
  }, [progressValue, firstCircleScale, secondCircleScale, thirdCircleScale]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: viewOpacity.value,
  }));

  const firstCircleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: firstCircleScale.value }],
  }));

  const secondCircleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondCircleScale.value }],
  }));

  const thirdCircleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thirdCircleScale.value }],
  }));

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setIsModalVisible(true);
      viewOpacity.value = withTiming(1, { duration: FADE_DURATION });
    } else {
      viewOpacity.value = withTiming(0, { duration: FADE_DURATION });
      setTimeout(() => {
        setIsModalVisible(false);
        resetAnimations();
      }, FADE_DURATION);
    }
  }, [isVisible, viewOpacity, resetAnimations]);

  // Handle progress changes
  useEffect(() => {
    if (isModalVisible && progress >= 0) {
      updateCircleAnimations(progress);
    }
  }, [progress, isModalVisible, updateCircleAnimations]);

  const progressText = useMemo(() => `${displayProgress}%`, [displayProgress]);

  return (
    <Modal
      visible={isModalVisible}
      transparent={false}
      animationType='fade'
      statusBarTranslucent
      presentationStyle='overFullScreen'
    >
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <View style={styles.overlay} />

        <View style={styles.circleContainer}>
          {/* Third circle */}
          <Animated.View style={[styles.thirdCircle, thirdCircleAnimatedStyle]} />

          {/* Second circle */}
          <Animated.View style={[styles.secondCircle, secondCircleAnimatedStyle]} />

          {/* First circle (smallest) */}
          <Animated.View style={[styles.firstCircle, firstCircleAnimatedStyle]} />

          {/* Progress container */}
          <View style={styles.progressContainer}>
            <Animated.Text
              numberOfLines={1}
              style={{
                color: colors.white,
                fontSize: 24,
                fontFamily: fonts.family.bold,
              }}
            >
              {progressText}
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.primaryLowOpacity,
        },
        circleContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        firstCircle: {
          width: 130,
          height: 130,
          borderRadius: 65,
          backgroundColor: colors.white,
          opacity: 0.2,
          position: 'absolute',
        },
        secondCircle: {
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.white,
          opacity: 0.15,
          position: 'absolute',
        },
        thirdCircle: {
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: colors.white,
          opacity: 0.1,
          position: 'absolute',
        },
        progressContainer: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primaryLowOpacity,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 10,
        },
      }),
    [colors],
  );
};

export default LoadingScreen;
