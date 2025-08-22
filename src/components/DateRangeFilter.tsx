import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '.';
import { useTheme } from '../context/themeContext';
import { Icons } from '../assets/Icons';
import { ThemeColors } from '../theme/colors';
import BottomSheet from './BottomSheet';

interface ComponentProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const options = ['Last 30 days', 'Last 90 days', '6 months', '1 year'];

const DateRangeFilter: React.FC<ComponentProps> = ({ selectedValue, setSelectedValue }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [visible, setVisible] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedValue(option);
    setVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.moreDownOptions}>
        <Text textStyle='medium14' color={selectedValue ? colors.primary : colors.lightGrey}>
          {selectedValue || 'Select Duration'}
        </Text>
        <Image source={Icons.ChevronDown} style={[styles.downIcon]} />
      </Pressable>
      <BottomSheet visible={visible} onClose={() => setVisible(false)} heading='Date range'>
        <View style={styles.optionsContainer}>
          {options.map(option => (
            <Pressable
              key={option}
              style={[styles.optionItem, selectedValue === option && styles.selectedOption]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text
                textStyle='regular16'
                color={selectedValue === option ? colors.primary : colors.textPrimary}
              >
                {option}
              </Text>
              {selectedValue === option && <Image source={Icons.Check} style={styles.checkIcon} />}
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        moreDownOptions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        downIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.primary,
        },
        optionsContainer: {
          paddingVertical: 8,
        },
        optionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray5,
        },
        selectedOption: {
          backgroundColor: colors.secondaryOpacity1,
        },
        checkIcon: {
          width: 20,
          height: 20,
          resizeMode: 'contain',
          tintColor: colors.primary,
        },
      }),
    [colors],
  );
};

export default DateRangeFilter;
