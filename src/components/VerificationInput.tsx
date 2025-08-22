import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { View, TextInput, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';
import { LayoutMetrics } from '../theme/commonLayout';

interface VerificationInputProps {
  length?: number;
  onCodeComplete?: (code: string) => void;
  error?: string;
  value?: string;
  containerStyle?: ViewProps['style'];
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  length = 6,
  onCodeComplete,
  value = '',
  containerStyle,
}) => {
  const { colors } = useTheme();
  const inputRefs = useRef<TextInput[]>([]);
  const [code, setCode] = useState<string[]>(Array(length).fill(''));

  // Sync external value - keep your original logic
  useEffect(() => {
    if (value && value.length === length) {
      const newCode = value.split('').slice(0, length);
      setCode(newCode);
    }
  }, [value, length]);

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
      }
    },
    [length],
  );

  // Keep your original handleChangeText - it was working perfectly
  const handleChangeText = useCallback(
    (text: string, index: number) => {
      if (!text) return;

      let updatedCode = [...code];

      if (text.length > 1) {
        // User pasted multiple characters
        const chars = text.slice(0, length).split('');
        chars.forEach((char, idx) => {
          if (idx < length) {
            updatedCode[idx] = char;
          }
        });
        setCode(updatedCode);
        focusInput(chars.length < length ? chars.length : length - 1);
        if (chars.length === length) {
          onCodeComplete?.(chars.join(''));
        }
        return;
      }

      // Regular single character input
      updatedCode[index] = text;
      setCode(updatedCode);

      if (index < length - 1) {
        focusInput(index + 1);
      }

      if (updatedCode.every(char => char !== '')) {
        onCodeComplete?.(updatedCode.join(''));
      }
    },
    [code, length, onCodeComplete, focusInput],
  );

  // FIXED: Only fix the backspace logic
  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      const key = e.nativeEvent.key;

      if (key === 'Backspace') {
        const updatedCode = [...code];

        if (code[index] !== '') {
          // Current input has content, clear it and stay here
          updatedCode[index] = '';
          setCode(updatedCode);
        } else {
          // Current input is empty, move to previous and clear it
          const prevIndex = index - 1;
          if (prevIndex >= 0) {
            updatedCode[prevIndex] = '';
            setCode(updatedCode);
            focusInput(prevIndex);
          }
        }
      }
    },
    [code, focusInput],
  );

  // Memoize the input style for minor performance improvement
  const inputStyle = useMemo(
    () => [
      styles.verificationInput,
      {
        fontFamily: fonts.family.black,
        fontSize: fonts.size.small16,
        borderColor: colors.textSecondary,
      },
    ],
    [colors.textSecondary],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.verificationContainer}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={inputStyle}
            keyboardType='number-pad'
            returnKeyType='done'
            maxLength={length} // allow up to full OTP length for paste
            value={code[index] || ''}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            autoFocus={index === 0}
            autoCorrect={false}
            autoCapitalize='none'
            textContentType='oneTimeCode'
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationInput: {
    width: 50,
    height: LayoutMetrics.input.heightDefault,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default VerificationInput;
