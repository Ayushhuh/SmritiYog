import { Platform } from 'react-native';

export const colorTokens = {
  light: {
    background: '#FFF8EF',
    surface: '#FFFFFF',
    'surface.warm': '#FFF1DF',
    border: '#E4D8C6',
    'text.primary': '#2B2118',
    'text.secondary': '#5A4A3B',
    'text.muted': '#766A5F',
    primary: '#C65D3A',
    'primary.dark': '#9E452A',
    secondary: '#2F8F83',
    'accent.sun': '#E6A23C',
    'accent.purple': '#8067A8',
    danger: '#C95656',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onDanger: '#FFFFFF',
    onAccent: '#FFFFFF',
  },
  dark: {
    background: '#1F2937',
    surface: '#111827',
    'surface.warm': '#111827',
    border: '#374151',
    'text.primary': '#F5F5F5',
    'text.secondary': '#E0E0E0',
    'text.muted': '#9CA3AF',
    primary: '#60A5FA',
    'primary.dark': '#3B82F6',
    secondary: '#34D399',
    'accent.sun': '#E6A23C',
    'accent.purple': '#9B81C2',
    danger: '#F87171',
    onPrimary: '#111827',
    onSecondary: '#111827',
    onDanger: '#FFFFFF',
    onAccent: '#111827',
  },
} as const satisfies Record<'light' | 'dark', Record<ColorTokenKey, string>>;

export type ThemeName = 'light' | 'dark';
export type ColorTokenKey =
  | 'background'
  | 'surface'
  | 'surface.warm'
  | 'border'
  | 'text.primary'
  | 'text.secondary'
  | 'text.muted'
  | 'primary'
  | 'primary.dark'
  | 'secondary'
  | 'accent.sun'
  | 'accent.purple'
  | 'danger'
  | 'onPrimary'
  | 'onSecondary'
  | 'onDanger'
  | 'onAccent';

export type ThemeColors = Record<ColorTokenKey, string>;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const radius = {
  md: 12,
  lg: 16,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h1: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  bodyLarge: { fontSize: 18, lineHeight: 30, fontWeight: '400' },
  body: { fontSize: 16, lineHeight: 26, fontWeight: '400' },
  label: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  caption: { fontSize: 14, lineHeight: 22, fontWeight: '400' },
  captionMedium: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
} as const;

export type TypographyKey = keyof typeof typography;

const DEVANAGARI_FALLBACK = 'Noto Sans Devanagari';
const NONETONE_FONT = 'Northeastern';

export const fontFamily = {
  regular: Platform.select({
    web: `'${NONETONE_FONT}', '${DEVANAGARI_FALLBACK}', sans-serif`,
    default: NONETONE_FONT,
  }),
  medium: Platform.select({
    web: `'${NONETONE_FONT}', '${DEVANAGARI_FALLBACK}', sans-serif`,
    default: NONETONE_FONT,
  }),
  semibold: Platform.select({
    web: `'${NONETONE_FONT}', '${DEVANAGARI_FALLBACK}', sans-serif`,
    default: NONETONE_FONT,
  }),
  bold: Platform.select({
    web: `'${NONETONE_FONT}', '${DEVANAGARI_FALLBACK}', sans-serif`,
    default: NONETONE_FONT,
  }),
} as const;

export const fonts = {
  regular: fontFamily.regular,
  medium: fontFamily.medium,
  semibold: fontFamily.semibold,
  bold: fontFamily.bold,
} as const;

export const component = {
  buttonHeight: 52,
  buttonHeightPrimary: 56,
  buttonHorizontalPadding: 24,
  cardPadding: 20,
  cardRadius: 16,
  controlHeight: 48,
  touchTarget: 48,
} as const;

export const textScale = {
  body: 1,
  bodyLarge: 1.05,
  heading: 1.1,
} as const;