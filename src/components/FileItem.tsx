import React, { useMemo } from 'react';

import { Image, ImageProps, StyleSheet, View } from 'react-native';
import { LayoutMetrics } from '../theme/commonLayout';
import { useTheme } from '../context/themeContext';
import { Text } from '.';
import { ThemeColors } from '../theme/colors';

interface ComponentProps {
  title: string;
  date: string;
  size: string;
  icon: ImageProps['source'];
}

const FileItem: React.FC<ComponentProps> = ({ title, date, size, icon }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.fileIcon} />
      <View style={styles.textWrapper}>
        <Text textStyle='medium14' color={colors.primary}>
          {title}
        </Text>
        <Text textStyle='medium12' color={colors.gray3}>
          {date}
        </Text>
      </View>
      <View style={styles.sizeWrapper}>
        <Text textStyle='bold12' color={colors.textPrimary}>
          {size}
        </Text>
      </View>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginHorizontal: LayoutMetrics.padding.horizontal,
          flexDirection: 'row',
          gap: 8,
          borderBottomWidth: 1,
          paddingVertical: 16,
          borderColor: colors.gray5,
        },
        fileIcon: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
        textWrapper: {
          flex: 1,
        },
        sizeWrapper: {
          paddingHorizontal: 5,
          borderWidth: 1,
          borderColor: colors.gray3,
          justifyContent: 'center',
          alignSelf: 'flex-start',
          paddingVertical: 2,
          borderRadius: 3,
        },
      }),
    [colors],
  );
};

export default FileItem;
