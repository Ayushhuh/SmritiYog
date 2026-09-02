import { useRouter } from 'expo-router';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BackHandler, StyleSheet, View } from 'react-native';

import { ConfirmationDialog } from '@/components/game/ConfirmationDialog';
import { ExitButton } from '@/components/game/ExitButton';
import { GameCompletion } from '@/components/game/GameCompletion';
import { GameFeedback } from '@/components/game/GameFeedback';
import { GameInstruction } from '@/components/game/GameInstruction';
import { GameScreen } from '@/components/game/GameScreen';
import { ObjectGrid } from '@/components/game/ObjectGrid';
import { ProgressIndicator } from '@/components/game/ProgressIndicator';
// import {
//   NORMAL_PICTOGRAPH,
//   OBJECT_COUNT,
//   ODD_OBJECT_INDEX,
//   ODD_PICTOGRAPH,
// } from '@/games/find-odd-one/assets';
import { useOddOneGame } from '@/games/find-odd-one/use-odd-one-game';
import { useLanguage } from '@/i18n/language-context';
import { speakText, stopSpeaking } from '@/i18n/speech';
import { spacing } from '@/theme/tokens';

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export default function FindOddOneGameScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const speak = useCallback(
    (text: string) => {
      speakText(text, language, { rate: 0.85 });
    },
    [language],
  );

  const game = useOddOneGame({
    onCorrect: () => speak(t('game.goodJob')),
    onWrong: () => speak(t('game.tryAgain')),
  });

  const instruction = `${t('game.findDifferent')} ${t('game.takeYourTime')}`;
  const roundLabel = fill(t('game.round'), { n: game.roundNumber, total: game.totalRounds });

  // const gridOrder = useMemo(() => {
  //   const rest = Array.from({ length: OBJECT_COUNT }, (_, i) => i).filter(
  //     (i) => i !== ODD_OBJECT_INDEX,
  //   );
  //   const order = [...rest];
  //   order.splice(game.oddIndex, 0, ODD_OBJECT_INDEX);
  //   return order;
  // }, [game.oddIndex]);

  // const choices = gridOrder.map((index) => ({
  //   index,
  //   label: fill(t('game.object'), { n: index + 1 }),
  //   icon: index === ODD_OBJECT_INDEX ? ODD_PICTOGRAPH : NORMAL_PICTOGRAPH,
  //   isOdd: index === ODD_OBJECT_INDEX,
  // }));
  const choices = game.currentObjects.map((object, index) => ({
    index,
    label: fill(t('game.object'), { n: index + 1 }),
    source: object.source,
    isOdd: object.id === game.currentRound?.oddOneId,
  }));
  

  const advanceHandledRef = useRef(false);

  useEffect(() => {
    if (game.phase !== 'completed') {
      advanceHandledRef.current = false;
      return;
    }
    if (advanceHandledRef.current) return;
    advanceHandledRef.current = true;

    let cancelled = false;
    let advanced = false;
    let speechDelay: ReturnType<typeof setTimeout> | undefined;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if (cancelled || advanced) return;
      advanced = true;
      if (speechDelay) clearTimeout(speechDelay);
      if (fallback) clearTimeout(fallback);
      router.replace('/game/remember-object');
    };
    const scheduleGo = () => {
      if (cancelled || advanced) return;
      speechDelay = setTimeout(go, 900);
    };

    speakText(`${t('game.done')} ${t('game.nextGame')}`, language, {
      rate: 0.85,
      onDone: scheduleGo,
      onStopped: scheduleGo,
      onError: scheduleGo,
    });
    fallback = setTimeout(go, 12000);

    return () => {
      cancelled = true;
      if (speechDelay) clearTimeout(speechDelay);
      if (fallback) clearTimeout(fallback);
      stopSpeaking();
    };
  }, [game.phase, router, t, language]);

  const requestExit = useCallback(() => {
    stopSpeaking();
    if (game.hasProgress) {
      setConfirmVisible(true);
    } else {
      router.back();
    }
  }, [game.hasProgress, router]);

  const confirmExit = useCallback(() => {
    setConfirmVisible(false);
    router.back();
  }, [router]);

  const keepPlaying = useCallback(() => {
    setConfirmVisible(false);
    speak(instruction);
  }, [speak, instruction]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      stopSpeaking();
      if (game.hasProgress) {
        setConfirmVisible(true);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [game.hasProgress]);

  if (game.phase === 'completed') {
    return (
      <GameScreen>
        <ExitButton label={t('game.exit')} onPress={confirmExit} />
        <GameCompletion
          doneTitle={t('game.done')}
          doneLine={t('game.completionLine')}
          playAgainLabel={t('game.playAgain')}
          exitLabel={t('game.exit')}
          onPlayAgain={game.playAgain}
          onExit={confirmExit}
        />
      </GameScreen>
    );
  }

  return (
    <GameScreen>
      <View style={styles.playArea}>
        <ExitButton label={t('game.exit')} onPress={requestExit} />

        <GameInstruction text={instruction} language={language} repeatLabel={t('speak')} />

        <ProgressIndicator
          roundNumber={game.roundNumber}
          totalRounds={game.totalRounds}
          label={roundLabel}
        />

        <ObjectGrid
          choices={choices}
          status={game.status}
          chosenIndex={game.chosenIndex}
          onChoose={game.choose}
        />

        <GameFeedback
          status={game.status}
          correctLabel={t('game.goodJob')}
          wrongLabel={t('game.tryAgain')}
          idleLabel={t('game.takeYourTime')}
        />
      </View>

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
  playArea: {
    flex: 1,
    gap: spacing.lg,
  },
});
