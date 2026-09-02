import { VoiceGuide } from '@/components/VoiceGuide';
import type { Language } from '@/i18n/languages';

type GameInstructionProps = {
  text: string;
  language: Language;
  repeatLabel: string;
};

export function GameInstruction({ text, language, repeatLabel }: GameInstructionProps) {
  return <VoiceGuide text={text} language={language} repeatLabel={repeatLabel} circular />;
}