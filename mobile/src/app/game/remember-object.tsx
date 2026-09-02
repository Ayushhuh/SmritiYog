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

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export default function RememberObjectScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { colors } = useTheme();
  const { state, rules, begin, advanceMemorization, toggleObject, check, finish } =
    useRememberObjectGame('easy');

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [hint, setHint] = useState('');
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackSpokenRef = useRef(false);
  const completeSpokenRef = useRef(false);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.gameState !== GAME_STATES.MEMORIZING) return;
    const current = state.targetObjects[state.currentObjectIndex];
    if (!current) return;

    let done = false;
    let speechFinished = false;
    let displayFinished = false;
    const maybeAdvance = () => {
      if (!done && speechFinished && displayFinished) {
        done = true;
        advanceMemorization();
      }
    };

    speakText(objectName(current, language), language, {
      rate: 0.85,
      onDone: () => {
        speechFinished = true;
        maybeAdvance();
      },
      onStopped: () => {
        speechFinished = true;
        maybeAdvance();
      },
      onError: () => {
        speechFinished = true;
        maybeAdvance();
      },
    });

    const displayTimer = setTimeout(() => {
      displayFinished = true;
      maybeAdvance();
    }, rules.displayTime);

    return () => {
      done = true;
      clearTimeout(displayTimer);
      stopSpeaking();
    };
  }, [state.gameState, state.currentObjectIndex, state.targetObjects, rules.displayTime, language, advanceMemorization]);

  useEffect(() => {
    if (state.gameState !== GAME_STATES.FEEDBACK) {
      feedbackSpokenRef.current = false;
      return;
    }
    if (feedbackSpokenRef.current) return;
    feedbackSpokenRef.current = true;
    const total = state.targetObjects.length;
    if (state.correctCount === total) {
      speakText(t('game.goodJob'), language, { rate: 0.85 });
    } else {
      speakText(
        `${t('game.goodTry')} ${fill(t('game.remembered'), {
          n: state.correctCount,
          count: total,
        })}`,
        language,
        { rate: 0.85 },
      );
    }
  }, [state.gameState, state.correctCount, state.targetObjects, t, language]);

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
      { rate: 0.85 },
    );
  }, [state.gameState, state.correctCount, state.targetObjects, t, language]);

  const handleSelect = (id: ObjectId) => {
    if (state.gameState !== GAME_STATES.RECALL) return;
    const already = state.selectedObjectIds.includes(id);
    if (!already && state.selectedObjectIds.length >= rules.objectCount) {
      setHint(t('game.maxFour'));
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => setHint(''), 2600);
      return;
    }
    toggleObject(id);
  };

  const hasProgress = state.gameState !== GAME_STATES.INTRO;

  const goHome = useCallback(() => router.back(), [router]);

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
    if (state.gameState === GAME_STATES.MEMORIZING) {
      const current =
        state.targetObjects[state.currentObjectIndex] ?? state.targetObjects[0];
      if (current) speakText(objectName(current, language), language, { rate: 0.85 });
    }
  }, [state.gameState, state.targetObjects, state.currentObjectIndex, language]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      stopSpeaking();
      if (hasProgress) {
        setConfirmVisible(true);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [hasProgress]);

  const totalObjects = state.targetObjects.length;
  const selectedCount = state.selectedObjectIds.length;
  const currentObjectId = state.targetObjects[state.currentObjectIndex];
  const currentObject = currentObjectId ? OBJECTS[currentObjectId] : undefined;
  const perfect = state.correctCount === totalObjects;

  let content: ReactNode;
  if (state.gameState === GAME_STATES.INTRO) {
    content = (
      <View style={styles.center}>
        <GameInstruction
          text={t('game.rememberObjects')}
          language={language}
          repeatLabel={t('speak')}
        />
        <GameButton label={t('game.start')} onPress={begin} />
      </View>
    );
  } else if (state.gameState === GAME_STATES.MEMORIZING && currentObject) {
    content = (
      <MemorizationStage
        object={currentObject}
        name={objectName(currentObjectId, language)}
        currentIndex={state.currentObjectIndex}
        total={totalObjects}
        rememberLabel={t('game.rememberObjects')}
        numberLabel={fill(t('game.objectNumber'), {
          n: state.currentObjectIndex + 1,
          total: totalObjects,
        })}
      />
    );
  } else if (state.gameState === GAME_STATES.RECALL) {
    content = (
      <View style={styles.recall}>
        <GameInstruction
          text={`${t('game.whichObjects')} ${t('game.selectRemembered')}`}
          language={language}
          repeatLabel={t('speak')}
        />
        {hint ? (
          <AppText variant="body" color="primary" style={styles.hint} accessibilityLiveRegion="polite">
            {hint}
          </AppText>
        ) : null}
        <RecallGrid
          options={state.recallOptions}
          selectedIds={state.selectedObjectIds}
          nameOf={(id) => objectName(id, language)}
          onSelect={handleSelect}
        />
        <View style={styles.footer}>
          <AppText variant="captionMedium" color="muted">
            {selectedCount} / {rules.objectCount}
          </AppText>
          <GameButton
            label={t('game.check')}
            onPress={check}
            disabled={selectedCount !== rules.objectCount}
          />
          {selectedCount !== rules.objectCount ? (
            <AppText variant="caption" color="muted" style={styles.hint}>
              {t('game.chooseFour')}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  } else if (state.gameState === GAME_STATES.FEEDBACK) {
    content = (
      <View style={styles.center}>
        <View
          style={[
            styles.circle,
            { backgroundColor: perfect ? colors.secondary : colors['surface.warm'] },
          ]}>
          <AppIcon
            name={perfect ? 'check' : 'smile'}
            color={perfect ? colors.onSecondary : colors['text.primary']}
            size={44}
          />
        </View>
        <AppText variant="h1" color="primary" style={styles.title}>
          {perfect ? t('game.goodJob') : t('game.goodTry')}
        </AppText>
        {!perfect ? (
          <AppText variant="bodyLarge" color="secondary" style={styles.title}>
            {fill(t('game.remembered'), { n: state.correctCount, count: totalObjects })}
          </AppText>
        ) : null}
        <View style={styles.actions}>
          <GameButton label={t('game.continue')} onPress={finish} />
        </View>
      </View>
    );
  } else {
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
      <ExitButton label={t('game.exit')} onPress={requestExit} />
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
  title: {
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    paddingTop: spacing.lg,
  },
});