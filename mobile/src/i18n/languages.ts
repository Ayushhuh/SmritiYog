export type Language = 'en' | 'hi' | 'as' | 'mni' | 'kha' | 'lus' | 'brx';

export const LANGUAGES: readonly Language[] = ['en', 'hi', 'as', 'mni', 'kha', 'lus', 'brx'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  as: 'অসমীয়া',
  mni: 'ꯃꯤꯇꯩꯂꯣꯟ',
  kha: 'Ka Ktien Khasi',
  lus: 'Mizo ṭawng',
  brx: 'बर',
};

export const LANGUAGE_SHORT: Record<Language, string> = {
  en: 'EN',
  hi: 'HI',
  as: 'AS',
  mni: 'MN',
  kha: 'KH',
  lus: 'MZ',
  brx: 'BR',
};

export const SPEECH_LANG: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  as: 'as-IN',
  mni: 'mni-IN',
  kha: 'kha-IN',
  lus: 'lus-IN',
  brx: 'brx-IN',
};

export function speechLang(language: Language): string {
  return SPEECH_LANG[language];
}

export const DEVANAGARI_SCRIPT: Record<Language, boolean> = {
  en: false,
  hi: true,
  as: false,
  mni: false,
  kha: false,
  lus: false,
  brx: true,
};

export const GAME_KEYWORDS: Record<Language, string[]> = {
  en: ['game', 'play', 'start'],
  hi: ['खेल', 'शुरू'],
  as: ['খেল', 'আৰম্ভ'],
  mni: ['ꯊꯥꯛ'],
  kha: ['iashib', 'sdang'],
  lus: ['khel', 'tan'],
  brx: ['खेल', 'खालाम', 'जागास'],
};

export type DayBand = 'morning' | 'afternoon' | 'evening';

export function dayBand(date: Date): DayBand {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export const GREETING_POOLS: Record<Language, Record<DayBand, string[]>> = {
  en: {
    morning: [
      'Good morning, {name}. A fresh new day with you.',
      'So glad to see you, {name}. Good morning!',
      'Good morning {name}, you make today brighter.',
    ],
    afternoon: [
      'Good afternoon, {name}. Let us spend some time together.',
      'Hello {name}, lovely to see you this afternoon.',
      'Good afternoon {name}. A gentle moment to play.',
    ],
    evening: [
      'Good evening, {name}. You did wonderfully today.',
      'Good evening {name}. Time to relax. Be proud.',
      'Good evening {name}. A calm evening, together.',
    ],
  },
  hi: {
    morning: [
      'सुप्रभात, {name}। आज का दिन हम साथ बिताएँगे।',
      'सुप्रभात {name}, आपको देखकर बहुत खुशी हुई।',
      'सुप्रभात {name}, आपका दिन उज्ज्वल रहे।',
    ],
    afternoon: [
      'दोपहर में नमस्कार {name}, कुछ समय साथ बिताते हैं।',
      'नमस्कार {name}, आपसे मिलकर अच्छा लगा।',
      'दोपहर की नमस्ते {name}, थोड़ा खेलें।',
    ],
    evening: [
      'शुभ संध्या {name}, आज आपने बहुत अच्छा किया।',
      'शुभ संध्या {name}, अब आराम करें और गर्व महसूस करें।',
      'शुभ संध्या {name}, आपके साथ शांत शाम।',
    ],
  },
  as: {
    morning: [
      'সুপ্ৰভাত, {name}। আজি দিনটো আমি একেলগে কটাম।',
      'সুপ্ৰভাত {name}, আপোনাক দেখি ভাল লাগিল।',
    ],
    afternoon: [
      'মধ্যাহ্নত নমস্কাৰ {name}, অলপ সময় একেলগে কটাওঁ।',
      'নমস্কাৰ {name}, অলপ খেলি লওঁ।',
    ],
    evening: [
      'শুভ সন্ধ্যা {name}, আজি আপুনি ভাল কৰিলে।',
      'শুভ সন্ধ্যা {name}, এতিয়া বিশ্ৰাম লওক।',
    ],
  },
  mni: {
    morning: [
      'ꯑꯌꯨꯕ ꯃꯇꯝ, {name}। ꯅꯅ ꯄꯣꯝ ꯀ ꯅ ꯫',
      'ꯑꯌꯨꯕ ꯃꯇꯝ {name}, ꯅ ꯑ ꯐ ꯖ ꯂ ꯫',
    ],
    afternoon: [
      'ꯀ ꯄ ꯊ ꯍ ꯅ, {name}। ꯊ ꯥ ꯛ ꯆ ꯒ ꯫',
      'ꯅ ꯨ ꯇ... ꯊ ꯥ ꯛ ꯀ ꯅ ꯫',
    ],
    evening: [
      'ꯅ ꯃ ꯍ ꯥ ꯉ, {name}। ꯅ ꯅ ꯐ ꯖ ꯂ ꯫',
      'ꯅ ꯃ ꯍ ꯥ ꯉ {name}, ꯌ ꯨ ꯃ ꯗ ꯅ ꯏ ꯌ ꯫',
    ],
  },
  kha: {
    morning: [
      'Ka syngngi bha, {name}. Ki ktien kynta ia phi. ',
      'Syngngi bha {name}, sngewbha ban shem ia phi.',
    ],
    afternoon: [
      'Ka sngi bha, {name}. To ngin ïaiashib.',
      'Ka sngi bha {name}, ngin iadon ka por suk.',
    ],
    evening: [
      'Ka shi taiew, {name}. Phi la leh bha mynta sngi.',
      'Ka shi taiew {name}, to ngin iashong suk.',
    ],
  },
  lus: {
    morning: [
      'Zing ṭhat, {name}. I lo vang tlat e.',
      'Zing ṭhat {name}, i hmuh ṭhat e.',
    ],
    afternoon: [
      'Chawlh ṭhat, {name}. I lo inhmel ṭhat e.',
      'Chawlh ṭhat {name}, i lo khel ṭan ila.',
    ],
    evening: [
      'Nimah ṭhat, {name}. I ni ṭhat e.',
      'Nimah ṭhat {name}, i lo lêng ṭhat e.',
    ],
  },
  brx: {
    morning: [
      'सुब्रा, {name}। आन्थायनि नानग्रा।',
      'सुब्रा {name}, नोंखौ नाइदों मानसिया।',
    ],
    afternoon: [
      'मोदोबनायनि सुब्रा, {name}। खेल गासिनं।',
      'सुब्रा {name}, थाथाय खालाम।',
    ],
    evening: [
      'सुब्रा {name}, आन्थाय दिनसा जागिरनि।',
      'सुब्रा {name}, आराम जानो।',
    ],
  },
};

export function greetPatient(name: string, language: Language, date: Date = new Date()): string {
  const band = dayBand(date);
  const pool = GREETING_POOLS[language][band];
  const index = dayOfYear(date) % pool.length;
  return pool[index].replace('{name}', ` ${name} `).trim();
}