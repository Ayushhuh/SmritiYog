import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import type { GameStatus } from '@/games/find-odd-one/use-odd-one-game';
import { spacing } from '@/theme/tokens';
import { ObjectChoice } from './ObjectChoice';

export type GameChoice = {
  index: number;
  label: string;
  source: ImageSourcePropType;
  isOdd: boolean;
};

type ObjectGridProps = {
  choices: GameChoice[];
  status: GameStatus;
  chosenIndex: number | null;
  onChoose: (index: number) => void;
};

const BALANCED_BREAKPOINT = 560;

export function ObjectGrid({
  choices,
  status,
  chosenIndex,
  onChoose,
}: ObjectGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const measures = containerWidth > 0;
  const columns = containerWidth >= BALANCED_BREAKPOINT ? 3 : 2;

  const tileSize =
    (containerWidth - spacing.xl * (columns - 1)) / columns;

  if (!measures) {
    return (
      <View
        onLayout={(event) =>
          setContainerWidth(event.nativeEvent.layout.width)
        }
        style={styles.grid}
      />
    );
  }

  return (
    <View
      onLayout={(event) =>
        setContainerWidth(event.nativeEvent.layout.width)
      }
      style={styles.grid}>
      {choices.map((choice, index) => {
        const centerSingleInLastRow =
          columns === 2 &&
          choices.length % 2 === 1 &&
          index === choices.length - 1;

        return (
          <View
            key={choice.index}
            style={
              centerSingleInLastRow
                ? styles.centeredTile
                : styles.tile
            }>
            <ObjectChoice
              index={choice.index}
              label={choice.label}
              source={choice.source}
              isOdd={choice.isOdd}
              size={tileSize}
              status={status}
              chosenIndex={chosenIndex}
              onChoose={onChoose}
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

  tile: {},

  centeredTile: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
