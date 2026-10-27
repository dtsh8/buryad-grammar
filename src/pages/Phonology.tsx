import { motion } from 'framer-motion'
import { useState } from 'react'
import { CONSONANTS } from '../data/grammar'
import VowelHarmonyChart from '../components/VowelHarmonyChart'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const PLACE_COLORS: Record<string, string> = {
  bilabial: '#c8851a',
  alveolar: '#0e88ea',
  velar: '#16a34a',
  postalveolar: '#9333ea',
  palatal: '#db2777',
  glottal: '#6b7280',
}

const placeCounts = Object.entries(
  CONSONANTS.reduce<Record<string, number>>((acc, c) => {
    acc[c.place] = (acc[c.place] || 0) + 1
    return acc
  }, {})
).map(([place, count]) => ({ place, count }))

type Tab = 'harmony' | 'consonants' | 'structure'

export default function Phonology() {
  const [tab, setTab] = useState<Tab>('harmony')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Phonology</h1>
        <p className="text-stone-500 mt-1">
          Sound system of Буряад хэлэн — vowels, harmony, and consonants.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex gap-6">
        {(
          [
            ['harmony', 'Vowel Harmony'],
            ['consonants', 'Consonants'],
            ['structure', 'Syllable Structure'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`pb-3 text-sm font-medium transition-colors ${tab === id ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Vowel Harmony panel */}
      {tab === 'harmony' && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3 }}
          className="space-y-6"
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
                    <th className="text-left py-2 pr-4 text-stone-400 font-normal">Root</th>
                    <th className="text-left py-2 px-3 text-stone-400 font-normal">Harmony</th>
                    <th className="text-left py-2 px-3 text-stone-400 font-normal">+Dative</th>
                    <th className="text-left py-2 px-3 text-stone-400 font-normal">
                      +Instrumental
                    </th>
                    <th className="text-left py-2 pl-3 text-stone-400 font-normal">Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { root: 'гэр', harmony: 'front (э)', dat: 'гэртэ', ins: 'гэрээр', tr: 'house' },
                    {
                      root: 'газар',
                      harmony: 'back (а)',
                      dat: 'газарта',
                      ins: 'газаараар',
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
                        <span
                          className={`badge ${row.harmony.startsWith('back') ? 'badge-amber' : 'badge-blue'}`}
                        >
                          {row.harmony}
                        </span>
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
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              Consonant Inventory ({CONSONANTS.length} phonemes)
            </h2>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    {['Letter', 'IPA', 'Place', 'Manner', 'Voiced'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-stone-400 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONSONANTS.map(c => (
                    <tr key={c.letter} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-2 pr-4 font-buryat text-2xl text-stone-800 w-10">
                        {c.letter}
                      </td>
                      <td className="py-2 pr-4">
                        <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                          /{c.ipa}/
                        </code>
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                          style={{ background: PLACE_COLORS[c.place] ?? '#888' }}
                        >
                          {c.place}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-stone-600 capitalize">{c.manner}</td>
                      <td className="py-2 pr-4">{c.voiced ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar chart by place of articulation */}
          <div className="card">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              Consonants by Place of Articulation
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={placeCounts} margin={{ left: -10 }}>
                <XAxis dataKey="place" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {placeCounts.map(entry => (
                    <Cell key={entry.place} fill={PLACE_COLORS[entry.place] ?? '#aaa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
        >
          <div className="card space-y-5">
            <h2 className="text-lg font-semibold text-stone-800">Syllable Structure</h2>
            <p className="text-sm text-stone-600">
              Buryad syllable structure is <strong>(C)(C)V(C)(C)</strong> — a vowel nucleus is
              obligatory; onset and coda consonants are optional. Long vowels (VV) count as one
              syllable nucleus.
            </p>
            {/* Syllable tree */}
            <div className="flex justify-center">
              <div className="text-center space-y-2">
                <div className="inline-block bg-stone-800 text-white text-sm px-4 py-2 rounded-full font-mono">
                  σ (syllable)
                </div>
                <div className="flex gap-8 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-mongol-100 border border-mongol-300 text-mongol-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Onset (C)
                    </div>
                    <p className="text-xs text-stone-400 mt-1">optional</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-buryat-100 border border-buryat-300 text-buryat-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Nucleus (V/VV)
                    </div>
                    <p className="text-xs text-stone-400 mt-1">obligatory</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-stone-400" />
                    <div className="bg-green-100 border border-green-300 text-green-900 text-sm px-3 py-1.5 rounded-lg font-mono">
                      Coda (C)
                    </div>
                    <p className="text-xs text-stone-400 mt-1">optional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { word: 'гэр', parse: 'г-э-р', pattern: 'CVC', meaning: 'house' },
                { word: 'аха', parse: 'а-ха', pattern: 'V.CV', meaning: 'elder brother' },
                { word: 'уhан', parse: 'у-hан', pattern: 'V.CVC', meaning: 'water' },
              ].map(ex => (
                <div
                  key={ex.word}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center"
                >
                  <p className="font-buryat text-2xl text-stone-800">{ex.word}</p>
                  <p className="text-xs text-stone-400 mt-1 font-mono">{ex.parse}</p>
                  <p className="badge badge-amber mt-1">{ex.pattern}</p>
                  <p className="text-xs text-stone-500 mt-1">'{ex.meaning}'</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
