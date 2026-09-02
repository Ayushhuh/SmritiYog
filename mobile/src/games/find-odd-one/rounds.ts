import type { OddOneImageKey } from './assets';

export type OddOneRoundObject = {
  id: string;
  type: 'apple' | 'orange';
  imageKey: OddOneImageKey;
  color: string;
  shade: string;
  size: 'small' | 'medium' | 'large';
  tiltDeg: number;
  note?: string;
};

export type OddOneRound = {
  roundNumber: number;
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyNote: string;
  prompt: {
    en: string;
    hi: string;
  };
  objects: OddOneRoundObject[];
  oddOneId: string;
};

export const TOTAL_ROUNDS = 5;

export const ROUNDS: OddOneRound[] = [
  {
    roundNumber: 1,
    difficulty: 'easy',
    difficultyNote: 'Easy - color spotting only',
    prompt: {
      en: 'Find the one that is different.',
      hi: 'जो अलग है उसे ढूंढिए।',
    },
    oddOneId: 'r1_o2',
    objects: [
      {
        id: 'r1_o1',
        type: 'apple',
        imageKey: 'apple_red_1',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r1_o2',
        type: 'apple',
        imageKey: 'apple_green_1',
        color: 'green',
        shade: 'bright',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r1_o3',
        type: 'apple',
        imageKey: 'apple_red_2',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: 5,
      },
      {
        id: 'r1_o4',
        type: 'apple',
        imageKey: 'apple_red_3',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: -5,
      },
      {
        id: 'r1_o5',
        type: 'apple',
        imageKey: 'apple_red_4',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: 3,
      },
      {
        id: 'r1_o6',
        type: 'apple',
        imageKey: 'apple_red_5',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: -3,
      },
    ],
  },

  {
    roundNumber: 2,
    difficulty: 'easy',
    difficultyNote: 'Easy - obvious shape difference',
    prompt: {
      en: 'Find the one that is different.',
      hi: 'जो अलग है उसे ढूंढिए।',
    },
    oddOneId: 'r2_o4',
    objects: [
      {
        id: 'r2_o1',
        type: 'orange',
        imageKey: 'orange_1',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r2_o2',
        type: 'orange',
        imageKey: 'orange_2',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 4,
      },
      {
        id: 'r2_o3',
        type: 'orange',
        imageKey: 'orange_3',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: -4,
      },
      {
        id: 'r2_o4',
        type: 'apple',
        imageKey: 'apple_red_6',
        color: 'red',
        shade: 'bright',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r2_o5',
        type: 'orange',
        imageKey: 'orange_4',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 2,
      },
      {
        id: 'r2_o6',
        type: 'orange',
        imageKey: 'orange_5',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: -2,
      },
    ],
  },

  {
    roundNumber: 3,
    difficulty: 'medium',
    difficultyNote:
      'Medium - shade, size and tilt vary within the majority group',
    prompt: {
      en: 'Find the one that is different.',
      hi: 'जो अलग है उसे ढूंढिए।',
    },
    oddOneId: 'r3_o5',
    objects: [
      {
        id: 'r3_o1',
        type: 'apple',
        imageKey: 'apple_red_7',
        color: 'red',
        shade: 'dark',
        size: 'large',
        tiltDeg: 10,
      },
      {
        id: 'r3_o2',
        type: 'apple',
        imageKey: 'apple_red_8',
        color: 'red',
        shade: 'light',
        size: 'small',
        tiltDeg: -8,
      },
      {
        id: 'r3_o3',
        type: 'apple',
        imageKey: 'apple_red_9',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r3_o4',
        type: 'apple',
        imageKey: 'apple_red_10',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 15,
      },
      {
        id: 'r3_o5',
        type: 'orange',
        imageKey: 'orange_6',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r3_o6',
        type: 'apple',
        imageKey: 'apple_red_11',
        color: 'red',
        shade: 'dark',
        size: 'small',
        tiltDeg: -12,
      },
    ],
  },

  {
    roundNumber: 4,
    difficulty: 'hard',
    difficultyNote:
      'Hard - high visual similarity and color-family matching',
    prompt: {
      en: 'Look closely — find the one that is different.',
      hi: 'ध्यान से देखिए — जो अलग है उसे ढूंढिए।',
    },
    oddOneId: 'r4_o8',
    objects: [
      {
        id: 'r4_o1',
        type: 'orange',
        imageKey: 'orange_7',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r4_o2',
        type: 'orange',
        imageKey: 'orange_8_green_tinted',
        color: 'orange-green',
        shade: 'unripe',
        size: 'medium',
        tiltDeg: 3,
      },
      {
        id: 'r4_o3',
        type: 'orange',
        imageKey: 'orange_9',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: -3,
      },
      {
        id: 'r4_o4',
        type: 'orange',
        imageKey: 'orange_10_green_tinted',
        color: 'orange-green',
        shade: 'unripe',
        size: 'medium',
        tiltDeg: 6,
      },
      {
        id: 'r4_o5',
        type: 'orange',
        imageKey: 'orange_11',
        color: 'orange',
        shade: 'dark',
        size: 'large',
        tiltDeg: 0,
      },
      {
        id: 'r4_o6',
        type: 'orange',
        imageKey: 'orange_12',
        color: 'orange',
        shade: 'medium',
        size: 'small',
        tiltDeg: -6,
      },
      {
        id: 'r4_o7',
        type: 'orange',
        imageKey: 'orange_13',
        color: 'orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 2,
      },
      {
        id: 'r4_o8',
        type: 'apple',
        imageKey: 'apple_reddish_orange_1',
        color: 'reddish-orange',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
        note:
          'Apple visually matched to orange color family; intended as the near-miss odd object.',
      },
    ],
  },

  {
    roundNumber: 5,
    difficulty: 'hard',
    difficultyNote:
      'Hard - size and object-category difference within a large same-color grid',
    prompt: {
      en: 'Look closely — find the one that is different.',
      hi: 'ध्यान से देखिए — जो अलग है उसे ढूंढिए।',
    },
    oddOneId: 'r5_o3',
    objects: [
      {
        id: 'r5_o1',
        type: 'apple',
        imageKey: 'apple_red_12',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 0,
      },
      {
        id: 'r5_o2',
        type: 'apple',
        imageKey: 'apple_red_13',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 4,
      },
      {
        id: 'r5_o3',
        type: 'orange',
        imageKey: 'orange_14_small',
        color: 'orange',
        shade: 'medium',
        size: 'small',
        tiltDeg: 0,
        note:
          'Small tangerine-like orange among uniform red apples.',
      },
      {
        id: 'r5_o4',
        type: 'apple',
        imageKey: 'apple_red_14',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: -4,
      },
      {
        id: 'r5_o5',
        type: 'apple',
        imageKey: 'apple_red_15',
        color: 'red',
        shade: 'dark',
        size: 'large',
        tiltDeg: 8,
      },
      {
        id: 'r5_o6',
        type: 'apple',
        imageKey: 'apple_red_16',
        color: 'red',
        shade: 'light',
        size: 'medium',
        tiltDeg: -8,
      },
      {
        id: 'r5_o7',
        type: 'apple',
        imageKey: 'apple_red_17',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: 2,
      },
      {
        id: 'r5_o8',
        type: 'apple',
        imageKey: 'apple_red_18',
        color: 'red',
        shade: 'medium',
        size: 'medium',
        tiltDeg: -2,
      },
    ],
  },
];

/**
 * Returns a shuffled copy of a round's objects.
 *
 * The odd object itself is kept identifiable by its ID, so its
 * screen position can change every time the round is played.
 */
export function shuffledRoundObjects(
  round: OddOneRound,
): OddOneRoundObject[] {
  const objects = [...round.objects];

  for (let i = objects.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [objects[i], objects[j]] = [objects[j], objects[i]];
  }

  return objects;
}
