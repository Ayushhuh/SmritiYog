import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import type { GameStatus } from '@/games/find-odd-one/use-odd-one-game';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { ImageSourcePropType } from 'react-native';

type ObjectChoiceProps = {
  index: number;
  label: string;
  source: ImageSourcePropType;
  isOdd: boolean;
  size: number;
  status: GameStatus;
  chosenIndex: number | null;
  onChoose: (index: number) => void;
};

export function ObjectChoice({
  index,
  label,
  source,
  isOdd,
  size,
  status,
  chosenIndex,
  onChoose,
}: ObjectChoiceProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();

  const isCorrect = isOdd && status === 'correct';
  const isWrong = chosenIndex === index && status === 'wrong';

  const imageCircleSize = Math.min(Math.round(size * 0.58), 120);
  const imageSize = Math.round(imageCircleSize * 0.78);

  return (
    <Pressable
      onPress={() => onChoose(index)}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: status !== 'idle',
        selected: isCorrect,
      }}
      style={({ pressed }) => [
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: colors.surface,
          borderColor: isCorrect
            ? colors.secondary
            : isWrong
              ? colors['accent.sun']
              : focused
                ? colors['primary.dark']
                : colors.border,
          borderWidth: isCorrect || isWrong || focused ? 3 : 2,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View style={styles.numberBadge}>
        <AppText
          variant="captionMedium"
          color="muted"
          accessibilityElementsHidden>
          {index + 1}
        </AppText>
      </View>

      <View
        style={[
          styles.imageCircle,
          {
            width: imageCircleSize,
            height: imageCircleSize,
            borderRadius: imageCircleSize / 2,
            backgroundColor: isCorrect
              ? colors.secondary
              : colors['surface.warm'],
            borderColor: colors.background,
          },
        ]}>
        <Image
          source={source}
          style={{
            width: imageSize,
            height: imageSize,
          }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>

      <AppText
        variant="caption"
        color={isCorrect ? 'secondary' : 'muted'}
        numberOfLines={1}
        style={styles.label}>
        {label}
      </AppText>

      {isCorrect ? (
        <View
          style={[
            styles.checkBadge,
            { backgroundColor: colors.secondary },
          ]}>
          <AppIcon
            name="check"
            color={colors.onSecondary}
            size={18}
          />
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

  numberBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
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
