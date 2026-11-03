import { useState } from 'react';
import ScriptLine from './ScriptLine';
import { SCRIPT_RULES, type ScriptRule } from '../data/scriptRules';
import { useI18n } from '../i18n/context';
import { letterChar, type Position, type Translit } from '../utils/mongolScript';

const ZWJ = '‍';

const LETTERS: Translit[] = [
  'a',
  'e',
  'i',
  'o',
  'ö',
  'n',
  'ng',
  'b',
  'p',
  'q',
  'γ',
  'm',
  'l',
  's',
  'š',
  't',
  'd',
  'č',
  'ǰ',
  'y',
  'r',
  'w',
];

// A zero-width joiner on a side makes the font draw the letter as if joined there.
const FORMS: Array<[Position, (c: string) => string]> = [
  ['isolated', c => c],
  ['initial', c => c + ZWJ],
  ['medial', c => ZWJ + c + ZWJ],
  ['final', c => ZWJ + c],
];

function ShapeExplorer() {
  const { t } = useI18n();
  const [letter, setLetter] = useState<Translit>('a');
  return (
    <div className="space-y-3">
      <div role="group" aria-label={t.script.explorer.label} className="flex flex-wrap gap-1.5">
        {LETTERS.map(l => (
          <button
            key={l}
            type="button"
            aria-pressed={letter === l}
            onClick={() => setLetter(l)}
            className={`min-w-9 rounded-md border px-2 py-1 font-buryat ${
              letter === l
                ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                : 'border-stone-200 text-stone-700 hover:border-buryat-300'
            }`}
          >
            {l === 'o' ? 'o / u' : l === 'ö' ? 'ö / ü' : l}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {FORMS.map(([position, form]) => (
          <figure
            key={position}
            className="flex w-24 flex-col items-center gap-2 rounded-xl border border-stone-200 py-3"
          >
            <span
              lang="mn-Mong"
              className="inline-block font-mongol [writing-mode:vertical-lr] text-6xl leading-none h-24 text-stone-900"
            >
              {form(letterChar(letter))}
            </span>
            <figcaption className="text-xs text-stone-500">
              {t.script.positions[position]}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-stone-500">{t.script.explorer.note}</p>
    </div>
  );
}

function RuleCard({ rule, number }: { rule: ScriptRule; number: number }) {
  const { t } = useI18n();
  const text = t.script.rules[rule.id];
  return (
    <article className="card space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-stone-900">
          <span className="text-buryat-600 mr-2">{number}.</span>
          {text.title}
        </h3>
        <p className="text-stone-700">{text.body}</p>
        <p className="text-xs text-stone-400">Poppe 1974, {rule.poppe}</p>
      </div>
      {rule.examples.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {rule.examples.map(latin => (
            <li key={latin} className="flex items-start gap-2">
              <ScriptLine latin={latin} className="text-4xl max-h-56" />
              <span className="font-buryat italic text-sm text-stone-600">
                {latin.replace(/ị/g, 'i')}
              </span>
            </li>
          ))}
        </ul>
      )}
      {rule.spoken && (
        <ul className="flex flex-wrap gap-4">
          {rule.spoken.map(([written, spoken]) => (
            <li key={written} className="flex items-start gap-2">
              <ScriptLine latin={written} className="text-4xl" />
              <span className="text-sm">
                <span className="font-buryat italic text-stone-700">{written}</span>
                <span className="text-stone-400"> → </span>
                <span className="font-buryat italic text-buryat-700">{spoken}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {rule.id === 'positions' && <ShapeExplorer />}
    </article>
  );
}

export default function ScriptRules() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <p className="text-stone-500">{t.script.rulesIntro}</p>
      {SCRIPT_RULES.map((rule, i) => (
        <RuleCard key={rule.id} rule={rule} number={i + 1} />
      ))}
    </div>
  );
}
