import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';

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
  error,
  value,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const [code, setCode] = useState<string[]>(
    value ? value.split('') : Array(length).fill(''),
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1 && text.length <= length) {
      const newCode = text.split('').slice(0, length);
      setCode(newCode);

      const nextIndex = Math.min(text.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      if (newCode.every(digit => digit !== '')) {
        onCodeComplete?.(newCode.join(''));
      }
    } else {
      const newCode = [...code];
      newCode[index] = text.slice(-1);
      setCode(newCode);

      if (text !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      if (newCode.every(digit => digit !== '')) {
        onCodeComplete?.(newCode.join(''));
      }
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const { key } = event.nativeEvent;

    if (key === 'Backspace') {
      if (code[index] === '') {
        if (index > 0) {
          const newCode = [...code];
          newCode[index - 1] = '';
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.verificationContainer}>
        {Array.from({ length }).map((_, index) => (
          <React.Fragment key={index}>
            <TextInput
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.verificationInput,
                {
                  fontFamily: fonts.family.black,
                  fontSize: fonts.size.small16,
                  padding: 0,
                  paddingTop: 2,
                },
              ]}
              maxLength={length}
              keyboardType="numeric"
              onChangeText={text => handleChange(text, index)}
              onKeyPress={event => handleKeyPress(event as any, index)}
              value={code[index]}
            />
          </React.Fragment>
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
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#939090',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  separator: {
    width: 15,
    height: 4,
    backgroundColor: 'black',
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});

export default VerificationInput;
