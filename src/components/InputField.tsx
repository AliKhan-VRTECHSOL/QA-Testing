import React, { useMemo } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { ThemeColors } from '../theme/colors';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';

const InputField: React.FC<TextInputProps> = props => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <TextInput
      style={styles.inputField}
      placeholderTextColor={colors.lightGrey}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      {...props}
    />
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        inputField: {
          borderWidth: 1,
          flex: 1,
          borderRadius: 16,
          height: 56,
          paddingHorizontal: 16,
          borderColor: colors.lightGrey,
          fontFamily: fonts.family.medium,
          fontSize: 16,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
};

export default InputField;
