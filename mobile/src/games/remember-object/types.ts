export const GAME_STATES = {
  INTRO: 'intro',
  MEMORIZING: 'memorizing',
  STORY: 'story',
  DELAY: 'delay',
  RECALL: 'recall',
  FEEDBACK: 'feedback',
  COMPLETE: 'complete',
} as const;

export type GameStateName =
  (typeof GAME_STATES)[keyof typeof GAME_STATES];

export type Level = 'easy' | 'medium' | 'hard';

export const LEVEL_CONFIG = {
  easy: {
    objectCount: 3,
    displayTime: 5000,
    optionCount: 6,
    delayTime: 0,
    ordered: false,
    hintAvailable: false,
  },

  medium: {
    objectCount: 3,
    displayTime: 0,
    optionCount: 6,
    delayTime: 30000,
    ordered: false,
    hintAvailable: false,
  },

  hard: {
    objectCount: 3,
    displayTime: 0,
    optionCount: 5,
    delayTime: 45000,
    ordered: true,
    hintAvailable: true,
  },
} as const;

export type LevelRules = {
  objectCount: number;
  displayTime: number;
  optionCount: number;
  delayTime: number;
  ordered: boolean;
  hintAvailable: boolean;
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
  return LEVEL_CONFIG[level];
}

export type RememberRound = {
  roundNumber: number;
  roundId: string;

  targetObjectIds: ObjectId[];

  /*
   * Used by Easy/Medium where order does not matter.
   */
  optionIds: ObjectId[];

  /*
   * Used by Hard where order matters.
   */
  targetObjectIdsInOrder?: ObjectId[];

  /*
   * Used by Medium/Hard.
   */
  story?: {
    en: string;
    hi: string;
    as: string;
    mni: string;
    kha: string;
    lus: string;
    brx: string;
  };

  /*
   * Used by Hard.
   */
  hint?: {
    en: string;
    hi: string;
    as: string;
    mni: string;
    kha: string;
    lus: string;
    brx: string;
  };
};

export type RememberState = {
  level: Level;
  gameState: GameStateName;
  hintUsed: boolean;

  roundIndex: number;
  totalRounds: number;

  targetObjects: ObjectId[];
  recallOptions: ObjectId[];

  currentObjectIndex: number;

  selectedObjectIds: ObjectId[];

  /*
   * For Hard mode.
   *
   * The order in which the patient selected the objects
   * is preserved here.
   */
  selectedOrder: ObjectId[];

  correctCount: number;

  /*
   * Hard mode position-based score.
   */
  score: number;

  /*
   * Speech-to-text transcript.
   *
   * The speech system can provide a normal string here.
   */
  speechTranscript: string;

  /*
   * Current story text, when applicable.
   */
  storyText: string;

  /*
   * Current hint text, when applicable.
   */
  hintText: string;

  /*
   * Identifiers used to associate a game attempt
   * with the patient/caregiver session.
   *
   * These are optional here because the existing application
   * may provide them from its session/context layer.
   */
  gameId?: string;
  sessionId?: string;
  patientId?: string;
  caregiverId?: string;
};
