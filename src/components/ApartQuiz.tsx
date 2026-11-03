import { useState } from 'react';
import ScriptLine from './ScriptLine';
import type { ApartPair } from '../data/scriptRules';
import { useI18n } from '../i18n/context';
import { pickRound } from '../utils/scriptGame';

interface Item {
  latin: string;
  verb: boolean;
  kind: 'apart' | 'joined';
  pair: ApartPair;
}

function items(pairs: ApartPair[]): Item[] {
  return pickRound(
    pairs.flatMap(pair => [
      { latin: pair.apart.latin, verb: false, kind: 'apart' as const, pair },
      { latin: pair.joined.latin, verb: !!pair.joined.verb, kind: 'joined' as const, pair },
    ]),
    pairs.length * 2
  );
}

// One word at a time, with the two meanings of its pair to choose from: only the joined or
// separate final vowel tells them apart (Skorodumova, p. 6).
export default function ApartQuiz({ pairs }: { pairs: ApartPair[] }) {
  const { lang, t } = useI18n();
  const q = t.script.pairs;
  const [deck, setDeck] = useState(() => items(pairs));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<'apart' | 'joined' | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const item = deck[index];
  const gloss = (kind: 'apart' | 'joined') =>
    lang === 'en' ? item.pair[kind].en : item.pair[kind].ru;
  // Both orders turn up, so the answer is not always on the same side.
  const options: Array<'apart' | 'joined'> =
    item.latin.length % 2 ? ['apart', 'joined'] : ['joined', 'apart'];

  function choose(kind: 'apart' | 'joined') {
    if (chosen) return;
    setChosen(kind);
    setScore(s => ({ right: s.right + (kind === item.kind ? 1 : 0), total: s.total + 1 }));
  }

  function next() {
    setChosen(null);
    if (index + 1 < deck.length) setIndex(index + 1);
    else {
      setDeck(items(pairs));
      setIndex(0);
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 p-4 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-semibold text-stone-900">{q.title}</h4>
        {score.total > 0 && (
          <span className="text-sm text-stone-500">{q.score(score.right, score.total)}</span>
        )}
      </div>
      <p className="text-sm text-stone-600">{q.intro}</p>
      <div className="flex flex-wrap items-center gap-6">
        <ScriptLine latin={item.latin} hints={false} className="h-36 text-6xl" />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {options.map(kind => {
              const state =
                chosen === null
                  ? 'border-stone-200 hover:border-buryat-400 hover:bg-buryat-50'
                  : kind === item.kind
                    ? 'border-green-200 bg-green-50 text-green-900'
                    : kind === chosen
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-stone-200 text-stone-400';
              return (
                <button
                  key={kind}
                  type="button"
                  disabled={chosen !== null}
                  onClick={() => choose(kind)}
                  className={`rounded-xl border px-4 py-2 font-medium ${state}`}
                >
                  {gloss(kind)}
                </button>
              );
            })}
          </div>
          {chosen && (
            <div aria-live="polite" className="text-sm space-y-1">
              <p className="font-medium text-stone-800">
                {chosen === item.kind ? q.right : q.wrong(gloss(item.kind))}
              </p>
              <p className="text-stone-600">
                <span className="font-buryat italic">
                  {item.latin}
                  {item.verb ? '-' : ''}
                </span>{' '}
                · {item.kind === 'apart' ? q.apart : q.joined}
              </p>
              <button
                type="button"
                onClick={next}
                className="font-medium text-buryat-700 underline underline-offset-2"
              >
                {q.another}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-stone-500">{q.conflict}</p>
    </div>
  );
}
