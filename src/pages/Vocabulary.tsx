import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import type { Lexeme, LexemeCategory } from '../data/vocabulary.types';
import SayButton from '../components/SayButton';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const ALL_CATEGORIES: LexemeCategory[] = [
  'noun',
  'verb',
  'adjective',
  'pronoun',
  'numeral',
  'phrase',
  'adverb',
  'particle',
];

const CAT_COLORS: Record<LexemeCategory, string> = {
  noun: 'badge-green',
  verb: 'badge-blue',
  adjective: 'badge-amber',
  pronoun: 'bg-purple-100 border-purple-300 text-purple-800 badge',
  numeral: 'badge-amber',
  phrase: 'badge-red',
  adverb: 'bg-teal-100 border-teal-300 text-teal-800 badge',
  particle: 'bg-stone-100 border-stone-300 text-stone-700 badge',
};

function LexemeCard({ l }: { l: Lexeme }) {
  return (
    <div className="border border-stone-200 rounded-xl p-4 hover:border-buryat-200 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-2">
        <p className="font-buryat text-xl text-stone-800 font-semibold group-hover:text-buryat-700 transition-colors">
          {l.buryad}
          <SayButton word={l.buryad} className="ml-1" />
        </p>
        <span className={`${CAT_COLORS[l.category] ?? 'badge'} shrink-0 text-xs`}>
          {l.category}
        </span>
      </div>
      <p className="text-xs text-stone-500 font-mono mt-0.5">/{l.ipa}/</p>
      <p className="text-sm text-stone-700 mt-1 font-medium">{l.english}</p>
      {l.russian && <p className="text-xs text-stone-500 mt-0.5">{l.russian}</p>}
      {l.tags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {l.tags.map(t => (
            <span key={t} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-24 bg-stone-100 rounded-xl" />
      ))}
    </div>
  );
}

export default function Vocabulary() {
  const { data, loading, error } = useVocabulary();
  const [activeCats, setActiveCats] = useState<Set<LexemeCategory>>(new Set());
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'alpha' | 'category'>('alpha');

  // Derive which categories actually exist in the data
  const presentCats = useMemo(
    () => ALL_CATEGORIES.filter(c => data.some(l => l.category === c)),
    [data]
  );

  const toggleCat = (c: LexemeCategory) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) {
        next.delete(c);
      } else {
        next.add(c);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data
      .filter(l => {
        const matchCat = activeCats.size === 0 || activeCats.has(l.category);
        const matchQ =
          q === '' ||
          l.buryad.toLowerCase().includes(q) ||
          l.english.toLowerCase().includes(q) ||
          (l.russian?.toLowerCase().includes(q) ?? false) ||
          (l.tags?.some(t => t.includes(q)) ?? false);
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        if (sort === 'category') {
          const cc = a.category.localeCompare(b.category);
          if (cc !== 0) return cc;
        }
        return a.buryad.localeCompare(b.buryad, 'ru');
      });
  }, [data, activeCats, query, sort]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-stone-900">Vocabulary</h1>
          {!loading && <span className="text-stone-500 text-sm">{data.length} entries</span>}
        </div>
        <p className="text-stone-500 mt-1">
          Core Buryad lexicon — searchable by Буряад, English, or Russian.
        </p>
      </motion.div>

      {/* Search + filter bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="search"
            aria-label="Search vocabulary"
            placeholder="буряад / English / русский…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-buryat-400 focus:ring-1 focus:ring-buryat-200 w-full sm:w-60"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            aria-label="Sort order"
            className="border border-stone-200 rounded-lg px-2 py-1.5 text-sm text-stone-600 outline-none focus:border-buryat-400"
          >
            <option value="alpha">A–Я alphabetical</option>
            <option value="category">By category</option>
          </select>
          {activeCats.size > 0 && (
            <button
              onClick={() => setActiveCats(new Set())}
              className="text-xs text-stone-500 hover:text-stone-700 underline"
            >
              clear filters
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {presentCats.map(c => (
            <button
              key={c}
              onClick={() => toggleCat(c)}
              aria-pressed={activeCats.has(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                activeCats.has(c)
                  ? 'bg-buryat-500 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {c}
              {!loading && (
                <span className="ml-1 opacity-60">{data.filter(l => l.category === c).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          ⚠️ Could not load vocabulary: {error}
        </div>
      )}

      {/* Loading */}
      {loading && <SkeletonGrid />}

      {/* Results */}
      {!loading && !error && (
        <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.3 }}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(l => (
              <LexemeCard key={l.id} l={l} />
            ))}
            {filtered.length === 0 && (
              <p className="text-stone-500 text-sm col-span-3 py-8 text-center">
                No words match your search.
              </p>
            )}
          </div>
          <p className="text-xs text-stone-500 text-right mt-3">
            {filtered.length} of {data.length} entries
          </p>
        </motion.div>
      )}
    </div>
  );
}
