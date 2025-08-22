import React, { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const KeyboardHeightView: React.FC = () => {
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (event: any) => {
      keyboardHeight.value = withTiming(event.endCoordinates.height, {
        duration: Platform.OS === 'ios' ? 250 : 200,
        easing: Easing.out(Easing.ease),
      });
    };

    const onKeyboardHide = () => {
      keyboardHeight.value = withTiming(0, {
        duration: Platform.OS === 'ios' ? 250 : 200,
        easing: Easing.in(Easing.ease),
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  const animatedStyles = useAnimatedStyle(() => ({
    height: keyboardHeight.value,
  }));

  return <Animated.View style={animatedStyles} />;
};

export default KeyboardHeightView;
