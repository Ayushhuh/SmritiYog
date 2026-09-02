import type { Language } from './languages';

type CharMap = Record<string, string>;

const DEVANAGARI: CharMap = {
  'अ': 'a',
  'आ': 'aa',
  'इ': 'i',
  'ई': 'ii',
  'उ': 'u',
  'ऊ': 'uu',
  'ऋ': 'ri',
  'ऌ': 'li',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
  'ऍ': 'e',
  'ॠ': 'rii',
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ii',
  'ु': 'u',
  'ू': 'uu',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'क': 'k',
  'ख': 'kh',
  'ग': 'g',
  'घ': 'gh',
  'ङ': 'ng',
  'च': 'ch',
  'छ': 'chh',
  'ज': 'j',
  'झ': 'jh',
  'ञ': 'ny',
  'ट': 't',
  'ठ': 'th',
  'ड': 'd',
  'ढ': 'dh',
  'ण': 'n',
  'त': 't',
  'थ': 'th',
  'द': 'd',
  'ध': 'dh',
  'न': 'n',
  'प': 'p',
  'फ': 'ph',
  'ब': 'b',
  'भ': 'bh',
  'म': 'm',
  'य': 'y',
  'र': 'r',
  'ल': 'l',
  'ळ': 'l',
  'व': 'v',
  'श': 'sh',
  'ष': 'sh',
  'स': 's',
  'ह': 'h',
  'क़': 'q',
  'ख़': 'kh',
  'ग़': 'g',
  'ज़': 'z',
  'ड़': 'r',
  'ढ़': 'rh',
  'फ़': 'f',
  'य़': 'y',
  'ं': 'm',
  'ँ': 'm',
  'ः': 'h',
  '।': '. ',
};

const BENGALI: CharMap = {
  'অ': 'a',
  'আ': 'aa',
  'ই': 'i',
  'ঈ': 'ii',
  'উ': 'u',
  'ঊ': 'uu',
  'ঋ': 'ri',
  'এ': 'e',
  'ঐ': 'oi',
  'ও': 'o',
  'ঔ': 'ou',
  'া': 'aa',
  'ি': 'i',
  'ী': 'ii',
  'ু': 'u',
  'ূ': 'uu',
  'ৃ': 'ri',
  'ে': 'e',
  'ৈ': 'oi',
  'ো': 'o',
  'ৌ': 'ou',
  'ক': 'k',
  'খ': 'kh',
  'গ': 'g',
  'ঘ': 'gh',
  'ঙ': 'ng',
  'চ': 'ch',
  'ছ': 'chh',
  'জ': 'j',
  'ঝ': 'jh',
  'ঞ': 'ny',
  'ট': 't',
  'ঠ': 'th',
  'ড': 'd',
  'ঢ': 'dh',
  'ণ': 'n',
  'ত': 't',
  'থ': 'th',
  'দ': 'd',
  'ধ': 'dh',
  'ন': 'n',
  'প': 'p',
  'ফ': 'ph',
  'ব': 'b',
  'ভ': 'bh',
  'ম': 'm',
  'য': 'y',
  'য়': 'y',
  'র': 'r',
  'ৰ': 'r',
  'ৱ': 'w',
  'ল': 'l',
  'শ': 'sh',
  'ষ': 'sh',
  'স': 's',
  'হ': 'h',
  'ৎ': 't',
  'ং': 'm',
  'ঁ': 'm',
  'ঃ': 'h',
  '।': '. ',
};

