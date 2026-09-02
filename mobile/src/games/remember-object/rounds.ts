import type { ObjectId } from './types';

export type RememberStory = {
  en: string;
  hi: string;
  as: string;
  mni: string;
  kha: string;
  lus: string;
  brx: string;
};

export type RememberRound = {
  roundNumber: number;
  roundIdTemplate: string;
  targetObjectIds: ObjectId[];
  optionIds: ObjectId[];
  targetObjectIdsInOrder?: ObjectId[];
  story?: RememberStory;
  hint?: RememberStory;
};

export const TOTAL_ROUNDS = 5;

export const REMEMBER_ROUNDS: Record<
  'easy' | 'medium' | 'hard',
  RememberRound[]
> = {
  easy: [
    {
      roundNumber: 1,
      roundIdTemplate: '{session_id}_easy_r1',
      targetObjectIds: ['apple', 'key', 'cup'],
      optionIds: ['apple', 'key', 'cup', 'book', 'chair', 'clock'],
    },
    {
      roundNumber: 2,
      roundIdTemplate: '{session_id}_easy_r2',
      targetObjectIds: ['spoon', 'door', 'tree'],
      optionIds: ['spoon', 'door', 'tree', 'pillow', 'apple', 'key'],
    },
    {
      roundNumber: 3,
      roundIdTemplate: '{session_id}_easy_r3',
      targetObjectIds: ['book', 'chair', 'cup'],
      optionIds: ['book', 'chair', 'cup', 'clock', 'spoon', 'tree'],
    },
    {
      roundNumber: 4,
      roundIdTemplate: '{session_id}_easy_r4',
      targetObjectIds: ['pillow', 'clock', 'key'],
      optionIds: ['pillow', 'clock', 'key', 'door', 'apple', 'book'],
    },
    {
      roundNumber: 5,
      roundIdTemplate: '{session_id}_easy_r5',
      targetObjectIds: ['door', 'tree', 'spoon'],
      optionIds: ['door', 'tree', 'spoon', 'cup', 'chair', 'pillow'],
    },
  ],

  medium: [
    {
      roundNumber: 1,
      roundIdTemplate: '{session_id}_medium_r1',
      targetObjectIds: ['apple', 'cup', 'book'],
      optionIds: ['apple', 'cup', 'book', 'key', 'chair', 'tree'],
      story: {
        en: 'You went to the market. You bought an apple, a cup, and a book.',
        hi: 'आप बाज़ार गए। आपने एक सेब, एक कप और एक किताब खरीदी।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
    {
      roundNumber: 2,
      roundIdTemplate: '{session_id}_medium_r2',
      targetObjectIds: ['door', 'key', 'chair'],
      optionIds: ['door', 'key', 'chair', 'spoon', 'clock', 'pillow'],
      story: {
        en: 'You came home. You opened the door with your key and sat on your chair.',
        hi: 'आप घर आए। आपने चाबी से दरवाज़ा खोला और अपनी कुर्सी पर बैठ गए।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
    {
      roundNumber: 3,
      roundIdTemplate: '{session_id}_medium_r3',
      targetObjectIds: ['spoon', 'cup', 'clock'],
      optionIds: ['spoon', 'cup', 'clock', 'book', 'tree', 'door'],
      story: {
        en: 'It was tea time. You picked up a spoon, filled a cup, and looked at the clock.',
        hi: 'चाय का समय था। आपने चम्मच उठाई, कप भरा और घड़ी देखी।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
    {
      roundNumber: 4,
      roundIdTemplate: '{session_id}_medium_r4',
      targetObjectIds: ['tree', 'pillow', 'book'],
      optionIds: ['tree', 'pillow', 'book', 'apple', 'key', 'spoon'],
      story: {
        en: 'In the evening, you sat under the tree, kept a pillow beside you, and read a book.',
        hi: 'शाम को, आप पेड़ के नीचे बैठे, अपने पास एक तकिया रखा और किताब पढ़ी।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
    {
      roundNumber: 5,
      roundIdTemplate: '{session_id}_medium_r5',
      targetObjectIds: ['chair', 'door', 'clock'],
      optionIds: ['chair', 'door', 'clock', 'cup', 'pillow', 'tree'],
      story: {
        en: 'Before bed, you moved the chair, closed the door, and set the clock.',
        hi: 'सोने से पहले, आपने कुर्सी हटाई, दरवाज़ा बंद किया और घड़ी सेट की।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
  ],

  hard: [
    {
      roundNumber: 1,
      roundIdTemplate: '{session_id}_hard_r1',
      targetObjectIds: ['key', 'door', 'chair'],
      targetObjectIdsInOrder: ['key', 'door', 'chair'],
      optionIds: ['key', 'door', 'chair', 'book', 'cup'],
      story: {
        en: 'First you picked up the key, then you opened the door, then you sat on the chair.',
        hi: 'पहले आपने चाबी उठाई, फिर दरवाज़ा खोला, फिर कुर्सी पर बैठे।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
      hint: {
        en: 'What did you unlock the door with?',
        hi: 'आपने दरवाज़ा किससे खोला था?',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },

    {
      roundNumber: 2,
      roundIdTemplate: '{session_id}_hard_r2',
      targetObjectIds: ['apple', 'spoon', 'cup'],
      targetObjectIdsInOrder: ['apple', 'spoon', 'cup'],
      optionIds: ['apple', 'spoon', 'cup', 'clock', 'pillow'],
      story: {
        en: 'You washed the apple, then took a spoon, then poured tea into a cup.',
        hi: 'आपने सेब धोया, फिर चम्मच ली, फिर कप में चाय डाली।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
      hint: {
        en: 'What did you clean first?',
        hi: 'आपने सबसे पहले क्या साफ़ किया था?',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },

    {
      roundNumber: 3,
      roundIdTemplate: '{session_id}_hard_r3',
      targetObjectIds: ['book', 'pillow', 'clock'],
      targetObjectIdsInOrder: ['book', 'pillow', 'clock'],
      optionIds: ['book', 'pillow', 'clock', 'tree', 'door'],
      story: {
        en: 'You read a book, then rested your head on a pillow, then checked the clock.',
        hi: 'आपने किताब पढ़ी, फिर तकिए पर सिर रखा, फिर घड़ी देखी।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
      hint: {
        en: 'What did you do before resting?',
        hi: 'आराम करने से पहले आपने क्या किया था?',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },

    {
      roundNumber: 4,
      roundIdTemplate: '{session_id}_hard_r4',
      targetObjectIds: ['tree', 'chair', 'cup'],
      targetObjectIdsInOrder: ['tree', 'chair', 'cup'],
      optionIds: ['tree', 'chair', 'cup', 'key', 'spoon'],
      story: {
        en: 'You walked to the tree, then brought a chair, then set down a cup.',
        hi: 'आप पेड़ के पास गए, फिर कुर्सी लाए, फिर कप रखा।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
      hint: {
        en: 'Where did you walk to first?',
        hi: 'आप सबसे पहले कहाँ गए थे?',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },

    {
      roundNumber: 5,
      roundIdTemplate: '{session_id}_hard_r5',
      targetObjectIds: ['door', 'key', 'clock'],
      targetObjectIdsInOrder: ['door', 'key', 'clock'],
      optionIds: ['door', 'key', 'clock', 'apple', 'book'],
      story: {
        en: 'You closed the door, then locked it with the key, then looked at the clock.',
        hi: 'आपने दरवाज़ा बंद किया, फिर चाबी से ताला लगाया, फिर घड़ी देखी।',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
      hint: {
        en: 'What did you do right after closing the door?',
        hi: 'दरवाज़ा बंद करने के तुरंत बाद आपने क्या किया था?',
        as: '',
        mni: '',
        kha: '',
        lus: '',
        brx: '',
      },
    },
  ],
};
