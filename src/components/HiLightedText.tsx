import React from 'react';
import { Text } from '.';
import { useTheme } from '../context/themeContext';
import { CustomTextProps } from './types';

interface ComponentProps {
  children: string;
  /**
   * Highlight rule in the format:
   * {
   *   word: [occurrenceIndexesToHighlight] // 0-based
   * }
   */
  highlight?: Record<string, number[]>;
  textStyle?: CustomTextProps;
  hiLightedTextStyle?: CustomTextProps;
}

const HiLightedText: React.FC<ComponentProps> = ({
  children,
  highlight = {},
  textStyle = { textStyle: 'regular12' },
  hiLightedTextStyle = { textStyle: 'medium12' },
}) => {
  const { colors } = useTheme();
  const words = children.split(' ');

  // Count each occurrence of a word
  const wordCountMap: Record<string, number> = {};

  return (
    <Text textStyle={textStyle.textStyle} color={colors.gray3} {...textStyle}>
      {words.map((word, index) => {
        const count = wordCountMap[word] ?? 0;
        wordCountMap[word] = count + 1;

        const shouldHighlight = highlight[word]?.includes(count);

        if (shouldHighlight) {
          return (
            <Text
              key={`${word}-${index}`}
              textStyle={hiLightedTextStyle.textStyle}
              color={colors.primary}
              {...hiLightedTextStyle}
            >
              {word + ' '}
            </Text>
          );
        } else {
          return <React.Fragment key={`${word}-${index}`}>{word + ' '}</React.Fragment>;
        }
      })}
    </Text>
  );
};

export default HiLightedText;
