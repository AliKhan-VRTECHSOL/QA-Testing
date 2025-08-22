import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  type ViewStyle,
  Platform,
} from 'react-native';
import { Text } from '.';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../context/themeContext';
import type { ThemeColors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heading?: string;
  subtitle?: string;
  maxHeight?: ViewStyle['maxHeight'];
  contentContainerStyle?: ViewStyle;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  heading,
  subtitle,
  maxHeight = Platform.select({
    android: '60%',
    ios: '50%',
    default: '50%',
  }),
  contentContainerStyle,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  // Local state to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useSharedValue(500); // off-screen initially
  const backdropOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const showSheet = () => {
    translateY.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
    backdropOpacity.value = withTiming(1, { duration: 200 });
  };

  const hideSheet = () => {
    'worklet';
    translateY.value = withTiming(500, {
      duration: 200,
      easing: Easing.in(Easing.ease),
    });
    backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
      // Properly separate the runOnJS calls
      runOnJS(setModalVisible)(false);
      runOnJS(onClose)();
    });
  };

  // Create a separate JS function for backdrop press
  const handleBackdropPress = () => {
    hideSheet();
  };

  // Fixed gesture for Android compatibility
  const handleGesture = Gesture.Pan()
    .activeOffsetY(10) // Add threshold for activation
    .failOffsetY(-10) // Prevent upward gestures from activating
    .minDistance(0) // Allow immediate response
    .onUpdate(e => {
      'worklet';
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(e => {
      'worklet';
      if (e.translationY > 100 || e.velocityY > 500) {
        hideSheet();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    } else if (modalVisible) {
      hideSheet();
    }
  }, [visible]); // Remove modalVisible from dependencies to prevent infinite loop

  // Show animation when modal becomes visible
  useEffect(() => {
    if (modalVisible && visible) {
      showSheet();
    }
  }, [modalVisible, visible]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      translateY.value = 500;
      backdropOpacity.value = 0;
    };
  }, []);

  return (
    <Modal
      transparent
      animationType='none'
      visible={modalVisible}
      statusBarTranslucent
      onRequestClose={handleBackdropPress}
    >
      <GestureHandlerRootView style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheetContainer,
            animatedStyle,
            maxHeight
              ? {
                  maxHeight: maxHeight,
                }
              : {},
          ]}
        >
          {/* Handle Area */}
          <GestureDetector gesture={handleGesture}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          {/* Header Section */}
          {(heading || subtitle) && (
            <View style={styles.headerSection}>
              {heading && (
                <Text center textStyle='black20' color={colors.textPrimary}>
                  {heading}
                </Text>
              )}
              {subtitle && (
                <Text textStyle='medium16' center color={colors.lightGrey}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}

          {/* Content */}
          <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const useStyles = (colors: ThemeColors) => {
  const { bottom } = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        modalWrapper: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        backdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        sheetContainer: {
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: 150,
          maxHeight: '90%',
        },
        handleContainer: {
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
        },
        handle: {
          width: 40,
          height: 4,
          backgroundColor: '#D1D5DB',
          borderRadius: 2,
        },
        headerSection: {
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        },
        heading: {
          fontSize: 18,
          fontWeight: '600',
          color: '#111827',
          marginBottom: 4,
        },
        subtitle: {
          fontSize: 14,
          color: '#6B7280',
          lineHeight: 20,
        },
        contentContainer: {
          paddingHorizontal: 20,
          paddingBottom: bottom + 32,
          flexGrow: 1,
          flexShrink: 1,
        },
      }),
    [colors],
  );
};

export default BottomSheet;
