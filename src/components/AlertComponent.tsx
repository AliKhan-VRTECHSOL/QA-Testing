import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/themeContext';
import { Text, CustomHighlightButton, OutlinedButton } from '.';

interface AlertComponentProps {
  isVisible: boolean;
  heading: string;
  description: string;
  showContinueButton?: boolean;
  showCancelButton?: boolean;
  showOKButton?: boolean;
  continueButtonText?: string;
  cancelButtonText?: string;
  okButtonText?: string;
  onContinue?: () => void;
  onCancel?: () => void;
  onOK?: () => void;
  onBackdropPress?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  isVisible,
  heading,
  description,
  showContinueButton = false,
  showCancelButton = false,
  showOKButton = true,
  continueButtonText = 'Continue',
  cancelButtonText = 'Cancel',
  okButtonText = 'OK',
  onContinue,
  onCancel,
  onOK,
  onBackdropPress,
  type = 'info',
}) => {
  const { colors } = useTheme();

  const getTypeColors = () => {
    switch (type) {
      case 'success':
        return { primary: colors.success, background: colors.confirmed };
      case 'error':
        return { primary: colors.red, background: colors.error };
      case 'warning':
        return { primary: colors.primary, background: colors.estimated };
      case 'info':
      default:
        return { primary: colors.primary, background: colors.uploadededBy };
    }
  };

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    handleBackdropPress();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleBackdropPress();
  };

  const handleOK = () => {
    if (onOK) {
      onOK();
    }
    handleBackdropPress();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleBackdropPress}>
        <View style={[styles.gradientBorder, { backgroundColor: colors.gradientColor }]}>
          <View style={[styles.container, { backgroundColor: colors.white }]}>
            <View style={styles.content}>
              <Text center textStyle='black20' color={colors.black}>
                {heading}
              </Text>
              <Text center textStyle='medium16' color={colors.lightGrey}>
                {description}
              </Text>

              <View style={styles.buttonContainer}>
                {showCancelButton && (
                  <OutlinedButton
                    title={cancelButtonText}
                    onPress={handleCancel}
                    style={styles.button}
                    smallVariant
                  />
                )}

                {showContinueButton && (
                  <CustomHighlightButton
                    title={continueButtonText}
                    onPress={handleContinue}
                    style={styles.button}
                    smallVariant
                  />
                )}

                {showOKButton && !showContinueButton && (
                  <CustomHighlightButton
                    title={okButtonText}
                    onPress={handleOK}
                    style={styles.button}
                    smallVariant
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    padding: 1,
    borderRadius: 12,
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    maxHeight: Dimensions.get('window').height * 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default AlertComponent;

