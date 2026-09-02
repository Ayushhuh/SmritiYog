import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { RecallChoice } from '@/components/game/RecallChoice';
import { OBJECTS } from '@/games/remember-object/library';
import type { ObjectId } from '@/games/remember-object/types';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type RecallGridProps = {
  options: ObjectId[];
  selectedIds: ObjectId[];
  selectedOrder?: ObjectId[];
  ordered?: boolean;
  nameOf: (id: ObjectId) => string;
  onSelect: (id: ObjectId) => void;
};

const TWO_COLUMNS_BREAKPOINT = 560;
const FOUR_COLUMNS_BREAKPOINT = 720;

export function RecallGrid({
  options,
  selectedIds,
  selectedOrder = [],
  ordered = false,
  nameOf,
  onSelect,
}: RecallGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const { colors } = useTheme();

  if (containerWidth <= 0) {
    return (
      <View
        onLayout={(event) =>
          setContainerWidth(event.nativeEvent.layout.width)
        }
        style={styles.grid}
      />
    );
  }

  const columns =
    containerWidth >= FOUR_COLUMNS_BREAKPOINT
      ? 4
      : containerWidth >= TWO_COLUMNS_BREAKPOINT
        ? 3
        : 2;

  const tileSize =
    (containerWidth - spacing.xl * (columns - 1)) / columns;

  return (
    <View
      onLayout={(event) =>
        setContainerWidth(event.nativeEvent.layout.width)
      }
      style={styles.grid}>
      {options.map((id) => {
        const object = OBJECTS[id];
        const selected = selectedIds.includes(id);

        const orderIndex = selectedOrder.indexOf(id);
        const selectionNumber =
          ordered && orderIndex >= 0
            ? orderIndex + 1
            : null;

        return (
          <View
            key={id}
            style={[
              styles.tile,
              { width: tileSize },
            ]}>
            {selectionNumber !== null ? (
              <View
                style={[
                  styles.orderBadge,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                <AppText
                  variant="captionMedium"
                  color="onPrimary">
                  {selectionNumber}
                </AppText>
              </View>
            ) : null}

            <RecallChoice
              object={object}
              name={nameOf(id)}
              size={tileSize}
              selected={selected}
              onPress={() => onSelect(id)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'flex-start',
  },

  tile: {
    position: 'relative',
  },

  orderBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
