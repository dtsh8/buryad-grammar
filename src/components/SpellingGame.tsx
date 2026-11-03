import { useState, type FormEvent } from 'react';
import ScriptLine from './ScriptLine';
import { SCRIPT_WORDS, type ScriptWordEntry } from '../data/scriptWords';
import { useI18n } from '../i18n/context';
import { letterChar, scriptWord, type Translit } from '../utils/mongolScript';
import { grade, pickRound, type Grade, type Mark } from '../utils/scriptGame';

const ROUND = 10;

type Mode = 'write' | 'read';

// k and g type the letters of q and γ; the font draws their front-vowel shapes from the word.
const KEYS: Translit[] = [
  'a',
  'e',
  'i',
  'o',
  'u',
  'ö',
  'ü',
  'n',
  'ng',
  'b',
  'p',
  'q',
  'γ',
  'k',
  'g',
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

const MARK_STYLE: Record<Mark, string> = {
  right: 'bg-green-50 text-green-900 border-green-200',
  sameShape: 'bg-sky-50 text-sky-900 border-sky-200',
  wrong: 'bg-red-50 text-red-900 border-red-200',
  missing: 'border-dashed border-red-300 text-red-700',
  extra: 'border-stone-200 text-stone-400 line-through',
};

const button =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-buryat-600 px-4 py-2.5 font-medium text-white hover:bg-buryat-700 disabled:opacity-40';

// Ten of Poppe's words: write each one from its English or Russian meaning, or read it from the
// script. The score is the share of letters right (scriptGame.ts).
export default function SpellingGame() {
  const { lang, t } = useI18n();
  const g = t.script.game;
  const [mode, setMode] = useState<Mode>('write');
  const [round, setRound] = useState<ScriptWordEntry[]>(() => pickRound(SCRIPT_WORDS, ROUND));
  const [scores, setScores] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<Grade | null>(null);

  const index = scores.length - (result ? 1 : 0);
  const word = round[index];
  const finished = !word;
  const gloss = (w: ScriptWordEntry) => (lang === 'en' ? w.en : w.ru);
  const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const readable = answer.trim() !== '' && scriptWord(answer.trim().replace(/\s+/g, '')) !== null;

  function restart(next: Mode = mode) {
    setMode(next);
    setRound(pickRound(SCRIPT_WORDS, ROUND));
    setScores([]);
    setAnswer('');
    setResult(null);
  }

  function check(e?: FormEvent) {
    e?.preventDefault();
    if (result || !word) return;
    const graded = grade(word.latin, answer);
    setResult(graded);
    setScores(s => [...s, graded.percent]);
  }

  function next() {
    setResult(null);
    setAnswer('');
  }

  return (
    <section className="card space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-stone-900">{g.title}</h2>
        <p className="text-sm text-stone-500">{g.intro}</p>
      </div>

      <div role="group" aria-label={g.modesLabel} className="flex flex-wrap gap-2">
        {(['write', 'read'] as const).map(m => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => restart(m)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              mode === m
                ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                : 'border-stone-200 text-stone-600 hover:border-buryat-300'
            }`}
          >
            {g.modes[m]}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm text-stone-500">
          <span>{finished ? g.done(average) : g.progress(index + 1, ROUND)}</span>
          {scores.length > 0 && (
            <span>
              {g.average}: <span className="font-semibold text-stone-800">{average}%</span>
            </span>
          )}
        </div>
        <div className="h-2 rounded-full bg-stone-100 overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-buryat-500 transition-all"
            style={{ width: `${(scores.length / ROUND) * 100}%` }}
          />
        </div>
      </div>

      {finished ? (
        <div className="space-y-4">
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {round.map((w, i) => (
              <li
                key={w.latin}
                className="flex justify-between gap-3 border-b border-stone-100 py-1"
              >
                <span>
                  <span className="font-buryat italic">{w.latin}</span>{' '}
                  <span className="text-stone-500">{gloss(w)}</span>
                </span>
                <span className="font-semibold text-stone-800">{scores[i]}%</span>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => restart()} className={button}>
            {g.again}
          </button>
        </div>
      ) : (
        <form onSubmit={check} className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-stone-600">{mode === 'write' ? g.writePrompt : g.readPrompt}</p>
            {mode === 'write' ? (
              <p className="text-2xl font-semibold text-stone-900">{gloss(word)}</p>
            ) : (
              <ScriptLine latin={word.latin} hints={false} className="h-40 text-6xl" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <input
                type="text"
                aria-label={g.answerLabel}
                placeholder={g.answerLabel}
                value={answer}
                disabled={!!result}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={e => setAnswer(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 font-buryat text-lg outline-none focus:border-buryat-400 focus:ring-1 focus:ring-buryat-200 disabled:bg-stone-50"
              />
              <div role="group" aria-label={g.keysLabel} className="flex flex-wrap gap-1.5">
                {KEYS.map(key => (
                  <button
                    key={key}
                    type="button"
                    disabled={!!result}
                    onClick={() => setAnswer(a => a + key)}
                    className="flex h-14 w-11 flex-col items-center justify-between rounded-lg border border-stone-200 py-1 hover:border-buryat-400 hover:bg-buryat-50 disabled:opacity-40"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block font-mongol [writing-mode:vertical-lr] text-2xl leading-none"
                    >
                      {letterChar(key)}
                    </span>
                    <span className="font-buryat text-xs text-stone-600">{key}</span>
                  </button>
                ))}
                <button
                  type="button"
                  disabled={!!result}
                  onClick={() => setAnswer(a => a + '-')}
                  className="h-14 rounded-lg border border-stone-200 px-2 text-xs text-stone-600 hover:border-buryat-400 disabled:opacity-40"
                >
                  - {g.apart}
                </button>
                <button
                  type="button"
                  disabled={!!result || !answer}
                  onClick={() => setAnswer(a => [...a].slice(0, -1).join(''))}
                  className="h-14 rounded-lg border border-stone-200 px-2 text-xs text-stone-600 hover:border-buryat-400 disabled:opacity-40"
                >
                  ⌫ {g.backspace}
                </button>
              </div>
            </div>
            {readable && (
              <div className="shrink-0 overflow-x-auto">
                <ScriptLine latin={answer.trim()} hints={false} className="h-48 text-5xl" />
              </div>
            )}
          </div>

          {!result && (
            <button type="submit" disabled={!answer.trim()} className={button}>
              {g.check}
            </button>
          )}

          {result && (
            <div aria-live="polite" className="rounded-xl bg-stone-50 p-4 space-y-3">
              <p className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-stone-900">{result.percent}%</span>
                <span className="font-medium text-stone-700">{g.verdict(result.percent)}</span>
              </p>
              <ol className="flex flex-wrap gap-1">
                {result.marks.map((m, i) => (
                  <li
                    key={i}
                    title={g.marks[m.mark]}
                    className={`min-w-8 rounded-md border px-2 py-1 text-center font-buryat ${MARK_STYLE[m.mark]}`}
                  >
                    {m.text}
                  </li>
                ))}
              </ol>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                {[...new Set(result.marks.map(m => m.mark))].map(m => (
                  <li key={m} className="flex items-center gap-1.5">
                    <span className={`inline-block h-3 w-3 rounded-sm border ${MARK_STYLE[m]}`} />
                    {g.marks[m]}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <ScriptLine latin={word.latin} className="h-40 text-5xl" />
                <div className="text-sm space-y-1">
                  <p className="text-stone-500">{g.answer}</p>
                  <p className="font-buryat italic text-lg">{word.latin}</p>
                  <p className="text-stone-700">{gloss(word)}</p>
                  <p className="text-xs text-stone-400">Poppe 1974, p. {word.page}</p>
                </div>
              </div>
              <button type="button" onClick={next} className={button}>
                {index + 1 < ROUND ? g.next : g.finish}
              </button>
            </div>
          )}
        </form>
      )}
    </section>
  );
}
