import { platformApiLevel } from 'expo-device';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { useFocusable } from '@/components/use-focusable';
import { GAME_KEYWORDS, SPEECH_LANG, type Language } from '@/i18n/languages';
import { useLanguage } from '@/i18n/language-context';
import { speakText, STT_LANG_FALLBACKS } from '@/i18n/speech';
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
  message?: string;
  error?: string;
};

type SpeechStartOptions = {
  lang: string;
  interimResults?: boolean;
  continuous?: boolean;
  contextualStrings?: string[];
  androidIntentOptions?: { EXTRA_LANGUAGE_MODEL?: string };
};

type SpeechModule = {
  isRecognitionAvailable(): boolean;
  requestPermissionsAsync(): Promise<{ granted: boolean }>;
  start(options: SpeechStartOptions): void;
  stop(): void;
  getSpeechRecognitionServices?(): string[];
  getDefaultRecognitionService?(): { packageName?: string };
  addListener: (
    name: string,
    listener: (event: unknown) => void,
  ) => { remove: () => void };
};

type VoiceInputProps = {
  language: Language;
  label: string;
  paused?: boolean;
  onGameCommand: () => void;
};

const RESTART_DELAY_MS = 350;
const RESPONSE_TIMEOUT_MS = 6000;
const MAX_CONSECUTIVE_ERRORS = 6;
// Android < 13 (TIRAMISU) can't run continuous recognition sessions.
const ANDROID_CONTINUOUS_MIN_API = 33;
const STICKY_ERRORS: ReadonlySet<string> = new Set([
  'not-allowed',
  'service-not-allowed',
  'audio-capture',
  'unknown',
]);

