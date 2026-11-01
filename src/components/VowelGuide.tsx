import { forwardRef } from 'react';
import { VOWELS } from '../data/grammar';
import { VOWEL_POSES } from '../data/mouthPoses';
import { useI18n } from '../i18n/context';
import MouthDiagram from './MouthDiagram';
import SayButton from './SayButton';

const HARMONY_DOT: Record<string, string> = {
  back: '#c8851a',
  front: '#0e88ea',
  neutral: '#6b7280',
};

interface Props {
  letter: string;
  onSelect: (letter: string) => void;
}

// Pick a vowel to see its tongue and lips on the head diagram.
const VowelGuide = forwardRef<HTMLDivElement, Props>(function VowelGuide(
  { letter, onSelect },
  ref
) {
  const { t } = useI18n();
  const guide = t.phonology.vowelGuide.diagram;
  const vowel = VOWELS.find(v => v.letter === letter) ?? VOWELS[0];
  const pose = VOWEL_POSES[vowel.letter];

  return (
    <div ref={ref} className="card space-y-4 scroll-mt-20">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">{guide.title}</h2>
        <p className="text-sm text-stone-500 mt-1">{guide.intro}</p>
      </div>
      <MouthDiagram
        pose={pose}
        color={HARMONY_DOT[vowel.harmony]}
        label={`${guide.label}: ${vowel.letter}`}
      />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={guide.vowelsLabel}>
        {VOWELS.map(v => (
          <button
            key={v.letter}
            type="button"
            aria-pressed={v.letter === vowel.letter}
            onClick={() => onSelect(v.letter)}
            className={`w-8 h-9 rounded-lg border font-buryat text-lg transition-colors ${
              v.letter === vowel.letter
                ? 'text-white border-transparent'
                : 'text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            style={v.letter === vowel.letter ? { background: HARMONY_DOT[v.harmony] } : undefined}
          >
            {v.letter}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="space-y-1">
        <p className="text-sm text-stone-700">
          {pose.wide ? guide.wide : guide.narrow}, {vowel.rounded ? guide.rounded : guide.unrounded}
        </p>
        <p className="text-sm">
          <span className="font-buryat text-buryat-700">{vowel.example.word}</span>
          <SayButton word={vowel.example.word} className="ml-1" />
          <span className="text-stone-500 ml-2">'{vowel.example.meaning}'</span>
        </p>
      </div>
      <p className="text-xs text-stone-500">{guide.schematic}</p>
    </div>
  );
});

export default VowelGuide;
