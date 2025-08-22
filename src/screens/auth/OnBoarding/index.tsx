import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SAScrollView, Text, CustomHighlightButton } from '../../../components';
import HeaderSpaced from '../../../components/Headers/HeaderSpaced';
import { useTheme } from '../../../context/themeContext';
import SearchDropdown from '../../../components/SearchDropdown';
import { ThemeColors } from '../../../theme/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const OnBoarding: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [selectAddress, setSelectAddress] = useState('');

  return (
    <SAScrollView
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      header={<HeaderSpaced title="" />}
      contentContainerStyle={styles.contentContainer}
    >
      <Text center textStyle="regular16" color={colors.textPrimary}>
        To personalise your shopping predictions, tell us where you usually buy
        groceries:
      </Text>

      <View style={styles.gradientBorderContainer}>
        <View style={styles.gradientBorderInnerContainer}>
          <Text textStyle="bold16">Use my current location</Text>
        </View>
      </View>
      <Text textStyle="regular16" color={colors.textPrimary}>
        or
      </Text>

      <SearchDropdown
        selectAddress={selectAddress}
        setSelectAddress={setSelectAddress}
      />
      <CustomHighlightButton
        title="Next"
        disabled={selectAddress.length == 0}
        onPress={() => navigation.navigate('SignUp')}
      />
    </SAScrollView>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          alignItems: 'center',
          gap: 20,
          paddingTop: 20,
        },
        gradientBorderContainer: {
          height: 56,
          borderRadius: 24,
          experimental_backgroundImage: colors.gradientColor,
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: 1,
        },
        gradientBorderInnerContainer: {
          height: 54,
          backgroundColor: colors.white,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
};

export default OnBoarding;
