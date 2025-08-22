import { Platform } from 'react-native';
import { DimensionsData } from '../../../utils/scaling';

export const headerHeight = Platform.select({
  ios: 58,
  android: 62,
  default: 56,
});

export const StatusBarContainerHeigt = 70;

export const progressBarWidth = DimensionsData.windowWidth - 80;
