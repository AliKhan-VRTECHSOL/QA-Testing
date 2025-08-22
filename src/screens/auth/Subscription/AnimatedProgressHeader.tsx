import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';

import Text from '../../../components/Text';
import { headerHeight, progressBarWidth, StatusBarContainerHeigt } from './constants';
import { useTheme } from '../../../context/themeContext';
import { ThemeColors } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../../../assets/Icons';

interface ComponentProps {
  step: number;
}

const AnimatedProgressHeader: React.FC<ComponentProps> = ({ step }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const progressStep = useSharedValue(-1);

  const handleUpdateProgress = useCallback(() => {
    progressStep.value = withTiming(step, {
      duration: 1000,
    });
  }, [step]);

  const progressBarAnimatedStyles = useAnimatedStyle(
    () => ({
      width: interpolate(
        progressStep.value,
        [0, 1, 2],
        [progressBarWidth * 0, progressBarWidth * 0.5, progressBarWidth * 1],
        Extrapolation.CLAMP,
      ),
    }),
    [progressStep],
  );

  const checkIconWrappperAnimatedStyles = (kindex: number) =>
    useAnimatedStyle(() => {
      return {
        borderColor: interpolateColor(
          progressStep.value,
          [kindex - 1, kindex, kindex + 1],
          [colors.gray5, colors.primary, colors.gray5],
          'RGB',
        ),
      };
    }, [progressStep, colors]);

  const checkIconContainerAnimatedStyles = (kindex: number) =>
    useAnimatedStyle(() => {
      if (kindex == 2) {
        return {
          transform: [
            {
              scale: interpolate(
                progressStep.value,
                [kindex - 1, kindex],
                [0.2, 1],
                Extrapolation.CLAMP,
              ),
            },
          ],
        };
      }
      return {
        transform: [
          {
            scale: interpolate(
              progressStep.value,
              [kindex - 1, kindex, kindex + 1],
              [0.2, 0.2, 1],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    }, [progressStep, colors]);

  const tagAnimatedStyle = (kindex: number) =>
    useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          progressStep.value,
          [kindex - 1, kindex, kindex + 1],
          [0, 1, 1],
          Extrapolation.CLAMP,
        ),
      };
    }, [progressStep, colors]);

  useEffect(() => {
    handleUpdateProgress();
  }, [step]);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.prgoress, progressBarAnimatedStyles]} />
        {[0, 1, 2].map(k => (
          <Animated.View
            style={[
              styles.checkIconWrappper,
              {
                ...(k == 1
                  ? { alignSelf: 'center' }
                  : k == 2
                  ? {
                      right: 0,
                    }
                  : {
                      left: 0,
                    }),
              },
              checkIconWrappperAnimatedStyles(k),
            ]}
          >
            <Animated.View style={[styles.checkIconContainer, checkIconContainerAnimatedStyles(k)]}>
              <Image source={Icons.Check} style={styles.checkIcon} />
            </Animated.View>
          </Animated.View>
        ))}
      </View>
      <View style={styles.stepTagWrapper}>
        {['Choose', 'Payment', 'Success'].map((k, kindex) => (
          <View style={styles.tagContainer}>
            <Text style={styles.greyText} textStyle='medium14' color={colors.gray3}>
              {k}
            </Text>
            <Animated.View style={tagAnimatedStyle(kindex)}>
              <Text numberOfLines={1} textStyle='bold14' color={colors.primary}>
                {k}
              </Text>
            </Animated.View>
          </View>
        ))}
      </View>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  const { top } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          left: 0,
          right: 0,
          height: StatusBarContainerHeigt,
          backgroundColor: colors.white,
          top: top + headerHeight,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 15,
        },
        progressBarContainer: {
          height: 2,
          width: progressBarWidth,
          backgroundColor: colors.gray5,
          borderRadius: 1,
          justifyContent: 'center',
        },
        prgoress: {
          backgroundColor: colors.primary,
          height: '100%',
        },
        checkIconWrappper: {
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: 10,
          borderColor: colors.gray5,
          borderWidth: 1,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        },
        checkIcon: {
          tintColor: colors.white,
          width: 10,
          height: 10,
          resizeMode: 'contain',
        },
        checkIconContainer: {
          width: 20,
          height: 20,
          backgroundColor: colors.primary,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            {
              scale: 0.2,
            },
          ],
        },
        stepTagWrapper: {
          width: progressBarWidth,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        },
        tagContainer: {
          flexShrink: 1,
          alignItems: 'center',
        },
        greyText: {
          position: 'absolute',
        },
      }),
    [colors],
  );
};

export default AnimatedProgressHeader;
