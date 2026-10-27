import { motion } from 'framer-motion'
import { useState } from 'react'
import { VERB_FORMS } from '../data/grammar'

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

// ─── Verb formation flowchart ──────────────────────────────────────────────

function VerbFlowchart() {
  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-stone-800">Verb Formation Flowchart</h2>
      <div className="overflow-x-auto">
        <div className="min-w-[500px] space-y-3">
          {/* Root */}
          <div className="flex justify-center">
            <div className="bg-stone-800 text-white rounded-xl px-6 py-3 text-center">
              <p className="text-xs text-stone-400 mb-0.5">Verb Root</p>
              <p className="font-buryat text-xl">яба-</p>
              <p className="text-xs text-stone-400">go</p>
            </div>
          </div>
          <div className="flex justify-center"><div className="w-px h-5 bg-stone-300" /></div>

          {/* Harmony check */}
          <div className="flex justify-center">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-5 py-2.5 text-center">
              <p className="text-xs text-amber-600 font-semibold mb-0.5">◆ HARMONY CHECK</p>
              <p className="text-sm text-amber-800">Root vowel: <strong className="font-buryat">а</strong> → back harmony</p>
            </div>
          </div>
          <div className="flex justify-center"><div className="w-px h-5 bg-stone-300" /></div>

          {/* Tense/form branches */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Present-Future', suffix: '-на', result: 'ябана', color: 'bg-mongol-50 border-mongol-200 text-mongol-800' },
              { label: 'Simple Past',    suffix: '-ба',  result: 'ябаба', color: 'bg-green-50 border-green-200 text-green-800' },
              { label: 'Infinitive',     suffix: '-ха',  result: 'ябаха', color: 'bg-purple-50 border-purple-200 text-purple-800' },
              { label: 'Imperative',     suffix: '—',    result: 'яба!',  color: 'bg-red-50 border-red-200 text-red-800' },
            ].map(b => (
              <div key={b.label} className={`rounded-xl border-2 p-3 text-center ${b.color}`}>
                <p className="text-xs font-semibold mb-1">{b.label}</p>
                <p className="text-xs font-mono mb-1">{b.suffix}</p>
                <p className="font-buryat text-lg font-bold">{b.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Evidentiality block ───────────────────────────────────────────────────

function EvidentialitySection() {
  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-stone-800">Evidentiality — Grammaticalized "How Do You Know?"</h2>
      <p className="text-sm text-stone-500">
        Buryad grammatically encodes whether the speaker <em>directly witnessed</em> an event or is reporting based on inference/hearsay.
        This is built into the verb morphology.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
          <p className="font-semibold text-green-800">👁️ Direct Evidence</p>
          <p className="text-sm text-green-700">Speaker personally witnessed the event.</p>
          <div className="bg-white rounded-lg p-3 space-y-1">
            <p className="font-buryat text-xl text-stone-800">Тэрэ ябаба.</p>
            <p className="text-xs text-stone-400 font-mono">he go-PST.DIRECT</p>
            <p className="text-sm text-stone-600 italic">"He went." <span className="text-green-600">(I saw it happen)</span></p>
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
          <p className="font-semibold text-amber-800">📢 Indirect / Reported Evidence</p>
          <p className="text-sm text-amber-700">Speaker infers or heard from another.</p>
          <div className="bg-white rounded-lg p-3 space-y-1">
            <p className="font-buryat text-xl text-stone-800">Тэрэ ябалай.</p>
            <p className="text-xs text-stone-400 font-mono">he go-PST.INDIR</p>
            <p className="text-sm text-stone-600 italic">"He (apparently) went." <span className="text-amber-600">(I was told / I infer)</span></p>
          </div>
        </div>
      </div>
      <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500">
        📌 This distinction is <strong>obligatory</strong> — speakers must commit to evidential marking every time they use a past tense form.
        English has no grammatical equivalent (only lexical: "apparently", "I heard that").
      </div>
    </div>
  )
}

// ─── Converbs section ─────────────────────────────────────────────────────

function ConverbSection() {
  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-stone-800">Converbs — Non-Finite Verbal Forms</h2>
      <p className="text-sm text-stone-500">
        Converbs are verb forms that link clauses without becoming finite. Buryad has several types:
      </p>
      <div className="space-y-3">
        {[
          {
            type: 'Simultaneous',
            suffix: '-жа / -жэ / -жо',
            description: 'Action occurs at the same time as the main verb.',
            example: 'Би дуулажа ябана.',
            gloss: 'I singing go-PRS',
            translation: 'I go along singing. / I am going while singing.',
            color: 'bg-mongol-50 border-mongol-200',
          },
          {
            type: 'Sequential / Anterior',
            suffix: '-аад / -ооб / -ааб',
            description: 'Action completed before the main verb action.',
            example: 'Ерэжэ ерэлгэ эдеэд ябаба.',
            gloss: 'come-SEQ food eat-SEQ go-PST',
            translation: 'Having come (and) having eaten, he went.',
            color: 'bg-amber-50 border-amber-200',
          },
          {
            type: 'Conditional',
            suffix: '-баа / -бол',
            description: 'Marks the condition for the main clause.',
            example: 'Бороо ороболь бидэ гэртэ байха.',
            gloss: 'rain fall-COND we home-DAT be-INF',
            translation: 'If it rains, we will stay home.',
            color: 'bg-green-50 border-green-200',
          },
        ].map(cv => (
          <div key={cv.type} className={`rounded-xl border p-4 space-y-2 ${cv.color}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-800">{cv.type}</span>
              <code className="text-xs bg-white/70 px-2 py-0.5 rounded font-mono">{cv.suffix}</code>
            </div>
            <p className="text-sm text-stone-600">{cv.description}</p>
            <div className="bg-white rounded-lg p-3 space-y-1">
              <p className="font-buryat text-base text-stone-800">{cv.example}</p>
              <p className="text-xs text-stone-400 font-mono">{cv.gloss}</p>
              <p className="text-sm text-stone-600 italic">'{cv.translation}'</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────

type Tab = 'forms' | 'evidentiality' | 'converbs'

export default function Verbs() {
  const [tab, setTab] = useState<Tab>('forms')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Verb System</h1>
        <p className="text-stone-500 mt-1">
          Tense, aspect, converbs, and grammaticalized evidentiality.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex gap-6">
        {([['forms','Verb Forms'],['evidentiality','Evidentiality'],['converbs','Converbs']] as [Tab,string][]).map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`pb-3 text-sm font-medium transition-colors ${tab===id?'tab-active':'tab-inactive'}`}
          >{label}</button>
        ))}
      </div>

      {tab === 'forms' && (
        <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6">
          <VerbFlowchart />
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Complete Form Reference</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {VERB_FORMS.map(form => (
                <div key={form.label} className="border border-stone-200 rounded-xl p-4 hover:border-buryat-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-stone-700">{form.label}</span>
                    <code className="text-xs bg-buryat-50 text-buryat-700 px-2 py-0.5 rounded font-mono">{form.suffix}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="font-buryat text-xl text-stone-800">{form.example.form}</p>
                    <p className="text-xs text-stone-400 font-mono">{form.example.verb}</p>
                    <p className="text-sm text-stone-600 italic">'{form.example.translation}'</p>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 border-t border-stone-100 pt-2">{form.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conjugation table */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">
              Note on Agreement
            </h2>
            <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 space-y-2">
              <p>
                Buryad verbs <strong>do not agree with the subject</strong> in person or number.
                The same form is used for all persons:
              </p>
              <div className="overflow-x-auto">
                <table className="text-sm">
                  <tbody>
                    {[
                      ['Би',    'I',    'ябана'],
                      ['Ши',    'You',  'ябана'],
                      ['Тэрэ',  'He/She','ябана'],
                      ['Бид',   'We',   'ябана'],
                      ['Та',    'You pl.','ябана'],
                      ['Тэдэнэр','They','ябана'],
                    ].map(([bur, en, form]) => (
                      <tr key={bur} className="border-b border-stone-200">
                        <td className="py-1.5 pr-4 font-buryat text-buryat-700 font-semibold">{bur}</td>
                        <td className="py-1.5 pr-4 text-stone-400">{en}</td>
                        <td className="py-1.5 font-buryat text-stone-800">{form}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400">All forms = <span className="font-buryat">ябана</span> 'go (PRS)'</p>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'evidentiality' && (
        <motion.div variants={fade} initial="hidden" animate="show">
          <EvidentialitySection />
        </motion.div>
      )}

      {tab === 'converbs' && (
        <motion.div variants={fade} initial="hidden" animate="show">
          <ConverbSection />
        </motion.div>
      )}
    </div>
  )
}
