import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '.';
import { useTheme } from '../context/themeContext';

interface ComponentProps {
  children: string;
  textColor?: string;
  bgColor?: string;
}

const StatusBadge: React.FC<ComponentProps> = ({ children, textColor, bgColor }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: bgColor || colors.uploadededBy,
        alignSelf: 'flex-start',
      }}
    >
      <Text textStyle='bold14' color={textColor}>
        {children}
      </Text>
    </View>
  );
};

export default StatusBadge;
