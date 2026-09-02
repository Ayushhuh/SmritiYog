import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  REMEMBER_ROUNDS,
  TOTAL_ROUNDS,
  type RememberRound,
} from './rounds';
import {
  GAME_STATES,
  levelRules,
  type Level,
  type ObjectId,
  type RememberState,
} from './types';

function createGameId(): string {
  return `remember-the-object-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function createSessionId(): string {
  return `session-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function getRound(level: Level, roundIndex: number): RememberRound {
  return REMEMBER_ROUNDS[level][roundIndex];
}

function freshState(
  level: Level,
  roundIndex = 0,
  gameId?: string,
  sessionId?: string,
): RememberState {
  const round = getRound(level, roundIndex);

  return {
    level,
    gameState: GAME_STATES.INTRO,

    roundIndex,
    totalRounds: TOTAL_ROUNDS,

    targetObjects:
      round.targetObjectIdsInOrder ?? round.targetObjectIds,

    recallOptions: [...round.optionIds],

    currentObjectIndex: 0,

    selectedObjectIds: [],
    selectedOrder: [],

    correctCount: 0,
    score: 0,

    speechTranscript: '',

    storyText: '',
    hintText: '',

    gameId,
    sessionId,

    /*
     * patientId and caregiverId are intentionally not invented here.
     * They will be supplied by the existing session/patient context.
     */
    patientId: undefined,
    caregiverId: undefined,
  };
}

export function useRememberObjectGame(level: Level = 'easy') {
  const [state, setState] = useState<RememberState>(() =>
    freshState(level),
  );

  const [delayRemainingMs, setDelayRemainingMs] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  const rules = useMemo(
    () => levelRules(state.level),
    [state.level],
  );

  const currentRound = REMEMBER_ROUNDS[state.level][state.roundIndex];

  /*
   * Create stable identifiers for this game attempt.
   */
  useEffect(() => {
    setState((previous) => {
      if (previous.gameId && previous.sessionId) {
        return previous;
      }

      return {
        ...previous,
        gameId: createGameId(),
        sessionId: createSessionId(),
      };
    });
  }, []);

  /*
   * Medium/Hard delay countdown.
   *
   * The delay is an actual game state and exposes the remaining time
   * to the UI. A light tap task can call tapDistractor() during it.
   */
  useEffect(() => {
    if (state.gameState !== GAME_STATES.DELAY) {
      setDelayRemainingMs(0);
      return;
    }

    const delay = rules.delayTime;

    setDelayRemainingMs(delay);

    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(delay - elapsed, 0);

      setDelayRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);

        setState((previous) => {
          if (previous.gameState !== GAME_STATES.DELAY) {
            return previous;
          }

          return {
            ...previous,
            gameState: GAME_STATES.RECALL,
          };
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.gameState, state.roundIndex, rules.delayTime]);

  /*
   * Start the current round.
   */
  const begin = useCallback(() => {
    setState((previous) => {
      const next = freshState(
        previous.level,
        previous.roundIndex,
        previous.gameId ?? createGameId(),
        previous.sessionId ?? createSessionId(),
      );

      const round = getRound(
        previous.level,
        previous.roundIndex,
      );

      const isEasy = previous.level === 'easy';

      return {
        ...next,

        gameState: isEasy
          ? GAME_STATES.MEMORIZING
          : GAME_STATES.STORY,

        targetObjects:
          round.targetObjectIdsInOrder ??
          round.targetObjectIds,

        recallOptions: [...round.optionIds],

        storyText:
          previous.level === 'easy'
            ? ''
            : round.story?.en ?? '',
        
        hintText:
          previous.level === 'hard'
            ? round.hint?.en ?? ''
            : '',
      };
    });

    setTapCount(0);
    setDelayRemainingMs(0);
  }, []);

  /*
   * Easy mode:
   *
   * The screen displays the 3 target images together for 5 seconds.
   * The UI calls this when the flash period has finished.
   */
  const finishMemorization = useCallback(() => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.MEMORIZING) {
        return previous;
      }

      return {
        ...previous,
        gameState: GAME_STATES.RECALL,
      };
    });
  }, []);

  /*
   * Compatibility with the previous screen.
   *
   * The old UI advanced one object at a time. We now treat that
   * callback as the end of the complete 3-image flash stage.
   */
  const advanceMemorization = useCallback(() => {
    finishMemorization();
  }, [finishMemorization]);

  /*
   * Medium/Hard:
   * story has been shown/spoken; start the required delay.
   */
  const startDelay = useCallback(() => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.STORY) {
        return previous;
      }

      return {
        ...previous,
        gameState: GAME_STATES.DELAY,
      };
    });

    setTapCount(0);
  }, []);

  /*
   * Light distractor task during the delay.
   *
   * The actual UI can render a simple tap button and call this.
   */
  const tapDistractor = useCallback(() => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.DELAY) {
        return previous;
      }

      return previous;
    });

    setTapCount((count) => count + 1);
  }, []);

  /*
   * Select an object.
   *
   * Easy/Medium:
   * order does not matter.
   *
   * Hard:
   * selectedOrder preserves the exact selection sequence.
   */
  const toggleObject = useCallback((id: ObjectId) => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.RECALL) {
        return previous;
      }

      const maxObjects = levelRules(previous.level).objectCount;

      if (previous.level === 'hard') {
        if (previous.selectedOrder.includes(id)) {
          return {
            ...previous,
            selectedObjectIds:
              previous.selectedObjectIds.filter(
                (objectId) => objectId !== id,
              ),
            selectedOrder:
              previous.selectedOrder.filter(
                (objectId) => objectId !== id,
              ),
          };
        }

        if (previous.selectedOrder.length >= maxObjects) {
          return previous;
        }

        return {
          ...previous,
          selectedObjectIds: [
            ...previous.selectedObjectIds,
            id,
          ],
          selectedOrder: [
            ...previous.selectedOrder,
            id,
          ],
        };
      }

      if (previous.selectedObjectIds.includes(id)) {
        return {
          ...previous,
          selectedObjectIds:
            previous.selectedObjectIds.filter(
              (objectId) => objectId !== id,
            ),
        };
      }

      if (previous.selectedObjectIds.length >= maxObjects) {
        return previous;
      }

      return {
        ...previous,
        selectedObjectIds: [
          ...previous.selectedObjectIds,
          id,
        ],
      };
    });
  }, []);

  /*
   * Accept speech-to-text output as a plain string.
   *
   * The speech recognizer itself does not need to know game rules.
   */
  const setSpeechTranscript = useCallback(
    (transcript: string) => {
      setState((previous) => ({
        ...previous,
        speechTranscript: transcript,
      }));
    },
    [],
  );

  /*
   * Convert a speech transcript into object selections.
   *
   * Matching is deliberately simple and string-based.
   */
  const applySpeechTranscript = useCallback(
    (transcript: string) => {
      const normalized = transcript.toLowerCase();

      const matches = state.recallOptions.filter((id) => {
        const name =
          id === 'apple'
            ? 'apple'
            : id === 'key'
              ? 'key'
              : id === 'pillow'
                ? 'pillow'
                : id === 'door'
                  ? 'door'
                  : id === 'cup'
                    ? 'cup'
                    : id === 'book'
                      ? 'book'
                      : id === 'chair'
                        ? 'chair'
                        : id === 'spoon'
                          ? 'spoon'
                          : id === 'clock'
                            ? 'clock'
                            : 'tree';

        return normalized.includes(name);
      });

      setSpeechTranscript(transcript);

      setState((previous) => {
        const limitedMatches = matches.slice(
          0,
          levelRules(previous.level).objectCount,
        );

        return {
          ...previous,
          selectedObjectIds: limitedMatches,
          selectedOrder:
            previous.level === 'hard'
              ? limitedMatches
              : [],
        };
      });
    },
    [state.recallOptions, setSpeechTranscript],
  );

  /*
   * Score the patient's answer.
   */
  const check = useCallback(() => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.RECALL) {
        return previous;
      }

      const targets =
        previous.targetObjects;

      let correctCount = 0;
      let score = 0;

      if (previous.level === 'hard') {
        /*
         * Hard mode:
         * position matters.
         */
        const orderedTargets =
          previous.targetObjects;

        correctCount =
          previous.selectedOrder.filter(
            (id, index) =>
              id === orderedTargets[index],
          ).length;

        score = correctCount;
      } else {
        /*
         * Easy/Medium:
         * order does not matter.
         */
        const targetSet = new Set(targets);

        correctCount =
          previous.selectedObjectIds.filter((id) =>
            targetSet.has(id),
          ).length;

        score = correctCount;
      }

      return {
        ...previous,
        correctCount,
        score,
        gameState: GAME_STATES.FEEDBACK,
      };
    });
  }, []);

  /*
   * Move to the next round.
   */
  const finish = useCallback(() => {
    setState((previous) => {
      if (previous.gameState !== GAME_STATES.FEEDBACK) {
        return previous;
      }

      const nextRoundIndex =
        previous.roundIndex + 1;

      if (nextRoundIndex >= TOTAL_ROUNDS) {
        return {
          ...previous,
          gameState: GAME_STATES.COMPLETE,
        };
      }

      const round = getRound(
        previous.level,
        nextRoundIndex,
      );

      const nextState = freshState(
        previous.level,
        nextRoundIndex,
        previous.gameId,
        previous.sessionId,
      );

      return {
        ...nextState,

        gameState: GAME_STATES.INTRO,

        targetObjects:
          round.targetObjectIdsInOrder ??
          round.targetObjectIds,

        recallOptions: [...round.optionIds],

        storyText: '',
        hintText: '',

        /*
         * Keep cumulative game score.
         */
        score: previous.score,
      };
    });

    setTapCount(0);
    setDelayRemainingMs(0);
  }, []);

  /*
   * Restart the complete game.
   */
  const restart = useCallback(() => {
    const gameId = createGameId();
    const sessionId = createSessionId();

    setState({
      ...freshState(
        level,
        0,
        gameId,
        sessionId,
      ),
    });

    setTapCount(0);
    setDelayRemainingMs(0);
  }, [level]);

  /*
   * Hard mode has one hint per round.
   *
   * The screen will call this when the patient requests it.
   */
  const useHint = useCallback(() => {
    if (state.level !== 'hard') {
      return;
    }

    if (!currentRound?.hint) {
      return;
    }

    setState((previous) => ({
      ...previous,
      hintText:
        previous.hintText ||
        currentRound.hint?.en ||
        '',
    }));
  }, [currentRound, state.level]);

  const clearHint = useCallback(() => {
    setState((previous) => ({
      ...previous,
      hintText: '',
    }));
  }, []);


    const setLevel = useCallback((nextLevel: Level) => {
      setState((previous) => {
        if (previous.gameState !== GAME_STATES.INTRO) {
          return previous;
        }

        return freshState(
          nextLevel,
          0,
          previous.gameId,
          previous.sessionId,
        );
      });

      setTapCount(0);
      setDelayRemainingMs(0);
    }, []);
  
  return {
    state,
    rules,

    currentRound,

    roundNumber: state.roundIndex + 1,
    totalRounds: state.totalRounds,

    delayRemainingMs,
    delayRemainingSeconds: Math.ceil(
      delayRemainingMs / 1000,
    ),

    tapCount,

    begin,
    setLevel,
    /*
     * Easy.
     */
    advanceMemorization,
    finishMemorization,

    /*
     * Medium/Hard.
     */
    startDelay,
    tapDistractor,

    /*
     * Recall.
     */
    toggleObject,

    /*
     * Speech-to-text.
     */
    setSpeechTranscript,
    applySpeechTranscript,

    /*
     * Hard mode.
     */
    useHint,
    clearHint,

    /*
     * Scoring / progression.
     */
    check,
    finish,
    restart,
  };
}
