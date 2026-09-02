import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ProgressIndicatorProps = {
  roundNumber: number;
  totalRounds: number;
  label: string;
};

export function ProgressIndicator({ roundNumber, totalRounds, label }: ProgressIndicatorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: totalRounds }, (_, index) => {
          const completed = index < roundNumber;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: completed ? colors.primary : colors.border,
                },
              ]}
            />
          );
        })}
      </View>
      <AppText variant="captionMedium" color="muted" accessibilityRole="text">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});