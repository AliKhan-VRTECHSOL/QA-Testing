import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '.';
import { useTheme } from '../context/themeContext';

interface ComponentProps {
  navTitles: string[];
  selected: string;
  setSelected: (value: string) => void;
}

const TopNavBar: React.FC<ComponentProps> = ({ navTitles, selected, setSelected }) => {
  const { colors } = useTheme();
  const selectedIndex = navTitles.indexOf(selected);

  return (
    <View style={[styles.container, { backgroundColor: colors.gray5 }]}>
      {navTitles.map((title, index) => {
        const isSelected = selected === title;
        const isLeftSelected = selectedIndex === index - 1;
        const isRightSelected = selectedIndex === index + 1;
        const isFirstItem = index === 0;
        const isLastItem = index === navTitles.length - 1;

        const borderStyle = {
          borderColor: colors.gray3,
          borderLeftWidth: isSelected || isLeftSelected || isFirstItem ? 0 : 0.5,
          borderRightWidth: isSelected || isRightSelected || isLastItem ? 0 : 0.5,
        };

        return (
          <Pressable
            key={title}
            style={[
              styles.button,
              {
                backgroundColor: isSelected ? 'white' : 'transparent',
              },
            ]}
            onPress={() => setSelected(title)}
          >
            <View style={[borderStyle, { width: '100%', alignItems: 'center' }]}>
              <Text textStyle='regular14' color={colors.textPrimary}>
                {title}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    borderRadius: 8,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 7,
  },
});

export default TopNavBar;
