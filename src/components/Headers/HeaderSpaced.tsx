import React, { useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../context/themeContext';
import { CommonLayoutStyles } from '../../theme/commonLayout';
import { Icons } from '../../assets/Icons';
import { Text } from '..';
import { useNavigation } from '@react-navigation/native';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

const HeaderSpaced: React.FC<ComponentProps> = ({ title, onPress }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const handleOnPress = useCallback(async () => {
    onPress && (await onPress());
    navigation && navigation.goBack();
  }, [navigation, onPress]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleOnPress}>
        <Image source={Icons.ArrowLeft} style={styles.backIcon} />
      </Pressable>
      <Text color={colors.screenHeadingColor} textStyle="bold20">
        {title}
      </Text>
      <Pressable
        style={{
          opacity: 0,
        }}
      >
        <Image source={Icons.ArrowLeft} style={styles.backIcon} />
      </Pressable>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: CommonLayoutStyles.paddingHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: 'rgba(18, 21, 27, 0.06)',
        },
        backIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default HeaderSpaced;
