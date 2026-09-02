import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import type { MemoryObject } from '@/games/remember-object/library';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ObjectVisualProps = {
  object: MemoryObject;
  size: number;
};

export function ObjectVisual({ object, size }: ObjectVisualProps) {
  const { colors } = useTheme();
  const circle = Math.max(0, Math.min(Math.round(size), 170));

  if (object.image != null) {
    return (
      <Image
        source={object.image}
        style={{ width: circle, height: circle, borderRadius: circle / 2 }}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.circle,
        {
          width: circle,
          height: circle,
          borderRadius: circle / 2,
          backgroundColor: colors['surface.warm'],
          borderColor: colors.background,
        },
      ]}>
      <AppIcon
        name={object.icon}
        color={colors['text.primary']}
        size={Math.round(circle * 0.52)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: spacing.sm / 2,
  },
});