export function VoiceInput({ language, label, paused = false, onGameCommand }: VoiceInputProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { focused, onFocus, onBlur } = useFocusable();

  const modRef = useRef<SpeechModule | null>(null);
  const languageRef = useRef(language);
  const onGameCommandRef = useRef(onGameCommand);
  const tRef = useRef(t);
  const handledRef = useRef(false);
  const askedPermissionRef = useRef(false);
  const startedRef = useRef(false);
  const mutedRef = useRef(false);
  const shouldListenRef = useRef(false);
  const heldRef = useRef(false);
  const failuresRef = useRef(0);
  const langIndexRef = useRef(0);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [available, setAvailable] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [screenFocused, setScreenFocused] = useState(false);
  const [responding, setResponding] = useState(false);
  const [userOff, setUserOff] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    languageRef.current = language;
    onGameCommandRef.current = onGameCommand;
    tRef.current = t;
    langIndexRef.current = 0;
  }, [language, onGameCommand, t]);

  const showHint = useCallback((message: string) => {
    setHint(message);
    setTimeout(() => setHint((current) => (current === message ? '' : current)), 5000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      handledRef.current = false;
      setScreenFocused(true);
      return () => {
        setScreenFocused(false);
        shouldListenRef.current = false;
        mutedRef.current = true;
        startedRef.current = false;
        if (restartTimerRef.current) {
          clearTimeout(restartTimerRef.current);
          restartTimerRef.current = null;
        }
        try {
          modRef.current?.stop();
        } catch {}
      };
    }, []),
  );

  const stopRecognition = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    startedRef.current = false;
    try {
      modRef.current?.stop();
    } catch {}
  }, []);

  const startRecognition = useCallback(
    async (forcePermission: boolean) => {
      const mod = modRef.current;
      if (!mod) return;
      if (startedRef.current) return;
      if (mutedRef.current) return;
      if (!shouldListenRef.current) return;
      if (userOff) return;
      if (heldRef.current) return;

      let granted = true;
      if (askedPermissionRef.current === false || forcePermission) {
        askedPermissionRef.current = true;
        try {
          const permission = await mod.requestPermissionsAsync();
          granted = permission.granted;
        } catch {
          granted = false;
        }
        if (!granted) {
          heldRef.current = true;
          setUserOff(true);
          showHint('Microphone was not allowed.');
          return;
        }
      }

      if (!shouldListenRef.current || mutedRef.current || userOff || heldRef.current) return;

      const fallbacks = STT_LANG_FALLBACKS[languageRef.current] ?? [SPEECH_LANG[languageRef.current]];
      const lang = fallbacks[Math.min(langIndexRef.current, fallbacks.length - 1)];
      const continuous =
        Platform.OS !== 'android' ||
        (platformApiLevel ?? ANDROID_CONTINUOUS_MIN_API) >= ANDROID_CONTINUOUS_MIN_API;
      const keywords = Array.from(
        new Set([...GAME_KEYWORDS[languageRef.current], ...GAME_KEYWORDS.en]),
      );

      try {
        console.log(
          `[voice] start lang=${lang} continuous=${continuous} services-ok=true`,
        );
        mod.start({
          lang,
          interimResults: true,
          continuous,
          contextualStrings: keywords,
          ...(Platform.OS === 'android'
            ? { androidIntentOptions: { EXTRA_LANGUAGE_MODEL: 'web_search' } }
            : {}),
        });
        startedRef.current = true;
        setHint('');
      } catch (error) {
        startedRef.current = false;
        console.warn('[voice] start failed', error);
        showHint('Voice input could not start here.');
      }
    },
    [showHint, userOff],
  );

  const restartRecognition = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    restartTimerRef.current = setTimeout(() => {
      restartTimerRef.current = null;
      void startRecognition(false);
    }, RESTART_DELAY_MS);
  }, [startRecognition]);

  const respond = useCallback(
    (text: string) => {
      mutedRef.current = true;
      stopRecognition();
      setResponding(true);
      setTranscript(text);
      let done = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = () => {
        if (done) return;
        done = true;
        if (timer) clearTimeout(timer);
        setResponding(false);
        setTranscript('');
        mutedRef.current = false;
        if (shouldListenRef.current && !userOff && !heldRef.current) {
          restartRecognition();
        }
      };
      speakText(text, languageRef.current, {
        rate: 0.9,
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
      timer = setTimeout(finish, RESPONSE_TIMEOUT_MS);
    },
    [restartRecognition, stopRecognition, userOff],
  );

  const handleResult = useCallback(
    (event: unknown) => {
      const resultEvent = event as ResultEvent;
      const record = resultEvent.results?.[0];
      if (!record?.transcript) return;
      const text = record.transcript;
      console.log('[voice]', resultEvent.isFinal ? '[final]' : '[live]', JSON.stringify(text));
      setTranscript(text);
      if (!resultEvent.isFinal) return;

      if (handledRef.current) return;
      const keywords = Array.from(
        new Set([...GAME_KEYWORDS[languageRef.current], ...GAME_KEYWORDS.en]),
      );
      const lower = text.toLowerCase();
      const isCommand = keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
      if (isCommand) {
        console.log('[voice] start-game command detected ->', JSON.stringify(text));
        handledRef.current = true;
        mutedRef.current = true;
        stopRecognition();
        setTranscript('');
        onGameCommandRef.current();
        return;
      }

      if (!mutedRef.current) {
        respond(tRef.current('voiceInputFallback'));
      }
    },
    [respond, stopRecognition],
  );

  const handleError = useCallback(
    (event: unknown) => {
      const errorEvent = event as ErrorEvent;
      const code = errorEvent.error ?? errorEvent.message ?? 'unknown';
      console.warn('[voice] error', code, JSON.stringify(errorEvent));
      failuresRef.current += 1;

      if (code === 'language-not-supported') {
        const fallbacks = STT_LANG_FALLBACKS[languageRef.current] ?? [];
        if (langIndexRef.current < fallbacks.length - 1) {
          langIndexRef.current += 1;
          showHint(`Recognition retrying in ${fallbacks[langIndexRef.current]}…`);
          restartRecognition();
          return;
        }
      }

      if (STICKY_ERRORS.has(code) || failuresRef.current >= MAX_CONSECUTIVE_ERRORS) {
        heldRef.current = true;
        if (code !== 'not-allowed') {
          showHint('Voice input is unavailable on this device right now.');
        }
        return;
      }

      if (code === 'network') {
        showHint('No network for voice input.');
      }
    },
    [restartRecognition, showHint],
  );

  useEffect(() => {
    let active = true;
    const subscriptions: { remove: () => void }[] = [];

    const onStart = () => {
      console.log('[voice] listening started');
      failuresRef.current = 0;
      heldRef.current = false;
      if (active) setListening(true);
    };
    const onEnd = () => {
      console.log('[voice] listening ended/restarting');
      if (!active) return;
      setListening(false);
      startedRef.current = false;
      if (shouldListenRef.current && !mutedRef.current && !userOff && !heldRef.current) {
        restartRecognition();
      }
    };

    const load = async () => {
      let speechModule: SpeechModule | null = null;
      if (Platform.OS === 'web') {
        // On web the package registers its web module under
        // "ExpoSpeechRecognitionModule", so importing is what makes it exist.
        try {
          const imported = (await import('expo-speech-recognition')) as {
            ExpoSpeechRecognitionModule?: SpeechModule;
          };
          speechModule = imported.ExpoSpeechRecognitionModule ?? null;
        } catch {
          speechModule = null;
        }
      } else {
        // Look the native module up without throwing: this is null in Expo Go
        // or any build made before the package/plugin were added, so we can
        // fail quietly instead of surfacing "Cannot find native module".
        speechModule = requireOptionalNativeModule('ExpoSpeechRecognition') as
          | SpeechModule
          | null;
      }
      if (!active) return;
      if (!speechModule) {
        console.warn(
          '[voice] speech-recognition module is not installed in this build. Rebuild with `npx expo run:android` (or an EAS development build); Expo Go does not include it.',
        );
        setAvailable(false);
        return;
      }
      modRef.current = speechModule;
      const supported =
        typeof speechModule.isRecognitionAvailable === 'function' &&
        speechModule.isRecognitionAvailable();
      setAvailable(supported);
      if (!supported) {
        console.warn(
          '[voice] speech recognition is not available in this build/device',
        );
        return;
      }

      if (Platform.OS === 'android') {
        try {
          console.log(
            '[voice] android speech services:',
            speechModule.getSpeechRecognitionServices?.() ?? [],
          );
          console.log(
            '[voice] android default recognition service:',
            speechModule.getDefaultRecognitionService?.().packageName ?? 'none',
          );
        } catch {}
      }

      subscriptions.push(speechModule.addListener('start', onStart));
      subscriptions.push(speechModule.addListener('end', onEnd));
      subscriptions.push(speechModule.addListener('result', handleResult));
      subscriptions.push(speechModule.addListener('error', handleError));
    };

    load();
    return () => {
      active = false;
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [handleError, handleResult, restartRecognition, userOff]);

  useEffect(() => {
    const desired =
      screenFocused &&
      available === true &&
      modRef.current != null &&
      !paused &&
      !responding &&
      !userOff &&
      !handledRef.current &&
      !heldRef.current;
    shouldListenRef.current = desired;
    if (!desired) {
      mutedRef.current = true;
      stopRecognition();
      return;
    }
    mutedRef.current = false;
    if (!startedRef.current) {
      startRecognition(false);
    }
  }, [screenFocused, available, paused, responding, userOff, startRecognition, stopRecognition]);

  useEffect(
    () => () => {
      try {
        modRef.current?.stop();
      } catch {}
    },
    [],
  );

  const toggleListening = () => {
    if (listening || shouldListenRef.current) {
      setUserOff(true);
      mutedRef.current = true;
      stopRecognition();
      setListening(false);
    } else {
      failuresRef.current = 0;
      heldRef.current = false;
      langIndexRef.current = 0;
      setUserOff(false);
    }
  };

  if (available !== true) return null;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggleListening}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ busy: listening, selected: listening }}
        style={({ pressed }) => [
          styles.mic,
          {
            backgroundColor: listening ? colors.secondary : colors['surface.warm'],
            borderColor: focused || pressed ? colors['primary.dark'] : colors.border,
            borderWidth: focused ? 3 : 1,
          },
        ]}>
        <AppIcon
          name="microphone"
          color={listening ? colors.onSecondary : colors['text.primary']}
          size={24}
        />
      </Pressable>

      {transcript ? (
        <AppText variant="body" color="secondary" fill numberOfLines={2} style={styles.caption}>
          {transcript}
        </AppText>
      ) : hint ? (
        <AppText variant="body" color="muted" fill numberOfLines={2} style={styles.caption}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: spacing.md,
  },
  mic: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    textAlign: 'center',
  },
});