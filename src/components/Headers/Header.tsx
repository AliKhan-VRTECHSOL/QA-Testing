import React, { useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../context/themeContext';
import { LayoutMetrics } from '../../theme/commonLayout';
import { Icons } from '../../assets/Icons';
import { Text } from '..';
import { useNavigation } from '@react-navigation/native';
import { CustomTextProps } from '../types';

interface ComponentProps {
  title: string;
  onPress?: () => void;
  variant?: 'default' | 'titleLeft';
  useThisNavigation?: any;
  hideBackKey?: boolean;
  headerTextStyle?: CustomTextProps;
}

const Header: React.FC<ComponentProps> = ({
  title,
  onPress,
  variant = 'default',
  useThisNavigation,
  hideBackKey = false,
  headerTextStyle = {
    textStyle: 'bold20',
  },
}) => {
  const navigation = useThisNavigation || useNavigation();
  const { colors } = useTheme();
  const styles = useMemo(() => useStyles(colors), [colors]);

  const handleOnPress = useCallback(async () => {
    if (onPress) {
      await onPress();
      return;
    }
    navigation && navigation.goBack();
  }, [navigation, onPress]);

  const renderDefaultVariant = () => (
    <View style={styles.container}>
      {hideBackKey ? null : (
        <Pressable onPress={handleOnPress}>
          <Image source={Icons.ArrowLeft} style={styles.backIcon} />
        </Pressable>
      )}
      <Text color={colors.screenHeadingColor} {...headerTextStyle}>
        {title}
      </Text>
      {hideBackKey ? null : (
        <Pressable
          style={{
            opacity: 0,
          }}
        >
          <Image source={Icons.ArrowLeft} style={styles.backIcon} />
        </Pressable>
      )}
    </View>
  );

  const renderTitleLeftVariant = () => (
    <View style={styles.containerTitleLeft}>
      {hideBackKey ? null : (
        <Pressable onPress={handleOnPress} style={styles.backIconContainer}>
          <Image
            source={Icons.ArrowLeft}
            style={[styles.backIcon, styles.backIconTitleLeft]}
            tintColor={colors.black}
          />
        </Pressable>
      )}
      <Text color={colors.screenHeadingColor} textStyle='black20' {...headerTextStyle}>
        {title}
      </Text>
    </View>
  );

  return renderTitleLeftVariant();

  return variant === 'titleLeft' ? renderTitleLeftVariant() : renderDefaultVariant();
};

const useStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: LayoutMetrics.padding.horizontal,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: 'rgba(18, 21, 27, 0.06)',
    },
    containerTitleLeft: {
      padding: LayoutMetrics.padding.horizontal,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: 'rgba(18, 21, 27, 0.06)',
      gap: 16,
    },
    backIcon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: colors.black,
    },
    backIconContainer: {
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIconTitleLeft: {
      tintColor: colors.black,
    },
  });

export default Header;
