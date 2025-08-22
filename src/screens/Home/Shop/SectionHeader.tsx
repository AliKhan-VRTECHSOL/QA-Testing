import React from 'react';
import { Pressable, View, Image } from 'react-native';
import { Text } from '../../../components';
import { Icons } from '../../../assets/Icons';
import { useTheme } from '../../../context/themeContext';
import useStyles from './styles';
import { ReceiptSection } from './types';

interface SectionHeaderProps {
  section: ReceiptSection;
  onToggleCollapse: (title: string) => void;
  ref?: React.Ref<View>;
}

const SectionHeader: React.FC<SectionHeaderProps> = React.forwardRef(
  ({ section, onToggleCollapse }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);

    return (
      <Pressable
        ref={ref}
        style={styles.sectionHeader}
        onPress={() => onToggleCollapse(section.title)}
      >
        <Text textStyle={'bold16'} color={colors.black}>
          {section.title}
        </Text>
        <Image
          source={Icons.ChevronDown}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
            transform: [{ rotate: `${section.collapsed ? 0 : 180}deg` }],
            tintColor: colors.primary,
          }}
        />
      </Pressable>
    );
  },
);

export default SectionHeader;
