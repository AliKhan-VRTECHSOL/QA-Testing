import React, { ReactNode, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonLayoutStyles } from '../theme/commonLayout';
import { useTheme } from '../context/themeContext';

interface ComponentProps {
  children: ReactNode;
  header?: ReactNode;
  removeSafeAreaInsets?: boolean;
}

type props = ComponentProps & ScrollViewProps;

const SAScrollView: React.FC<props> = ({
  children,
  header,
  removeSafeAreaInsets = false,
  ...rest
}) => {
  const styles = useStyles();

  if (removeSafeAreaInsets) {
    return (
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.select({ android: 'height', ios: 'padding' })}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={false}
          {...rest}
          contentContainerStyle={[
            styles.contentContainerStyle,
            rest.contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {header}
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.select({ android: 'height', ios: 'padding' })}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={false}
          {...rest}
          contentContainerStyle={[
            styles.contentContainerStyle,
            rest.contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        mainContainer: {
          flex: 1,
          backgroundColor: colors.white,
        },
        contentContainerStyle: {
          paddingBottom: Platform.select({ android: 50, ios: 0 }),
          paddingHorizontal: CommonLayoutStyles.paddingHorizontal,
        },
      }),
    [colors],
  );
};

export default SAScrollView;
