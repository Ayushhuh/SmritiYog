import { useCallback, useEffect, useRef, useState } from 'react';

import { ODD_ONE_ASSETS } from './assets';
import {
  OddOneRoundObject,
  ROUNDS,
  TOTAL_ROUNDS,
  shuffledRoundObjects,
} from './rounds';

export type GameStatus = 'idle' | 'correct' | 'wrong';
export type GamePhase = 'playing' | 'completed';

export type OddOneGameOptions = {
  totalRounds?: number;
  onCorrect?: () => void;
  onWrong?: () => void;
  onDone?: () => void;
  onFatigueOffer?: () => void;
};

const GOOD_DELAY_MS = 900;
const RETRY_DELAY_MS = 2600;

const FATIGUE_RESPONSE_INCREASE_PERCENT = 40;
const FATIGUE_CONSECUTIVE_ROUNDS = 3;

export function useOddOneGame({
  totalRounds = TOTAL_ROUNDS,
  onCorrect,
  onWrong,
  onDone,
  onFatigueOffer,
}: OddOneGameOptions = {}) {
  const safeTotalRounds = Math.min(
    Math.max(totalRounds, 1),
    ROUNDS.length,
  );

  const [phase, setPhase] = useState<GamePhase>('playing');
  const [roundIndex, setRoundIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);

  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);

  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);

  const [fatigueOfferVisible, setFatigueOfferVisible] = useState(false);

  const [currentObjects, setCurrentObjects] = useState<OddOneRoundObject[]>(
    () => shuffledRoundObjects(ROUNDS[0]),
  );

  const roundStartTimeRef = useRef(Date.now());
  const previousResponseTimeRef = useRef<number | null>(null);
  const fatigueConsecutiveCountRef = useRef(0);

  const phaseRef = useRef(phase);
  const roundIndexRef = useRef(roundIndex);
  const statusRef = useRef(status);
  const totalRoundsRef = useRef(safeTotalRounds);

  const onCorrectRef = useRef(onCorrect);
  const onWrongRef = useRef(onWrong);
  const onDoneRef = useRef(onDone);
  const onFatigueOfferRef = useRef(onFatigueOffer);

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
    totalRoundsRef.current = safeTotalRounds;
  }, [safeTotalRounds]);

  useEffect(() => {
    onCorrectRef.current = onCorrect;
    onWrongRef.current = onWrong;
    onDoneRef.current = onDone;
    onFatigueOfferRef.current = onFatigueOffer;
  }, [onCorrect, onWrong, onDone, onFatigueOffer]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  /*
   * Prepare the objects whenever the round changes.
   *
   * The objects are shuffled so the odd object's screen position
   * is not always the same.
   */
  useEffect(() => {
    const round = ROUNDS[roundIndex];

    if (!round) {
      return;
    }

    setCurrentObjects(shuffledRoundObjects(round));
    setChosenIndex(null);
    setStatus('idle');
    setResponseTimeMs(null);

    roundStartTimeRef.current = Date.now();
  }, [roundIndex]);

  const currentRound = ROUNDS[
    Math.min(roundIndex, safeTotalRounds - 1)
  ];

  /*
   * Find the current odd object's position AFTER shuffling.
   */
  const oddIndex = currentObjects.findIndex(
    (object) => object.id === currentRound?.oddOneId,
  );

  const choose = useCallback(
    (index: number) => {
      if (phaseRef.current !== 'playing') {
        return;
      }

      if (statusRef.current !== 'idle') {
        return;
      }

      const round = ROUNDS[roundIndexRef.current];

      if (!round) {
        return;
      }

      const selectedObject = currentObjects[index];

      if (!selectedObject) {
        return;
      }

      const responseTime = Date.now() - roundStartTimeRef.current;

      setChosenIndex(index);
      setResponseTimeMs(responseTime);

      /*
       * IMPORTANT:
       * Correctness is determined by object ID, not by a fixed index.
       */
      const isCorrect = selectedObject.id === round.oddOneId;

      if (isCorrect) {
        setStatus('correct');
        setAnsweredCount((count) => count + 1);
        setScore((currentScore) => currentScore + 10);

        setResponseTimes((times) => [...times, responseTime]);

        /*
         * Basic fatigue detection:
         *
         * If the response time increases by 40% or more compared
         * with the previous round for 3 consecutive rounds,
         * offer a break.
         */
        if (previousResponseTimeRef.current !== null) {
          const increase =
            ((responseTime - previousResponseTimeRef.current) /
              previousResponseTimeRef.current) *
            100;

          if (increase >= FATIGUE_RESPONSE_INCREASE_PERCENT) {
            fatigueConsecutiveCountRef.current += 1;
          } else {
            fatigueConsecutiveCountRef.current = 0;
          }

          if (
            fatigueConsecutiveCountRef.current >=
            FATIGUE_CONSECUTIVE_ROUNDS
          ) {
            setFatigueOfferVisible(true);
            onFatigueOfferRef.current?.();
          }
        }

        previousResponseTimeRef.current = responseTime;

        onCorrectRef.current?.();

        timersRef.current.push(
          setTimeout(() => {
            setStatus('idle');
            setChosenIndex(null);

            if (
              roundIndexRef.current + 1 >=
              totalRoundsRef.current
            ) {
              setPhase('completed');
              onDoneRef.current?.();
            } else {
              setRoundIndex((index) => index + 1);
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
            setResponseTimeMs(null);
          }, RETRY_DELAY_MS),
        );
      }
    },
    [currentObjects],
  );

  const dismissFatigueOffer = useCallback(() => {
    setFatigueOfferVisible(false);
  }, []);

  /*
   * This pauses the game when the user accepts a break.
   * We use the existing GamePhase type and temporarily clear
   * the active round state rather than changing the external
   * phase contract.
   */
  const takeBreak = useCallback(() => {
    clearTimers();
    setFatigueOfferVisible(false);
    setStatus('idle');
    setChosenIndex(null);
  }, [clearTimers]);

  const resumeAfterBreak = useCallback(() => {
    roundStartTimeRef.current = Date.now();
    setStatus('idle');
    setChosenIndex(null);
    setFatigueOfferVisible(false);
  }, []);

  const playAgain = useCallback(() => {
    clearTimers();

    fatigueConsecutiveCountRef.current = 0;
    previousResponseTimeRef.current = null;

    setPhase('playing');
    setRoundIndex(0);
    setChosenIndex(null);
    setStatus('idle');
    setAnsweredCount(0);
    setScore(0);
    setResponseTimeMs(null);
    setResponseTimes([]);
    setFatigueOfferVisible(false);

    setCurrentObjects(shuffledRoundObjects(ROUNDS[0]));

    roundStartTimeRef.current = Date.now();
  }, [clearTimers]);

  const averageResponseTimeMs =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce(
            (total, time) => total + time,
            0,
          ) / responseTimes.length,
        )
      : null;

  /*
   * Keep ODD_ONE_ASSETS referenced here so TypeScript catches
   * missing asset keys during development.
   */
  const currentObjectAssets = currentObjects.map((object) => ({
    ...object,
    source: ODD_ONE_ASSETS[object.imageKey],
  }));

  return {
    phase,
    status,

    chosenIndex,

    /*
     * Position of the odd object after shuffling.
     */
    oddIndex,

    /*
     * Current round information.
     */
    currentRound,
    currentObjects: currentObjectAssets,

    roundNumber: Math.min(
      roundIndex + 1,
      safeTotalRounds,
    ),

    totalRounds: safeTotalRounds,

    /*
     * Progress / scoring.
     */
    answeredCount,
    score,

    /*
     * Timing information.
     */
    responseTimeMs,
    averageResponseTimeMs,

    /*
     * Fatigue information.
     */
    fatigueOfferVisible,
    dismissFatigueOffer,
    takeBreak,
    resumeAfterBreak,

    hasProgress:
      answeredCount > 0 && phase === 'playing',

    choose,
    playAgain,
  };
}
