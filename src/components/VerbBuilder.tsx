import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  translateToBuryad,
  extractRoot,
  detectHarmony,
  deriveAll,
  conjugate,
  type DerivedForm,
} from '../utils/verbMorphology'

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

// ─── Quick-pick verbs ──────────────────────────────────────────────────────

const QUICK_VERBS = [
  'go',
  'eat',
  'read',
  'write',
  'love',
  'speak',
  'run',
  'work',
  'know',
  'sing',
  'dance',
  'sleep',
  'teach',
  'help',
]

// ─── Harmony badge ─────────────────────────────────────────────────────────

function HarmonyBadge({ harmony }: { harmony: 'back' | 'front' }) {
  return (
    <span className={`badge ${harmony === 'back' ? 'badge-amber' : 'badge-blue'}`}>
      {harmony === 'back' ? '🔴 Back harmony (а/о/у)' : '🔵 Front harmony (э/ø/ü)'}
    </span>
  )
}

// ─── Base paradigm mini-table ───────────────────────────────────────────────

function BaseParadigm({ root, meaning }: { root: string; meaning: string }) {
  const forms = conjugate(root)
  // Simple past/gerund for English gloss
  const pastEn = meaning.endsWith('e') ? meaning + 'd' : meaning + 'ed'
  const ingEn = meaning.endsWith('e') ? meaning.slice(0, -1) + 'ing' : meaning + 'ing'
  const rows: Array<[string, string, string]> = [
    ['Present-Future', forms.prs, `→ ${meaning}s / will ${meaning}`],
    ['Simple Past', forms.pst, `→ ${pastEn} (witnessed)`],
    ['Evidential Past', forms.evidPst, `→ apparently ${pastEn}`],
    ['Habitual', forms.hab, `→ ${meaning}s (habitually)`],
    ['Negative', forms.neg, `→ does not ${meaning}`],
    ['Infinitive', forms.inf, `→ to ${meaning}`],
    ['Simult. Converb', forms.simConv, `→ while ${ingEn}`],
    ['Seq. Converb', forms.seqConv, `→ having ${pastEn}`],
  ]
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-base font-semibold text-stone-800">Base paradigm</h3>
        <span className="font-buryat text-xl text-buryat-700 font-bold">{forms.inf}</span>
        <span className="text-stone-400 italic text-sm">'{meaning}'</span>
      </div>
      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <tbody>
            {rows.map(([label, form, en]) => (
              <tr key={label} className="border-b border-stone-100">
                <td className="py-1.5 pr-4 text-stone-500 w-44">{label}</td>
                <td className="py-1.5 pr-4 font-buryat text-lg font-semibold text-stone-800">
                  {form}
                </td>
                <td className="py-1.5 text-xs text-stone-400 italic">{en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Derivation card ───────────────────────────────────────────────────────

function DerivCard({
  d,
  expanded,
  onToggle,
}: {
  d: DerivedForm
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${d.color}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-stone-900">{d.label}</span>
          <code className="text-xs bg-white/70 px-2 py-0.5 rounded font-mono">{d.suffix}</code>
          <span className="font-buryat text-xl font-bold text-stone-800">{d.inf}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-xs text-stone-500 italic hidden sm:block">{d.englishRole}</span>
          <span
            className={`text-stone-400 transition-transform text-lg ${expanded ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-stone-200/60">
              {/* Description */}
              <p className="text-sm text-stone-600 mt-3">{d.description}</p>

              {/* Morpheme breakdown */}
              <div className="flex items-end gap-2 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="bg-stone-700 text-white px-3 py-2 rounded-lg font-buryat text-base font-bold">
                    {/* show the base root inside derived root */}
                    {d.root.slice(0, d.root.length - d.suffix.replace(/^-/, '').length)}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 uppercase">ROOT</span>
                </div>
                <span className="text-stone-300 text-lg mb-4">+</span>
                <div className="flex flex-col items-center">
                  <div className="bg-amber-500 text-white px-3 py-2 rounded-lg font-buryat text-base font-bold">
                    {d.suffix.replace(/^-/, '')}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 uppercase">DERIV</span>
                </div>
                <span className="text-stone-400 mx-1 mb-4 font-bold">→</span>
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-stone-300 px-3 py-2 rounded-lg font-buryat text-lg font-bold text-stone-800">
                    {d.root}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 uppercase">DERIV.ROOT</span>
                </div>
              </div>

              {/* Mini conjugation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    ['INF', d.inf],
                    ['PRS', d.prs],
                    ['PST', d.pst],
                    ['NEG', d.neg],
                  ] as [string, string][]
                ).map(([lbl, frm]) => (
                  <div key={lbl} className="bg-white/70 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-stone-400 font-mono uppercase">{lbl}</p>
                    <p className="font-buryat text-base font-bold text-stone-800">{frm}</p>
                  </div>
                ))}
              </div>

              {/* Example sentence */}
              <div className="bg-white rounded-xl p-3 space-y-1">
                <p className="font-buryat text-base text-stone-800">{d.exampleSentence.buryad}</p>
                <p className="text-xs font-mono text-stone-400">{d.exampleSentence.gloss}</p>
                <p className="text-sm italic text-stone-600">'{d.exampleSentence.translation}'</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function VerbBuilder() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [infinitive, setInfinitive] = useState('')
  const [root, setRoot] = useState('')
  const [meaning, setMeaning] = useState('')
  const [derivations, setDerivations] = useState<DerivedForm[]>([])
  const [expanded, setExpanded] = useState<string>('Causative')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleTranslate(verb?: string) {
    const query = (verb ?? input).trim()
    if (!query) return
    if (verb) setInput(verb)

    setStatus('loading')
    setErrorMsg('')
    try {
      const buryad = await translateToBuryad(query)
      const r = extractRoot(buryad)
      const d = deriveAll(r, query.replace(/^to\s+/i, ''))
      setInfinitive(buryad)
      setRoot(r)
      setMeaning(query.replace(/^to\s+/i, ''))
      setDerivations(d)
      setStatus('done')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Translation failed — check your connection.')
      setStatus('error')
    }
  }

  const harmony = root ? detectHarmony(root) : null

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Verb Builder</h2>
        <p className="text-sm text-stone-500">
          Enter any English verb. It will be translated to Буряад using the Google Translate
          <span className="font-mono text-xs ml-1 bg-stone-100 px-1 rounded">bxr</span> (Buryat
          Russia) API, then the root is extracted and all five voice derivations are applied
          automatically.
        </p>

        {/* Search box */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTranslate()}
            placeholder="e.g. write, to sing, dance…"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-buryat-400 focus:ring-2 focus:ring-buryat-100 transition"
          />
          <button
            onClick={() => handleTranslate()}
            disabled={status === 'loading' || !input.trim()}
            className="px-5 py-2.5 bg-buryat-600 hover:bg-buryat-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {status === 'loading' ? '…' : 'Derive'}
          </button>
        </div>

        {/* Quick-pick */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-stone-400 mr-1 self-center">Quick:</span>
          {QUICK_VERBS.map(v => (
            <button
              key={v}
              onClick={() => handleTranslate(v)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-buryat-100 hover:text-buryat-800 text-stone-600 rounded-full text-xs transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={infinitive}
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Translation result header */}
            <div className="rounded-2xl bg-gradient-to-r from-stone-800 to-stone-700 text-white p-5 space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">
                    English → Buryad
                  </p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-stone-300 text-lg italic">"{meaning}"</span>
                    <span className="text-stone-500 text-xl">→</span>
                    <span className="font-buryat text-4xl font-bold">{infinitive}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-stone-400 text-xs">Root</p>
                  <p className="font-buryat text-2xl font-bold text-buryat-400">{root}-</p>
                  {harmony && <HarmonyBadge harmony={harmony} />}
                </div>
              </div>

              {/* Morpheme highlight */}
              <div className="flex items-center gap-1.5 text-sm flex-wrap">
                <span className="text-stone-400">Structure:</span>
                <span className="bg-stone-600 text-white px-2 py-0.5 rounded font-buryat">
                  {root}
                </span>
                <span className="text-stone-500">+</span>
                <span className="bg-buryat-500 text-white px-2 py-0.5 rounded font-mono">
                  {harmony === 'back' ? '-ха' : '-хэ'}
                </span>
                <span className="text-stone-400 text-xs">(infinitive suffix)</span>
              </div>
            </div>

            {/* Base paradigm */}
            <BaseParadigm root={root} meaning={meaning} />

            {/* Derivations */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
                Voice & Valency Derivations
              </h3>
              {derivations.map(d => (
                <DerivCard
                  key={d.label}
                  d={d}
                  expanded={expanded === d.label}
                  onToggle={() => setExpanded(expanded === d.label ? '' : d.label)}
                />
              ))}
            </div>

            {/* Attribution */}
            <p className="text-xs text-stone-400 text-center">
              Translation via Google Translate (bxr — Buryat Russia). Morphology rules: Poppe (1960)
              · Skribnik &amp; Sesenova (2006). Results are approximate — always verify with a
              native speaker.
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
