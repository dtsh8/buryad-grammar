import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  VERB_PARADIGMS,
  VERB_DERIVATIONS,
  CONVERBS,
  TENSE_ENTRIES,
  type VerbParadigm,
} from '../data/grammar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import VerbBuilder from '../components/VerbBuilder';

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

type Tab = 'anatomy' | 'tenses' | 'voice' | 'converbs' | 'conjugator' | 'builder';

// ─── Morpheme segment colors ─────────────────────────────────────────────

const SEG_COLOR: Record<string, string> = {
  root: 'bg-stone-700 text-white',
  derivation: 'bg-amber-500 text-white',
  tense: 'bg-mongol-600 text-white',
  negation: 'bg-red-600 text-white',
  aspect: 'bg-green-600 text-white',
};

// ─── Verb Anatomy ─────────────────────────────────────────────────────────

function MorphemeBlock({
  text,
  label,
  colorClass,
}: {
  text: string;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`px-3 py-2 rounded-lg font-buryat text-lg font-bold min-w-[50px] text-center ${colorClass}`}
      >
        {text}
      </div>
      <span className="text-[10px] text-stone-400 mt-1 font-mono uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function VerbAnatomy() {
  const examples = [
    {
      label: 'Simple form',
      segments: [
        { text: 'яба', label: 'ROOT', cls: SEG_COLOR.root },
        { text: '-на', label: 'TENSE (PRS)', cls: SEG_COLOR.tense },
      ],
      translation: 'ябана — goes / will go',
    },
    {
      label: 'With derivation',
      segments: [
        { text: 'яба', label: 'ROOT', cls: SEG_COLOR.root },
        { text: '-уул', label: 'CAUS', cls: SEG_COLOR.derivation },
        { text: '-на', label: 'TENSE (PRS)', cls: SEG_COLOR.tense },
      ],
      translation: 'ябуулна — sends / makes go',
    },
    {
      label: 'Negative habitual',
      segments: [
        { text: 'яба', label: 'ROOT', cls: SEG_COLOR.root },
        { text: '-даг', label: 'HAB', cls: SEG_COLOR.aspect },
        { text: '-үй', label: 'NEG', cls: SEG_COLOR.negation },
      ],
      translation: 'ябадагүй — does not go (habitually)',
    },
    {
      label: 'Causative passive',
      segments: [
        { text: 'яба', label: 'ROOT', cls: SEG_COLOR.root },
        { text: '-уул', label: 'CAUS', cls: SEG_COLOR.derivation },
        { text: '-гда', label: 'PASS', cls: SEG_COLOR.aspect },
        { text: '-на', label: 'TENSE', cls: SEG_COLOR.tense },
      ],
      translation: 'ябуулагдана — is made to go',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-stone-800">Verb Morpheme Structure</h2>
        <p className="text-sm text-stone-500">
          Buryad verbs are built by stacking suffixes onto a root, left to right, in a fixed order:
          <span className="font-mono text-xs ml-1 bg-stone-100 px-2 py-0.5 rounded">
            ROOT [+deriv] [+aspect] [+tense/mood]
          </span>
        </p>
        <div className="space-y-5">
          {examples.map(ex => (
            <div key={ex.label} className="space-y-2">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                {ex.label}
              </p>
              <div className="flex items-end gap-1 flex-wrap">
                {ex.segments.map((seg, i) => (
                  <div key={i} className="flex items-end gap-1">
                    <MorphemeBlock text={seg.text} label={seg.label} colorClass={seg.cls} />
                    {i < ex.segments.length - 1 && (
                      <span className="text-stone-300 text-lg mb-3">+</span>
                    )}
                  </div>
                ))}
                <span className="text-stone-400 ml-2 mb-3 text-sm">
                  → <span className="font-buryat text-stone-700 font-medium">{ex.translation}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries({
          ROOT: SEG_COLOR.root,
          DERIVATION: SEG_COLOR.derivation,
          'TENSE/MOOD': SEG_COLOR.tense,
          ASPECT: SEG_COLOR.aspect,
          NEGATION: SEG_COLOR.negation,
        }).map(([label, cls]) => (
          <span key={label} className={`badge px-2 py-1 text-xs ${cls}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Harmony reminder */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm">
        <p className="font-semibold text-amber-800 mb-1">🔊 Every suffix is vowel-harmonic</p>
        <p className="text-amber-700">
          Back-vowel roots (а/о/у) take <span className="font-buryat">-на / -ба / -жа</span> etc.;
          front-vowel roots (э/ø/ü) take <span className="font-buryat">-нэ / -бэ / -жэ</span>.
        </p>
      </div>
    </div>
  );
}

// ─── Tense Timeline ────────────────────────────────────────────────────────

const EVID_COLOR: Record<string, string> = {
  direct: 'bg-green-100 border-green-400 text-green-900',
  indirect: 'bg-amber-100 border-amber-400 text-amber-900',
  neutral: 'bg-stone-100 border-stone-300 text-stone-700',
};
const EVID_LABEL: Record<string, string> = {
  direct: '👁️ Direct',
  indirect: '📢 Indirect',
  neutral: '⚪ Neutral',
};

function TenseTimeline() {
  const [selected, setSelected] = useState<number>(3);
  const t = TENSE_ENTRIES[selected];

  return (
    <div className="space-y-6">
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-stone-800">Tense System</h2>

        {/* Timeline bar */}
        <div className="relative pt-2 pb-6">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200" />
          <div className="flex justify-between">
            {(['PAST', 'NOW', 'FUTURE'] as const).map(l => (
              <span key={l} className="text-xs text-stone-400 font-semibold">
                {l}
              </span>
            ))}
          </div>
          <div className="flex justify-around mt-2">
            {TENSE_ENTRIES.map((te, i) => (
              <button
                key={te.label}
                onClick={() => setSelected(i)}
                className={`flex flex-col items-center gap-1 group`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    selected === i
                      ? 'scale-150 ' +
                        (te.evidentiality === 'direct'
                          ? 'bg-green-500 border-green-600'
                          : te.evidentiality === 'indirect'
                            ? 'bg-amber-500 border-amber-600'
                            : 'bg-mongol-500 border-mongol-600')
                      : 'bg-white border-stone-300 group-hover:border-stone-400'
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors ${selected === i ? 'text-stone-800' : 'text-stone-400 group-hover:text-stone-600'}`}
                >
                  {te.suffix.back}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected tense detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.2 }}
            className={`rounded-xl border-2 p-5 space-y-3 ${EVID_COLOR[t.evidentiality]}`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{t.label}</h3>
                <p className="text-sm font-buryat text-stone-500">{t.buryad}</p>
              </div>
              <div className="flex gap-2">
                <span className={`badge ${EVID_COLOR[t.evidentiality]}`}>
                  {EVID_LABEL[t.evidentiality]}
                </span>
                <span className="badge bg-stone-100 border-stone-300 text-stone-700 capitalize">
                  {t.aspectuality}
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { label: 'Suffix (back)', val: t.suffix.back },
                { label: 'Suffix (front)', val: t.suffix.front },
              ].map(row => (
                <div key={row.label} className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-stone-400">{row.label}</p>
                  <p className="font-mono font-bold text-stone-800">{row.val}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {t.examples.map(ex => (
                <div key={ex.form} className="flex gap-3 items-baseline">
                  <span className="font-buryat text-xl text-stone-800 font-semibold">
                    {ex.form}
                  </span>
                  <span className="text-sm text-stone-600 italic">'{ex.translation}'</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-600 bg-white/50 rounded-lg p-2">{t.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Evidentiality deep-dive */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">
          Evidentiality — Grammaticalized Epistemics
        </h2>
        <p className="text-sm text-stone-500">
          Buryad grammatically encodes <em>how the speaker knows</em> what they are saying. This is
          obligatory — every past-tense statement commits to an evidential source.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👁️</span>
              <div>
                <p className="font-semibold text-green-800">
                  Direct Evidence <span className="font-mono text-sm">-ба</span>
                </p>
                <p className="text-xs text-green-600">Speaker personally witnessed the event</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 space-y-1">
              <p className="font-buryat text-xl">Тэрэ ябаба.</p>
              <p className="text-xs text-stone-400 font-mono">he go-PST.DIR</p>
              <p className="text-sm italic text-stone-600">
                "He went." <span className="text-green-600">(I saw it)</span>
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📢</span>
              <div>
                <p className="font-semibold text-amber-800">
                  Indirect Evidence <span className="font-mono text-sm">-лай</span>
                </p>
                <p className="text-xs text-amber-600">Speaker infers or reports hearsay</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 space-y-1">
              <p className="font-buryat text-xl">Тэрэ ябалай.</p>
              <p className="text-xs text-stone-400 font-mono">he go-PST.INDIR</p>
              <p className="text-sm italic text-stone-600">
                "He (apparently) went." <span className="text-amber-600">(I infer / heard)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-sm text-stone-500">
          📌 English has NO grammatical equivalent — only lexical hedges like "apparently", "I heard
          that", "it seems". In Buryad, the choice is <strong>obligatory every time</strong> you use
          a past tense.
        </div>
      </div>

      {/* Negation */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Negation</h2>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Form</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Negative</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Pattern</th>
                <th className="text-left py-2 text-stone-500 font-normal">Translation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pos: 'ябана', neg: 'ябадагүй', pat: 'HAB + -гүй', tr: 'does not go' },
                { pos: 'ябаба', neg: 'ябаагүй', pat: 'root-aa + -гүй', tr: 'did not go' },
                { pos: 'ябаха', neg: 'ябахагүй', pat: 'INF + -гүй', tr: 'will not go' },
                {
                  pos: 'яба!',
                  neg: 'ябажа болохогүй',
                  pat: 'SIMCONV + болохогүй',
                  tr: 'must not go',
                },
              ].map(row => (
                <tr key={row.pos} className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 font-buryat text-stone-700">{row.pos}</td>
                  <td className="py-2.5 pr-4 font-buryat font-bold text-red-700">{row.neg}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-stone-400">{row.pat}</td>
                  <td className="py-2.5 italic text-stone-500">{row.tr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-400">
          The negator <span className="font-buryat font-bold text-red-700">-гүй</span> is a suffix
          that attaches to the habitual stem for present negation, or directly to the verbal noun
          for past/future.
        </p>
      </div>
    </div>
  );
}

// ─── Voice & Derivation ───────────────────────────────────────────────────

function VoiceDerivation() {
  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Verb Derivation — Voice & Valency</h2>
        <p className="text-sm text-stone-500">
          Buryad has a rich system of derivational suffixes that modify the verb's argument
          structure (how many participants it takes and their roles).
        </p>
      </div>
      {VERB_DERIVATIONS.map(d => (
        <div key={d.label} className={`rounded-2xl border-2 p-5 space-y-4 ${d.color}`}>
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900">{d.label}</h3>
                <code className="text-sm bg-white/60 px-2 py-0.5 rounded font-mono">
                  {d.suffix}
                </code>
              </div>
              <p className="text-sm font-buryat text-stone-500">{d.buryad}</p>
              <p className="text-sm text-stone-600 mt-1">{d.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">English equivalent</p>
              <p className="text-sm font-medium text-stone-700 italic">{d.english}</p>
            </div>
          </div>

          {/* Before / After diagram */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-stone-200 min-w-[110px]">
              <p className="text-xs text-stone-400 mb-0.5">Base</p>
              <p className="font-buryat text-lg font-bold text-stone-800">{d.example.base}</p>
              <p className="text-xs text-stone-500 italic">{d.example.baseGloss}</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl text-stone-400">→</span>
              <code className="text-xs text-stone-400 font-mono">
                {d.suffix.split('/')[0].trim()}
              </code>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border-2 border-current min-w-[130px]">
              <p className="text-xs mb-0.5 opacity-60">Derived</p>
              <p className="font-buryat text-lg font-bold">{d.example.derived}</p>
              <p className="text-xs italic opacity-70">{d.example.derivedGloss}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Stacking note */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-stone-800">Derivations Stack</h3>
        <p className="text-sm text-stone-500">
          Multiple derivational suffixes can be applied in sequence:
        </p>
        <div className="flex flex-wrap items-center gap-2 bg-stone-50 rounded-xl p-4">
          {[
            { text: 'яба', label: 'ROOT: go', cls: SEG_COLOR.root },
            { text: '-уул', label: 'CAUS: make go', cls: SEG_COLOR.derivation },
            { text: '-гда', label: 'PASS: be made to', cls: SEG_COLOR.aspect },
            { text: '-на', label: 'TENSE', cls: SEG_COLOR.tense },
          ].map((seg, i, arr) => (
            <div key={i} className="flex items-end gap-2">
              <MorphemeBlock text={seg.text} label={seg.label} colorClass={seg.cls} />
              {i < arr.length - 1 && <span className="text-stone-300 mb-3 text-lg">+</span>}
            </div>
          ))}
          <div className="ml-2 mb-1">
            <p className="font-buryat text-xl text-stone-800">= ябуулагдана</p>
            <p className="text-xs text-stone-400 italic">"is (being) made to go"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Converbs ────────────────────────────────────────────────────────────

function ConverbSection() {
  const [open, setOpen] = useState<string>(CONVERBS[0].label);

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-stone-800">
          Converbs — Non-Finite Clause Linkers
        </h2>
        <p className="text-sm text-stone-500">
          Converbs are verb forms that link subordinate clauses to a main clause. They carry most of
          the verbal content; only the final verb is finite. This allows long chains of actions to
          be expressed without repeating subjects.
        </p>
        {/* Chain diagram */}
        <div className="bg-stone-50 rounded-xl p-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max text-sm">
            {[
              {
                text: 'Босоод',
                label: 'rise-SEQ',
                cls: 'bg-amber-100 border-amber-300 text-amber-900',
              },
              {
                text: 'угаагаад',
                label: 'wash-SEQ',
                cls: 'bg-amber-100 border-amber-300 text-amber-900',
              },
              {
                text: 'эдеэжэ',
                label: 'eat-SIM',
                cls: 'bg-mongol-100 border-mongol-300 text-mongol-900',
              },
              {
                text: 'ябаба',
                label: 'go-PST ← FINITE',
                cls: 'bg-stone-700 text-white border-stone-700',
              },
            ].map((s, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`border-2 rounded-lg px-3 py-2 text-center ${s.cls}`}>
                  <p className="font-buryat font-bold">{s.text}</p>
                  <p className="text-xs font-mono opacity-70">{s.label}</p>
                </div>
                {i < arr.length - 1 && <span className="text-stone-400 font-bold">→</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2 italic">
            "Having got up, having washed, eating — (he) went."
          </p>
        </div>
      </div>

      {/* Converb accordion */}
      <div className="space-y-2">
        {CONVERBS.map(cv => (
          <div key={cv.label} className={`rounded-xl border-2 overflow-hidden ${cv.color}`}>
            <button
              onClick={() => setOpen(open === cv.label ? '' : cv.label)}
              className="w-full flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-800">{cv.label}</span>
                <code className="text-xs bg-white/60 px-2 py-0.5 rounded font-mono">
                  {cv.suffix}
                </code>
              </div>
              <span
                className={`text-stone-400 transition-transform ${open === cv.label ? 'rotate-180' : ''}`}
              >
                ▾
              </span>
            </button>
            <AnimatePresence>
              {open === cv.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-3 border-t border-stone-200/50">
                    <p className="text-sm text-stone-600 mt-3">{cv.semantics}</p>
                    <p className="text-xs text-stone-400">
                      <span className="font-semibold">English parallel:</span> {cv.englishParallel}
                    </p>
                    {cv.examples.map(ex => (
                      <div key={ex.buryad} className="bg-white rounded-xl p-3 space-y-1">
                        <p className="font-buryat text-base text-stone-800">{ex.buryad}</p>
                        <p className="text-xs font-mono text-stone-400">{ex.gloss}</p>
                        <p className="text-sm italic text-stone-600">'{ex.translation}'</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Interactive Conjugator ───────────────────────────────────────────────

const FORM_ROWS: Array<{
  key: keyof VerbParadigm['forms'];
  label: string;
  category: string;
  color: string;
}> = [
  { key: 'presentFuture', label: 'Present-Future', category: 'Finite', color: 'text-mongol-700' },
  { key: 'simplePast', label: 'Simple Past (direct)', category: 'Finite', color: 'text-green-700' },
  {
    key: 'evidentialPast',
    label: 'Evid. Past (indirect)',
    category: 'Finite',
    color: 'text-amber-700',
  },
  { key: 'habitual', label: 'Habitual', category: 'Finite', color: 'text-stone-700' },
  { key: 'imperative', label: 'Imperative (direct)', category: 'Mood', color: 'text-red-700' },
  {
    key: 'jussive',
    label: 'Jussive / Permissive (-г)',
    category: 'Mood',
    color: 'text-orange-600',
  },
  {
    key: 'politeImperative',
    label: 'Formal imperative (-гты)',
    category: 'Mood',
    color: 'text-red-400',
  },
  { key: 'infinitive', label: 'Infinitive', category: 'Non-fin.', color: 'text-purple-700' },
  { key: 'negPresentFuture', label: 'Neg. Present', category: 'Negation', color: 'text-red-700' },
  { key: 'negPast', label: 'Neg. Past', category: 'Negation', color: 'text-red-700' },
  { key: 'simultConv', label: 'Simultaneous Conv.', category: 'Converb', color: 'text-mongol-700' },
  { key: 'seqConv', label: 'Sequential Conv.', category: 'Converb', color: 'text-amber-700' },
  { key: 'conditional', label: 'Conditional', category: 'Converb', color: 'text-green-700' },
  { key: 'verbalNoun', label: 'Verbal Noun', category: 'Nominal', color: 'text-stone-700' },
  { key: 'participle', label: 'Participle', category: 'Nominal', color: 'text-stone-700' },
];

function Conjugator() {
  const [verbIdx, setVerbIdx] = useState(0);
  const [filter, setFilter] = useState<string>('All');
  const vp = VERB_PARADIGMS[verbIdx];

  const categories = ['All', ...Array.from(new Set(FORM_ROWS.map(r => r.category)))];
  const rows = FORM_ROWS.filter(r => filter === 'All' || r.category === filter);

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Interactive Conjugator</h2>

        {/* Verb picker */}
        <div className="flex flex-wrap gap-2">
          {VERB_PARADIGMS.map((vp, i) => (
            <button
              key={vp.infinitive}
              onClick={() => setVerbIdx(i)}
              className={`px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                verbIdx === i
                  ? 'border-buryat-500 bg-buryat-50 text-buryat-800'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <span className="font-buryat mr-1">{vp.infinitive}</span>
              <span className="text-stone-400 text-xs">— {vp.meaning}</span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-buryat-100 text-buryat-800'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Paradigm table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={vp.infinitive + filter}
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4 p-3 bg-stone-50 rounded-xl">
              <div>
                <span className="font-buryat text-2xl font-bold text-stone-800">
                  {vp.infinitive}
                </span>
                <span className="text-stone-400 ml-2 italic">'{vp.meaning}'</span>
              </div>
              <span
                className={`badge ${vp.harmony === 'back' ? 'badge-amber' : 'badge-blue'} ml-auto`}
              >
                {vp.harmony} harmony
              </span>
            </div>
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left py-2 pr-4 text-stone-400 font-normal">Form</th>
                  <th className="text-left py-2 pr-4 text-stone-400 font-normal">Category</th>
                  <th className="text-left py-2 text-stone-400 font-normal">Буряад</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.key} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-2.5 pr-4 text-stone-600 font-medium">{row.label}</td>
                    <td className="py-2.5 pr-4">
                      <span className="badge bg-stone-100 border-stone-200 text-stone-600 text-xs">
                        {row.category}
                      </span>
                    </td>
                    <td className={`py-2.5 font-buryat text-xl font-semibold ${row.color}`}>
                      {vp.forms[row.key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Distribution chart */}
      <div className="card">
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Form Count by Category
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={categories
              .filter(c => c !== 'All')
              .map(cat => ({
                cat,
                count: FORM_ROWS.filter(r => r.category === cat).length,
              }))}
            margin={{ left: -20 }}
          >
            <XAxis dataKey="cat" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#c8851a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'anatomy', label: 'Verb Anatomy', icon: '🧬' },
  { id: 'tenses', label: 'Tenses', icon: '⏱️' },
  { id: 'voice', label: 'Voice & Voice', icon: '🔄' },
  { id: 'converbs', label: 'Converbs', icon: '🔗' },
  { id: 'conjugator', label: 'Conjugator', icon: '⚡' },
  { id: 'builder', label: 'Verb Builder', icon: '🔤' },
];

export default function Verbs() {
  const [tab, setTab] = useState<Tab>('anatomy');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Verb System</h1>
        <p className="text-stone-500 mt-1">
          Morpheme anatomy, tense–evidentiality, voice derivation, converbs, and interactive
          conjugation.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex gap-1 overflow-x-auto">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.25 }}
        >
          {tab === 'anatomy' && <VerbAnatomy />}
          {tab === 'tenses' && <TenseTimeline />}
          {tab === 'voice' && <VoiceDerivation />}
          {tab === 'converbs' && <ConverbSection />}
          {tab === 'conjugator' && <Conjugator />}
          {tab === 'builder' && <VerbBuilder />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
