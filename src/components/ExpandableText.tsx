import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/themeContext';
import { Text } from '.';
import { ThemeColors } from '../theme/colors';

const ExpandableText = ({
  text,
  maxLines = 3,
  emptyTag = 'No text',
}: {
  text: string;
  maxLines?: number;
  emptyTag?: string;
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        textStyle='regular12'
        color={colors.lightGrey}
        numberOfLines={isExpanded ? undefined : maxLines}
      >
        {text && text.length > 0 ? text : emptyTag}
      </Text>
      {text && text.length > maxLines && (
        <Text
          textStyle='regular12'
          color={colors.primary}
          style={styles.toggle}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Text>
      )}
    </View>
  );
};

const useStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    toggle: {
      textDecorationLine: 'underline',
      textDecorationColor: colors.primary,
      alignSelf: 'flex-start',
    },
  });
};

export default ExpandableText;
