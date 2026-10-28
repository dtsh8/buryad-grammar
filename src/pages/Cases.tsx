import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { CASES, POSSESSIVE_SUFFIXES, type GrammarCase } from '../data/grammar';
import CorpusLink from '../components/CorpusLink';
import { useVocabulary } from '../hooks/useVocabulary';
import { decline, type CaseId } from '../utils/nounMorphology';
import SayButton from '../components/SayButton';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// Suffix strings list rules separated by " · ", each a form plus an optional condition:
// "-да after л, м, н · -та after other consonants" → [{form: "-да", when: "after л, м, н"}, …]
function suffixRules(s: string): Array<{ form: string; when: string }> {
  return s.split(' · ').map(rule => {
    const [form, ...rest] = rule.trim().split(' ');
    return { form, when: rest.join(' ') };
  });
}

// Just the forms, for the compact case card: "-да / -та".
function suffixForms(s: string): string {
  return [...new Set(suffixRules(s).map(r => r.form))].join(' / ');
}

function SuffixRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
      <span className="text-xs text-stone-500 sm:w-36 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5 min-w-0">
        {value === '—' ? (
          <span className="text-sm text-stone-500 italic">no suffix</span>
        ) : (
          suffixRules(value).map(r => (
            <span
              key={r.form + r.when}
              className="inline-flex flex-wrap items-baseline gap-1 bg-white/70 border border-stone-200 rounded-lg px-2 py-1 text-sm max-w-full"
            >
              <code className="font-buryat font-bold text-stone-800">{r.form}</code>
              {r.when && <span className="text-stone-500 text-xs">{r.when}</span>}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

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
      aria-pressed={active}
      className={`text-left w-full rounded-xl border-2 p-4 transition-all ${
        active ? c.colorClass + ' shadow-md' : 'bg-white border-stone-200 hover:border-stone-300'
      }`}
    >
      <p className="font-semibold text-stone-800">{c.english}</p>
      <p className="text-sm font-buryat text-stone-500">{c.buryad}</p>
      <p className="mt-1 font-buryat text-sm text-stone-500 break-words">
        {c.suffix.afterConsonant === '—' ? 'no suffix' : suffixForms(c.suffix.afterConsonant)}
      </p>
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
      <div>
        <h2 className="text-2xl font-bold text-stone-900">{c.english}</h2>
        <p className="font-buryat text-lg text-stone-600">{c.buryad}</p>
        <p className="text-sm text-stone-500">{c.russian}</p>
      </div>

      {/* Suffix rules */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Suffix</p>
        {!c.suffix.afterVowel || c.suffix.afterVowel === c.suffix.afterConsonant ? (
          <SuffixRow label="After any stem" value={c.suffix.afterConsonant} />
        ) : (
          <>
            <SuffixRow label="After a consonant" value={c.suffix.afterConsonant} />
            <SuffixRow label="After a vowel" value={c.suffix.afterVowel} />
          </>
        )}
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
                <th className="text-left py-1.5 pr-4 text-stone-500 font-normal">Stem</th>
                <th className="text-left py-1.5 pr-4 text-stone-500 font-normal">Inflected</th>
                <th className="text-left py-1.5 pr-4 text-stone-500 font-normal">Translation</th>
                <th className="text-left py-1.5 text-stone-500 font-normal">Note</th>
              </tr>
            </thead>
            <tbody>
              {c.examples.map((ex, i) => (
                <tr key={i} className="border-b border-stone-200/30">
                  <td className="py-2 pr-4 font-buryat text-stone-600">{ex.stem}</td>
                  <td className="py-2 pr-4 font-buryat font-bold text-stone-900 text-base whitespace-nowrap">
                    {ex.inflected}
                    <SayButton word={ex.inflected} className="ml-1" />
                  </td>
                  <td className="py-2 pr-4 text-stone-600 italic">'{ex.translation}'</td>
                  <td className="py-2 text-xs text-stone-500">{ex.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {c.corpusQuery && <CorpusLink query={c.corpusQuery} />}

      {/* Analogy */}
      <div className="bg-white/60 rounded-xl p-3 text-sm text-stone-600">
        <span className="font-semibold">💡 Analogy: </span>
        {c.analogy}
      </div>
    </motion.div>
  );
}

export default function Cases() {
  const [selected, setSelected] = useState<string>(CASES[0].id);
  const activeCase = CASES.find(c => c.id === selected) ?? CASES[0];
  const detailRef = useRef<HTMLDivElement>(null);
  const { data: lexicon } = useVocabulary();
  const nouns = lexicon
    .filter(l => l.category === 'noun')
    .sort((a, b) => a.buryad.localeCompare(b.buryad, 'ru'));
  const [nounId, setNounId] = useState('ger');
  const noun = nouns.find(n => n.id === nounId);
  // гэр until the vocabulary has loaded (or if its id ever changes)
  const forms = decline(noun?.buryad ?? 'гэр', noun?.nStem);

  // Picking a case from the paradigm table further down brings its detail panel into view.
  function showFromTable(id: string) {
    setSelected(id);
    detailRef.current?.scrollIntoView({ block: 'start' });
  }

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
      <div ref={detailRef} className="scroll-mt-20" aria-live="polite">
        <AnimatePresence mode="wait">
          <CaseDetail key={selected} c={activeCase} />
        </AnimatePresence>
      </div>

      {/* Full declension table */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h2 className="text-lg font-semibold text-stone-800">Declension</h2>
          <label htmlFor="declension-noun" className="text-sm text-stone-500">
            Noun
          </label>
          <select
            id="declension-noun"
            value={noun ? nounId : 'ger'}
            onChange={e => setNounId(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-2 py-1 font-buryat text-stone-800 max-w-full"
          >
            {nouns.length === 0 && <option value="ger">гэр — house</option>}
            {nouns.map(n => (
              <option key={n.id} value={n.id}>
                {n.buryad} — {n.english}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-stone-500">
          Built by rule from the textbook's case endings; every form for these nouns was checked
          against the Buryat National Corpus.
          {noun?.nStem === 'unstable' && (
            <>
              {' '}
              Its final <span className="font-buryat">н</span> drops in the accusative, instrumental
              and comitative.
            </>
          )}
          {noun?.nStem === 'stable' && (
            <>
              {' '}
              Its final <span className="font-buryat">н</span> stays in every case.
            </>
          )}
        </p>
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
              {CASES.map(c => ({ case_: c.english, form: forms[c.id as CaseId] })).map((row, i) => (
                <tr
                  key={row.case_}
                  className={`border-b border-stone-100 cursor-pointer transition-colors ${
                    CASES[i]?.id === selected ? 'bg-buryat-50' : 'hover:bg-stone-50'
                  }`}
                  onClick={() => CASES[i] && showFromTable(CASES[i].id)}
                >
                  <td className="py-2.5 pr-4 text-stone-500 font-mono text-xs">{i + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-stone-700">
                    {/* The button gives keyboard users the row's click target. */}
                    <button
                      type="button"
                      aria-pressed={CASES[i]?.id === selected}
                      onClick={e => {
                        e.stopPropagation();
                        if (CASES[i]) showFromTable(CASES[i].id);
                      }}
                      className="text-left hover:text-buryat-700"
                    >
                      {row.case_}
                    </button>
                  </td>
                  <td className="py-2.5 pr-4 font-buryat text-stone-500">{CASES[i]?.buryad}</td>
                  <td className="py-2.5 font-buryat text-lg text-buryat-700 font-semibold">
                    {row.form}
                    <SayButton word={row.form} className="ml-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Possessive suffixes */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Possessive Suffixes</h2>
        <p className="text-sm text-stone-500">
          The possessor's person is a suffix on the noun. It comes <em>after</em> the case suffix:{' '}
          <span className="font-buryat text-stone-700">нютаг-та-мнай</span> "in our homeland"
          (homeland-DAT-1PL).
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Person</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Suffix</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Example</th>
                <th className="text-left py-2 pr-4 text-stone-500 font-normal">Gloss</th>
                <th className="text-left py-2 text-stone-500 font-normal">Translation</th>
              </tr>
            </thead>
            <tbody>
              {POSSESSIVE_SUFFIXES.map(p => (
                <tr key={p.person} className="border-b border-stone-100">
                  <td className="py-2.5 pr-4 text-stone-600 font-medium">{p.person}</td>
                  <td className="py-2.5 pr-4 font-buryat text-stone-700">{p.suffix}</td>
                  <td className="py-2.5 pr-4 font-buryat text-lg text-buryat-700 font-semibold">
                    {p.example}
                    <SayButton word={p.example} className="ml-1" />
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-stone-500">{p.gloss}</td>
                  <td className="py-2.5 italic text-stone-500">'{p.translation}'</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-500">
          All examples are attested in Buryad news texts. The reflexive suffix refers back to the
          subject: <span className="font-buryat">нютагтаа</span> "in one's own homeland".
        </p>
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
