import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecallChoice } from '@/components/game/RecallChoice';
import { OBJECTS } from '@/games/remember-object/library';
import type { ObjectId } from '@/games/remember-object/types';
import { spacing } from '@/theme/tokens';

type RecallGridProps = {
  options: ObjectId[];
  selectedIds: ObjectId[];
  nameOf: (id: ObjectId) => string;
  onSelect: (id: ObjectId) => void;
};

const TWO_COLUMNS_BREAKPOINT = 560;
const FOUR_COLUMNS_BREAKPOINT = 720;

export function RecallGrid({ options, selectedIds, nameOf, onSelect }: RecallGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  if (containerWidth <= 0) {
    return (
      <View
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
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
  const tileSize = (containerWidth - spacing.xl * (columns - 1)) / columns;

  return (
    <View
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      style={styles.grid}>
      {options.map((id) => {
        const object = OBJECTS[id];
        return (
          <RecallChoice
            key={id}
            object={object}
            name={nameOf(id)}
            size={tileSize}
            selected={selectedIds.includes(id)}
            onPress={() => onSelect(id)}
          />
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
});