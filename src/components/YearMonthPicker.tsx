import React, { useState } from 'react';
import { Pressable, FlatList, StyleSheet, View } from 'react-native';

import { Text } from '.';
import { useTheme } from '../context/themeContext';
import BottomSheet from './BottomSheet';

const getTwelveYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear - 6; i <= currentYear + 5; i++) {
    years.push(i);
  }

  return years;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface ComponentProps {
  onSelected: (month: string, year: string) => void;
  visible: boolean;
  onClose: () => void;
}

const YearMonthPicker: React.FC<ComponentProps> = ({ onSelected, visible, onClose }) => {
  const { colors } = useTheme();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleSelection = (value: string) => {
    if (!selectedYear) {
      setSelectedYear(value);
    } else {
      setSelectedMonth(value);
      onSelected(value, selectedYear);
      setSelectedYear('');
      setSelectedMonth('');
      onClose();
    }
  };

  const renderItem = ({ item }: { item: string | number }) => {
    return (
      <Pressable
        onPress={() => handleSelection(item.toString())}
        style={({ pressed }) => [
          styles.item,
          {
            borderColor: pressed ? colors.primary : colors.lightGrey,
          },
        ]}
      >
        {({ pressed }) => (
          <Text textStyle='medium14' color={pressed ? colors.primary : colors.textPrimary}>
            {item}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <BottomSheet
      visible={visible}
      heading={selectedYear === '' ? 'Select Year' : 'Select Month'}
      onClose={() => {
        setSelectedYear('');
        setSelectedMonth('');
        onClose();
      }}
    >
      <View style={styles.listContainer}>
        <FlatList
          data={selectedYear === '' ? getTwelveYearRange() : months}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.flatList}
        />
      </View>
    </BottomSheet>
  );
};

export default YearMonthPicker;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  flatList: {
    gap: 10,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1 / 3,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    height: 48,
    justifyContent: 'center',
  },
});
