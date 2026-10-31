import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Tooltip from '../components/Tooltip';
import { useVocabulary } from '../hooks/useVocabulary';
import { useI18n } from '../i18n/context';
import type { Messages } from '../i18n/en';
import {
  buildIndex,
  describe,
  lookup,
  tokenise,
  translateWord,
  type OnlineGloss,
  type ReaderIndex,
  type Token,
} from '../utils/reader';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const SAMPLE = 'Хэлэжэ байһан үгэдэ харюусалгатай байха хэрэгтэй.';

// Long enough that moving the mouse across a line doesn't send every word to the service.
const LOOKUP_DELAY = 300; // ms

// "to speak (хэлэхэ, Burlang, machine-translated)": the verb is named when the page has a form of it.
function onlineText(gloss: OnlineGloss, sources: Messages['reader']['sources']): string {
  const source = sources[gloss.source];
  return `${gloss.text} (${gloss.lemma ? `${gloss.lemma}, ${source}` : source})`;
}

function Word({ token, index }: { token: Token; index: ReaderIndex }) {
  const { lang, t } = useI18n();
  const key = token.key ?? '';
  const hits = lookup(key, index);
  const target = lang === 'ru' ? 'ru' : 'en';
  const id = `${target}:${key}`;
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState<{ id: string; gloss: OnlineGloss | null } | null>(null);
  const answered = online?.id === id;
  const needed = open && hits.length === 0 && !answered;

  useEffect(() => {
    if (!needed) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void translateWord(key, target).then(gloss => {
        if (!cancelled) setOnline({ id, gloss });
      });
    }, LOOKUP_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [needed, key, target, id]);

  let text = t.reader.looking;
  if (hits.length > 0) text = describe(key, hits, lang);
  else if (answered)
    text = online.gloss ? onlineText(online.gloss, t.reader.sources) : t.reader.notFound;

  return (
    <Tooltip
      text={text}
      onOpenChange={setOpen}
      className={`border-b hover:bg-buryat-50 ${
        hits.length > 0 ? 'border-buryat-400' : 'border-dotted border-stone-400'
      }`}
    >
      {token.text}
    </Tooltip>
  );
}

export default function Reader() {
  const { t } = useI18n();
  const { data, error } = useVocabulary();
  const [text, setText] = useState(SAMPLE);
  const index = useMemo(() => buildIndex(data), [data]);
  const tokens = useMemo(() => tokenise(text, index), [text, index]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-stone-900">{t.reader.title}</h1>
        <p className="text-stone-500 mt-1">{t.reader.intro}</p>
      </motion.div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {t.loadError} {error}
        </p>
      )}

      <div className="card space-y-4">
        <p
          lang="bua"
          data-testid="reader-text"
          className="font-buryat text-lg leading-loose whitespace-pre-wrap break-words min-h-16"
        >
          {tokens.map((token, i) =>
            token.key ? (
              <Word key={`${i}:${token.key}`} token={token} index={index} />
            ) : (
              <span key={i}>{token.text}</span>
            )
          )}
        </p>
        <p className="text-xs text-stone-500">
          {t.reader.legend}{' '}
          <a
            href="https://burlang.ru"
            target="_blank"
            rel="noreferrer"
            className="text-buryat-700 underline"
          >
            burlang.ru
          </a>
        </p>
      </div>

      <textarea
        lang="bua"
        aria-label={t.reader.inputLabel}
        placeholder={t.reader.inputLabel}
        value={text}
        rows={6}
        onChange={e => setText(e.target.value)}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 font-buryat outline-none focus:border-buryat-400 focus:ring-1 focus:ring-buryat-200"
      />
    </div>
  );
}
