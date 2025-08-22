import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import fonts from '../theme/fonts';
import { useTheme } from '../context/themeContext';
import { CustomTextProps } from './types';

const Text: React.FC<CustomTextProps> = ({
  textStyle = 'regular14',
  color,
  style,
  children,
  center,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <RNText
      selectionColor={'transparent'}
      style={[
        { color: color || colors.primary },
        textStyle ? textStyles[textStyle] : {},
        center
          ? {
              textAlign: 'center',
            }
          : {},
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const textStyles = StyleSheet.create({
  regular10: { fontFamily: fonts.family.regular, fontSize: 10 },
  regular12: { fontFamily: fonts.family.regular, fontSize: 12 },
  regular14: { fontFamily: fonts.family.regular, fontSize: 14 },
  regular16: { fontFamily: fonts.family.regular, fontSize: 16 },
  regular24: { fontFamily: fonts.family.regular, fontSize: 24 },
  medium10: { fontFamily: fonts.family.medium, fontSize: 10 },
  medium12: { fontFamily: fonts.family.medium, fontSize: 12 },
  medium14: { fontFamily: fonts.family.medium, fontSize: 14 },
  medium16: { fontFamily: fonts.family.medium, fontSize: 16 },
  medium18: { fontFamily: fonts.family.medium, fontSize: 18 },
  medium20: { fontFamily: fonts.family.medium, fontSize: 20 },
  medium24: { fontFamily: fonts.family.medium, fontSize: 24 },
  bold12: { fontFamily: fonts.family.bold, fontSize: 12 },
  bold14: { fontFamily: fonts.family.bold, fontSize: 14 },
  bold16: { fontFamily: fonts.family.bold, fontSize: 16 },
  bold18: { fontFamily: fonts.family.bold, fontSize: 18 },
  bold20: { fontFamily: fonts.family.bold, fontSize: 20 },
  bold22: { fontFamily: fonts.family.bold, fontSize: 22 },
  bold24: { fontFamily: fonts.family.bold, fontSize: 24 },
  bold28: { fontFamily: fonts.family.bold, fontSize: 28 },
  bold30: { fontFamily: fonts.family.bold, fontSize: 30 },
  black12: { fontFamily: fonts.family.black, fontSize: 12 },
  black16: { fontFamily: fonts.family.black, fontSize: 16 },
  black20: { fontFamily: fonts.family.black, fontSize: 20 },
  black22: { fontFamily: fonts.family.black, fontSize: 22 },
  logo38: { fontFamily: fonts.family.logoFont, fontSize: 38 },
  logo24: { fontFamily: fonts.family.logoFont, fontSize: 24 },
});

export default Text;
