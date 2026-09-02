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

export type ObjectSource = number | null;

export const OBJECT_SOURCES: ObjectSource[] = [null, null, null, null, null];