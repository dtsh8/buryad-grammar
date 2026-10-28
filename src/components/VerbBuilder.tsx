import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  conjugate,
  deriveAll,
  detectHarmony,
  extractRoot,
  translateToBuryad,
  type DerivedForm,
} from '../utils/verbMorphology';
import { englishForms } from '../utils/englishForms';
import { findVerb, isBuryad, isInfinitive, primarySense } from '../utils/verbLexicon';
import { useVocabulary } from '../hooks/useVocabulary';
import AttestBadge from './AttestBadge';
import Suffixed from './Suffixed';
import Tooltip from './Tooltip';
import type { Lexeme } from '../data/vocabulary.types';

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

// ─── Where a verb came from ────────────────────────────────────────────────

type Source = 'lexicon' | 'typed' | 'machine';

const SOURCE_BADGE: Record<Source, { cls: string; text: string }> = {
  lexicon: { cls: 'badge-green', text: '✓ From the app’s vocabulary' },
  typed: { cls: 'badge-blue', text: 'Typed in Buryad' },
  machine: { cls: 'badge-amber', text: '⚠ Machine translation, unverified' },
};

interface Resolved {
  infinitive: string;
  root: string;
  meaning: string; // English gloss; empty when unknown (typed Buryad not in the vocabulary)
  russian?: string;
  source: Source;
}

function fromLexeme(l: Lexeme): Resolved {
  return {
    infinitive: l.buryad,
    root: extractRoot(l.buryad),
    meaning: primarySense(l),
    russian: l.russian,
    source: 'lexicon',
  };
}

// Vocabulary first; a Buryad infinitive is used as typed; anything else goes to
// machine translation, whose output must be a single infinitive to be accepted.
async function resolveVerb(query: string, lexicon: Lexeme[]): Promise<Resolved> {
  const found = findVerb(query, lexicon);
  if (found) return fromLexeme(found);

  if (isBuryad(query)) {
    const word = query.trim().toLowerCase();
    if (!isInfinitive(word)) {
      throw new Error(
        `"${query}" is not a Buryad infinitive. Type the -ха / -хо / -хэ form, e.g. хараха.`
      );
    }
    return { infinitive: word, root: extractRoot(word), meaning: '', source: 'typed' };
  }

  const meaning = query.replace(/^to\s+/i, '').trim();
  const buryad = (await translateToBuryad(query)).toLowerCase();
  if (!isInfinitive(buryad)) {
    throw new Error(
      `Google Translate returned "${buryad}", which is not a single Buryad verb in -ха / -хо / -хэ. Try another verb, or type the Buryad infinitive.`
    );
  }
  const known = findVerb(buryad, lexicon);
  if (known) return { ...fromLexeme(known), meaning };
  return { infinitive: buryad, root: extractRoot(buryad), meaning, source: 'machine' };
}

// ─── Harmony badge ─────────────────────────────────────────────────────────

function HarmonyBadge({ harmony }: { harmony: 'back' | 'front' }) {
  return (
    <span className={`badge ${harmony === 'back' ? 'badge-amber' : 'badge-blue'}`}>
      {harmony === 'back' ? 'Back harmony (а/о/у)' : 'Front harmony (э/ө/ү)'}
    </span>
  );
}

// ─── Base paradigm mini-table ───────────────────────────────────────────────

