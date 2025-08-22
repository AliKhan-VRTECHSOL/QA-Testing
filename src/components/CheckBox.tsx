import React, { SetStateAction, useMemo } from 'react';
import { Pressable, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/themeContext';
import { ThemeColors } from '../theme/colors';
import { Icons } from '../assets/Icons';

interface ComponentProps {
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckBox: React.FC<ComponentProps> = ({ selected, setSelected }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <Pressable
      onPress={() => setSelected(prev => !prev)}
      style={[
        styles.container,
        selected ? styles.selectedContainerOverload : {},
      ]}
    >
      <Image source={Icons.Check} style={styles.icon} />
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
          tintColor: colors.white,
        },
      }),
    [colors],
  );
};

export default CheckBox;
