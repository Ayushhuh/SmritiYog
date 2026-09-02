import { OBJECT_COUNT } from './assets';

export const TOTAL_ROUNDS = 5;

function shuffledIndexes(count: number): number[] {
  const indexes = Array.from({ length: count }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

export function createOddPositions(total: number = TOTAL_ROUNDS): number[] {
  return shuffledIndexes(OBJECT_COUNT).slice(0, total);
}