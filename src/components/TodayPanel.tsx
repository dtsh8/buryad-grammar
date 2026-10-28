import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';
import { decline, type CaseId } from '../utils/nounMorphology';
import { loadLastPractice } from '../utils/lastPractice';
import Suffixed from './Suffixed';
import AttestBadge from './AttestBadge';

const DRILLS = {
  cases: { label: 'Form the case', desc: 'Put nouns into all six cases', tab: 'cases' },
  conjugation: { label: 'Conjugation', desc: 'Verbs with person endings', tab: 'conjugation' },
} as const;

const WOTD_CASES: Array<{ id: CaseId; label: string }> = [
  { id: 'genitive', label: 'of' },
  { id: 'instrumental', label: 'by' },
  { id: 'comitative', label: 'with' },
];

// The day number in the viewer's own time zone, so the word changes at local midnight.
function dayNumber(): number {
  const now = new Date();
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
}

// Top of the home page: where to continue, and a word of the day with real case forms.
export default function TodayPanel() {
  const { data } = useVocabulary();
  const last = loadLastPractice();
  const drill = DRILLS[last ?? 'cases'];
  const nouns = data.filter(l => l.category === 'noun');
  const word = nouns.length ? nouns[dayNumber() % nouns.length] : undefined;
  const forms = word ? decline(word.buryad, word.nStem) : undefined;

  return (
    <section aria-labelledby="today-heading" className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2
          id="today-heading"
          lang="bua"
          className="font-buryat text-3xl font-bold text-buryat-700"
        >
          Сайн байна!
        </h2>
        <p className="text-stone-500">
          {last ? 'Pick up where you left off.' : 'Start with a short drill.'}
        </p>
      </div>

      <Link
        to={`/practice${drill.tab === 'conjugation' ? '' : `?tab=${drill.tab}`}`}
        className="group rounded-2xl bg-buryat-600 text-white p-5 flex items-center justify-between gap-4 hover:bg-buryat-700 transition-colors"
      >
        <span className="grid gap-1">
          <span className="text-sm opacity-90">{last ? 'Continue practice' : 'Practice'}</span>
          <span className="text-xl font-semibold">{drill.label}</span>
          <span className="text-sm opacity-90">{drill.desc}</span>
        </span>
        <ArrowRight
          size={22}
          aria-hidden="true"
          className="shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      <div className="card space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Word of the day
        </p>
        {word && forms ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span lang="bua" className="font-buryat text-3xl font-bold text-buryat-700">
                {word.buryad}
              </span>
              <span className="text-stone-500">{word.english}</span>
            </p>
            <ul className="flex flex-wrap gap-2">
              {WOTD_CASES.map(({ id, label }) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1"
                >
                  <span className="text-xs text-stone-500">{label}</span>
                  <Suffixed base={word.buryad} form={forms[id]} className="font-semibold" />
                  <AttestBadge form={forms[id]} />
                </li>
              ))}
            </ul>
            <Link
              to={`/cases?noun=${encodeURIComponent(word.id)}`}
              className="inline-flex items-center gap-1 text-sm text-buryat-700 hover:underline underline-offset-2"
            >
              All seven cases <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className="text-stone-500 text-sm">Loading the vocabulary…</p>
        )}
      </div>
    </section>
  );
}
