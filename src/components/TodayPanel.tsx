import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';
import { decline, type CaseId } from '../utils/nounMorphology';
import { loadLastPractice } from '../utils/lastPractice';
import Suffixed from './Suffixed';
import AttestBadge from './AttestBadge';
import { useI18n } from '../i18n/context';
import { gloss } from '../i18n/lang';

// Cases shown for the word of the day; their cues are under today.caseCues.
const WOTD_CASES = [
  'genitive',
  'instrumental',
  'comitative',
] as const satisfies ReadonlyArray<CaseId>;

// The day number in the viewer's own time zone, so the word changes at local midnight.
function dayNumber(): number {
  const now = new Date();
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
}

// Top of the home page: where to continue, and a word of the day with real case forms.
export default function TodayPanel() {
  const { data } = useVocabulary();
  const { t, lang } = useI18n();
  const last = loadLastPractice();
  const drillId = last ?? 'cases';
  const drill = t.today.drills[drillId];
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
        <p className="text-stone-500">{last ? t.today.resume : t.today.start}</p>
      </div>

      <Link
        to={`/practice${drillId === 'conjugation' ? '' : `?tab=${drillId}`}`}
        className="group rounded-2xl bg-buryat-600 text-white p-5 flex items-center justify-between gap-4 hover:bg-buryat-700 transition-colors"
      >
        <span className="grid gap-1">
          <span className="text-sm opacity-90">{last ? t.today.continue : t.today.practice}</span>
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
          {t.today.wordOfDay}
        </p>
        {word && forms ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span lang="bua" className="font-buryat text-3xl font-bold text-buryat-700">
                {word.buryad}
              </span>
              <span className="text-stone-500">{gloss(word, lang)}</span>
            </p>
            <ul className="flex flex-wrap gap-2">
              {WOTD_CASES.map(id => (
                <li
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1"
                >
                  <span className="text-xs text-stone-500">{t.today.caseCues[id]}</span>
                  <Suffixed base={word.buryad} form={forms[id]} className="font-semibold" />
                  <AttestBadge form={forms[id]} />
                </li>
              ))}
            </ul>
            <Link
              to={`/cases?noun=${encodeURIComponent(word.id)}`}
              className="inline-flex items-center gap-1 text-sm text-buryat-700 hover:underline underline-offset-2"
            >
              {t.today.allCases} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className="text-stone-500 text-sm">{t.today.loading}</p>
        )}
      </div>
    </section>
  );
}
