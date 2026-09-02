import { Text, type TextProps, type TextStyle } from 'react-native';

import { fonts, typography, type TypographyKey, type ThemeColors } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

export type AppTextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'onPrimary'
  | 'onSecondary'
  | 'onDanger'
  | 'inherit';

function resolveColor(colors: ThemeColors, color: AppTextColor): string | undefined {
  switch (color) {
    case 'primary':
      return colors['text.primary'];
    case 'secondary':
      return colors['text.secondary'];
    case 'muted':
      return colors['text.muted'];
    case 'onPrimary':
      return colors.onPrimary;
    case 'onSecondary':
      return colors.onSecondary;
    case 'onDanger':
      return colors.onDanger;
    case 'inherit':
      return undefined;
  }
}

function resolveFont(fontWeight: string | number | undefined): string {
  switch (fontWeight) {
    case '700':
    case '800':
      return fonts.bold;
    case '600':
      return fonts.semibold;
    case '500':
      return fonts.medium;
    default:
      return fonts.regular;
  }
}

export type AppTextProps = TextProps & {
  variant?: TypographyKey;
  color?: AppTextColor;
  fill?: boolean;
};

export function AppText({
  variant = 'body',
  color = 'primary',
  fill = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  const base = typography[variant];
  const family = resolveFont(base.fontWeight);

  const dynamicStyle: TextStyle = {
    fontFamily: family,
  };
  const resolved = resolveColor(colors, color);
  if (resolved !== undefined) {
    dynamicStyle.color = resolved;
  }
  if (fill) {
    dynamicStyle.flexShrink = 1;
  }

  return <Text style={[base, dynamicStyle, style]} {...rest} />;
}