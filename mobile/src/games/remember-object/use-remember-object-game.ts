import { useCallback, useMemo, useState } from 'react';

import { createDeal } from './library';
import { GAME_STATES, levelRules, type Level, type ObjectId, type RememberState } from './types';

function freshState(level: Level): RememberState {
  const rules = levelRules(level);
  const deal = createDeal(rules.objectCount, rules.optionCount);
  return {
    level,
    gameState: GAME_STATES.INTRO,
    targetObjects: deal.targets,
    recallOptions: deal.options,
    currentObjectIndex: 0,
    selectedObjectIds: [],
    correctCount: 0,
  };
}

export function useRememberObjectGame(level: Level = 'easy') {
  const [state, setState] = useState<RememberState>(() => freshState(level));

  const rules = useMemo(() => levelRules(state.level), [state.level]);

  const begin = useCallback(() => {
    setState((prev) => ({
      ...freshState(prev.level),
      gameState: GAME_STATES.MEMORIZING,
      currentObjectIndex: 0,
    }));
  }, []);

  const advanceMemorization = useCallback(() => {
    setState((prev) => {
      if (prev.gameState !== GAME_STATES.MEMORIZING) return prev;
      if (prev.currentObjectIndex + 1 >= prev.targetObjects.length) {
        return { ...prev, gameState: GAME_STATES.RECALL, currentObjectIndex: prev.currentObjectIndex + 1 };
      }
      return { ...prev, currentObjectIndex: prev.currentObjectIndex + 1 };
    });
  }, []);

  const toggleObject = useCallback((id: ObjectId) => {
    setState((prev) => {
      if (prev.gameState !== GAME_STATES.RECALL) return prev;
      if (prev.selectedObjectIds.includes(id)) {
        return { ...prev, selectedObjectIds: prev.selectedObjectIds.filter((x) => x !== id) };
      }
      if (prev.selectedObjectIds.length >= levelRules(prev.level).objectCount) return prev;
      return { ...prev, selectedObjectIds: [...prev.selectedObjectIds, id] };
    });
  }, []);

  const check = useCallback(() => {
    setState((prev) => {
      if (prev.gameState !== GAME_STATES.RECALL) return prev;
      const targets = new Set(prev.targetObjects);
      const correctCount = prev.selectedObjectIds.filter((id) => targets.has(id)).length;
      return { ...prev, correctCount, gameState: GAME_STATES.FEEDBACK };
    });
  }, []);

  const finish = useCallback(() => {
    setState((prev) => ({ ...prev, gameState: GAME_STATES.COMPLETE }));
  }, []);

  const restart = useCallback(() => {
    setState((prev) => ({ ...freshState(prev.level) }));
  }, []);

  return {
    state,
    rules,
    begin,
    advanceMemorization,
    toggleObject,
    check,
    finish,
    restart,
  };
}