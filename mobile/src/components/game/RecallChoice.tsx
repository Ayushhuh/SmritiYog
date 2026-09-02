import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { ObjectVisual } from '@/components/game/ObjectVisual';
import { useFocusable } from '@/components/use-focusable';
import type { MemoryObject } from '@/games/remember-object/library';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type RecallChoiceProps = {
  object: MemoryObject;
  name: string;
  size: number;
  selected: boolean;
  onPress: () => void;
};

export function RecallChoice({ object, name, size, selected, onPress }: RecallChoiceProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();
  const visualSize = Math.max(0, Math.min(Math.round(size * 0.46), 90));

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.tile,
        {
          width: size,
          minHeight: size,
          backgroundColor: selected ? colors['surface.warm'] : colors.surface,
          borderColor: selected
            ? colors.primary
            : focused
              ? colors['primary.dark']
              : colors.border,
          borderWidth: selected || focused ? 3 : 2,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <ObjectVisual object={object} size={visualSize} />

      <AppText
        variant="captionMedium"
        color={selected ? 'primary' : 'secondary'}
        numberOfLines={2}
        style={styles.label}>
        {name}
      </AppText>

      {selected ? (
        <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
          <AppIcon name="check" color={colors.onPrimary} size={18} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 20,
    padding: spacing.sm,
  },
  label: {
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});