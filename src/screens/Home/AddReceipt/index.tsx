import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Platform } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../context/themeContext';
import type { ThemeColors } from '../../../theme/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../components';
import UploadReceipt from '../../../components/Forms/UploadReceiptList';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const AddReceipt: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { bottom } = useSafeAreaInsets();

  const translateY = useSharedValue(500);
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
      runOnJS(navigation.pop)();
    });
  };

  const handleBackdropPress = () => {
    hideSheet();
  };

  const gesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetY(-10)
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
    const timeout = setTimeout(() => {
      showSheet();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.sheetContainer, animatedStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>

        <View style={styles.headerSection}>
          <Text center textStyle='black20' color={colors.textPrimary}>
            Upload your receipts
          </Text>
          <Text textStyle='medium16' center color={colors.lightGrey}>
            Please select your scanner type
          </Text>
        </View>

        <View style={[styles.contentContainer, { paddingBottom: bottom + 32 }]}>
          <UploadReceipt navigation={navigation} smallScreenVariant handleCloseSheet={hideSheet} />
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
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
      maxHeight: Platform.select({
        android: '60%',
        ios: '50%',
        default: '50%',
      }),
    },
    handleContainer: {
      alignItems: 'center',
      paddingVertical: 12,
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
    contentContainer: {
      paddingHorizontal: 20,
    },
  });

export default AddReceipt;
