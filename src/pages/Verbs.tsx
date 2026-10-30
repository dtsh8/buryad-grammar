import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  VERB_PARADIGMS,
  VERB_DERIVATIONS,
  CONVERBS,
  TENSE_ENTRIES,
  PERSON_ENDINGS,
  type VerbParadigm,
} from '../data/grammar';
import VerbBuilder from '../components/VerbBuilder';
import CorpusLink from '../components/CorpusLink';
import TenseLanes from '../components/TenseLanes';
import Tooltip from '../components/Tooltip';
import { HARMONY_TIP } from '../data/harmonyTerms';
import SayButton from '../components/SayButton';
import Tabs from '../components/Tabs';
import { tabPanelProps, useTab, type TabDef } from '../hooks/useTab';
import { useI18n } from '../i18n/context';

const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

type Tab = 'anatomy' | 'tenses' | 'person' | 'voice' | 'converbs' | 'conjugator' | 'builder';

// ─── Morpheme segment colors ─────────────────────────────────────────────

const SEG_COLOR: Record<string, string> = {
  root: 'bg-stone-700 text-white',
  derivation: 'bg-amber-500 text-white',
  tense: 'bg-mongol-600 text-white',
  negation: 'bg-red-600 text-white',
  aspect: 'bg-green-600 text-white',
  person: 'bg-purple-600 text-white',
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
      <span className="text-[10px] text-stone-500 mt-1 font-mono uppercase tracking-wide">
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
        { text: '-гүй', label: 'NEG', cls: SEG_COLOR.negation },
      ],
      translation: 'ябадаггүй — does not go (habitually)',
    },
    {
      label: 'With person ending',
      segments: [
        { text: 'яба', label: 'ROOT', cls: SEG_COLOR.root },
        { text: '-аа', label: 'PERF', cls: SEG_COLOR.tense },
        { text: '-гүй', label: 'NEG', cls: SEG_COLOR.negation },
        { text: '-бди', label: '1PL', cls: SEG_COLOR.person },
      ],
      translation: 'ябаагүйбди — we did not go',
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
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
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
                <span className="text-stone-500 ml-2 mb-3 text-sm">
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
          Roots with а/у take <span className="font-buryat">-на / -ба / -жа</span> etc.; roots with
          о take <span className="font-buryat">-но / -бо / -жо</span>; roots with э/ө/ү take{' '}
          <span className="font-buryat">-нэ / -бэ / -жэ</span>.
        </p>
      </div>
    </div>
  );
}

// ─── Tense Timeline ────────────────────────────────────────────────────────

