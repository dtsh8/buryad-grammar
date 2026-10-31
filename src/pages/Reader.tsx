import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Tooltip from '../components/Tooltip';
import { useVocabulary } from '../hooks/useVocabulary';
import { useI18n } from '../i18n/context';
import type { Messages } from '../i18n/en';
import { findPhrases, sentenceOf } from '../utils/phrases';
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

interface Context {
  phrase?: string;
  sentence: string;
}

interface Found {
  id: string;
  word: OnlineGloss | null;
  phrase: string | null;
  sentence: string | null;
}

function Word({
  token,
  index,
  context,
  tone,
}: {
  token: Token;
  index: ReaderIndex;
  context: Context;
  tone: string;
}) {
  const { lang, t } = useI18n();
  const key = token.key ?? '';
  const hits = lookup(key, index);
  const known = hits.length > 0;
  const target = lang === 'ru' ? 'ru' : 'en';
  const whole = context.sentence.replace(/[.!?…]+$/, '');
  const phrase = context.phrase !== whole ? context.phrase : undefined;
  const sentence = whole !== token.text ? context.sentence : undefined;
  const id = `${target}:${key}:${phrase}:${sentence}`;
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
        sentence ? translateText(sentence, target) : null,
      ]).then(([word, phrase, sentence]) => {
        if (!cancelled) setFound({ id, word, phrase, sentence });
      });
    }, LOOKUP_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [needed, known, key, target, phrase, sentence, id]);

  const lines: string[] = [];
  if (known) lines.push(describe(key, hits, lang));
  else if (answer)
    lines.push(answer.word ? onlineText(answer.word, t.reader.sources) : t.reader.notFound);
  if (answer) {
    const machine = t.reader.sources.machine;
    if (answer.phrase) lines.push(`${t.reader.phrase}: ${answer.phrase} (${machine})`);
    if (answer.sentence) lines.push(`${t.reader.sentence}: ${answer.sentence} (${machine})`);
  } else if (!known || phrase || sentence) {
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

export default function Reader() {
  const { t } = useI18n();
  const { data, error } = useVocabulary();
  const [text, setText] = useState(SAMPLE);
  const index = useMemo(() => buildIndex(data), [data]);
  const tokens = useMemo(() => tokenise(text, index), [text, index]);
  const sentences = useMemo(() => sentenceOf(tokens), [tokens]);
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
        <p
          lang="bua"
          data-testid="reader-text"
          className="font-buryat text-lg leading-loose whitespace-pre-wrap break-words min-h-16"
        >
          {tokens.map((token, i) =>
            token.key ? (
              <Word
                key={`${i}:${token.key}`}
                token={token}
                index={index}
                context={{ phrase: phraseAt.get(i)?.text, sentence: sentences[i] }}
                tone={phraseAt.get(i)?.tone ?? ''}
              />
            ) : (
              <span key={i} className={phraseAt.get(i)?.tone}>
                {token.text}
              </span>
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
