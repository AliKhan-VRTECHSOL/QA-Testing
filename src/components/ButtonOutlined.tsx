import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { Text } from '.';
import { useTheme } from '../context/themeContext';
import { useMemo } from 'react';
import { LayoutMetrics } from '../theme/commonLayout';
import { ThemeColors } from '../theme/colors';

interface ComponentProps extends PressableProps {
  title: string;
  smallVariant?: boolean;
  tagColor?: string;
}

const ButtonOutlined: React.FC<ComponentProps> = ({ title, smallVariant, tagColor, ...props }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const ComponentStyles = useMemo(() => {
    let containerStyle = Object.assign(
      {},
      styles.gradientBorderContainer,
      smallVariant ? styles.smallGradientBorderContainer : {},
      props?.style ? props?.style : {},
    );
    let innerContainerStyle = Object.assign(
      {},
      styles.gradientBorderInnerContainer,
      smallVariant ? styles.smallGradientBorderInnerContainer : {},
    );
    return {
      container: containerStyle,
      innerContainer: innerContainerStyle,
    };
  }, [styles, smallVariant, props?.style]);

  return (
    <Pressable {...props} style={ComponentStyles.container}>
      <View style={ComponentStyles.innerContainer}>
        <Text color={tagColor} textStyle='bold16'>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const useStyles = (colors: ThemeColors) => {
  return useMemo(
    () =>
      StyleSheet.create({
        gradientBorderContainer: {
          height: LayoutMetrics.button.height,
          borderRadius: LayoutMetrics.button.borderRadius,
          experimental_backgroundImage: colors.gradientColor,
          width: '100%',
          justifyContent: 'center',
          paddingHorizontal: 1,
        },
        gradientBorderInnerContainer: {
          height: LayoutMetrics.button.height - 2,
          backgroundColor: colors.white,
          borderRadius: LayoutMetrics.button.borderRadius,
          alignItems: 'center',
          justifyContent: 'center',
        },
        smallGradientBorderContainer: {
          height: LayoutMetrics.button.heightSmall,
          borderRadius: LayoutMetrics.button.borderRadiusSmall,
          width: '100%',
        },
        smallGradientBorderInnerContainer: {
          height: LayoutMetrics.button.heightSmall - 2,
          borderRadius: LayoutMetrics.button.borderRadiusSmall,
        },
      }),
    [colors],
  );
};

export default ButtonOutlined;
