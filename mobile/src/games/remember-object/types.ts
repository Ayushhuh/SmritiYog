export const GAME_STATES = {
  INTRO: 'intro',
  MEMORIZING: 'memorizing',
  RECALL: 'recall',
  FEEDBACK: 'feedback',
  COMPLETE: 'complete',
} as const;

export type GameStateName = (typeof GAME_STATES)[keyof typeof GAME_STATES];

export const LEVEL_CONFIG = {
  easy: {
    objectCount: 4,
    displayTime: 5000,
    optionCount: 10,
  },
  medium: {
    // implement later
  },
  hard: {
    // implement later
  },
} as const;

export type Level = 'easy' | 'medium' | 'hard';

export type LevelRules = {
  objectCount: number;
  displayTime: number;
  optionCount: number;
};

export const OBJECT_IDS = [
  'apple',
  'key',
  'pillow',
  'door',
  'cup',
  'book',
  'chair',
  'spoon',
  'clock',
  'tree',
] as const;

export type ObjectId = (typeof OBJECT_IDS)[number];

export function levelRules(level: Level): LevelRules {
  if (level === 'easy') return LEVEL_CONFIG.easy;
  throw new Error(`Level "${level}" is not implemented yet.`);
}

export type RememberState = {
  level: Level;
  gameState: GameStateName;
  targetObjects: ObjectId[];
  recallOptions: ObjectId[];
  currentObjectIndex: number;
  selectedObjectIds: ObjectId[];
  correctCount: number;
};