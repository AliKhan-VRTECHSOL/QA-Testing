import type React from 'react';
import { useState, useMemo } from 'react';
import { View, Pressable, FlatList, Image, StyleSheet } from 'react-native';
import { Text } from '.';
import BottomSheet from './BottomSheet';
import { useTheme } from '../context/themeContext';
import type { ThemeColors } from '../theme/colors';
import { DimensionsData } from '../utils/scaling';
import { LayoutMetrics } from '../theme/commonLayout';
import { Icons } from '../assets/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DropdownModalProps {
  title?: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: string[];
  smallVariant?: boolean;
  placeholder?: string;
}

const DropDownModal: React.FC<DropdownModalProps> = ({
  title,
  selectedValue,
  setSelectedValue,
  options,
  smallVariant = false,
  placeholder,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [visible, setVisible] = useState(false);

  const handleSelect = (item: string) => {
    setSelectedValue(item);
    setVisible(false);
  };

  const renderItem = ({ item }: { item: string }) => (
    <Pressable
      key={item}
      style={[styles.optionItem, selectedValue === item && styles.selectedOption]}
      onPress={() => handleSelect(item)}
    >
      <Text
        textStyle='regular16'
        color={selectedValue === item ? colors.primary : colors.textPrimary}
      >
        {item}
      </Text>
      {selectedValue === item && <Image source={Icons.Check} style={styles.checkIcon} />}
    </Pressable>
  );

  // Fix: Create a more stable separator component
  const ItemSeparator = useMemo(
    () => () => <View style={[styles.separator, { backgroundColor: colors.lightGrey }]} />,
    [colors.lightGrey, styles.separator],
  );

  return (
    <View style={{ gap: 12 }}>
      {title && (
        <Text textStyle='medium14' color={colors.lightGrey}>
          {title}
        </Text>
      )}
      <Pressable
        style={[styles.dropdownButton, smallVariant ? styles.smallVariantOverload : {}]}
        onPress={() => setVisible(true)}
      >
        <Text
          textStyle={selectedValue ? 'medium16' : 'regular16'}
          color={colors.textPrimary}
          style={styles.dropdownText}
        >
          {selectedValue || placeholder || title || 'Select Option'}
        </Text>
        <Image source={Icons.arrowDown} style={styles.dropdownIcon} />
      </Pressable>
      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        heading={placeholder || title || 'Select Option'}
        subtitle={title ? `Choose from ${options.length} available options` : undefined}
      >
        <FlatList
          data={options}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: bottom + bottom + 32 }}
          ItemSeparatorComponent={ItemSeparator}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: 48,
            offset: 48 * index,
            index,
          })}
        />
      </BottomSheet>
    </View>
  );
};

const useStyles = (colors: ThemeColors) =>
  useMemo(
    () =>
      StyleSheet.create({
        dropdownButton: {
          // flex: 1,
          minWidth: DimensionsData.windowWidth / 2 - 32,
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: colors.lightGrey,
          alignItems: 'center',
          paddingHorizontal: LayoutMetrics.padding.horizontal,
          borderRadius: LayoutMetrics.input.borderRadius,
          height: LayoutMetrics.input.heightDefault,
        },
        smallVariantOverload: {
          height: LayoutMetrics.input.heightSmall,
          borderRadius: LayoutMetrics.input.borderRadiusSmall,
        },
        dropdownText: {
          flex: 1,
        },
        dropdownIcon: {
          width: 18,
          height: 18,
          resizeMode: 'contain',
        },
        option: {
          paddingVertical: 12,
        },
        // Fix: More stable separator styling
        separator: {
          height: StyleSheet.hairlineWidth,
          marginHorizontal: 0,
          opacity: 1,
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

export default DropDownModal;
