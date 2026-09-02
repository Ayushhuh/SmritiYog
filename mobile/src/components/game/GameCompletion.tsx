import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { GameButton } from './GameButton';

type GameCompletionProps = {
  doneTitle: string;
  doneLine: string;
  playAgainLabel: string;
  exitLabel: string;
  onPlayAgain: () => void;
  onExit: () => void;
};

export function GameCompletion({
  doneTitle,
  doneLine,
  playAgainLabel,
  exitLabel,
  onPlayAgain,
  onExit,
}: GameCompletionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: colors.secondary }]}>
        <AppIcon name="check" color={colors.onSecondary} size={44} />
      </View>

      <AppText variant="h1" color="primary" style={styles.title}>
        {doneTitle}
      </AppText>
      <AppText variant="bodyLarge" color="secondary" style={styles.line}>
        {doneLine}
      </AppText>

      <View style={styles.actions}>
        <GameButton label={playAgainLabel} icon="redo" onPress={onPlayAgain} />
        <GameButton label={exitLabel} icon="door-open" variant="secondary" onPress={onExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  line: {
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
});