import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import { type Language } from '@/i18n/languages';
import { speakText, stopSpeaking } from '@/i18n/speech';
import { spacing, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type VoiceGuideProps = {
  text: string;
  language: Language;
  repeatLabel: string;
  speakAutomatically?: boolean;
  circular?: boolean;
  onSpeechChange?: (speaking: boolean) => void;
};

export function VoiceGuide({
  text,
  language,
  repeatLabel,
  speakAutomatically = true,
  circular = true,
  onSpeechChange,
}: VoiceGuideProps) {
  const { colors } = useTheme();
  const { focused, onFocus, onBlur } = useFocusable();
  const lastText = useRef(text);
  const [speaking, setSpeaking] = useState(false);
  const mounted = useRef(true);

  const finishSpeak = () => {
    if (mounted.current) setSpeaking(false);
    onSpeechChange?.(false);
  };

  const speak = () => {
    setSpeaking(true);
    onSpeechChange?.(true);
    speakText(text, language, {
      rate: 0.85,
      onDone: finishSpeak,
      onStopped: finishSpeak,
      onError: finishSpeak,
    });
  };

  useEffect(() => {
    if (text === lastText.current || !speakAutomatically) return;
    lastText.current = text;
    const id = setTimeout(speak, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    lastText.current = text;
    if (speakAutomatically) {
      const id = setTimeout(speak, 400);
      return () => {
        mounted.current = false;
        clearTimeout(id);
        stopSpeaking();
      };
    }
    return () => {
      mounted.current = false;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleColor = circular ? colors['accent.purple'] : colors.background;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: circleColor,
            borderColor: colors.background,
          },
        ]}>
        <AppIcon name="headphones" color={colors.onAccent} size={30} />
      </View>

      <View style={styles.textColumn}>
        <AppText variant="h1" color="primary">
          {text}
        </AppText>
      </View>

      <Pressable
        onPress={speak}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityRole="button"
        accessibilityLabel={`${repeatLabel}. ${text}`}
        accessibilityState={{ busy: speaking }}
        style={({ pressed }) => [
          styles.speaker,
          {
            backgroundColor: speaking ? colors.secondary : colors['surface.warm'],
            borderColor: focused || pressed ? colors['primary.dark'] : colors.border,
            borderWidth: focused ? 3 : 1,
          },
        ]}>
        <AppIcon
          name={speaking ? 'volume-up' : 'redo'}
          color={speaking ? colors.onSecondary : colors['text.primary']}
          size={24}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xs,
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