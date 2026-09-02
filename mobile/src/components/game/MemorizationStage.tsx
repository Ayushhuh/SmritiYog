import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ObjectVisual } from '@/components/game/ObjectVisual';
import type { MemoryObject } from '@/games/remember-object/library';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type MemorizationStageProps = {
  objects?: MemoryObject[];
  object?: MemoryObject;
  rememberLabel: string;
  numberLabel?: string;
};

export function MemorizationStage({
  objects,
  object,
  rememberLabel,
  numberLabel,
}: MemorizationStageProps) {
  const { colors } = useTheme();

  const displayObjects =
    objects && objects.length > 0
      ? objects
      : object
        ? [object]
        : [];

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <AppText variant="h2" color="secondary" style={styles.heading}>
        {rememberLabel}
      </AppText>

      {numberLabel ? (
        <AppText variant="captionMedium" color="muted" style={styles.number}>
          {numberLabel}
        </AppText>
      ) : null}

      <View style={styles.objectsRow}>
        {displayObjects.map((item) => (
          <View key={item.id} style={styles.objectWrap}>
            <ObjectVisual object={item} size={150} />
          </View>
        ))}
      </View>

      <AppText variant="bodyLarge" color="primary" style={styles.instruction}>
        Remember all the objects
      </AppText>

      <View
        style={[
          styles.progressBar,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.primary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  number: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  objectsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  objectWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
