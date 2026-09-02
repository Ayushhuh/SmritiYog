import { requireOptionalNativeModule } from 'expo-modules-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { SPEECH_LANG, type Language } from '@/i18n/languages';
import { STT_LANG_FALLBACKS } from '@/i18n/speech';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ResultRecord = {
  transcript?: string;
};

type ResultEvent = {
  isFinal?: boolean;
  results?: ResultRecord[];
};

type ErrorEvent = {
  error?: string;
  message?: string;
};

type SpeechStartOptions = {
  lang: string;
  interimResults?: boolean;
  continuous?: boolean;
  maxAlternatives?: number;
  contextualStrings?: string[];
  androidIntentOptions?: {
    EXTRA_LANGUAGE_MODEL?: string;
  };
};

type SpeechModule = {
  isRecognitionAvailable(): boolean;
  requestPermissionsAsync(): Promise<{ granted: boolean }>;
  start(options: SpeechStartOptions): void;
  stop(): void;
  addListener: (
    name: string,
    listener: (event: unknown) => void,
  ) => { remove: () => void };
};

type RememberSpeechInputProps = {
  language: Language;
  onTranscript: (transcript: string) => void;
  contextualStrings?: string[];
  disabled?: boolean;
};

export function RememberSpeechInput({
  language,
  onTranscript,
  contextualStrings = [],
  disabled = false,
}: RememberSpeechInputProps) {
  const { colors } = useTheme();

  const moduleRef = useRef<SpeechModule | null>(null);
  const languageRef = useRef(language);
  const onTranscriptRef = useRef(onTranscript);
  const startedRef = useRef(false);
  const languageIndexRef = useRef(0);

  const [available, setAvailable] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    languageRef.current = language;
    onTranscriptRef.current = onTranscript;
    languageIndexRef.current = 0;
  }, [language, onTranscript]);

  useEffect(() => {
    let active = true;

    const subscriptions: { remove: () => void }[] = [];

    const handleStart = () => {
      if (!active) return;

      startedRef.current = true;
      setListening(true);
      setError('');
    };

    const handleEnd = () => {
      if (!active) return;

      startedRef.current = false;
      setListening(false);
    };

    const handleResult = (event: unknown) => {
      const resultEvent = event as ResultEvent;
      const text = resultEvent.results?.[0]?.transcript?.trim();

      if (!text) return;

      setTranscript(text);

      if (resultEvent.isFinal) {
        onTranscriptRef.current(text);
      }
    };

    const handleError = (event: unknown) => {
      const errorEvent = event as ErrorEvent;
      const code =
        errorEvent.error ??
        errorEvent.message ??
        'unknown';

      startedRef.current = false;
      setListening(false);

      if (code === 'language-not-supported') {
        const fallbacks =
          STT_LANG_FALLBACKS[languageRef.current] ?? [
            SPEECH_LANG[languageRef.current],
          ];

        if (
          languageIndexRef.current <
          fallbacks.length - 1
        ) {
          languageIndexRef.current += 1;
          setError(
            `Retrying speech recognition in ${
              fallbacks[languageIndexRef.current]
            }...`,
          );
          return;
        }
      }

      if (code === 'not-allowed') {
        setError('Microphone permission was not allowed.');
      } else {
        setError('Speech recognition is unavailable.');
      }
    };

    const load = async () => {
      let speechModule: SpeechModule | null = null;

      if (Platform.OS === 'web') {
        try {
          const imported =
            (await import('expo-speech-recognition')) as {
              ExpoSpeechRecognitionModule?: SpeechModule;
            };

          speechModule =
            imported.ExpoSpeechRecognitionModule ?? null;
        } catch {
          speechModule = null;
        }
      } else {
        speechModule =
          requireOptionalNativeModule(
            'ExpoSpeechRecognition',
          ) as SpeechModule | null;
      }

      if (!active) return;

      if (!speechModule) {
        setAvailable(false);
        return;
      }

      moduleRef.current = speechModule;

      let recognitionAvailable = false;

      try {
        recognitionAvailable =
          speechModule.isRecognitionAvailable();
      } catch {
        recognitionAvailable = false;
      }

      setAvailable(recognitionAvailable);

      if (!recognitionAvailable) return;

      subscriptions.push(
        speechModule.addListener(
          'start',
          handleStart,
        ),
      );

      subscriptions.push(
        speechModule.addListener(
          'end',
          handleEnd,
        ),
      );

      subscriptions.push(
        speechModule.addListener(
          'result',
          handleResult,
        ),
      );

      subscriptions.push(
        speechModule.addListener(
          'error',
          handleError,
        ),
      );
    };

    void load();

    return () => {
      active = false;

      subscriptions.forEach((subscription) =>
        subscription.remove(),
      );

      try {
        moduleRef.current?.stop();
      } catch {}

      startedRef.current = false;
    };
  }, []);

  const startListening = useCallback(async () => {
    const speechModule = moduleRef.current;

    if (
      !speechModule ||
      disabled ||
      startedRef.current
    ) {
      return;
    }

    setError('');
    setTranscript('');
    languageIndexRef.current = 0;

    const permission =
      await speechModule.requestPermissionsAsync();

    if (!permission.granted) {
      setError(
        'Microphone permission was not allowed.',
      );
      return;
    }

    const fallbacks =
      STT_LANG_FALLBACKS[language] ?? [
        SPEECH_LANG[language],
      ];

    const lang =
      fallbacks[
        Math.min(
          languageIndexRef.current,
          fallbacks.length - 1,
        )
      ];

    try {
      speechModule.start({
        lang,
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
        contextualStrings,
        ...(Platform.OS === 'android'
          ? {
              androidIntentOptions: {
                EXTRA_LANGUAGE_MODEL:
                  'web_search',
              },
            }
          : {}),
      });

      startedRef.current = true;
    } catch {
      startedRef.current = false;
      setListening(false);
      setError(
        'Speech recognition could not start.',
      );
    }
  }, [
    contextualStrings,
    disabled,
    language,
  ]);

  const stopListening = useCallback(() => {
    if (!moduleRef.current) return;

    try {
      moduleRef.current.stop();
    } catch {}

    startedRef.current = false;
    setListening(false);
  }, []);

  const handlePress = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      void startListening();
    }
  }, [
    listening,
    startListening,
    stopListening,
  ]);

  if (available !== true) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          listening
            ? 'Stop speaking'
            : 'Speak remembered objects'
        }
        accessibilityState={{
          busy: listening,
          disabled,
        }}
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.mic,
          {
            backgroundColor: listening
              ? colors.secondary
              : colors['surface.warm'],
            borderColor:
              pressed
                ? colors['primary.dark']
                : colors.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <AppIcon
          name="microphone"
          color={
            listening
              ? colors.onSecondary
              : colors['text.primary']
          }
          size={26}
        />
      </Pressable>

      <AppText
        variant="captionMedium"
        color="muted"
        style={styles.label}>
        {listening
          ? 'Listening...'
          : 'Tap to say the objects'}
      </AppText>

      {transcript ? (
        <AppText
          variant="body"
          color="secondary"
          style={styles.transcript}>
          {transcript}
        </AppText>
      ) : null}

      {error ? (
        <AppText
          variant="caption"
          color="muted"
          style={styles.error}
          accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  mic: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    textAlign: 'center',
  },

  transcript: {
    textAlign: 'center',
    maxWidth: 320,
  },

  error: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
