import { useCallback, useEffect, useRef, useState } from 'react';

import { ODD_OBJECT_INDEX } from './assets';
import { createOddPositions, TOTAL_ROUNDS } from './rounds';

export type GameStatus = 'idle' | 'correct' | 'wrong';
export type GamePhase = 'playing' | 'completed';

type OddOneGameOptions = {
  totalRounds?: number;
  onCorrect?: () => void;
  onWrong?: () => void;
  onDone?: () => void;
};

const GOOD_DELAY_MS = 900;
const RETRY_DELAY_MS = 2600;

export function useOddOneGame({
  totalRounds = TOTAL_ROUNDS,
  onCorrect,
  onWrong,
  onDone,
}: OddOneGameOptions = {}) {
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [roundIndex, setRoundIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [oddPositions, setOddPositions] = useState<number[]>(() =>
    createOddPositions(totalRounds),
  );

  const phaseRef = useRef(phase);
  const roundIndexRef = useRef(roundIndex);
  const statusRef = useRef(status);
  const totalRoundsRef = useRef(totalRounds);
  const onCorrectRef = useRef(onCorrect);
  const onWrongRef = useRef(onWrong);
  const onDoneRef = useRef(onDone);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    roundIndexRef.current = roundIndex;
  }, [roundIndex]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    totalRoundsRef.current = totalRounds;
  }, [totalRounds]);

  useEffect(() => {
    onCorrectRef.current = onCorrect;
    onWrongRef.current = onWrong;
    onDoneRef.current = onDone;
  }, [onCorrect, onWrong, onDone]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const choose = useCallback((index: number) => {
    if (phaseRef.current !== 'playing') return;
    if (statusRef.current !== 'idle') return;

    setChosenIndex(index);

    if (index === ODD_OBJECT_INDEX) {
      setStatus('correct');
      setAnsweredCount((count) => count + 1);
      onCorrectRef.current?.();
      timersRef.current.push(
        setTimeout(() => {
          setStatus('idle');
          setChosenIndex(null);
          if (roundIndexRef.current + 1 >= totalRoundsRef.current) {
            setPhase('completed');
            onDoneRef.current?.();
          } else {
            setRoundIndex((i) => i + 1);
          }
        }, GOOD_DELAY_MS),
      );
    } else {
      setStatus('wrong');
      onWrongRef.current?.();
      timersRef.current.push(
        setTimeout(() => {
          setStatus('idle');
          setChosenIndex(null);
        }, RETRY_DELAY_MS),
      );
    }
  }, []);

  const playAgain = useCallback(() => {
    clearTimers();
    setOddPositions(createOddPositions(totalRoundsRef.current));
    setRoundIndex(0);
    setChosenIndex(null);
    setStatus('idle');
    setAnsweredCount(0);
    setPhase('playing');
  }, [clearTimers]);

  return {
    phase,
    status,
    chosenIndex,
    oddIndex: oddPositions[Math.min(roundIndex, oddPositions.length - 1)],
    roundNumber: Math.min(roundIndex + 1, totalRounds),
    totalRounds,
    hasProgress: answeredCount > 0 && phase === 'playing',
    choose,
    playAgain,
  };
}