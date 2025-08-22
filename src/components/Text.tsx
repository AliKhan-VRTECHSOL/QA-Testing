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
  regular12: { fontFamily: fonts.family.regular, fontSize: 12 },
  regular14: { fontFamily: fonts.family.regular, fontSize: 14 },
  regular16: { fontFamily: fonts.family.regular, fontSize: 16 },
  regular24: { fontFamily: fonts.family.regular, fontSize: 24 },
  medium12: { fontFamily: fonts.family.medium, fontSize: 12 },
  medium14: { fontFamily: fonts.family.medium, fontSize: 14 },
  medium16: { fontFamily: fonts.family.medium, fontSize: 16 },
  medium24: { fontFamily: fonts.family.medium, fontSize: 24 },
  bold12: { fontFamily: fonts.family.bold, fontSize: 12 },
  bold16: { fontFamily: fonts.family.bold, fontSize: 16 },
  bold20: { fontFamily: fonts.family.bold, fontSize: 20 },
  bold24: { fontFamily: fonts.family.bold, fontSize: 24 },
  bold30: { fontFamily: fonts.family.bold, fontSize: 30 },
  black16: { fontFamily: fonts.family.black, fontSize: 16 },
});

export default Text;
