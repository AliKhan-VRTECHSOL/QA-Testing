export interface ThemeColors {
  primary: string;
  secondary: string;
  splashBackground: string;
  pressedColor: string;
  white: string;
  textPrimary: string;
  black: string;
  screenHeadingColor: string;
  lightGrey: string;
  gray3: string;
  gray5: string;
  gradientColor?: string;
  searchResultText: string;
  secondaryOpacity1: string;
  error: string;
  disabled: string;
  primaryLowOpacity: string;
  imageBGColor: string;
  estimated: string;
  estimatedText: string;
  confirmed: string;
  confirmedText: string;
  uploadededBy: string;
  subscriptionCardBGColor: string;
  success: string;
  red: string;
}

// Light theme colors
const lightThemeColors: ThemeColors = {
  primary: '#7B48FF',
  secondary: '#A911F1',
  splashBackground: '#7552EB',
  pressedColor: '#b6add2',
  white: '#ffffff',
  textPrimary: '#01021D',
  black: '#000',
  screenHeadingColor: '#1F1F1F',
  lightGrey: '#778593',
  gray3: '#828282',
  gray5: '#E0E0E0',
  searchResultText: '#8D879A',
  disabled: '#EDEDED',
  secondaryOpacity1: 'rgba(169, 17, 241, 0.1)',
  error: '#FF0000',
  primaryLowOpacity: '#8D6FE4',
  imageBGColor: '#F2F2F2',
  estimated: '#F2F2DE',
  estimatedText: '#5F480F',
  confirmed: '#E1F2DE',
  confirmedText: '#0F5F4C',
  uploadededBy: '#F1EDFF',
  subscriptionCardBGColor: 'rgba(105, 64, 228, 0.05)',
  success: '#41D195',
  red: '#EB5757',
};

// Dark theme colors
const darkThemeColors: ThemeColors = {
  primary: '#7B48FF',
  secondary: '#A911F1',
  splashBackground: '#7552EB',
  pressedColor: '#49318F',
  white: '#ffffff',
  textPrimary: '#01021D',
  black: '#000',
  screenHeadingColor: '#1F1F1F',
  lightGrey: '#778593',
  gray3: '#828282',
  gray5: '#E0E0E0',
  searchResultText: '#8D879A',
  disabled: '#EDEDED',
  secondaryOpacity1: 'rgba(169, 17, 241, 0.1)',
  error: '#FF0000',
  primaryLowOpacity: '#8D6FE4',
  imageBGColor: '#F2F2F2',
  estimated: '#F2F2DE',
  estimatedText: '#5F480F',
  confirmed: '#E1F2DE',
  confirmedText: '#0F5F4C',
  uploadededBy: '#F1EDFF',
  subscriptionCardBGColor: 'rgba(105, 64, 228, 0.05)',
  success: '#41D195',
  red: '#EB5757',
};

darkThemeColors.gradientColor = `linear-gradient(90deg, ${darkThemeColors.secondary} 0%, ${darkThemeColors.primary} 100%)`;
lightThemeColors.gradientColor = `linear-gradient(90deg, ${lightThemeColors.secondary} 0%, ${lightThemeColors.primary} 100%)`;

type ThemeType = 'light' | 'dark';

export const Colors: Record<ThemeType, ThemeColors> = Object.freeze({
  light: lightThemeColors,
  dark: darkThemeColors,
} as const);

export type ColorTheme = typeof lightThemeColors;
export type ColorKey = keyof ColorTheme;
