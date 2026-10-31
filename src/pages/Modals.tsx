import { motion } from 'framer-motion';
import CorpusLink from '../components/CorpusLink';
import DoubleNegation from '../components/DoubleNegation';
import ModalFrames from '../components/ModalFrames';
import ModalSquare from '../components/ModalSquare';
import Tabs from '../components/Tabs';
import {
  MODAL_ENTRIES,
  MODAL_NEGATION,
  MODAL_PAIR,
  MODAL_RELATIVES,
  MODAL_TRAPS,
  type ModalEntry,
  type ModalExample,
} from '../data/grammar';
import { tabPanelProps, useTab, type TabDef } from '../hooks/useTab';
import { useI18n } from '../i18n/context';
import { gloss } from '../i18n/lang';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
type Tab = 'map' | 'forms' | 'negation';

// Labels come from the i18n messages under `modals.tabs`.
const TAB_IDS: ReadonlyArray<Omit<TabDef<Tab>, 'label'>> = [
  { id: 'map' },
  { id: 'forms' },
  { id: 'negation' },
];

function Example({ example }: { example: ModalExample }) {
  const { lang } = useI18n();
  return (
    <>
      <p lang="bua" className="font-buryat text-buryat-700">
        {example.buryad}
      </p>
      <p className="text-sm italic text-stone-600">'{gloss(example.translation, lang)}'</p>
      <p className="text-xs text-stone-500">{example.source}</p>
    </>
  );
}

function EntryCard({ entry }: { entry: ModalEntry }) {
  const { lang, t } = useI18n();
  const e = t.modals.entry;

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 lang="bua" className="text-xl font-bold font-buryat text-stone-900">
          {entry.word}
        </h3>
        <span lang="bua" className="badge badge-amber font-buryat">
          {entry.pattern}
        </span>
      </div>
      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {e.meaning}
          </dt>
          <dd className="text-stone-700">{gloss(entry.meaning, lang)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{e.who}</dt>
          <dd className="text-stone-700">{gloss(entry.subject, lang)}</dd>
        </div>
      </dl>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 space-y-0.5">
          <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">
            {e.example}
          </p>
          <Example example={entry.example} />
          {entry.past && (
            <div className="pt-2 mt-2 border-t border-green-200 space-y-0.5">
              <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">
                {e.past}
              </p>
              <Example example={entry.past} />
            </div>
          )}
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-3">
          <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">{e.negative}</p>
          {entry.negatives.map(n => (
            <div key={n.buryad} className="space-y-0.5">
              <p className="text-sm text-red-800">
                <span lang="bua" className="font-buryat font-semibold">
                  {n.pattern}
                </span>{' '}
                · {gloss(n.meaning, lang)}
              </p>
              <Example example={n} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-stone-600">{gloss(entry.note, lang)}</p>
      <CorpusLink query={entry.corpusQuery} />
    </div>
  );
}

export default function Modals() {
  const { lang, t } = useI18n();
  const m = t.modals;
  const TABS = TAB_IDS.map(d => ({ ...d, label: m.tabs[d.id] }));
  const [tab, setTab] = useTab(TABS);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">{m.title}</h1>
        <p className="text-stone-500 mt-1">{m.intro}</p>
      </motion.div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label={m.tabsLabel} />

      {tab === 'map' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="space-y-6"
          {...tabPanelProps(tab)}
        >
          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{m.square.title}</h2>
              <p className="text-sm text-stone-500 mt-1">{m.square.intro}</p>
            </div>
            <ModalSquare />
          </div>
          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{m.frames.title}</h2>
              <p className="text-sm text-stone-500 mt-1">{m.frames.intro}</p>
            </div>
            <ModalFrames />
          </div>
        </motion.div>
      )}

      {tab === 'forms' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="space-y-6"
          {...tabPanelProps(tab)}
        >
          {MODAL_ENTRIES.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}

          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{m.pair.title}</h2>
              <p className="text-sm text-stone-500 mt-1">{m.pair.intro}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                  {m.pair.advice}
                </p>
                <p lang="bua" className="font-buryat text-stone-800 mt-1">
                  {MODAL_PAIR.stem} <strong>{MODAL_PAIR.advice}</strong>.
                </p>
              </div>
              <div className="rounded-xl bg-mongol-50 border border-mongol-200 p-3">
                <p className="text-xs font-semibold text-mongol-800 uppercase tracking-wide">
                  {m.pair.duty}
                </p>
                <p lang="bua" className="font-buryat text-stone-800 mt-1">
                  {MODAL_PAIR.stem} <strong>{MODAL_PAIR.duty}</strong>.
                </p>
              </div>
            </div>
            <p className="text-sm italic text-stone-600">
              '{gloss(MODAL_PAIR.translation, lang)}'{' '}
              <span className="not-italic text-xs text-stone-500">{MODAL_PAIR.source}</span>
            </p>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">{m.relatives.title}</h2>
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  {[m.relatives.word, m.relatives.meaning, m.relatives.example].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-stone-500 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODAL_RELATIVES.map(r => (
                  <tr key={r.word} className="border-b border-stone-100 align-top">
                    <td
                      lang="bua"
                      className="py-2.5 pr-4 font-buryat font-semibold text-buryat-700 whitespace-nowrap"
                    >
                      {r.word}
                    </td>
                    <td className="py-2.5 pr-4 text-stone-600">{gloss(r.meaning, lang)}</td>
                    <td className="py-2.5 min-w-56">
                      <Example example={r.example} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === 'negation' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="space-y-6"
          {...tabPanelProps(tab)}
        >
          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{m.negation.tableTitle}</h2>
              <p className="text-sm text-stone-500 mt-1">{m.negation.tableIntro}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    {[
                      m.negation.word,
                      m.negation.onModal,
                      m.negation.onVerb,
                      m.negation.withBeshe,
                      m.negation.usage,
                    ].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-stone-500 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODAL_NEGATION.map(row => (
                    <tr key={row.word} className="border-b border-stone-100 align-top">
                      <td lang="bua" className="py-2.5 pr-4 font-buryat text-stone-700">
                        {row.word}
                      </td>
                      <td lang="bua" className="py-2.5 pr-4 font-buryat font-bold text-red-700">
                        {row.onModal}
                      </td>
                      <td lang="bua" className="py-2.5 pr-4 font-buryat text-red-700">
                        {row.onVerb ?? '—'}
                      </td>
                      <td lang="bua" className="py-2.5 pr-4 font-buryat text-red-700">
                        {row.withBeshe ?? '—'}
                      </td>
                      <td className="py-2.5 min-w-64 text-stone-600">{gloss(row.share, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{m.negation.doubleTitle}</h2>
              <p className="text-sm text-stone-500 mt-1">{m.negation.doubleIntro}</p>
            </div>
            <DoubleNegation />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-800">{m.negation.trapsTitle}</h2>
            {MODAL_TRAPS.map(trap => (
              <div key={trap.source} className="card py-4 space-y-1">
                <h3 className="text-sm font-semibold text-stone-800">{gloss(trap.title, lang)}</h3>
                <p className="text-sm text-stone-600">{gloss(trap.text, lang)}</p>
                <p className="text-xs text-stone-500">{trap.source}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-1">
        <p className="text-xs text-stone-500">{m.glossKey}</p>
        <p className="text-xs text-stone-500">{m.source}</p>
      </div>
    </div>
  );
}
