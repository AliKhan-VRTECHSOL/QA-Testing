import React, { SetStateAction, useMemo } from 'react';
import { Pressable, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import { Icons } from '../assets/Icons';

interface ComponentProps {
  selected: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<boolean>>;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  iconStyle?: ImageStyle;
}

const CheckBox: React.FC<ComponentProps> = ({
  selected,
  setSelected,
  onPress,
  containerStyle = {},
  iconStyle = {},
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <Pressable
      onPress={() => (onPress ? onPress() : setSelected ? setSelected(prev => !prev) : null)}
      style={[
        styles.container,
        containerStyle ? containerStyle : {},
        selected ? styles.selectedContainerOverload : {},
      ]}
    >
      <Image
        source={Icons.Check}
        style={[styles.icon, iconStyle ? iconStyle : {}, selected ? styles.iconSelected : {}]}
      />
    </Pressable>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderWidth: 1,
          borderColor: colors.lightGrey,
          borderRadius: 5,
          width: 18,
          height: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
        },
        selectedContainerOverload: {
          experimental_backgroundImage: colors.gradientColor,
          borderColor: colors.white,
        },
        icon: {
          width: 10,
          height: 10,
          tintColor: 'transparent',
        },
        iconSelected: {
          tintColor: colors.white,
        },
      }),
    [colors],
  );
};

export default CheckBox;
