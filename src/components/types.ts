import { TextProps } from 'react-native';
import { textStyles } from './Text';

//Text
export interface CustomTextProps extends TextProps {
  textStyle?: keyof typeof textStyles;
  color?: string;
  center?: boolean;
}
