import { useMemo, type Dispatch, type SetStateAction } from 'react';
import Tooltip from './Tooltip';
import { useI18n } from '../i18n/context';
import { scriptTokens } from '../utils/mongolScript';
import { letterHint } from '../utils/scriptHints';

// Top to bottom, columns left to right.
const VERTICAL = 'font-mongol [writing-mode:vertical-lr]';

// A line of script. Every letter is its own hover target, but they stay inline spans in one run
// of text, so the font still joins them and picks each one's positional shape.
export default function ScriptLine({
  latin,
  className = '',
  active,
  onActive,
  hints = true,
}: {
  latin: string;
  // Without hints the line is plain text, for the reading game where a hint would give it away.
  hints?: boolean;
  className?: string;
  active?: number | null;
  onActive?: Dispatch<SetStateAction<number | null>>;
}) {
  const { t } = useI18n();
  const tokens = useMemo(() => scriptTokens(latin), [latin]);
  let n = 0;
  return (
    <p lang="mn-Mong" className={`${VERTICAL} ${className}`}>
      {tokens.map((token, i) =>
        'text' in token ? (
          <span key={i}>{token.text}</span>
        ) : (
          <span key={i}>
            {token.word.pieces.map((piece, j) => {
              if ('joiner' in piece) return <span key={j}>{piece.joiner}</span>;
              if (!hints) return <span key={j}>{piece.letter.char}</span>;
              const index = n++;
              return (
                <Tooltip
                  key={j}
                  inline
                  text={letterHint(piece.letter, t)}
                  onOpenChange={open => onActive?.(a => (open ? index : a === index ? null : a))}
                  className={`rounded-sm outline-none hover:text-buryat-700 focus-visible:text-buryat-700 ${
                    active === index ? 'text-buryat-700' : ''
                  }`}
                >
                  {piece.letter.char}
                </Tooltip>
              );
            })}
          </span>
        )
      )}
    </p>
  );
}
