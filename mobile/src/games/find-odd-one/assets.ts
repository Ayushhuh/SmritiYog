export type ObjectSource = number | null;

export type OddOneObject = {
  id: string;
  type: 'apple' | 'orange';
  imageKey: OddOneImageKey;
  source: ObjectSource;
  color: string;
  shade: string;
  size: 'small' | 'medium' | 'large';
  tiltDeg: number;
};

/*
 * Static image registry.
 *
 * React Native / Expo requires static require() calls for bundled images.
 * Keep every image reference explicit here.
 */
export const ODD_ONE_ASSETS = {
  apple_red_1: require('../../../assets/find-odd-one/apple_red_1.png'),
  apple_green_1: require('../../../assets/find-odd-one/apple_green_1.png'),
  apple_red_2: require('../../../assets/find-odd-one/apple_red_2.png'),
  apple_red_3: require('../../../assets/find-odd-one/apple_red_3.png'),
  apple_red_4: require('../../../assets/find-odd-one/apple_red_4.png'),
  apple_red_5: require('../../../assets/find-odd-one/apple_red_5.png'),
  apple_red_6: require('../../../assets/find-odd-one/apple_red_6.png'),
  apple_red_7: require('../../../assets/find-odd-one/apple_red_7.png'),
  apple_red_8: require('../../../assets/find-odd-one/apple_red_8.png'),
  apple_red_9: require('../../../assets/find-odd-one/apple_red_9.png'),
  apple_red_10: require('../../../assets/find-odd-one/apple_red_10.png'),
  apple_red_11: require('../../../assets/find-odd-one/apple_red_11.png'),
  apple_red_12: require('../../../assets/find-odd-one/apple_red_12.png'),
  apple_red_13: require('../../../assets/find-odd-one/apple_red_13.png'),
  apple_red_14: require('../../../assets/find-odd-one/apple_red_14.png'),
  apple_red_15: require('../../../assets/find-odd-one/apple_red_15.png'),
  apple_red_16: require('../../../assets/find-odd-one/apple_red_16.png'),
  apple_red_17: require('../../../assets/find-odd-one/apple_red_17.png'),
  apple_red_18: require('../../../assets/find-odd-one/apple_red_18.png'),
  apple_reddish_orange_1: require('../../../assets/find-odd-one/apple_reddish_orange_1.png'),

  orange_1: require('../../../assets/find-odd-one/orange_1.png'),
  orange_2: require('../../../assets/find-odd-one/orange_2.png'),
  orange_3: require('../../../assets/find-odd-one/orange_3.png'),
  orange_4: require('../../../assets/find-odd-one/orange_4.png'),
  orange_5: require('../../../assets/find-odd-one/orange_5.png'),
  orange_6: require('../../../assets/find-odd-one/orange_6.png'),
  orange_7: require('../../../assets/find-odd-one/orange_7.png'),
  orange_8_green_tinted: require('../../../assets/find-odd-one/orange_8_green_tinted.png'),
  orange_9: require('../../../assets/find-odd-one/orange_9.png'),
  orange_10_green_tinted: require('../../../assets/find-odd-one/orange_10_green_tinted.png'),
  orange_11: require('../../../assets/find-odd-one/orange_11.png'),
  orange_12: require('../../../assets/find-odd-one/orange_12.png'),
  orange_13: require('../../../assets/find-odd-one/orange_13.png'),
  orange_14_small: require('../../../assets/find-odd-one/orange_14_small.png'),
} as const;

export type OddOneImageKey = keyof typeof ODD_ONE_ASSETS;

/*
 * Legacy exports.
 *
 * These are intentionally kept for now so the existing game code
 * continues to work while we migrate it to the new round configuration.
 */
export const OBJECT_COUNT = 5;

export const ODD_OBJECT_INDEX = 2;

export const OBJECT_NAMES = [
  'image 1.png',
  'image 2.png',
  'image 3.png',
  'image 4.png',
  'image 5.png',
] as const;

export const NORMAL_PICTOGRAPH = 'tree';

export const ODD_PICTOGRAPH = 'star';

export const OBJECT_SOURCES: ObjectSource[] = [
  null,
  null,
  null,
  null,
  null,
];
