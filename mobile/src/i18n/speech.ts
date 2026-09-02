import * as Speech from 'expo-speech';

import type { Language } from './languages';
import { romanize } from './romanize';

const FALLBACK_CHAINS: Record<Language, readonly string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  hi: ['hi-IN', 'hi', 'en-IN'],
  as: ['as-IN', 'as', 'bn-IN', 'bn', 'hi-IN', 'en-IN'],
  mni: ['mni-IN', 'mni', 'hi-IN', 'hi', 'en-IN'],
  kha: ['kha-IN', 'kha', 'en-IN', 'hi-IN'],
  lus: ['lus-IN', 'lus', 'en-IN', 'hi-IN'],
  brx: ['brx-IN', 'brx', 'hi-IN', 'hi', 'as-IN', 'en-IN'],
};

// Same ordered preference is reused for speech recognition locales: try the
// patient's language first and step down to a locale the recognizer supports.
export const STT_LANG_FALLBACKS: Record<Language, readonly string[]> = FALLBACK_CHAINS;

type CachedVoice = {
  identifier: string;
  language: string;
  name: string;
  quality: string;
  localService: boolean | null;
};

let cachedVoices: CachedVoice[] | null = null;
let cachePromise: Promise<CachedVoice[]> | null = null;

function normalize(code: string): string {
  return code.trim().toLowerCase().replace(/_/g, '-');
}

function baseOf(code: string): string {
  return normalize(code).split('-')[0];
}

async function getVoices(): Promise<CachedVoice[]> {
  if (cachedVoices) return cachedVoices;
  if (!cachePromise) {
    cachePromise = (async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        cachedVoices = voices.map((voice) => ({
          identifier: voice.identifier,
          language: normalize(voice.language),
          name: voice.name,
          quality: String(voice.quality),
          // WebVoice exposes localService (false = remote/server voice, e.g. Google's).
          localService:
            'localService' in voice ? (voice as { localService?: boolean }).localService ?? null : null,
        }));
        console.log(
          '[speech] available voices:',
          cachedVoices.map(
            (voice) => `${voice.language} "${voice.name}" (${voice.quality})`,
          ),
        );
      } catch (error) {
        console.warn('[speech] could not list available voices', error);
        cachedVoices = [];
      }
      return cachedVoices;
    })();
  }
  return cachePromise;
}

export function resetSpeechCache(): void {
  cachedVoices = null;
  cachePromise = null;
}

export function stopSpeaking(): void {
  try {
    void Speech.stop();
  } catch {}
}

function isGoogleVoice(voice: CachedVoice): boolean {
  return /google/i.test(voice.identifier) || /google/i.test(voice.name);
}

function chooseVoice(candidates: CachedVoice[]): CachedVoice | undefined {
  if (candidates.length === 0) return undefined;
  let best = candidates[0];
  for (const candidate of candidates) {
    if (voiceRank(candidate) > voiceRank(best)) best = candidate;
  }
  return best;
}

function voiceRank(voice: CachedVoice): number {
  let rank = 0;
  if (isGoogleVoice(voice)) rank += 4;
  if (voice.quality === 'Enhanced') rank += 2;
  if (voice.localService === false) rank += 1;
  return rank;
}

export type ResolvedVoice = {
  language: string;
  identifier?: string;
  name?: string;
};

export async function resolveSpeechLanguage(language: Language): Promise<ResolvedVoice> {
  const preferred = FALLBACK_CHAINS[language];
  const voices = await getVoices();
  if (voices.length === 0) return { language: preferred[preferred.length - 1] };

  for (const code of preferred) {
    const chosen = chooseVoice(voices.filter((voice) => voice.language === normalize(code)));
    if (chosen) return { language: chosen.language, identifier: chosen.identifier, name: chosen.name };
  }
  for (const code of preferred) {
    const base = baseOf(code);
    const chosen = chooseVoice(voices.filter((voice) => baseOf(voice.language) === base));
    if (chosen) return { language: chosen.language, identifier: chosen.identifier, name: chosen.name };
  }
  return { language: preferred[preferred.length - 1] };
}

export type SpeakTextOptions = {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onStopped?: () => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
};

const NATIVE_SCRIPT_BASES: Partial<Record<Language, readonly string[]>> = {
  hi: ['hi'],
  brx: ['brx'],
  as: ['as', 'bn'],
  mni: ['mni'],
};

function shouldUseNativeScript(
  text: string,
  language: Language,
  resolvedBase: string,
): boolean {
  if (text.trim().length === 0) return false;
  const bases = NATIVE_SCRIPT_BASES[language];
  if (!bases) return true;
  return bases.includes(resolvedBase);
}

export async function speakText(
  text: string,
  language: Language,
  options: SpeakTextOptions = {},
): Promise<ResolvedVoice | null> {
  const resolved = await resolveSpeechLanguage(language);
  const resolvedBase = resolved.language.split('-')[0].toLowerCase();
  const nativeScript = shouldUseNativeScript(text, language, resolvedBase);
  const spoken = nativeScript ? text.trim() : romanize(text, language);
  console.log(
    `[speech] requested=${language} resolved=${resolved.language}${
      resolved.name ? ` voice="${resolved.name}"` : ''
    } script=${nativeScript ? 'native' : 'romanized'} original="${text}" spoken="${spoken}"`,
  );
  try {
    await Speech.stop();
    Speech.speak(spoken, {
      language: resolved.language,
      voice: resolved.identifier,
      rate: options.rate ?? 0.85,
      pitch: options.pitch,
      onStart: options.onStart,
      onStopped: options.onStopped,
      onDone: options.onDone,
      onError: (error) => {
        console.warn('[speech] utterance error in', resolved.language, error);
        options.onError?.(error);
      },
    });
    return resolved;
  } catch (error) {
    console.warn('[speech] speak failed', error);
    options.onError?.(error as Error);
    return null;
  }
}