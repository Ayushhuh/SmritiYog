import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { useFocusable } from '@/components/use-focusable';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ExitButtonProps = {
  label: string;
  onPress: () => void;
};

export function ExitButton({ label, onPress }: ExitButtonProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors['surface.warm'],
          borderColor: focused || pressed ? colors['primary.dark'] : colors.border,
          borderWidth: focused ? 3 : 1,
        },
      ]}>
      <AppIcon name="door-open" color={colors['text.primary']} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
});