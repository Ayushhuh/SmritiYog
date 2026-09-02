import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import type { Language } from '@/i18n/languages';
import { speakText, stopSpeaking } from '@/i18n/speech';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ReminderCardProps = {
  title: string;
  time: string;
  reminderSpeak: string;
  speakLabel: string;
  doneLabel: string;
  language: Language;
  onDone?: () => void;
};

export function ReminderCard({
  title,
  time,
  reminderSpeak,
  speakLabel,
  doneLabel,
  language,
  onDone = () => {},
}: ReminderCardProps) {
  const { colors } = useTheme();
  const speakerFocus = useFocusable();
  const doneFocus = useFocusable();
  const [speaking, setSpeaking] = useState(false);
  const [done, setDone] = useState(false);

  const speakReminder = () => {
    setSpeaking(true);
    speakText(reminderSpeak, language, {
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const handleDone = () => {
    setDone(true);
    stopSpeaking();
    onDone();
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: done ? colors.secondary : colors['surface.warm'],
            borderColor: colors.background,
          },
        ]}>
        <AppIcon
          name="pills"
          color={done ? colors.onSecondary : colors['text.primary']}
          size={26}
        />
      </View>

      <View style={styles.textColumn}>
        <AppText
          variant="h3"
          color={done ? 'secondary' : 'primary'}
          style={done ? styles.struck : undefined}>
          {title}
        </AppText>
        <AppText variant="body" color="secondary">
          {time}
        </AppText>
      </View>

      <Pressable
        onPress={speakReminder}
        onFocus={speakerFocus.onFocus}
        onBlur={speakerFocus.onBlur}
        accessibilityRole="button"
        accessibilityLabel={`${speakLabel}. ${reminderSpeak}`}
        accessibilityState={{ busy: speaking }}
        style={({ pressed }) => [
          styles.roundButton,
          {
            backgroundColor: speaking ? colors.secondary : colors['surface.warm'],
            borderColor:
              speakerFocus.focused || pressed ? colors['primary.dark'] : colors.border,
            borderWidth: speakerFocus.focused ? 3 : 1,
          },
        ]}>
        <AppIcon
          name={speaking ? 'volume-up' : 'redo'}
          color={speaking ? colors.onSecondary : colors['text.primary']}
          size={22}
        />
      </Pressable>

      <Pressable
        onPress={handleDone}
        onFocus={doneFocus.onFocus}
        onBlur={doneFocus.onBlur}
        accessibilityRole="button"
        accessibilityLabel={doneLabel}
        accessibilityState={{ selected: done }}
        style={({ pressed }) => [
          styles.roundButton,
          {
            backgroundColor: done ? colors.secondary : colors.surface,
            borderColor:
              doneFocus.focused || pressed ? colors['primary.dark'] : colors['text.muted'],
            borderWidth: doneFocus.focused ? 3 : 2,
          },
        ]}>
        {done ? (
          <AppIcon name="check" color={colors.onSecondary} size={22} />
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  roundButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  struck: {
    textDecorationLine: 'line-through',
  },
});