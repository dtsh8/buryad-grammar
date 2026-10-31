import { motion } from 'framer-motion';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Tooltip from '../components/Tooltip';
import { useVocabulary } from '../hooks/useVocabulary';
import { useI18n } from '../i18n/context';
import type { Messages } from '../i18n/en';
import { findPhrases, splitSentences } from '../utils/phrases';
import {
  buildIndex,
  describe,
  lookup,
  tokenise,
  translateText,
  translateWord,
  type OnlineGloss,
  type ReaderIndex,
  type Token,
} from '../utils/reader';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const SAMPLE = 'Хэлэжэ байһан үгэдэ харюусалгатай байха хэрэгтэй.';

// Neighbouring phrases alternate, so the eye can see where one ends and the next begins.
const PHRASE_TONES = ['bg-buryat-50', 'bg-sky-50'];

// Long enough that moving the mouse across a line doesn't send every word to the service.
const LOOKUP_DELAY = 300; // ms

// "to speak (хэлэхэ, Burlang, machine-translated)": the verb is named when the page has a form of it.
function onlineText(gloss: OnlineGloss, sources: Messages['reader']['sources']): string {
  const source = sources[gloss.source];
  return `${gloss.text} (${gloss.lemma ? `${gloss.lemma}, ${source}` : source})`;
}

interface Found {
  id: string;
  word: OnlineGloss | null;
  phrase: string | null;
}

function Word({
  token,
  index,
  phrase,
  tone,
}: {
  token: Token;
  index: ReaderIndex;
  phrase?: string;
  tone: string;
}) {
  const { lang, t } = useI18n();
  const key = token.key ?? '';
  const hits = lookup(key, index);
  const known = hits.length > 0;
  const target = lang === 'ru' ? 'ru' : 'en';
  const id = `${target}:${key}:${phrase}`;
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<Found | null>(null);
  const answer = found?.id === id ? found : null;
  const needed = open && !answer;

  useEffect(() => {
    if (!needed) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void Promise.all([
        known ? null : translateWord(key, target),
        phrase ? translateText(phrase, target) : null,
      ]).then(([word, phrase]) => {
        if (!cancelled) setFound({ id, word, phrase });
      });
    }, LOOKUP_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [needed, known, key, target, phrase, id]);

  const lines: string[] = [];
  if (known) lines.push(describe(key, hits, lang));
  else if (answer)
    lines.push(answer.word ? onlineText(answer.word, t.reader.sources) : t.reader.notFound);
  if (answer?.phrase) {
    lines.push(`${t.reader.phrase}: ${answer.phrase} (${t.reader.sources.machine})`);
  } else if (!answer && (!known || phrase)) {
    lines.push(t.reader.looking);
  }

  return (
    <Tooltip
      text={lines.join('\n\n')}
      onOpenChange={setOpen}
      className={`border-b hover:bg-buryat-100 ${tone} ${
        known ? 'border-buryat-400' : 'border-dotted border-stone-400'
      }`}
    >
      {token.text}
    </Tooltip>
  );
}

// A sentence with its translation beside it, hidden so the reader can work it out first. Nothing
// is sent to the translation service until they ask.
function SentenceRow({ sentence, children }: { sentence: string; children: ReactNode }) {
  const { lang, t } = useI18n();
  const target = lang === 'ru' ? 'ru' : 'en';
  const id = `${target}:${sentence}`;
  const [shown, setShown] = useState(false);
  const [result, setResult] = useState<{ id: string; text: string | null } | null>(null);
  const answer = result?.id === id ? result : null;
  const needed = shown && !answer;

  useEffect(() => {
    if (!needed) return;
    let cancelled = false;
    void translateText(sentence, target).then(text => {
      if (!cancelled) setResult({ id, text });
    });
    return () => {
      cancelled = true;
    };
  }, [needed, sentence, target, id]);

  function toggle() {
    setShown(s => !s);
    setResult(null); // so a failed translation is tried again next time
  }

  let translation = t.reader.looking;
  if (answer) {
    translation = answer.text ? `${answer.text} (${t.reader.sources.machine})` : t.reader.notFound;
  }

  return (
    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 py-4 first:pt-0 border-b border-stone-100 last:border-b-0">
      <p lang="bua" data-testid="reader-sentence" className="font-buryat text-lg leading-loose">
        {children}
      </p>
      <div className="text-sm space-y-1 md:pt-2">
        <button
          type="button"
          aria-expanded={shown}
          onClick={toggle}
          className="font-medium text-buryat-700 underline underline-offset-2"
        >
          {shown ? t.reader.hideTranslation : t.reader.showTranslation}
        </button>
        {shown && (
          <p aria-live="polite" className="text-stone-700">
            {translation}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Reader() {
  const { t } = useI18n();
  const { data, error } = useVocabulary();
  const [text, setText] = useState(SAMPLE);
  const index = useMemo(() => buildIndex(data), [data]);
  const tokens = useMemo(() => tokenise(text, index), [text, index]);
  const sentences = useMemo(() => splitSentences(tokens), [tokens]);
  const phraseAt = useMemo(() => {
    const at = new Map<number, { text: string; tone: string }>();
    findPhrases(tokens, index).forEach(({ start, end, text }, n) => {
      const tone = PHRASE_TONES[n % PHRASE_TONES.length];
      for (let i = start; i <= end; i++) at.set(i, { text, tone });
    });
    return at;
  }, [tokens, index]);

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
        <div data-testid="reader-text" className="min-h-16">
          {sentences.map(({ start, end, text: sentence }) => (
            <SentenceRow key={`${start}:${sentence}`} sentence={sentence}>
              {tokens.slice(start, end + 1).map((token, offset) => {
                const i = start + offset;
                const phrase = phraseAt.get(i);
                return token.key ? (
                  <Word
                    key={`${i}:${token.key}`}
                    token={token}
                    index={index}
                    // A phrase that is the whole sentence would give the answer away.
                    phrase={
                      phrase?.text !== sentence.replace(/[.!?…]+$/, '') ? phrase?.text : undefined
                    }
                    tone={phrase?.tone ?? ''}
                  />
                ) : (
                  <span key={i} className={phrase?.tone}>
                    {token.text}
                  </span>
                );
              })}
            </SentenceRow>
          ))}
        </div>
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