function TenseTimeline() {
  const [selected, setSelected] = useState<number>(() =>
    Math.max(
      0,
      TENSE_ENTRIES.findIndex(t => t.label === 'Perfect')
    )
  );
  const t = TENSE_ENTRIES[selected];

  return (
    <div className="space-y-6">
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-stone-800">Tense System</h2>

        <p className="text-sm text-stone-500">
          The present is <span className="font-buryat">-на</span> (
          <span className="font-buryat">ябана</span> “goes, is going”); “right now, in progress” is
          the phrase <span className="font-buryat">-жа байна</span>. The future is{' '}
          <span className="font-buryat">-ха</span> (<span className="font-buryat">ябахаб</span> “I
          will go”). Pick a row for details.
        </p>

        {/* Timeline: one row per tense, placed in time */}
        <TenseLanes tenses={TENSE_ENTRIES} selected={selected} onSelect={setSelected} />
        <p className="text-xs text-stone-500">
          ● one event · ●— result or relevance lasting until now · ••• a habit · ▬ a stretch of time
        </p>

        {/* Selected tense detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.2 }}
            className="rounded-xl border-2 p-5 space-y-3 bg-stone-100 border-stone-300 text-stone-700"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{t.label}</h3>
                <p className="text-sm font-buryat text-stone-500">{t.buryad}</p>
              </div>
              {t.aspectuality !== 'n/a' && (
                <div className="flex gap-2">
                  <span className="badge bg-stone-100 border-stone-300 text-stone-700 capitalize">
                    {t.aspectuality}
                  </span>
                </div>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { label: 'Suffix (back)', val: t.suffix.back },
                { label: 'Suffix (front)', val: t.suffix.front },
              ].map(row => (
                <div key={row.label} className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-stone-500">{row.label}</p>
                  <p className="font-buryat font-bold text-stone-800">{row.val}</p>
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
            {t.corpusQuery && <CorpusLink query={t.corpusQuery} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Past forms */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Four Past Forms</h2>
        <p className="text-sm text-stone-500">
          Only <span className="font-buryat">-ба</span> is a true past tense. The other three are
          participles that can also end a sentence. In news text the perfect{' '}
          <span className="font-buryat">-аа</span> and the participle{' '}
          <span className="font-buryat">-һан</span> dominate.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { form: 'ябаба', suffix: '-ба', label: 'Simple past', gloss: 'went' },
            { form: 'ябаа', suffix: '-аа', label: 'Perfect', gloss: 'went, has gone' },
            { form: 'ябаһан', suffix: '-һан', label: 'Past participle', gloss: 'went; who went' },
            { form: 'ябанхай', suffix: '-нхай', label: 'Resultative', gloss: 'has gone, is away' },
          ].map(p => (
            <div key={p.suffix} className="rounded-xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-xs text-stone-500">
                {p.label} <span className="font-mono">{p.suffix}</span>
              </p>
              <p className="font-buryat text-xl text-stone-800">{p.form}</p>
              <p className="text-sm italic text-stone-500">'{p.gloss}'</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          🔎 <strong>Under review:</strong> whether these forms also differ in evidentiality
          (witnessed vs reported) is being checked with a native speaker. Neither the textbook nor
          Skribnik &amp; Darzhaeva (2020) describe it. An earlier version of this page taught an
          "evidential past in -лай". A narrative past in -лай does occur in literary prose (
          <span className="font-buryat">Тогоошо ябалай</span> "Togoosho set off"), but it is rare (a
          few dozen hits in the Buryat National Corpus, mostly one author) and no source describes
          it as evidential, so it is not taught here.
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
                { pos: 'ябадаг', neg: 'ябадаггүй', pat: 'HAB + -гүй', tr: 'does not go' },
                { pos: 'ябаа', neg: 'ябаагүй', pat: 'PERF + -гүй', tr: 'did not go' },
                { pos: 'ерэбэ', neg: 'ерэбэгүй', pat: 'PST + -гүй', tr: 'did not come' },
                { pos: 'ябана', neg: 'ябанагүй', pat: 'PRS + -гүй', tr: 'is not going' },
                { pos: 'ябаа', neg: 'ябаадүй', pat: 'PERF + -дүй', tr: 'has not gone yet' },
                { pos: 'ябаха', neg: 'ябахагүй', pat: 'INF + -гүй', tr: 'will not go' },
                {
                  pos: 'яба!',
                  neg: 'ябажа болохогүй',
                  pat: 'SIMCONV + болохогүй',
                  tr: 'must not go',
                },
              ].map(row => (
                <tr key={row.neg} className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 font-buryat text-stone-700">{row.pos}</td>
                  <td className="py-2.5 pr-4 font-buryat font-bold text-red-700">{row.neg}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-stone-500">{row.pat}</td>
                  <td className="py-2.5 italic text-stone-500">{row.tr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-500">
          The negator <span className="font-buryat font-bold text-red-700">-гүй</span> is a suffix
          that attaches to the habitual (keeping both г: ябадаггүй), the perfect (ябаагүй), the past
          (ерэбэгүй), the present (ябанагүй) or the infinitive (ябахагүй). Person endings follow it:
          ябаагүйбди "we did not go". The variant <span className="font-buryat">-дүй</span> means
          "not yet, but it will happen" (textbook p. 54).
        </p>
      </div>
    </div>
  );
}

// ─── Person Endings ───────────────────────────────────────────────────────

function PersonEndings() {
  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Person Endings</h2>
        <p className="text-sm text-stone-500">
          Unlike Khalkha Mongolian, Buryad marks the subject's person on the verb. The ending goes
          last, after tense and negation:{' '}
          <span className="font-buryat text-stone-700">яба-аа-гүй-бди</span> "we did not go". The
          pronoun can be dropped because the ending already identifies the subject.
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Person</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Pronoun</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Ending</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Present</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Past -ба</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Perfect</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Future -ха</th>
                <th className="text-left py-2 text-stone-500 font-normal">Attested</th>
              </tr>
            </thead>
            <tbody>
              {PERSON_ENDINGS.map(p => (
                <tr key={p.person} className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 text-stone-600 font-medium">{p.person}</td>
                  <td className="py-2.5 pr-4 font-buryat text-stone-500">{p.pronoun}</td>
                  <td className="py-2.5 pr-4 font-buryat font-bold text-purple-700">{p.suffix}</td>
                  <td className="py-2.5 pr-4 font-buryat text-lg text-stone-800">{p.present}</td>
                  <td className="py-2.5 pr-4 font-buryat text-lg text-stone-800">{p.past}</td>
                  <td className="py-2.5 pr-4 font-buryat text-lg text-stone-800">
                    {p.perfect ?? '—'}
                  </td>
                  <td className="py-2.5 pr-4 font-buryat text-lg text-stone-800">
                    {p.future ?? '—'}
                  </td>
                  <td className="py-2.5 font-buryat text-xs text-stone-500">
                    {p.attested.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-500">
          "Attested" lists forms found in Buryad news texts. The other columns apply the same
          endings to <span className="font-buryat">яба-</span> "go"; forms not listed as attested
          are built by rule. The textbook also gives -м and -мди as variants of -б and -бди. The 3pl
          perfect is left blank because ябаа + -д would look like the converb ябаад; 3pl -д is shown
          on the present and the -ба past, as in the textbook. The future has no 3pl -д at all: the
          Buryat National Corpus has ябахаб 114 times but no ябахад.
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
              <p className="text-sm text-stone-500 flex flex-wrap items-baseline gap-2">
                <span className="font-buryat">{d.buryad}</span>
                {d.buryadUnverified && (
                  <Tooltip
                    text="This Buryad term does not occur in the Buryat National Corpus or the textbook. It is being checked with a native speaker."
                    className="text-xs rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2"
                  >
                    unverified term
                  </Tooltip>
                )}
              </p>
              <p className="text-sm text-stone-600 mt-1">{d.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-500">English equivalent</p>
              <p className="text-sm font-medium text-stone-700 italic">{d.english}</p>
            </div>
          </div>

          {/* Before / After diagram */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white rounded-xl px-4 py-3 text-center border border-stone-200 min-w-[110px]">
              <p className="text-xs text-stone-500 mb-0.5">Base</p>
              <p className="font-buryat text-lg font-bold text-stone-800">{d.example.base}</p>
              <p className="text-xs text-stone-500 italic">{d.example.baseGloss}</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl text-stone-500">→</span>
              <code className="text-xs text-stone-500 font-mono">
                {d.suffix.split('/')[0].trim()}
              </code>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border-2 border-current min-w-[130px]">
              <p className="text-xs mb-0.5 opacity-60">Derived</p>
              <p className="font-buryat text-lg font-bold">{d.example.derived}</p>
              <p className="text-xs italic opacity-70">{d.example.derivedGloss}</p>
            </div>
          </div>
          {d.corpusQuery && <CorpusLink query={d.corpusQuery} />}
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
            <p className="text-xs text-stone-500 italic">"is (being) made to go"</p>
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
                text: 'Бодоод',
                label: 'rise-SEQ',
                cls: 'bg-amber-100 border-amber-300 text-amber-900',
              },
              {
                text: 'угаагаад',
                label: 'wash-SEQ',
                cls: 'bg-amber-100 border-amber-300 text-amber-900',
              },
              {
                text: 'эдижэ',
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
                {i < arr.length - 1 && <span className="text-stone-500 font-bold">→</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2 italic">
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
              aria-expanded={open === cv.label}
              className="w-full flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-800">{cv.label}</span>
                <code className="text-xs bg-white/60 px-2 py-0.5 rounded font-mono">
                  {cv.suffix}
                </code>
              </div>
              <span
                aria-hidden="true"
                className={`text-stone-500 transition-transform ${open === cv.label ? 'rotate-180' : ''}`}
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
                    <p className="text-xs text-stone-500">
                      <span className="font-semibold">English parallel:</span> {cv.englishParallel}
                    </p>
                    {cv.examples.map(ex => (
                      <div key={ex.buryad} className="bg-white rounded-xl p-3 space-y-1">
                        <p className="font-buryat text-base text-stone-800">{ex.buryad}</p>
                        <p className="text-xs font-mono text-stone-500">{ex.gloss}</p>
                        <p className="text-sm italic text-stone-600">'{ex.translation}'</p>
                      </div>
                    ))}
                    {cv.corpusQuery && <CorpusLink query={cv.corpusQuery} />}
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
  { key: 'presentFuture', label: 'Present', category: 'Finite', color: 'text-mongol-700' },
  { key: 'simplePast', label: 'Simple Past (-ба)', category: 'Finite', color: 'text-green-700' },
  { key: 'perfect', label: 'Perfect (-аа)', category: 'Finite', color: 'text-green-700' },
  {
    key: 'pastParticiple',
    label: 'Past Participle (-һан)',
    category: 'Nominal',
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
    color: 'text-rose-600',
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
              aria-pressed={verbIdx === i}
              className={`px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                verbIdx === i
                  ? 'border-buryat-500 bg-buryat-50 text-buryat-800'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <span className="font-buryat mr-1">{vp.infinitive}</span>
              <span className="text-stone-500 text-xs">— {vp.meaning}</span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
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
                <span className="text-stone-500 ml-2 italic">'{vp.meaning}'</span>
              </div>
              <span className="ml-auto">
                <Tooltip
                  text={HARMONY_TIP[vp.harmony]}
                  className={`badge ${vp.harmony === 'back' ? 'badge-amber' : 'badge-blue'}`}
                >
                  {vp.harmony} harmony
                </Tooltip>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="text-left py-2 pr-4 text-stone-500 font-normal">Form</th>
                    <th className="text-left py-2 pr-4 text-stone-500 font-normal">Category</th>
                    <th className="text-left py-2 text-stone-500 font-normal">Буряад</th>
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
                        <SayButton word={vp.forms[row.key]} className="ml-1" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

// Labels come from the i18n messages under `verbs.tabs`.
const TAB_IDS: ReadonlyArray<Omit<TabDef<Tab>, 'label'>> = [
  { id: 'anatomy', icon: '🧬' },
  { id: 'tenses', icon: '⏱️' },
  { id: 'person', icon: '👤' },
  { id: 'voice', icon: '🔄' },
  { id: 'converbs', icon: '🔗' },
  { id: 'conjugator', icon: '⚡' },
  { id: 'builder', icon: '🔤' },
];

export default function Verbs() {
  const { t } = useI18n();
  const TABS = TAB_IDS.map(d => ({ ...d, label: t.verbs.tabs[d.id] }));
  const [tab, setTab] = useTab(TABS);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">{t.verbs.title}</h1>
        <p className="text-stone-500 mt-1">{t.verbs.intro}</p>
      </motion.div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} label={t.verbs.tabsLabel} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.25 }}
          {...tabPanelProps(tab)}
        >
          {tab === 'anatomy' && <VerbAnatomy />}
          {tab === 'tenses' && <TenseTimeline />}
          {tab === 'person' && <PersonEndings />}
          {tab === 'voice' && <VoiceDerivation />}
          {tab === 'converbs' && <ConverbSection />}
          {tab === 'conjugator' && <Conjugator />}
          {tab === 'builder' && <VerbBuilder />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
