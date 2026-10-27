import { motion } from 'framer-motion'
import { useState } from 'react'
import { VOCABULARY, type Lexeme } from '../data/grammar'

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const CATEGORIES = ['all', 'pronoun', 'numeral', 'noun', 'phrase'] as const
type Cat = (typeof CATEGORIES)[number]

const CAT_COLORS: Record<string, string> = {
  pronoun: 'badge-blue',
  numeral: 'badge-amber',
  noun: 'badge-green',
  phrase: 'badge-red',
}

function LexemeCard({ l }: { l: Lexeme }) {
  return (
    <div className="border border-stone-200 rounded-xl p-4 hover:border-buryat-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <p className="font-buryat text-xl text-stone-800 font-semibold">{l.buryad}</p>
        <span className={`badge ${CAT_COLORS[l.category] ?? ''} shrink-0`}>{l.category}</span>
      </div>
      <p className="text-xs text-stone-400 font-mono mt-0.5">/{l.ipa}/</p>
      <p className="text-sm text-stone-600 mt-1 italic">{l.english}</p>
    </div>
  )
}

export default function Vocabulary() {
  const [cat, setCat] = useState<Cat>('all')
  const [query, setQuery] = useState('')

  const filtered = VOCABULARY.filter(
    l =>
      (cat === 'all' || l.category === cat) &&
      (query === '' ||
        l.buryad.toLowerCase().includes(query.toLowerCase()) ||
        l.english.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Vocabulary</h1>
        <p className="text-stone-500 mt-1">Core words, phrases, pronouns, and numerals.</p>
      </motion.div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search Buryad or English…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-buryat-400 focus:ring-1 focus:ring-buryat-200 w-52"
        />
        <div className="flex gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                cat === c
                  ? 'bg-buryat-100 text-buryat-800'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map(l => (
          <LexemeCard key={l.buryad} l={l} />
        ))}
        {filtered.length === 0 && (
          <p className="text-stone-400 text-sm col-span-3 py-8 text-center">
            No words match your search.
          </p>
        )}
      </div>

      {/* Numbers table */}
      {(cat === 'all' || cat === 'numeral') && query === '' && (
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Numeral System</h2>
          <p className="text-sm text-stone-500">
            Buryad uses a decimal system. Numbers compound predictably:
          </p>
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 pr-4 text-stone-400 font-normal">Value</th>
                  <th className="text-left py-2 pr-4 text-stone-400 font-normal">Buryad</th>
                  <th className="text-left py-2 text-stone-400 font-normal">IPA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [1, 'нэгэн', 'neɡen'],
                  [2, 'хоёр', 'xojor'],
                  [3, 'гурбан', 'ɡurban'],
                  [4, 'дүрбэн', 'dyrben'],
                  [5, 'табан', 'taban'],
                  [6, 'зургаан', 'zurɡaːn'],
                  [7, 'долоон', 'doloːn'],
                  [8, 'найман', 'najman'],
                  [9, 'юhэн', 'juhen'],
                  [10, 'арбан', 'arban'],
                  [20, 'хорин', 'xorin'],
                  [100, 'зуун', 'zuːn'],
                  [1000, 'мянган', 'mjaŋɡan'],
                ].map(([n, bur, ipa]) => (
                  <tr key={n} className="border-b border-stone-100">
                    <td className="py-2 pr-4 text-stone-600 font-mono">{n}</td>
                    <td className="py-2 pr-4 font-buryat text-lg text-stone-800">{bur}</td>
                    <td className="py-2 text-xs text-stone-400 font-mono">/{ipa}/</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-400">
            Compounds: 11 = арбан нэгэн (ten-one), 21 = хорин нэгэн (twenty-one), 23 = хорин гурбан
            (twenty-three)
          </p>
        </div>
      )}

      {/* Phrasebook */}
      {(cat === 'all' || cat === 'phrase') && query === '' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Essential Phrases</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { bur: 'Сайн байна уу?', en: 'How are you? (lit. "Is it good?")' },
              { bur: 'Сайн, баярлаа.', en: 'Fine, thank you.' },
              { bur: 'Таны нэрэн хэн бэ?', en: 'What is your name?' },
              { bur: 'Минии нэрэн …', en: 'My name is …' },
              { bur: 'Би Буряадаар мэдэхэгүйб.', en: "I don't know Buryat." },
              { bur: 'Дахин хэлыт.', en: 'Please say it again.' },
              { bur: 'Хаана байна?', en: 'Where is it?' },
              { bur: 'Хэды мүнгэн бэ?', en: 'How much does it cost?' },
            ].map(p => (
              <div key={p.bur} className="bg-stone-50 rounded-xl p-3 space-y-1">
                <p className="font-buryat text-base text-stone-800">{p.bur}</p>
                <p className="text-sm text-stone-500 italic">{p.en}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
