import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Handwriting from '../components/Handwriting';
import ScriptLine from '../components/ScriptLine';
import ScriptRules from '../components/ScriptRules';
import SpellingGame from '../components/SpellingGame';
import Tabs from '../components/Tabs';
import Tooltip from '../components/Tooltip';
import { tabPanelProps, useTab, type TabDef } from '../hooks/useTab';
import { SCRIPT_READING, type ReadingSentence } from '../data/scriptReading';
import { useI18n } from '../i18n/context';
import { KNOWN_SPELLINGS, cyrillicToLatin, hasCyrillic, scriptTokens } from '../utils/mongolScript';
import { letterHint } from '../utils/scriptHints';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const SAMPLE = 'mongγol bičig';

type Tab = 'write' | 'rules' | 'hand';

// Labels come from the i18n messages under `script.tabs`.
const TAB_IDS: ReadonlyArray<Omit<TabDef<Tab>, 'label'>> = [
  { id: 'write' },
  { id: 'rules' },
  { id: 'hand' },
];

function Writer() {
  const { t } = useI18n();
  const [input, setInput] = useState(SAMPLE);
  const [active, setActive] = useState<number | null>(null);
  const cyrillic = hasCyrillic(input);
  const latin = useMemo(() => (cyrillic ? cyrillicToLatin(input) : input), [cyrillic, input]);
  const letters = useMemo(
    () =>
      scriptTokens(latin).flatMap(token =>
        'word' in token
          ? token.word.pieces.flatMap(piece => ('letter' in piece ? [piece.letter] : []))
          : []
      ),
    [latin]
  );

  return (
    <section className="card space-y-4">
      <h2 className="text-xl font-semibold text-stone-900">{t.script.writeTitle}</h2>
      <input
        type="text"
        aria-label={t.script.inputLabel}
        placeholder={t.script.inputLabel}
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 font-buryat text-lg outline-none focus:border-buryat-400 focus:ring-1 focus:ring-buryat-200"
      />
      <p className="text-xs text-stone-500">{t.script.inputHint}</p>
      {cyrillic && (
        <div className="rounded-lg bg-buryat-50 px-3 py-2 text-sm space-y-1">
          <p>
            <span className="text-stone-500">{t.script.readAs}:</span>{' '}
            <span className="font-buryat font-semibold">{latin}</span>{' '}
            <button
              type="button"
              onClick={() => setInput(latin)}
              className="font-medium text-buryat-700 underline underline-offset-2"
            >
              {t.script.editLatin}
            </button>
          </p>
          <p className="text-stone-600">{t.script.cyrillicNote}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="overflow-x-auto">
          <ScriptLine
            latin={latin}
            active={active}
            onActive={setActive}
            className="h-80 text-7xl leading-snug"
          />
        </div>
        {letters.length > 0 && (
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-stone-700">{t.script.letters}</h3>
            <ol className="flex flex-wrap gap-1.5">
              {letters.map((letter, i) => (
                <li key={i}>
                  <Tooltip
                    text={letterHint(letter, t)}
                    onOpenChange={open => setActive(a => (open ? i : a === i ? null : a))}
                    className={`min-w-9 rounded-md border px-2 py-1 font-buryat text-base ${
                      active === i
                        ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                        : 'border-stone-200 text-stone-700'
                    } ${letter.alsoReads.length > 0 ? 'border-dashed' : ''}`}
                  >
                    {letter.sound}
                  </Tooltip>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function SpokenWritten() {
  const { t } = useI18n();
  const c = t.script.columns;
  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{t.script.spokenTitle}</h2>
        <p className="text-sm text-stone-500 mt-1">{t.script.spokenIntro}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-200">
              <th className="py-2 pr-4 font-medium">{c.buryad}</th>
              <th className="py-2 pr-4 font-medium">{c.written}</th>
              <th className="py-2 pr-4 font-medium">{c.script}</th>
              <th className="py-2 font-medium">{c.source}</th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_SPELLINGS.map(w => (
              <tr key={w.buryad} className="border-b border-stone-100 last:border-b-0">
                <td lang="bua" className="py-2 pr-4 font-buryat text-base">
                  {w.buryad}
                </td>
                <td className="py-2 pr-4 font-buryat text-base italic">{w.latin}</td>
                <td className="py-2 pr-4">
                  <ScriptLine latin={w.latin} className="text-4xl" />
                </td>
                <td className="py-2 text-stone-500 whitespace-nowrap">{w.poppe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReadingCard({ sentence, number }: { sentence: ReadingSentence; number: number }) {
  const { lang, t } = useI18n();
  const [shown, setShown] = useState(false);
  return (
    <li className="flex gap-4 rounded-xl border border-stone-200 p-4">
      <div className="overflow-x-auto shrink-0 max-w-[60%]">
        <ScriptLine latin={sentence.latin} className="h-60 text-4xl leading-normal" />
      </div>
      <div className="min-w-0 space-y-2 text-sm">
        <p className="text-stone-400">{number}</p>
        <button
          type="button"
          aria-expanded={shown}
          onClick={() => setShown(s => !s)}
          className="text-left font-medium text-buryat-700 underline underline-offset-2"
        >
          {shown ? t.script.hideReading : t.script.showReading}
        </button>
        {shown && (
          <div className="space-y-1">
            <p className="font-buryat italic text-base">{sentence.latin.replace(/ị/g, 'i')}</p>
            <p className="text-stone-700">{lang === 'en' ? sentence.en : sentence.ru}</p>
            <p className="text-xs text-stone-400">Poppe 1974, p. {sentence.page}</p>
          </div>
        )}
      </div>
    </li>
  );
}

export default function Script() {
  const { t } = useI18n();
  const TABS = TAB_IDS.map(d => ({ ...d, label: t.script.tabs[d.id] }));
  const [tab, setTab] = useTab(TABS);
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">{t.script.title}</h1>
        <p className="text-stone-500 mt-1">{t.script.intro}</p>
      </motion.div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label={t.script.tabsLabel} />

      {tab === 'write' && (
        <div {...tabPanelProps(tab)} className="space-y-8">
          <Writer />

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">{t.script.readingTitle}</h2>
              <p className="text-sm text-stone-500 mt-1">{t.script.readingIntro}</p>
            </div>
            <ol className="grid md:grid-cols-2 gap-4">
              {SCRIPT_READING.map((sentence, i) => (
                <ReadingCard key={sentence.latin} sentence={sentence} number={i + 1} />
              ))}
            </ol>
          </section>

          <SpokenWritten />
        </div>
      )}

      {tab === 'hand' && (
        <div {...tabPanelProps(tab)}>
          <Handwriting />
        </div>
      )}

      {tab === 'rules' && (
        <div {...tabPanelProps(tab)} className="space-y-8">
          <ScriptRules />
          <SpellingGame />
        </div>
      )}

      <p className="text-xs text-stone-500">
        {t.script.source} {t.script.fontNote}
      </p>
    </div>
  );
}
