import React from 'react';
import { Pressable } from 'react-native';
import { Text } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import useStyles from './styles';

interface SectionFooterProps {
  collapsed: boolean;
}

const SectionFooter: React.FC<SectionFooterProps> = ({ collapsed }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  if (collapsed) return null;

  return (
    <Pressable style={styles.addItemButton}>
      <Text textStyle='medium16'>Add item</Text>
    </Pressable>
  );
};

export default SectionFooter;
