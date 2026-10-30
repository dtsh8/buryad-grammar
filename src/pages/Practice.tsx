import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Lightbulb } from 'lucide-react';
import SayButton from '../components/SayButton';
import AttestBadge from '../components/AttestBadge';
import Suffixed from '../components/Suffixed';
import { saveLastPractice } from '../utils/lastPractice';
import Tabs from '../components/Tabs';
import { tabPanelProps, useTab, type TabDef } from '../hooks/useTab';
import { useI18n } from '../i18n/context';
import { useVocabulary } from '../hooks/useVocabulary';
import type { Lexeme } from '../data/vocabulary.types';
import {
  caseItems,
  generatedCaseItems,
  caseQuestion,
  checkAnswer,
  conjugationQuestion,
  drillVerbs,
  type CaseItem,
  type CaseQuestion,
  type ConjugationQuestion,
  type Verdict,
} from '../utils/practice';

type Tab = 'conjugation' | 'cases';

// Labels come from the i18n messages under `practice.tabs`.
const TAB_IDS: ReadonlyArray<Omit<TabDef<Tab>, 'label'>> = [{ id: 'conjugation' }, { id: 'cases' }];

// Letters missing from a Russian keyboard.
const SPECIAL_LETTERS = ['һ', 'ү', 'ө'];

const rng = Math.random;

// ─── Shared pieces ────────────────────────────────────────────────────────

interface Score {
  right: number;
  total: number;
  streak: number;
}

function useScore(): [Score, (ok: boolean) => void] {
  const [score, setScore] = useState<Score>({ right: 0, total: 0, streak: 0 });
  const record = (ok: boolean) =>
    setScore(s => ({
      right: s.right + (ok ? 1 : 0),
      total: s.total + 1,
      streak: ok ? s.streak + 1 : 0,
    }));
  return [score, record];
}

function ScoreBar({ score }: { score: Score }) {
  return (
    <div className="flex gap-4 text-sm text-stone-500" aria-live="polite">
      <span>
        Score{' '}
        <strong className="text-stone-800">
          {score.right} / {score.total}
        </strong>
      </span>
      <span>
        Streak <strong className="text-stone-800">{score.streak}</strong>
      </span>
    </div>
  );
}

function VerdictBanner({ verdict, answer }: { verdict: Verdict; answer: string }) {
  const style = {
    correct: 'bg-green-50 border-green-200 text-green-900',
    almost: 'bg-buryat-50 border-buryat-200 text-buryat-900',
    wrong: 'bg-red-50 border-red-200 text-red-900',
  }[verdict];
  const title = {
    correct: 'Correct',
    almost: 'Almost: mind the Buryad letters',
    wrong: 'Not quite',
  }[verdict];
  return (
    <div role="status" className={`rounded-xl border p-3 flex items-center gap-2 ${style}`}>
      {verdict === 'wrong' ? (
        <X size={18} aria-hidden="true" />
      ) : (
        <Check size={18} aria-hidden="true" />
      )}
      <span className="font-semibold">{title}</span>
      <span className="text-sm">
        ·{' '}
        <span lang="bua" className="font-buryat font-bold text-base">
          {answer}
        </span>
      </span>
      <SayButton word={answer} />
      <AttestBadge form={answer} />
    </div>
  );
}

