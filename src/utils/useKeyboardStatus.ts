import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export const useKeyboardStatus = (): boolean => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (_: KeyboardEvent) => setKeyboardVisible(true);
    const onKeyboardHide = (_: KeyboardEvent) => setKeyboardVisible(false);

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardVisible;
};
