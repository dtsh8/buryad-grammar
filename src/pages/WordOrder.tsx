import { motion } from 'framer-motion';
import WordOrderDiagram from '../components/WordOrderDiagram';
import AgglutinationDiagram from '../components/AgglutinationDiagram';
import { POSTPOSITIONS } from '../data/grammar';
import { useState } from 'react';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
type Tab = 'order' | 'postpositions' | 'agglutination';

export default function WordOrder() {
  const [tab, setTab] = useState<Tab>('order');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">Syntax & Word Order</h1>
        <p className="text-stone-500 mt-1">
          SOV order, postpositions, pre-nominal modifiers, and agglutinative morphology.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex gap-6">
        {(
          [
            ['order', 'Word Order'],
            ['postpositions', 'Postpositions'],
            ['agglutination', 'Agglutination'],
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

      {tab === 'order' && (
        <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">SOV Word Order</h2>
            <WordOrderDiagram />
          </div>

          {/* Pre-nominal modifier section */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Pre-Nominal Modifiers</h2>
            <p className="text-sm text-stone-500">
              In Buryad, all noun modifiers (adjectives, genitives, relative clauses) come{' '}
              <strong>before</strong> the noun — the opposite of languages like French or Spanish.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  Buryad
                </p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="bg-mongol-100 border border-mongol-200 rounded-lg px-2 py-1 font-buryat text-mongol-800">
                    томо
                  </span>
                  <span className="text-stone-400 text-sm">+</span>
                  <span className="bg-amber-100 border border-amber-200 rounded-lg px-2 py-1 font-buryat text-amber-800">
                    гэр
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-stone-400">
                  <span>big</span>
                  <span>house</span>
                </div>
                <p className="text-sm italic text-stone-600">'big house'</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  English
                </p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="bg-mongol-100 border border-mongol-200 rounded-lg px-2 py-1 text-mongol-800">
                    big
                  </span>
                  <span className="text-stone-400 text-sm">+</span>
                  <span className="bg-amber-100 border border-amber-200 rounded-lg px-2 py-1 text-amber-800">
                    house
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-stone-400">
                  <span>big</span>
                  <span>house</span>
                </div>
                <p className="text-sm italic text-stone-600">
                  'big house' ← same order here, but relative clauses differ!
                </p>
              </div>
            </div>

            {/* Relative clause comparison */}
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-800">
                🔄 Relative clauses: key difference
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase mb-1">
                    English (post-nominal)
                  </p>
                  <p className="italic text-stone-700">
                    "the man <u>who reads books</u>"
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">→ relative clause AFTER noun</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase mb-1">
                    Buryad (pre-nominal)
                  </p>
                  <p className="font-buryat text-buryat-700">
                    "<u>ном уншадаг</u> хүн"
                  </p>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">book read-PTCP man</p>
                  <p className="text-xs text-stone-400">→ relative clause BEFORE noun</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'postpositions' && (
        <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Postpositions vs. Prepositions</h2>
            <p className="text-sm text-stone-500">
              English uses <em>pre</em>positions (before NP); Buryad uses <em>post</em>positions
              (after NP).
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm space-y-2">
                <p className="font-semibold text-red-800">English (PRE-position)</p>
                <p className="text-red-700">
                  <strong>about</strong> Buryatia
                </p>
                <p className="text-red-700">
                  <strong>inside</strong> the city
                </p>
                <p className="text-red-700">
                  <strong>beside</strong> the house
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm space-y-2">
                <p className="font-semibold text-green-800">Buryad (POST-position)</p>
                <p className="font-buryat text-green-700">
                  Буряадай <strong>тухай</strong>
                </p>
                <p className="font-buryat text-green-700">
                  хотын <strong>дотор</strong>
                </p>
                <p className="font-buryat text-green-700">
                  гэрэй <strong>хажуугаар</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Postposition Reference</h2>
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  {['Postposition', 'Meaning', 'Case required', 'Example'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-stone-400 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POSTPOSITIONS.map(p => (
                  <tr key={p.buryad} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-2.5 pr-4 font-buryat text-buryat-700 font-semibold text-base">
                      {p.buryad}
                    </td>
                    <td className="py-2.5 pr-4 text-stone-600">{p.meaning}</td>
                    <td className="py-2.5 pr-4">
                      <span className="badge badge-amber">{p.caseRequired}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="font-buryat text-stone-700">{p.example.phrase}</span>
                      <span className="text-stone-400 text-xs ml-2">'{p.example.translation}'</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === 'agglutination' && (
        <motion.div variants={fade} initial="hidden" animate="show" className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-stone-800 mb-1">Agglutination in Depth</h2>
            <p className="text-sm text-stone-500 mb-4">
              Buryad builds words by stacking morphemes — each with a single, transparent function.
            </p>
            <AgglutinationDiagram />
          </div>
        </motion.div>
      )}
    </div>
  );
}
