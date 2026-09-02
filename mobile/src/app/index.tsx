import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ReminderCard } from '@/components/ReminderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StartGameCard } from '@/components/StartGameCard';
import { VoiceGuide } from '@/components/VoiceGuide';
import { VoiceInput } from '@/components/VoiceInput';
import { greetPatient, SPEECH_LANG } from '@/i18n/languages';
import { useLanguage } from '@/i18n/language-context';
import { speakText } from '@/i18n/speech';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

const PATIENT_NAME = 'Ayush';
const COUNTDOWN_TIMEOUT_MS = 6000;

export default function HomeScreen() {
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const router = useRouter();

  const countdownStartedRef = useRef(false);
  const [greetingSpeaking, setGreetingSpeaking] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  const greetingText = greetPatient(PATIENT_NAME, language);

  const todayDate = new Date().toLocaleDateString(SPEECH_LANG[language], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useFocusEffect(
    useCallback(() => {
      countdownStartedRef.current = false;
    }, []),
  );

  const startGameWithCountdown = () => {
    if (countdownStartedRef.current) return;
    countdownStartedRef.current = true;

    setCountdownActive(true);
    setCountdownText(t('game.countdown'));
    let finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      setCountdownActive(false);
      setCountdownText('');
      router.push('/game/find-odd-one');
    };

    speakText(t('game.countdown'), language, {
      rate: 0.9,
      onDone: go,
      onStopped: go,
      onError: go,
    });
    timer = setTimeout(go, COUNTDOWN_TIMEOUT_MS);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ScreenHeader />

        <View style={styles.section}>
          <VoiceGuide
            text={greetingText}
            language={language}
            repeatLabel={t('speak')}
            onSpeechChange={setGreetingSpeaking}
          />
          <AppText variant="body" color="muted" style={styles.date}>
            {todayDate}
          </AppText>
          <VoiceInput
            language={language}
            label={t('voiceInput')}
            paused={greetingSpeaking || countdownActive}
            onGameCommand={startGameWithCountdown}
          />
          {countdownText ? (
            <AppText variant="bodyLarge" color="secondary" style={styles.countdown}>
              {countdownText}
            </AppText>
          ) : null}
        </View>

        <View style={styles.primarySection}>
          <StartGameCard
            title={t('startGame')}
            gameSpeak={t('gameSpeak')}
            speakLabel={t('speak')}
            language={language}
            onStart={startGameWithCountdown}
          />
        </View>

        <View style={styles.reminderSection}>
          <ReminderCard
            title={t('reminderTitle')}
            time={t('reminderTime')}
            reminderSpeak={t('reminderSpeak')}
            speakLabel={t('speak')}
            doneLabel={t('markDone')}
            language={language}
          />
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing['2xl'],
  },
  section: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  date: {
    textAlign: 'center',
  },
  countdown: {
    textAlign: 'center',
  },
  primarySection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  reminderSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
});