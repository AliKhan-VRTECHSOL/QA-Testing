import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from './Header';
import { useTheme } from '../../context/themeContext';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

type HeaderVariant = 'default' | 'titleLeft';

interface NavigatorHeaderProps extends Partial<NativeStackHeaderProps> {
  variant?: HeaderVariant;
  onPress?: () => void;
  useThisNavigation?: any;
}

const NavigatorHeader: React.FC<NavigatorHeaderProps> = ({
  options,
  variant = 'titleLeft',
  onPress,
  useThisNavigation,
}) => {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: top,
          backgroundColor: colors.white,
        },
      }),
    [top, colors.white],
  );

  const headerTitle = typeof options?.headerTitle === 'string' ? options.headerTitle : ''; // fallback to empty string if undefined or not a string

  return (
    <View style={styles.container}>
      <Header
        title={headerTitle}
        variant={variant}
        onPress={onPress}
        useThisNavigation={useThisNavigation}
      />
    </View>
  );
};

export default NavigatorHeader;
