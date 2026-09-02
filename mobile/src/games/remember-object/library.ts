import type { Language } from '@/i18n/languages';
import { OBJECT_IDS, type ObjectId } from './types';

export type MemoryObject = {
  id: ObjectId;
  icon: string;
  image: number | null;
};

export const OBJECTS: Record<ObjectId, MemoryObject> = {
  apple: { id: 'apple', icon: 'apple-alt', image: null },
  key: { id: 'key', icon: 'key', image: null },
  pillow: { id: 'pillow', icon: 'bed', image: null },
  door: { id: 'door', icon: 'door-open', image: null },
  cup: { id: 'cup', icon: 'mug-hot', image: null },
  book: { id: 'book', icon: 'book', image: null },
  chair: { id: 'chair', icon: 'chair', image: null },
  spoon: { id: 'spoon', icon: 'utensil-spoon', image: null },
  clock: { id: 'clock', icon: 'clock', image: null },
  tree: { id: 'tree', icon: 'tree', image: null },
};

export const OBJECT_NAMES: Record<Language, Record<ObjectId, string>> = {
  en: {
    apple: 'Apple',
    key: 'Key',
    pillow: 'Pillow',
    door: 'Door',
    cup: 'Cup',
    book: 'Book',
    chair: 'Chair',
    spoon: 'Spoon',
    clock: 'Clock',
    tree: 'Tree',
  },
  hi: {
    apple: 'सेब',
    key: 'चाबी',
    pillow: 'तकिया',
    door: 'दरवाज़ा',
    cup: 'कप',
    book: 'किताब',
    chair: 'कुर्सी',
    spoon: 'चम्मच',
    clock: 'घड़ी',
    tree: 'पेड़',
  },
  as: {
    apple: 'আপেল',
    key: 'চাবি',
    pillow: 'বালিছ',
    door: 'দুৱাৰ',
    cup: 'কাপ',
    book: 'কিতাপ',
    chair: 'চকী',
    spoon: 'চামুচ',
    clock: 'ঘড়ী',
    tree: 'গছ',
  },
  mni: {
    apple: 'ꯑ ꯄ ꯂ',
    key: 'ꯊ ꯥ ꯕ ꯤ',
    pillow: 'ꯄ ꯨ ꯊ ꯨ',
    door: 'ꯊ ꯣ ꯡ',
    cup: 'ꯀ ꯞ',
    book: 'ꯂ ꯥ ꯏ ꯔ ꯤ ꯛ',
    chair: 'ꯀ ꯥ ꯔ ꯭ ꯁ',
    spoon: 'ꯆ ꯨ ꯃ ꯨ ꯆ',
    clock: 'ꯄ ꯨ ꯡ',
    tree: 'ꯌ ꯨ ꯝ',
  },
  kha: {
    apple: 'Ka sohphoh',
    key: 'Ka shabi',
    pillow: 'Ka phew',
    door: 'Ka jingkhang',
    cup: 'Ka khur',
    book: 'Ka kot',
    chair: 'Ka sandok',
    spoon: 'Ka samur',
    clock: 'Ka baje',
    tree: 'Ka dieng',
  },
  lus: {
    apple: 'Vandak',
    key: 'Rimchawi',
    pillow: 'Hmuilawm',
    door: 'Kawngkhar',
    cup: 'Bebel',
    book: 'Lehkhabu',
    chair: 'Thutphah',
    spoon: 'Sawh',
    clock: 'Baji',
    tree: 'Thing',
  },
  brx: {
    apple: 'आपेल',
    key: 'साबि',
    pillow: 'बालिस',
    door: 'दुआर',
    cup: 'कप',
    book: 'खान्दाइ',
    chair: 'चेदान',
    spoon: 'चामुच',
    clock: 'घडि',
    tree: 'बिफाङ',
  },
};

export function objectName(id: ObjectId, language: Language): string {
  return OBJECT_NAMES[language][id];
}

export type Deal = {
  targets: ObjectId[];
  options: ObjectId[];
};

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createDeal(objectCount: number, optionCount: number): Deal {
  const order = shuffled(OBJECT_IDS);
  const targets = order.slice(0, objectCount);
  const options = shuffled([...targets, ...order.slice(objectCount, optionCount)]);
  return { targets, options };
}