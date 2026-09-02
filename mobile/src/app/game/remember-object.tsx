import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { ConfirmationDialog } from '@/components/game/ConfirmationDialog';
import { ExitButton } from '@/components/game/ExitButton';
import { GameButton } from '@/components/game/GameButton';
import { GameCompletion } from '@/components/game/GameCompletion';
import { GameInstruction } from '@/components/game/GameInstruction';
import { GameScreen } from '@/components/game/GameScreen';
import { MemorizationStage } from '@/components/game/MemorizationStage';
import { RecallGrid } from '@/components/game/RecallGrid';
import { OBJECTS, objectName } from '@/games/remember-object/library';
import { GAME_STATES, type ObjectId } from '@/games/remember-object/types';
import { useRememberObjectGame } from '@/games/remember-object/use-remember-object-game';
import { useLanguage } from '@/i18n/language-context';
import { speakText, stopSpeaking } from '@/i18n/speech';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => String(values[key] ?? ''),
  );
}

export default function RememberObjectScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { colors } = useTheme();

  const {
    state,
    rules,
    currentRound,
    roundNumber,
    totalRounds,
    delayRemainingSeconds,
    begin,
    finishMemorization,
    startDelay,
    tapDistractor,
    toggleObject,
    useHint,
    check,
    finish,
  } = useRememberObjectGame('easy');

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [hint, setHint] = useState('');
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const memorizationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const feedbackSpokenRef = useRef(false);
  const completeSpokenRef = useRef(false);

  /*
   * EASY:
   * Show all three objects together for exactly the configured
   * memorization period.
   */
  useEffect(() => {
    if (state.gameState !== GAME_STATES.MEMORIZING) return;

    if (memorizationTimerRef.current) {
      clearTimeout(memorizationTimerRef.current);
    }

    memorizationTimerRef.current = setTimeout(() => {
      finishMemorization();
    }, rules.displayTime);

    return () => {
      if (memorizationTimerRef.current) {
        clearTimeout(memorizationTimerRef.current);
        memorizationTimerRef.current = null;
      }
    };
  }, [state.gameState, rules.displayTime, finishMemorization]);

  /*
   * Speak the story when Medium/Hard begins.
   */
  useEffect(() => {
    if (state.gameState !== GAME_STATES.STORY) return;

    const story = currentRound?.story?.[language] ?? currentRound?.story?.en;

    if (!story) return;

    speakText(story, language, {
      rate: 0.82,
    });

    return () => {
      stopSpeaking();
    };
  }, [state.gameState, currentRound, language]);

  /*
   * Feedback speech.
   */
  useEffect(() => {
    if (state.gameState !== GAME_STATES.FEEDBACK) {
      feedbackSpokenRef.current = false;
      return;
    }

    if (feedbackSpokenRef.current) return;
    feedbackSpokenRef.current = true;

    const total = state.targetObjects.length;

    if (state.correctCount === total) {
      speakText(t('game.goodJob'), language, {
        rate: 0.85,
      });
    } else {
      speakText(
        `${t('game.goodTry')} ${fill(t('game.remembered'), {
          n: state.correctCount,
          count: total,
        })}`,
        language,
        {
          rate: 0.85,
        },
      );
    }
  }, [
    state.gameState,
    state.correctCount,
    state.targetObjects,
    t,
    language,
  ]);

  /*
   * Completion speech.
   */
  useEffect(() => {
    if (state.gameState !== GAME_STATES.COMPLETE) {
      completeSpokenRef.current = false;
      return;
    }

    if (completeSpokenRef.current) return;
    completeSpokenRef.current = true;

    speakText(
      `${t('game.done')} ${fill(t('game.remembered'), {
        n: state.correctCount,
        count: state.targetObjects.length,
      })}`,
      language,
      {
        rate: 0.85,
      },
    );
  }, [
    state.gameState,
    state.correctCount,
    state.targetObjects,
    t,
    language,
  ]);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }

      if (memorizationTimerRef.current) {
        clearTimeout(memorizationTimerRef.current);
      }

      stopSpeaking();
    };
  }, []);

  const handleSelect = useCallback(
    (id: ObjectId) => {
      if (state.gameState !== GAME_STATES.RECALL) return;

      const alreadySelected = state.selectedObjectIds.includes(id);

      if (
        !alreadySelected &&
        state.selectedObjectIds.length >= rules.objectCount
      ) {
        setHint(
          `You can select ${rules.objectCount} objects.`,
        );

        if (hintTimerRef.current) {
          clearTimeout(hintTimerRef.current);
        }

        hintTimerRef.current = setTimeout(() => {
          setHint('');
        }, 2600);

        return;
      }

      toggleObject(id);
    },
    [
      state.gameState,
      state.selectedObjectIds,
      rules.objectCount,
      toggleObject,
    ],
  );

  const handleStoryContinue = useCallback(() => {
    stopSpeaking();
    startDelay();
  }, [startDelay]);

  const handleHint = useCallback(() => {
    useHint();

    const localizedHint =
      currentRound?.hint?.[language] ??
      currentRound?.hint?.en ??
      '';

    setHint(localizedHint);
  }, [useHint, currentRound, language]);

  const hasProgress =
    state.gameState !== GAME_STATES.INTRO;

  const goHome = useCallback(() => {
    stopSpeaking();
    router.back();
  }, [router]);

  const requestExit = useCallback(() => {
    stopSpeaking();

    if (hasProgress) {
      setConfirmVisible(true);
    } else {
      goHome();
    }
  }, [hasProgress, goHome]);

  const confirmExit = useCallback(() => {
    setConfirmVisible(false);
    stopSpeaking();
    goHome();
  }, [goHome]);

  const keepPlaying = useCallback(() => {
    setConfirmVisible(false);

    if (state.gameState === GAME_STATES.STORY) {
      const story =
        currentRound?.story?.[language] ??
        currentRound?.story?.en ??
        '';

      if (story) {
        speakText(story, language, {
          rate: 0.82,
        });
      }
    }
  }, [
    state.gameState,
    currentRound,
    language,
  ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        stopSpeaking();

        if (hasProgress) {
          setConfirmVisible(true);
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [hasProgress]);

  const totalObjects = state.targetObjects.length;
  const selectedCount = state.selectedObjectIds.length;

  const perfect =
    state.correctCount === totalObjects;

  let content: ReactNode;

  /*
   * INTRO
   */
  if (state.gameState === GAME_STATES.INTRO) {
    content = (
      <View style={styles.center}>
        <AppText
          variant="captionMedium"
          color="muted"
          style={styles.roundLabel}>
          Round {roundNumber} / {totalRounds}
        </AppText>

        <GameInstruction
          text={t('game.rememberObjects')}
          language={language}
          repeatLabel={t('speak')}
        />

        <GameButton
          label={t('game.start')}
          onPress={begin}
        />
      </View>
    );
  }

  /*
   * EASY MEMORIZATION
   * Three images are displayed simultaneously.
   */
  else if (
    state.gameState === GAME_STATES.MEMORIZING
  ) {
    const objects = state.targetObjects
      .map((id) => OBJECTS[id])
      .filter(Boolean);

    content = (
      <View style={styles.center}>
        <AppText
          variant="captionMedium"
          color="muted"
          style={styles.roundLabel}>
          Round {roundNumber} / {totalRounds}
        </AppText>

        <MemorizationStage
          objects={objects}
          rememberLabel={t('game.rememberObjects')}
          numberLabel="Remember these 3 objects"
        />
      </View>
    );
  }

  /*
   * MEDIUM / HARD STORY
   */
  else if (state.gameState === GAME_STATES.STORY) {
    const story =
      currentRound?.story?.[language] ??
      currentRound?.story?.en ??
      '';

    content = (
      <View style={styles.center}>
        <AppText
          variant="captionMedium"
          color="muted"
          style={styles.roundLabel}>
          Round {roundNumber} / {totalRounds}
        </AppText>

        <GameInstruction
          text={story}
          language={language}
          repeatLabel={t('speak')}
        />

        <GameButton
          label="Continue"
          onPress={handleStoryContinue}
        />
      </View>
    );
  }

  /*
   * DELAY / LIGHT TAP ACTIVITY
   */
  else if (state.gameState === GAME_STATES.DELAY) {
    content = (
      <View style={styles.center}>
        <AppText
          variant="h2"
          color="secondary"
          style={styles.title}>
          Remember the story
        </AppText>

        <AppText
          variant="bodyLarge"
          color="primary"
          style={styles.timer}>
          {delayRemainingSeconds}s
        </AppText>

        <AppText
          variant="body"
          color="muted"
          style={styles.description}>
          Tap the button while you wait.
        </AppText>

        <GameButton
          label="Tap"
          onPress={tapDistractor}
        />

        <AppText
          variant="captionMedium"
          color="muted">
          Taps: {state.selectedObjectIds.length * 0 + 0}
        </AppText>
      </View>
    );
  }

  /*
   * RECALL
   */
  else if (state.gameState === GAME_STATES.RECALL) {
    const ordered =
      state.level === 'hard';

    content = (
      <View style={styles.recall}>
        <AppText
          variant="captionMedium"
          color="muted"
          style={styles.roundLabel}>
          Round {roundNumber} / {totalRounds}
        </AppText>

        <GameInstruction
          text={
            ordered
              ? 'Select the objects in the same order as the story.'
              : 'Select the objects you remember from the story.'
          }
          language={language}
          repeatLabel={t('speak')}
        />

        {ordered && !hint ? (
          <GameButton
            label="Hint"
            onPress={handleHint}
          />
        ) : null}

        {hint ? (
          <AppText
            variant="body"
            color="primary"
            style={styles.hint}
            accessibilityLiveRegion="polite">
            {hint}
          </AppText>
        ) : null}

        <RecallGrid
          options={state.recallOptions}
          selectedIds={state.selectedObjectIds}
          selectedOrder={state.selectedOrder}
          ordered={state.level === 'hard'}
          nameOf={(id) => objectName(id, language)}
          onSelect={handleSelect}
        />

        <View style={styles.footer}>
          <AppText
            variant="captionMedium"
            color="muted">
            {selectedCount} / {rules.objectCount}
          </AppText>

          <GameButton
            label={t('game.check')}
            onPress={check}
            disabled={
              selectedCount !== rules.objectCount
            }
          />
        </View>
      </View>
    );
  }

  /*
   * FEEDBACK
   */
  else if (state.gameState === GAME_STATES.FEEDBACK) {
    content = (
      <View style={styles.center}>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: perfect
                ? colors.secondary
                : colors['surface.warm'],
            },
          ]}>
          <AppIcon
            name={perfect ? 'check' : 'smile'}
            color={
              perfect
                ? colors.onSecondary
                : colors['text.primary']
            }
            size={44}
          />
        </View>

        <AppText
          variant="h1"
          color="primary"
          style={styles.title}>
          {perfect
            ? t('game.goodJob')
            : t('game.goodTry')}
        </AppText>

        <AppText
          variant="bodyLarge"
          color="secondary"
          style={styles.title}>
          {fill(t('game.remembered'), {
            n: state.correctCount,
            count: totalObjects,
          })}
        </AppText>

        <View style={styles.actions}>
          <GameButton
            label={
              roundNumber < totalRounds
                ? t('game.continue')
                : t('game.done')
            }
            onPress={finish}
          />
        </View>
      </View>
    );
  }

  /*
   * COMPLETE
   */
  else {
    content = (
      <GameCompletion
        doneTitle={t('game.done')}
        doneLine={fill(t('game.remembered'), {
          n: state.correctCount,
          count: totalObjects,
        })}
        playAgainLabel={t('game.continue')}
        exitLabel={t('game.exit')}
        onPlayAgain={goHome}
        onExit={goHome}
      />
    );
  }

  return (
    <GameScreen>
      <ExitButton
        label={t('game.exit')}
        onPress={requestExit}
      />

      {content}

      <ConfirmationDialog
        visible={confirmVisible}
        title={t('game.exitGame')}
        message={t('game.exitConfirm')}
        confirmLabel={t('game.exit')}
        cancelLabel={t('game.keepPlaying')}
        onConfirm={confirmExit}
        onCancel={keepPlaying}
      />
    </GameScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },

  recall: {
    gap: spacing.lg,
  },

  roundLabel: {
    textAlign: 'center',
  },

  title: {
    textAlign: 'center',
  },

  timer: {
    fontSize: 48,
    textAlign: 'center',
  },

  description: {
    textAlign: 'center',
  },

  hint: {
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },

  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actions: {
    alignSelf: 'stretch',
    paddingTop: spacing.lg,
  },
});
