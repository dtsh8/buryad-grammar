import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { LANGUAGE_META } from '../data/grammar'
import ComparisonTable, { TypologyRadar } from '../components/ComparisonTable'
import { Globe2, Users, BookMarked, Mic2 } from 'lucide-react'

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const navCards = [
  {
    to: '/phonology',
    emoji: '🔊',
    title: 'Phonology',
    desc: 'Vowel harmony, consonants, long vowels',
  },
  { to: '/cases', emoji: '📐', title: 'Cases', desc: '7 nominal cases with endings and examples' },
  { to: '/verbs', emoji: '⚡', title: 'Verbs', desc: 'Tense, converbs, evidentiality' },
  { to: '/word-order', emoji: '🔀', title: 'Word Order', desc: 'SOV, postpositions, modifiers' },
  { to: '/vocabulary', emoji: '📖', title: 'Vocabulary', desc: 'Core words, phrases and numerals' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
      {/* Hero */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-buryat-100 text-buryat-700 text-sm font-medium mb-2">
          <span>ISO 639-3: bua</span>
          <span className="opacity-40">|</span>
          <span>Mongolic family</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-buryat font-bold text-stone-900 leading-tight">
          Буряад хэлэн
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto">
          An interactive grammar reference for the <strong>Buryat language</strong> — an
          agglutinative, SOV, vowel-harmonic Mongolic tongue of Eastern Siberia.
        </p>
      </motion.section>

      {/* Quick stats */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Users, label: 'Native speakers', value: '~461 000' },
          { icon: Globe2, label: 'Word order', value: 'SOV' },
          { icon: BookMarked, label: 'Nominal cases', value: '7 cases' },
          { icon: Mic2, label: 'Vowel harmony', value: 'Back / Front' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card text-center py-5">
            <Icon size={22} className="mx-auto text-buryat-400 mb-2" />
            <p className="text-xl font-bold text-stone-800">{value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.section>

      {/* Language overview */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Language Profile</h2>
          {Object.entries({
            Family: LANGUAGE_META.family,
            Scripts: LANGUAGE_META.scripts.join(', '),
            Regions: LANGUAGE_META.regions.join('; '),
            Morphology: LANGUAGE_META.typology.morphologicalType,
            Alignment: LANGUAGE_META.typology.caseMarking,
          }).map(([k, v]) => (
            <div key={k} className="flex gap-2 text-sm">
              <span className="text-stone-400 w-24 shrink-0">{k}</span>
              <span className="text-stone-700">{v}</span>
            </div>
          ))}
        </div>
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold text-stone-800">Key Typological Features</h2>
          <ul className="space-y-2 text-sm text-stone-700">
            {[
              '🧩 Agglutinative morphology — suffixes stack transparently',
              '🔊 Vowel harmony — back vs. front vowels determine suffix shape',
              '🔚 Verb-final (SOV) — verb always last in clause',
              '📐 7 cases — replace prepositions and word-order signals',
              '👁️ Evidentiality — grammar marks how you know something',
              '🚫 No grammatical gender — nouns are genderless',
              '↙️ Pre-nominal modifiers — adjectives and rel. clauses precede nouns',
            ].map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Navigation cards */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Explore the Grammar</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map(({ to, emoji, title, desc }) => (
            <NavLink
              key={to}
              to={to}
              className="card group hover:shadow-md hover:border-buryat-200 transition-all border cursor-pointer"
            >
              <span className="text-3xl mb-2 block">{emoji}</span>
              <h3 className="font-semibold text-stone-800 group-hover:text-buryat-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-stone-400 mt-1">{desc}</p>
            </NavLink>
          ))}
        </div>
      </motion.section>

      {/* Comparison */}
      <motion.section
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, delay: 0.25 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-stone-800">Cross-Language Comparison</h2>
        <ComparisonTable />
        <TypologyRadar />
      </motion.section>
    </div>
  )
}
