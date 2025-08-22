import { moderateScale } from '../utils/scaling';

const size = {
  tiny12: moderateScale(12),
  small16: moderateScale(16),
  regular20: moderateScale(20),
  large24: moderateScale(24),
};

const family = {
  light: 'Satoshi-Light',
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  bold: 'Satoshi-Bold',
  black: 'Satoshi-Black',
  lightItalic: 'Satoshi-LightItalic',
  regularItalic: 'Satoshi-Italic',
  mediumItalic: 'Satoshi-MediumItalic',
  boldItalic: 'Satoshi-BoldItalic',
  blackItalic: 'Satoshi-BlackItalic',
  logoFont: 'FONTSPRINGDEMO-AllRoundGothicMediumRegular',
};

export default {
  size,
  family,
};
