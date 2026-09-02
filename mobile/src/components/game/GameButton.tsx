import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import { component, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type GameButtonVariant = 'primary' | 'secondary' | 'danger';

type GameButtonProps = {
  label: string;
  onPress: () => void;
  variant?: GameButtonVariant;
  icon?: string;
  disabled?: boolean;
};

export function GameButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}: GameButtonProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();

  const background = disabled
    ? colors.border
    : variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.danger
        : colors['surface.warm'];
  const contentColor = disabled
    ? colors['text.muted']
    : variant === 'primary'
      ? colors.onPrimary
      : variant === 'danger'
        ? colors.onDanger
        : colors['text.primary'];

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor: disabled
            ? colors.border
            : focused
              ? colors['primary.dark']
              : colors.border,
          borderWidth: disabled ? 1 : focused ? 3 : 1,
          opacity: disabled ? 1 : pressed ? 0.9 : 1,
        },
      ]}>
      {icon ? <AppIcon name={icon} color={contentColor} size={22} /> : null}
      <AppText
        variant="h3"
        color={disabled ? 'muted' : variant === 'secondary' ? 'primary' : 'inherit'}
        style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: component.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: component.buttonHorizontalPadding,
    borderRadius: radius.md,
  },
  label: {
    textAlign: 'center',
  },
});