function BaseParadigm({ root, meaning }: { root: string; meaning: string }) {
  const forms = conjugate(root);
  const ef = englishForms(meaning || 'do');
  const rows: Array<[string, string, string]> = [
    ['Present-Future', forms.prs, `→ ${ef.thirdPerson} / will ${meaning}`],
    ['Perfect', forms.perf, `→ ${ef.past} / has ${ef.pastPart}`],
    ['Past Participle', forms.pstPtcp, `→ (who) ${ef.past}`],
    ['Simple Past', forms.pst, `→ ${ef.past}`],
    ['Resultative', forms.res, `→ has long since ${ef.pastPart}`],
    ['Habitual', forms.hab, `→ ${ef.thirdPerson} (habitually)`],
    ['Negative', forms.neg, `→ does not ${meaning}`],
    ['Negative Past', forms.negPst, `→ did not ${meaning}`],
    ['Infinitive', forms.inf, `→ to ${meaning}`],
    ['Simult. Converb', forms.simConv, `→ while ${ef.gerund}`],
    ['Seq. Converb', forms.seqConv, `→ having ${ef.pastPart}`],
  ];
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-base font-semibold text-stone-800">Base paradigm</h3>
        <span className="font-buryat text-xl text-buryat-700 font-bold">{forms.inf}</span>
        {meaning && <span className="text-stone-500 italic text-sm">'{meaning}'</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <tbody>
            {rows.map(([label, form, en]) => (
              <tr key={label} className="border-b border-stone-100">
                <td className="py-1.5 pr-3 sm:pr-4 text-stone-500 w-28 sm:w-44 align-top">
                  {label}
                  {/* Phones: the gloss sits under the label instead of in its own column */}
                  {meaning && (
                    <span className="sm:hidden block text-xs italic text-stone-400">{en}</span>
                  )}
                </td>
                <td className="py-1.5 pr-4 text-lg font-semibold text-stone-800">
                  <Suffixed base={root} form={form} /> <AttestBadge form={form} />
                </td>
                <td className="hidden sm:table-cell py-1.5 text-xs text-stone-500 italic">
                  {meaning && en}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Derivation card ───────────────────────────────────────────────────────

function DerivCard({
  d,
  expanded,
  onToggle,
  glossed,
}: {
  d: DerivedForm;
  expanded: boolean;
  onToggle: () => void;
  glossed: boolean;
}) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${d.color}`}>
      {/* Header: the toggle's tap area (::after) covers the whole header; the badges sit
          above it (z-10) so they open their own tooltips. */}
      <div className="relative w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="font-bold text-stone-900 text-left after:absolute after:inset-0 after:content-['']"
          >
            {d.label}
          </button>
          <code className="text-xs bg-white/70 px-2 py-0.5 rounded font-mono">{d.suffix}</code>
          <span className="relative z-10">
            <Tooltip
              text="Built by rule. This verb may not have this voice in real use."
              className="text-[11px] rounded-full border border-stone-300 bg-white/70 text-stone-600 px-2"
            >
              built by rule
            </Tooltip>
          </span>
          <span className="font-buryat text-xl font-bold text-stone-800">{d.inf}</span>
          <span className="relative z-10">
            <AttestBadge form={d.inf} />
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-xs text-stone-500 italic hidden sm:block">{d.englishRole}</span>
          <span
            aria-hidden="true"
            className={`text-stone-500 transition-transform text-lg ${expanded ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </div>
      </div>

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
              {glossed && <p className="text-sm text-stone-600 mt-3">{d.description}</p>}

              {/* Morpheme breakdown */}
              <div className="flex items-end gap-2 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="bg-stone-700 text-white px-3 py-2 rounded-lg font-buryat text-base font-bold">
                    {/* show the base root inside derived root */}
                    {d.root.slice(0, d.root.length - d.suffix.replace(/^[-+]/, '').length)}
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 uppercase">ROOT</span>
                </div>
                <span className="text-stone-300 text-lg mb-4">+</span>
                <div className="flex flex-col items-center">
                  <div className="bg-amber-500 text-white px-3 py-2 rounded-lg font-buryat text-base font-bold">
                    {d.suffix.replace(/^[-+]/, '')}
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 uppercase">DERIV</span>
                </div>
                <span className="text-stone-500 mx-1 mb-4 font-bold">→</span>
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-stone-300 px-3 py-2 rounded-lg font-buryat text-lg font-bold text-stone-800">
                    {d.root}
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 uppercase">DERIV.ROOT</span>
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
                    <p className="text-[10px] text-stone-500 font-mono uppercase">{lbl}</p>
                    <p className="font-buryat text-base font-bold text-stone-800">{frm}</p>
                    <AttestBadge form={frm} />
                  </div>
                ))}
              </div>

              {/* Example sentence */}
              <div className="bg-white rounded-xl p-3 space-y-1">
                <p className="font-buryat text-base text-stone-800">{d.exampleSentence.buryad}</p>
                <p className="text-xs font-mono text-stone-500">{d.exampleSentence.gloss}</p>
                {glossed && (
                  <p className="text-sm italic text-stone-600">'{d.exampleSentence.translation}'</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function VerbBuilder() {
  const { data: lexicon, loading: lexiconLoading } = useVocabulary();
  const quickVerbs = lexicon.filter(l => l.category === 'verb');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Resolved | null>(null);
  const [derivations, setDerivations] = useState<DerivedForm[]>([]);
  const [expanded, setExpanded] = useState<string>('Causative');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Incremented per request; a response is applied only if it is still the latest,
  // so a slow earlier lookup can't overwrite a newer one.
  const requestId = useRef(0);

  async function handleTranslate(verb?: string) {
    const query = (verb ?? input).trim();
    if (!query) return;
    if (verb) setInput(verb);

    const id = ++requestId.current;
    setStatus('loading');
    setErrorMsg('');
    try {
      const r = await resolveVerb(query, lexicon);
      if (id !== requestId.current) return;
      setResult(r);
      setDerivations(deriveAll(r.root, r.meaning || 'do it'));
      setStatus('done');
    } catch (e) {
      if (id !== requestId.current) return;
      setErrorMsg(e instanceof Error ? e.message : 'Translation failed — check your connection.');
      setStatus('error');
    }
  }

  const root = result?.root ?? '';
  const meaning = result?.meaning ?? '';
  const harmony = root ? detectHarmony(root) : null;

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Verb Builder</h2>
        {/* On phones the explanation folds away so the search box comes first. */}
        <p className="hidden sm:block text-sm text-stone-500">
          Type an English verb or a Buryad infinitive. Verbs in the app’s vocabulary are used as
          they are. Anything else is sent to Google Translate, whose Buryad is often wrong, so those
          results are marked as unverified. The full paradigm and the four voice derivations are
          then built by rule.
        </p>
        <details className="sm:hidden text-sm text-stone-500">
          <summary className="cursor-pointer select-none text-buryat-700">How it works</summary>
          <p className="mt-2">
            Type an English verb or a Buryad infinitive. Verbs in the app’s vocabulary are used as
            they are. Anything else is sent to Google Translate, whose Buryad is often wrong, so
            those results are marked as unverified. The full paradigm and the four voice derivations
            are then built by rule.
          </p>
        </details>

        {/* Search box */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTranslate()}
            aria-label="English verb or Buryad infinitive"
            placeholder="e.g. see, to sing, хараха…"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-buryat-400 focus:ring-2 focus:ring-buryat-100 transition"
          />
          <button
            onClick={() => handleTranslate()}
            disabled={status === 'loading' || !input.trim()}
            className="px-5 py-2.5 bg-buryat-600 hover:bg-buryat-700 disabled:bg-stone-200 disabled:text-stone-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {status === 'loading' ? '…' : 'Derive'}
          </button>
        </div>

        {/* Quick-pick */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-stone-500 mr-1 self-center">From the vocabulary:</span>
          {lexiconLoading && <span className="text-xs text-stone-500 self-center">loading…</span>}
          {quickVerbs.map(v => (
            <button
              key={v.id}
              onClick={() => handleTranslate(v.buryad)}
              title={v.english}
              className="px-2.5 py-1 bg-stone-100 hover:bg-buryat-100 hover:text-buryat-800 text-stone-600 rounded-full text-xs transition-colors"
            >
              <span className="font-buryat">{v.buryad}</span>
              <span className="text-stone-500 ml-1">{primarySense(v)}</span>
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
      {status === 'done' && result && (
        <AnimatePresence mode="wait">
          <motion.div
            key={result.infinitive}
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
                  <span className={`badge ${SOURCE_BADGE[result.source].cls}`}>
                    {SOURCE_BADGE[result.source].text}
                  </span>
                  <div className="flex items-baseline gap-3 flex-wrap mt-2">
                    {meaning && (
                      <>
                        <span className="text-stone-300 text-lg italic">"{meaning}"</span>
                        <span className="text-stone-500 text-xl">→</span>
                      </>
                    )}
                    <span className="font-buryat text-4xl font-bold">{result.infinitive}</span>
                  </div>
                  {result.russian && (
                    <p className="text-stone-500 text-sm mt-1">рус. {result.russian}</p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-stone-500 text-xs">Root</p>
                  <p className="font-buryat text-2xl font-bold text-buryat-400">{root}-</p>
                  {harmony && <HarmonyBadge harmony={harmony} />}
                </div>
              </div>

              {/* Morpheme highlight */}
              <div className="flex items-center gap-1.5 text-sm flex-wrap">
                <span className="text-stone-500">Structure:</span>
                <span className="bg-stone-600 text-white px-2 py-0.5 rounded font-buryat">
                  {root}
                </span>
                <span className="text-stone-500">+</span>
                <span className="bg-buryat-500 text-white px-2 py-0.5 rounded font-mono">
                  -{conjugate(root).inf.slice(root.length)}
                </span>
                <span className="text-stone-500 text-xs">(infinitive suffix)</span>
              </div>
            </div>

            {/* Base paradigm */}
            <BaseParadigm root={root} meaning={meaning} />

            {/* Derivations */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
                Voice & Valency Derivations
              </h3>
              <p className="text-sm text-stone-500">
                These forms are built by rule, so the suffixes are right, but not every verb has
                every voice. Some are never used: <span className="font-buryat">унтагдаха</span> "to
                be slept" follows the rules but no text has it. Check a form in the{' '}
                <a
                  href="https://buryat.web-corpora.net/buryat_corpus/search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-buryat-700 hover:underline underline-offset-2"
                >
                  Buryat National Corpus ↗
                </a>{' '}
                before relying on it.
              </p>
              {derivations.map(d => (
                <DerivCard
                  key={d.label}
                  d={d}
                  expanded={expanded === d.label}
                  onToggle={() => setExpanded(expanded === d.label ? '' : d.label)}
                  glossed={meaning !== ''}
                />
              ))}
            </div>

            {/* Attribution */}
            <p className="text-xs text-stone-500 text-center">
              {result.source === 'machine' &&
                'Translation via Google Translate (bxr), not checked: the verb itself may be wrong. '}
              Forms are built by rule (Poppe 1960; Skribnik 2003; Учебник бурятского языка; Skribnik
              &amp; Darzhaeva 2020) and can miss irregular verbs.
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