// Text input with buttons for һ ү ө; Enter checks, then Enter again moves on.
function AnswerForm({
  answered,
  onCheck,
  onNext,
}: {
  answered: boolean;
  onCheck: (value: string) => void;
  onNext: () => void;
}) {
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (answered) {
      setValue('');
      onNext();
      input.current?.focus();
    } else if (value.trim()) {
      onCheck(value);
      next.current?.focus();
    }
  }

  function insert(letter: string) {
    const el = input.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setValue(value.slice(0, start) + letter + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + 1, start + 1);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="practice-answer" className="sr-only">
          Your answer
        </label>
        <input
          id="practice-answer"
          ref={input}
          lang="bua"
          value={value}
          onChange={e => setValue(e.target.value)}
          readOnly={answered}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Type the form…"
          className="flex-1 min-w-0 rounded-xl border-2 sm:border border-stone-300 bg-white px-4 py-3 sm:py-2.5 font-buryat text-2xl sm:text-lg read-only:bg-stone-50"
        />
        <div className="grid grid-cols-3 sm:flex gap-2">
          {SPECIAL_LETTERS.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => insert(l)}
              disabled={answered}
              aria-label={`Insert ${l}`}
              className="min-h-12 sm:min-h-0 sm:w-11 rounded-xl border border-stone-300 bg-white font-buryat text-2xl sm:text-lg hover:bg-stone-100 disabled:opacity-40"
            >
              {l}
            </button>
          ))}
        </div>
        <button
          ref={next}
          type="submit"
          className="w-full sm:w-auto min-h-[54px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 rounded-2xl sm:rounded-xl bg-buryat-600 px-4 py-2.5 text-lg sm:text-base font-semibold sm:font-medium text-white hover:bg-buryat-700"
        >
          {answered ? (
            <>
              Next <ArrowRight size={16} aria-hidden="true" />
            </>
          ) : (
            'Check'
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Conjugation drill ────────────────────────────────────────────────────

function ConjugationDrill({ verbs }: { verbs: Lexeme[] }) {
  const [q, setQ] = useState<ConjugationQuestion>(() => conjugationQuestion(verbs, rng));
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [score, record] = useScore();

  return (
    <div className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="badge-amber">{q.tense.label}</span>
        <ScoreBar score={score} />
      </div>

      <div>
        <p className="text-sm text-stone-500">
          Conjugate <span className="text-stone-700">“to {q.meaning}”</span> for the subject:
        </p>
        <p className="mt-2 text-2xl">
          <span lang="bua" className="font-buryat font-bold text-stone-800">
            {q.pronoun}
          </span>{' '}
          <span lang="bua" className="cyrillic">
            {q.infinitive}
          </span>
          <span className="ml-2 text-sm text-stone-500">({q.person})</span>
        </p>
      </div>

      <AnswerForm
        key={q.answer + q.person}
        answered={verdict !== null}
        onCheck={value => {
          const v = checkAnswer(value, q.answer);
          setVerdict(v);
          record(v !== 'wrong');
        }}
        onNext={() => {
          setQ(conjugationQuestion(verbs, rng));
          setVerdict(null);
        }}
      />

      {verdict && (
        <div className="space-y-2">
          <VerdictBanner verdict={verdict} answer={q.answer} />
          <p className="text-sm text-stone-600 flex flex-wrap items-baseline gap-1">
            <Lightbulb size={14} className="self-center text-buryat-600" aria-hidden="true" />
            <span lang="bua" className="font-buryat">
              {q.root}
            </span>
            → {q.tense.label.toLowerCase()}{' '}
            <span lang="bua" className="font-buryat font-semibold">
              {q.stem}
            </span>
            {q.ending ? (
              <>
                + person ending{' '}
                <span lang="bua" className="font-buryat font-semibold">
                  -{q.ending}
                </span>
              </>
            ) : (
              <>with no ending for 3sg</>
            )}
            .{' '}
            <Link
              to="/verbs?tab=person"
              className="text-buryat-700 hover:underline underline-offset-2"
            >
              Person endings
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Case drill ───────────────────────────────────────────────────────────

const CURATED = caseItems();

function CaseDrill({ items }: { items: CaseItem[] }) {
  const [q, setQ] = useState<CaseQuestion>(() => caseQuestion(items, rng));
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, record] = useScore();
  const { item } = q;

  function next() {
    setQ(caseQuestion(items, rng));
    setVerdict(null);
    setChosen(null);
  }

  return (
    <div className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="badge-blue">
          {q.kind === 'produce' ? 'Form the case' : 'Name the case'}
        </span>
        <ScoreBar score={score} />
      </div>

      {q.kind === 'produce' ? (
        <>
          <div>
            <p className="text-sm text-stone-500">
              Put this noun into the <strong className="text-stone-700">{item.caseName}</strong>{' '}
              case, meaning “{item.translation}”:
            </p>
            <p lang="bua" className="mt-2 text-2xl font-buryat font-bold text-stone-800">
              {item.stem}
            </p>
          </div>
          <AnswerForm
            key={item.caseId + item.form}
            answered={verdict !== null}
            onCheck={value => {
              const v = checkAnswer(value, item.form);
              setVerdict(v);
              record(v !== 'wrong');
            }}
            onNext={next}
          />
        </>
      ) : (
        <>
          <div>
            <p className="text-sm text-stone-500">
              Which case is this form of{' '}
              <span lang="bua" className="font-buryat text-stone-700">
                {item.stem}
              </span>
              ?
            </p>
            <p lang="bua" className="mt-2 text-2xl font-buryat font-bold text-stone-800">
              {item.form} <SayButton word={item.form} />
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map(name => {
              const isAnswer = name === item.caseName;
              const state =
                verdict === null
                  ? 'bg-white border-stone-300 hover:bg-stone-50'
                  : isAnswer
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : name === chosen
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-stone-200 text-stone-500';
              return (
                <button
                  key={name}
                  type="button"
                  disabled={verdict !== null}
                  onClick={() => {
                    setChosen(name);
                    setVerdict(isAnswer ? 'correct' : 'wrong');
                    record(isAnswer);
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-left font-medium transition-colors ${state}`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {verdict && (
            <button
              type="button"
              onClick={next}
              autoFocus
              className="inline-flex items-center gap-1.5 rounded-xl bg-buryat-600 px-4 py-2.5 font-medium text-white hover:bg-buryat-700"
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </>
      )}

      {verdict && (
        <div className="space-y-2">
          {q.kind === 'produce' && <VerdictBanner verdict={verdict} answer={item.form} />}
          <p className="text-sm text-stone-600">
            <Suffixed base={item.stem} form={item.form} className="font-semibold" /> ={' '}
            {item.caseName}, “{item.translation}”.{item.generated && ' Built by rule.'}
            {item.nStem === 'unstable' && !item.form.startsWith(item.stem) && (
              <>
                {' '}
                <span lang="bua" className="font-buryat">
                  {item.stem}
                </span>{' '}
                drops its <span className="font-buryat">н</span> in this case.
              </>
            )}{' '}
            Suffix:{' '}
            <span lang="bua" className="font-buryat">
              {item.rule}
            </span>
            .{' '}
            <Link to="/cases" className="text-buryat-700 hover:underline underline-offset-2">
              Cases
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Practice() {
  const { t } = useI18n();
  const TABS = TAB_IDS.map(d => ({ ...d, label: t.practice.tabs[d.id] }));
  const [tab, setTab] = useTab(TABS);
  // Remembered for the Continue card on the Today page
  useEffect(() => saveLastPractice(tab), [tab]);
  const { data, loading, error } = useVocabulary();
  const verbs = drillVerbs(data);
  // Curated examples plus every vocabulary noun once the vocabulary has loaded.
  const caseDrillItems = useMemo(() => [...CURATED, ...generatedCaseItems(data)], [data]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-stone-900">{t.practice.title}</h1>
        <p className="mt-1 text-stone-600">
          {t.practice.intro} <span className="font-buryat">һ ү ө</span>.
        </p>
      </header>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label={t.practice.tabsLabel} />

      <section {...tabPanelProps(tab)}>
        {tab === 'conjugation' &&
          (error ? (
            <p className="text-red-700">
              {t.loadError} {error}
            </p>
          ) : loading || verbs.length === 0 ? (
            <p className="text-stone-500">{t.practice.loadingVerbs}</p>
          ) : (
            <ConjugationDrill verbs={verbs} />
          ))}
        {tab === 'cases' && <CaseDrill items={caseDrillItems} />}
      </section>
    </div>
  );
}
