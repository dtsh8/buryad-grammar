import { motion } from 'framer-motion';
import { Fragment, useRef, useState } from 'react';
import { CONSONANTS, type ConsonantPlace } from '../data/grammar';
import ArticulationGuide, { PLACE_COLORS } from '../components/ArticulationGuide';
import VowelHarmonyChart from '../components/VowelHarmonyChart';
import Tabs from '../components/Tabs';
import HintTooltip from '../components/Tooltip';
import { HARMONY_TIP } from '../data/harmonyTerms';
import { ABBR_CLASS, SYLLABLE_TIP } from '../data/abbreviations';
import { tabPanelProps, useTab, type TabDef } from '../hooks/useTab';
import { useI18n } from '../i18n/context';

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

type Tab = 'harmony' | 'consonants' | 'structure';

// Labels come from the i18n messages under `phonology.tabs`.
const TAB_IDS: ReadonlyArray<Omit<TabDef<Tab>, 'label'>> = [
  { id: 'harmony' },
  { id: 'consonants' },
  { id: 'structure' },
];

export default function Phonology() {
  const { t } = useI18n();
  const TABS = TAB_IDS.map(d => ({ ...d, label: t.phonology.tabs[d.id] }));
  const [tab, setTab] = useTab(TABS);
  const [place, setPlace] = useState<ConsonantPlace>('bilabial');
  const guideRef = useRef<HTMLDivElement>(null);

  // Below lg the guide sits above the table, so bring it back into view.
  function showPlace(next: ConsonantPlace) {
    setPlace(next);
    guideRef.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">{t.phonology.title}</h1>
        <p className="text-stone-500 mt-1">{t.phonology.intro}</p>
      </motion.div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label={t.phonology.tabsLabel} />

      {/* Vowel Harmony panel */}
      {tab === 'harmony' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3 }}
          className="space-y-6"
          {...tabPanelProps(tab)}
        >
          <div className="card">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Vowel Inventory & Harmony</h2>
            <VowelHarmonyChart />
          </div>

          {/* Harmony in suffixes demo */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Harmony in Action</h2>
            <p className="text-sm text-stone-500">
              The same grammatical suffix takes different phonological shapes depending on the root:
            </p>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 text-stone-500 font-normal">Root</th>
                    <th className="text-left py-2 px-3 text-stone-500 font-normal">Harmony</th>
                    <th className="text-left py-2 px-3 text-stone-500 font-normal">+Dative</th>
                    <th className="text-left py-2 px-3 text-stone-500 font-normal">
                      +Instrumental
                    </th>
                    <th className="text-left py-2 pl-3 text-stone-500 font-normal">Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { root: 'гэр', harmony: 'front (э)', dat: 'гэртэ', ins: 'гэрээр', tr: 'house' },
                    {
                      root: 'газар',
                      harmony: 'back (а)',
                      dat: 'газарта',
                      ins: 'газараар',
                      tr: 'land',
                    },
                    { root: 'ном', harmony: 'back (о)', dat: 'номдо', ins: 'номоор', tr: 'book' },
                    {
                      root: 'үнэн',
                      harmony: 'front (ү)',
                      dat: 'үнэндэ',
                      ins: 'үнэнөөр',
                      tr: 'truth',
                    },
                  ].map(row => (
                    <tr key={row.root} className="border-b border-stone-100">
                      <td className="py-2.5 pr-4 font-buryat text-stone-800 font-medium">
                        {row.root}
                      </td>
                      <td className="py-2.5 px-3">
                        <HintTooltip
                          text={HARMONY_TIP[row.harmony.startsWith('back') ? 'back' : 'front']}
                          className={`badge ${row.harmony.startsWith('back') ? 'badge-amber' : 'badge-blue'}`}
                        >
                          {row.harmony}
                        </HintTooltip>
                      </td>
                      <td className="py-2.5 px-3 font-buryat text-buryat-700">{row.dat}</td>
                      <td className="py-2.5 px-3 font-buryat text-buryat-700">{row.ins}</td>
                      <td className="py-2.5 pl-3 text-stone-500 italic">{row.tr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Consonants panel */}
      {tab === 'consonants' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-6 items-start"
          {...tabPanelProps(tab)}
        >
          <div className="lg:order-2 lg:sticky lg:top-20 space-y-3">
            <ArticulationGuide ref={guideRef} place={place} onSelect={setPlace} />
            <p className="text-xs text-stone-500">{t.phonology.sources}</p>
          </div>

          <div className="card lg:order-1 min-w-0">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              Consonant Inventory ({CONSONANTS.length} phonemes)
            </h2>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    {['Letter', 'IPA', 'Place', 'Manner', 'Voiced'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-stone-500 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONSONANTS.map(c => (
                    <Fragment key={c.letter}>
                      <tr className={c.place === place ? 'bg-stone-50' : undefined}>
                        <td className="pt-2 pr-4 font-buryat text-2xl text-stone-800 w-10">
                          {c.letter}
                        </td>
                        <td className="pt-2 pr-4 whitespace-nowrap">
                          <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                            /{c.ipa}/
                          </code>
                          {c.allophone && (
                            <HintTooltip
                              text={`${c.allophone.note} Reported by a native speaker; not yet confirmed in a written source.`}
                              className="ml-1.5 whitespace-nowrap text-xs rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2"
                            >
                              ~[{c.allophone.ipa}]
                            </HintTooltip>
                          )}
                        </td>
                        <td className="pt-2 pr-4">
                          <button
                            type="button"
                            onClick={() => showPlace(c.place)}
                            aria-pressed={c.place === place}
                            className="text-xs font-medium px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                            style={{ background: PLACE_COLORS[c.place] }}
                          >
                            {t.phonology.guide.places[c.place].name}
                          </button>
                        </td>
                        <td className="pt-2 pr-4 text-stone-600 capitalize">{c.manner}</td>
                        <td className="pt-2 pr-4">{c.voiced ? '✓' : '—'}</td>
                      </tr>
                      <tr
                        className={`border-b border-stone-100 ${c.place === place ? 'bg-stone-50' : ''}`}
                      >
                        <td colSpan={5} className="pb-2 pt-0.5 text-xs text-stone-600">
                          {c.how}
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Syllable structure */}
      {tab === 'structure' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3 }}
          className="space-y-6"
          {...tabPanelProps(tab)}
        >
          <div className="card space-y-5">
            <h2 className="text-lg font-semibold text-stone-800">Syllable Structure</h2>
            <p className="text-sm text-stone-600">
              Buryad syllable structure is{' '}
              <HintTooltip text={SYLLABLE_TIP.formula} className={`font-bold ${ABBR_CLASS}`}>
                (C)(C)V(C)(C)
              </HintTooltip>{' '}
              — a vowel nucleus is obligatory; onset and coda consonants are optional. Long vowels
              (VV) count as one syllable nucleus.
            </p>
            {/* Syllable tree */}
            <div className="flex justify-center">
              <div className="text-center space-y-2">
                <HintTooltip
                  text={SYLLABLE_TIP.sigma}
                  className="inline-block bg-stone-800 text-white text-sm px-4 py-2 rounded-full font-mono"
                >
                  σ (syllable)
                </HintTooltip>
                <div className="flex gap-8 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-mongol-100 border border-mongol-300 text-mongol-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Onset (C)
                    </div>
                    <p className="text-xs text-stone-500 mt-1">optional</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-buryat-100 border border-buryat-300 text-buryat-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Nucleus (V/VV)
                    </div>
                    <p className="text-xs text-stone-500 mt-1">obligatory</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-green-100 border border-green-300 text-green-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Coda (C)
                    </div>
                    <p className="text-xs text-stone-500 mt-1">optional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { word: 'гэр', parse: 'г-э-р', pattern: 'CVC', meaning: 'house' },
                { word: 'аха', parse: 'а-ха', pattern: 'V.CV', meaning: 'elder brother' },
                { word: 'уһан', parse: 'у-һан', pattern: 'V.CVC', meaning: 'water' },
              ].map(ex => (
                <div
                  key={ex.word}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center"
                >
                  <p className="font-buryat text-2xl text-stone-800">{ex.word}</p>
                  <p className="text-xs text-stone-500 mt-1 font-mono">{ex.parse}</p>
                  <HintTooltip text={SYLLABLE_TIP[ex.pattern]} className="badge badge-amber mt-1">
                    {ex.pattern}
                  </HintTooltip>
                  <p className="text-xs text-stone-500 mt-1">'{ex.meaning}'</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
