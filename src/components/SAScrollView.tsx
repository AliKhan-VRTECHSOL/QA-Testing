import React, { ReactNode, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LayoutMetrics } from '../theme/commonLayout';
import { useTheme } from '../context/themeContext';
import { useKeyboardStatus } from '../utils/useKeyboardStatus';

const platformSpecificKeyboardVerticalOffset = Platform.select({
  android: 61,
  ios: 85,
  default: 100,
});

interface SAScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  removeSafeAreaInsets?: boolean;
  IndividualkeyboardVerticalOffset?: number;
}

const SAScrollView: React.FC<SAScrollViewProps> = ({
  children,
  header,
  footer,
  removeSafeAreaInsets = false,
  contentContainerStyle,
  IndividualkeyboardVerticalOffset,
  ...scrollProps
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const isKeyboardVisible = useKeyboardStatus();

  const keyboardVerticalOffset = useMemo(() => {
    if (!footer) return -35;

    if (Platform.OS === 'ios') {
      return platformSpecificKeyboardVerticalOffset;
    }

    return isKeyboardVisible ? platformSpecificKeyboardVerticalOffset : 0;
  }, [isKeyboardVisible, footer]);

  const resolvedContentStyle = useMemo(() => {
    return [styles.contentContainer, contentContainerStyle];
  }, [styles.contentContainer, contentContainerStyle]);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
      keyboardVerticalOffset={IndividualkeyboardVerticalOffset || keyboardVerticalOffset}
    >
      {removeSafeAreaInsets ? (
        <View style={[styles.mainContainer, footer && { paddingBottom: insets.bottom }]}>
          {header}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            automaticallyAdjustKeyboardInsets={false}
            contentContainerStyle={resolvedContentStyle}
            {...scrollProps}
          >
            {children}
          </ScrollView>
          {footer}
        </View>
      ) : (
        <SafeAreaView style={styles.mainContainer}>
          {header}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            automaticallyAdjustKeyboardInsets={false}
            contentContainerStyle={resolvedContentStyle}
            {...scrollProps}
          >
            {children}
          </ScrollView>
          {footer}
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
};

const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        mainContainer: {
          flex: 1,
          backgroundColor: colors.white,
        },
        contentContainer: {
          flexGrow: 1,
          paddingBottom: bottom,
          paddingHorizontal: LayoutMetrics.padding.horizontal,
        },
      }),
    [colors],
  );
};

export default SAScrollView;
