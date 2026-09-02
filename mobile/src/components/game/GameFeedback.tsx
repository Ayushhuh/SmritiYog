import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import type { GameStatus } from '@/games/find-odd-one/use-odd-one-game';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type GameFeedbackProps = {
  status: GameStatus;
  correctLabel: string;
  wrongLabel: string;
  idleLabel: string;
};

export function GameFeedback({ status, correctLabel, wrongLabel, idleLabel }: GameFeedbackProps) {
  const { colors } = useTheme();

  if (status === 'correct') {
    return (
      <View style={styles.banner} accessibilityLiveRegion="polite">
        <View style={[styles.iconCircle, { backgroundColor: colors.secondary }]}>
          <AppIcon name="check" color={colors.onSecondary} size={24} />
        </View>
        <AppText variant="h2" color="secondary">
          {correctLabel}
        </AppText>
      </View>
    );
  }

  if (status === 'wrong') {
    return (
      <View style={styles.banner} accessibilityLiveRegion="polite">
        <View style={[styles.iconCircle, { backgroundColor: colors['surface.warm'] }]}>
          <AppIcon name="smile" color={colors['text.primary']} size={24} />
        </View>
        <AppText variant="h3" color="primary">
          {wrongLabel}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <AppText variant="caption" color="muted" style={styles.idle}>
        {idleLabel}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    textAlign: 'center',
  },
});