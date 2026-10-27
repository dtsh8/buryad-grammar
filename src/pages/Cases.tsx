import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CASES, type GrammarCase } from '../data/grammar';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function CaseCard({
  c,
  onClick,
  active,
}: {
  c: GrammarCase;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-xl border-2 p-4 transition-all ${
        active ? c.colorClass + ' shadow-md' : 'bg-white border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-stone-800">{c.english}</p>
          <p className="text-sm font-buryat text-stone-500">{c.buryad}</p>
        </div>
        <span className="text-lg font-mono text-stone-400 shrink-0">{c.suffix.afterConsonant}</span>
      </div>
      <p className="text-xs text-stone-500 mt-2">{c.semanticRole}</p>
    </button>
  );
}

function CaseDetail({ c }: { c: GrammarCase }) {
  return (
    <motion.div
      key={c.id}
      variants={fade}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border-2 p-6 space-y-5 ${c.colorClass}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-stone-900">{c.english}</h2>
          <p className="font-buryat text-lg text-stone-600">{c.buryad}</p>
          <p className="text-sm text-stone-500">{c.russian}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400 mb-0.5">Suffix</p>
          <code className="text-xl font-bold font-mono text-stone-700">
            {c.suffix.afterConsonant}
          </code>
          {c.suffix.afterVowel && (
            <p className="text-xs text-stone-400 mt-1">after vowel: {c.suffix.afterVowel}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
          Question words
        </p>
        <div className="flex flex-wrap gap-2">
          {c.questions.map(q => (
            <span key={q} className="badge-blue badge text-xs">
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">
          Examples
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b border-stone-200/50">
                <th className="text-left py-1.5 pr-4 text-stone-400 font-normal">Stem</th>
                <th className="text-left py-1.5 pr-4 text-stone-400 font-normal">Inflected</th>
                <th className="text-left py-1.5 pr-4 text-stone-400 font-normal">Translation</th>
                <th className="text-left py-1.5 text-stone-400 font-normal">Note</th>
              </tr>
            </thead>
            <tbody>
              {c.examples.map((ex, i) => (
                <tr key={i} className="border-b border-stone-200/30">
                  <td className="py-2 pr-4 font-buryat text-stone-600">{ex.stem}</td>
                  <td className="py-2 pr-4 font-buryat font-bold text-stone-900 text-base">
                    {ex.inflected}
                  </td>
                  <td className="py-2 pr-4 text-stone-600 italic">'{ex.translation}'</td>
                  <td className="py-2 text-xs text-stone-400">{ex.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analogy */}
      <div className="bg-white/60 rounded-xl p-3 text-sm text-stone-600">
        <span className="font-semibold">💡 Analogy: </span>
        {c.analogy}
      </div>
    </motion.div>
  );
}

// ─── Declension paradigm table ─────────────────────────────────────────────

const PARADIGM_NOUN = { root: 'гэр', meaning: 'house', harmony: 'front (э)' };
const PARADIGM_FORMS: Array<{ case_: string; form: string }> = [
  { case_: 'Nominative', form: 'гэр' },
  { case_: 'Genitive', form: 'гэрэй' },
  { case_: 'Dative-Locative', form: 'гэртэ' },
  { case_: 'Accusative', form: 'гэрые' },
  { case_: 'Instrumental', form: 'гэрээр' },
  { case_: 'Comitative', form: 'гэртэй' },
  { case_: 'Ablative', form: 'гэрhэй' },
];

export default function Cases() {
  const [selected, setSelected] = useState<string>(CASES[0].id);
  const activeCase = CASES.find(c => c.id === selected) ?? CASES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Nominal Case System</h1>
        <p className="text-stone-500 mt-1">
          Buryad has <strong>7 cases</strong> — suffixes on the noun that replace prepositions and
          encode grammatical role.
        </p>
      </motion.div>

      {/* Case selector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CASES.map(c => (
          <CaseCard key={c.id} c={c} active={selected === c.id} onClick={() => setSelected(c.id)} />
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <CaseDetail key={selected} c={activeCase} />
      </AnimatePresence>

      {/* Full declension table */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">
          Full Paradigm: <span className="font-buryat text-buryat-700">гэр</span>
          <span className="text-stone-400 font-normal text-base ml-2">
            ({PARADIGM_NOUN.meaning}, {PARADIGM_NOUN.harmony})
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-2 pr-4 text-stone-500">#</th>
                <th className="text-left py-2 pr-4 text-stone-500">Case</th>
                <th className="text-left py-2 pr-4 text-stone-500">Буряад</th>
                <th className="text-left py-2 text-stone-500">Form</th>
              </tr>
            </thead>
            <tbody>
              {PARADIGM_FORMS.map((row, i) => (
                <tr
                  key={row.case_}
                  className={`border-b border-stone-100 cursor-pointer transition-colors ${
                    CASES[i]?.id === selected ? 'bg-buryat-50' : 'hover:bg-stone-50'
                  }`}
                  onClick={() => setSelected(CASES[i]?.id ?? selected)}
                >
                  <td className="py-2.5 pr-4 text-stone-400 font-mono text-xs">{i + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-stone-700">{row.case_}</td>
                  <td className="py-2.5 pr-4 font-buryat text-stone-500">{CASES[i]?.buryad}</td>
                  <td className="py-2.5 font-buryat text-lg text-buryat-700 font-semibold">
                    {row.form}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm">
        <strong className="text-amber-800">📌 Learning tip:</strong>
        <span className="text-amber-700 ml-1">
          Each case suffix is a vowel-harmonic template. Once you learn the 7 back-harmony forms,
          you automatically know the 7 front-harmony variants by substituting а→э, о→ө, у→ү.
        </span>
      </div>
    </div>
  );
}
