import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { useTheme } from '../../../context/themeContext';
import { HiLightedText, Text } from '../..';
import { ThemeColors } from '../../../theme/colors';
import { LayoutMetrics } from '../../../theme/commonLayout';
import { Images } from '../../../assets/images';
import { Icons } from '../../../assets/Icons';

interface ComponentProps {
  title: string;
  subTitle: string;
  highlightTitle?: any;
}

const LogoHeaderDescription: React.FC<ComponentProps> = ({ title, subTitle, highlightTitle }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View>
      {/* <View style={styles.logoContainer}>
        <Image source={Icons.Logo} style={styles.logo} />
      </View> */}
      <HiLightedText
        highlight={highlightTitle}
        textStyle={{
          textStyle: 'bold30',
          color: colors.screenHeadingColor,
        }}
        hiLightedTextStyle={{
          textStyle: 'bold30',
        }}
      >
        {title}
      </HiLightedText>
      <Text textStyle='medium14' color={colors.textPrimary}>
        {subTitle}
      </Text>
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        logoContainer: {
          width: 70,
          height: 70,
          borderRadius: 45,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: colors.secondaryOpacity1,
          marginBottom: 8,
        },
        logo: {
          width: 50,
          height: 50,
          resizeMode: 'contain',
        },
      }),
    [colors],
  );
};

export default LogoHeaderDescription;
