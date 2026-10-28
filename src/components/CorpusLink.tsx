import { useState } from 'react';

const BNC_SEARCH = 'https://buryat.web-corpora.net/buryat_corpus/search';

// Points to real examples in the Buryat National Corpus. The corpus can't open a search
// from a link, so this shows the word-form pattern to type (* is a wildcard) and copies it.
export default function CorpusLink({ query }: { query: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. no permission): the pattern stays visible to select.
    }
  }

  return (
    <p className="text-xs text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>Real examples:</span>
      <a
        href={BNC_SEARCH}
        target="_blank"
        rel="noopener noreferrer"
        className="text-buryat-700 hover:underline underline-offset-2"
      >
        Buryat National Corpus ↗
      </a>
      <span>— search the word form</span>
      <code className="font-buryat bg-white/70 border border-stone-200 rounded px-1.5 py-0.5 text-stone-800">
        {query}
      </code>
      <button type="button" onClick={copy} className="text-buryat-700 hover:underline">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </p>
  );
}
