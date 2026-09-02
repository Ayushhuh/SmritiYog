import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ObjectVisual } from '@/components/game/ObjectVisual';
import type { MemoryObject } from '@/games/remember-object/library';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type MemorizationStageProps = {
  object: MemoryObject;
  name: string;
  currentIndex: number;
  total: number;
  rememberLabel: string;
  numberLabel: string;
};

export function MemorizationStage({
  object,
  name,
  currentIndex,
  total,
  rememberLabel,
  numberLabel,
}: MemorizationStageProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <AppText variant="h2" color="secondary" style={styles.heading}>
        {rememberLabel}
      </AppText>

      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index < currentIndex ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>

      <AppText variant="captionMedium" color="muted" style={styles.number}>
        {numberLabel}
      </AppText>

      <View style={styles.objectWrap}>
        <ObjectVisual object={object} size={190} />
      </View>

      <AppText variant="bodyLarge" color="primary" style={styles.name}>
        {name}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  number: {
    marginTop: -spacing.sm,
  },
  objectWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  name: {
    textAlign: 'center',
    fontWeight: '600',
  },
});