const MEITEI: CharMap = {
  'ꯀ': 'k',
  'ꯁ': 's',
  'ꯂ': 'l',
  'ꯃ': 'm',
  'ꯄ': 'p',
  'ꯅ': 'n',
  'ꯆ': 'ch',
  'ꯇ': 't',
  'ꯈ': 'kh',
  'ꯉ': 'ng',
  'ꯊ': 'th',
  'ꯋ': 'w',
  'ꯌ': 'y',
  'ꯍ': 'h',
  'ꯎ': 'un',
  'ꯏ': 'i',
  'ꯐ': 'ph',
  'ꯑ': 'a',
  'ꯒ': 'g',
  'ꯓ': 'jh',
  'ꯔ': 'r',
  'ꯕ': 'b',
  'ꯖ': 'j',
  'ꯗ': 'd',
  'ꯘ': 'gh',
  'ꯙ': 'dh',
  'ꯚ': 'bh',
  'ꯛ': 'y',
  'ꯜ': 'kh',
  'ꯝ': 'th',
  'ꯞ': 'w',
  'ꯟ': 'y',
  'ꯥ': 'a',
  'ꯦ': 'i',
  'ꯧ': 'u',
  'ꯨ': 'e',
  'ꯩ': 'o',
  'ꯪ': 'ee',
  '꯫': '.',
  '꯮': 'sh',
};

const DEVANAGARI_CONSONANTS = new Set([
  'क',
  'ख',
  'ग',
  'घ',
  'ङ',
  'च',
  'छ',
  'ज',
  'झ',
  'ञ',
  'ट',
  'ठ',
  'ड',
  'ढ',
  'ण',
  'त',
  'थ',
  'द',
  'ध',
  'न',
  'प',
  'फ',
  'ब',
  'भ',
  'म',
  'य',
  'र',
  'ल',
  'ळ',
  'व',
  'श',
  'ष',
  'स',
  'ह',
  'क़',
  'ख़',
  'ग़',
  'ज़',
  'ड़',
  'ढ़',
  'फ़',
  'य़',
]);

const BENGALI_CONSONANTS = new Set([
  'ক',
  'খ',
  'গ',
  'ঘ',
  'ঙ',
  'চ',
  'ছ',
  'জ',
  'ঝ',
  'ঞ',
  'ট',
  'ঠ',
  'ড',
  'ঢ',
  'ণ',
  'ত',
  'থ',
  'দ',
  'ধ',
  'ন',
  'প',
  'ফ',
  'ব',
  'ভ',
  'ম',
  'য',
  'য়',
  'র',
  'ৰ',
  'ৱ',
  'ল',
  'শ',
  'ষ',
  'স',
  'হ',
  'ৎ',
]);

const DEVANAGARI_MATRAS = new Set(['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ']);
const BENGALI_MATRAS = new Set(['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ']);
const DEVANAGARI_VIRAMA = '्';
const BENGALI_VIRAMA = '্';

function transliterateIndic(
  text: string,
  map: CharMap,
  consonants: Set<string>,
  matras: Set<string>,
  virama: string,
): string {
  const list = Array.from(text);
  let out = '';
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (ch === virama) continue;
    const value = map[ch];
    if (value === undefined) {
      out += ch;
      continue;
    }
    if (consonants.has(ch)) {
      out += value;
      const next = list[i + 1];
      if (next !== virama && !(next !== undefined && matras.has(next))) {
        out += 'a';
      }
    } else {
      out += value;
    }
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

const MEITEI_RANGE = /[\uABC0-\uABEF]/;

function transliterateMeitei(text: string): string {
  const words: string[] = [];
  let word = '';
  const flush = () => {
    if (word) {
      words.push(word);
      word = '';
    }
  };
  for (const token of text.split(' ')) {
    if (MEITEI_RANGE.test(token)) {
      for (const ch of Array.from(token)) {
        word += MEITEI[ch] ?? ch;
      }
    } else {
      flush();
      words.push(token);
    }
  }
  flush();
  return words.join(' ').replace(/\s{2,}/g, ' ').trim();
}

const LATIN_LANGUAGES = new Set<Language>(['en', 'kha', 'lus']);

export function romanize(text: string, language: Language): string {
  if (LATIN_LANGUAGES.has(language)) return text.trim();
  switch (language) {
    case 'hi':
    case 'brx':
      return transliterateIndic(text, DEVANAGARI, DEVANAGARI_CONSONANTS, DEVANAGARI_MATRAS, DEVANAGARI_VIRAMA);
    case 'as':
      return transliterateIndic(text, BENGALI, BENGALI_CONSONANTS, BENGALI_MATRAS, BENGALI_VIRAMA);
    case 'mni':
      return transliterateMeitei(text);
    default:
      return text.trim();
  }
}