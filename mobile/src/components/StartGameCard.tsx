import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import type { Language } from '@/i18n/languages';
import { speakText } from '@/i18n/speech';
import { component, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type StartGameCardProps = {
  title: string;
  gameSpeak: string;
  speakLabel: string;
  language: Language;
  onStart: () => void;
};

export function StartGameCard({
  title,
  gameSpeak,
  speakLabel,
  language,
  onStart,
}: StartGameCardProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();
  const speakerFocus = useFocusable();
  const [speaking, setSpeaking] = useState(false);

  const speakGame = () => {
    setSpeaking(true);
    speakText(gameSpeak, language, {
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors['surface.warm'], borderColor: colors.border },
      ]}>
      <Pressable
        onPress={onStart}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [
          styles.mainButton,
          {
            borderColor: focused ? colors['primary.dark'] : 'transparent',
            borderWidth: focused ? 3 : 0,
            opacity: pressed ? 0.9 : 1,
          },
        ]}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.primary,
              borderColor: colors.background,
            },
          ]}>
          <AppIcon name="gamepad" color={colors.onPrimary} size={36} />
        </View>
        <AppText variant="h1" color="primary">
          {title}
        </AppText>
      </Pressable>

      <View style={styles.speakerWrap}>
        <Pressable
          onPress={speakGame}
          onFocus={speakerFocus.onFocus}
          onBlur={speakerFocus.onBlur}
          accessibilityRole="button"
          accessibilityLabel={`${speakLabel}. ${gameSpeak}`}
          accessibilityState={{ busy: speaking }}
          style={({ pressed }) => [
            styles.speaker,
            {
              backgroundColor: speaking ? colors.secondary : colors.surface,
              borderColor:
                speakerFocus.focused || pressed ? colors['primary.dark'] : colors.border,
              borderWidth: speakerFocus.focused ? 3 : 1,
            },
          ]}>
          <AppIcon
            name={speaking ? 'volume-up' : 'redo'}
            color={speaking ? colors.onSecondary : colors['text.primary']}
            size={24}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: component.buttonHeightPrimary + 200,
  },
  mainButton: {
    flex: 1,
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    borderRadius: radius.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerWrap: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 1,
  },
  speaker: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});