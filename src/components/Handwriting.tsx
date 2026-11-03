import { useCallback, useEffect, useMemo, useState } from 'react';
import HandCanvas from './HandCanvas';
import ScriptLine from './ScriptLine';
import { SCRIPT_WORDS } from '../data/scriptWords';
import { STROKE_PARTS } from '../data/scriptStrokes';
import { useScriptTemplates } from '../hooks/useScriptTemplates';
import { useI18n } from '../i18n/context';
import {
  recognise,
  strokeOrder,
  traceScore,
  type Match,
  type Stroke,
  type StrokeCheck,
  type TemplateReading,
  type XY,
} from '../utils/handwriting';
import { scriptWord, wordText } from '../utils/mongolScript';

const W = 240;
const H = 320;
const TOLERANCE = 10; // px a traced line may stray from the guide
const GUIDE = '#d6d3d1';
const FONT = '"Noto Sans Mongolian"';
const ZWJ = '‍';

type Mode = 'recognise' | 'trace';

const button =
  'inline-flex items-center justify-center rounded-xl bg-buryat-600 px-4 py-2 font-medium text-white hover:bg-buryat-700 disabled:opacity-40';
const plain =
  'rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:border-buryat-400 disabled:opacity-40';

// The shape a reading names, drawn by the font: "kü" initial → ᠬᠦ + joiner.
function readingText({ sound, position }: TemplateReading): string {
  const word = scriptWord(sound);
  const text = word ? wordText(word) : sound;
  if (position === 'initial') return text + ZWJ;
  if (position === 'medial') return ZWJ + text + ZWJ;
  if (position === 'final') return ZWJ + text;
  return text;
}

// Matches with the same sounds, from the same or a neighbouring place, are one choice.
function groups(matches: Match[]): TemplateReading[][] {
  const out: TemplateReading[][] = [];
  const seen = new Set<string>();
  for (const { template } of matches) {
    const key = [...new Set(template.readings.map(r => r.sound))].sort().join(' ');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(template.readings);
  }
  return out;
}

function Controls({
  strokes,
  setStrokes,
}: {
  strokes: Stroke[];
  setStrokes: (s: Stroke[]) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={strokes.length === 0}
        onClick={() => setStrokes(strokes.slice(0, -1))}
        className={plain}
      >
        {t.script.hand.undo}
      </button>
      <button
        type="button"
        disabled={strokes.length === 0}
        onClick={() => setStrokes([])}
        className={plain}
      >
        {t.script.hand.clear}
      </button>
    </div>
  );
}

function Recogniser() {
  const { t } = useI18n();
  const h = t.script.hand;
  const { data, error } = useScriptTemplates();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [choices, setChoices] = useState<TemplateReading[][] | null>(null);
  const [word, setWord] = useState<string[]>([]);
  const latin = word.join('');

  function run() {
    if (!data) return;
    setChoices(groups(recognise(strokes, data.templates, data.points, 12)).slice(0, 4));
  }

  function pick(reading: TemplateReading) {
    setWord(w => [...w, reading.position === 'apart' ? `-${reading.sound}` : reading.sound]);
    setStrokes([]);
    setChoices(null);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">{h.recogniseIntro}</p>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="space-y-2">
          <HandCanvas
            width={W}
            height={H}
            strokes={strokes}
            onChange={s => {
              setStrokes(s);
              setChoices(null);
            }}
            label={h.canvasLabel}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!data || strokes.length === 0}
              onClick={run}
              className={button}
            >
              {h.recognise}
            </button>
            <Controls strokes={strokes} setStrokes={setStrokes} />
          </div>
          {!data && !error && <p className="text-sm text-stone-500">{h.loading}</p>}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {h.loadError} {error}
            </p>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          {choices && (
            <div aria-live="polite" className="space-y-2">
              <h3 className="text-sm font-semibold text-stone-700">{h.matches}</h3>
              <ul className="space-y-2">
                {choices.map(readings => {
                  const sounds = [...new Map(readings.map(r => [r.sound, r])).values()];
                  const places = [...new Set(readings.map(r => r.position))];
                  return (
                    <li
                      key={readings.map(r => r.sound + r.position).join()}
                      className="flex items-center gap-3 rounded-xl border border-stone-200 p-2"
                    >
                      <span
                        lang="mn-Mong"
                        className="inline-block w-12 text-center font-mongol [writing-mode:vertical-lr] text-4xl leading-none"
                      >
                        {readingText(readings[0])}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1.5">
                          {sounds.map(r => (
                            <button
                              key={r.sound}
                              type="button"
                              onClick={() => pick(r)}
                              className="min-w-9 rounded-md border border-buryat-300 bg-buryat-50 px-2 py-1 font-buryat text-buryat-800 hover:bg-buryat-100"
                            >
                              {r.sound}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-stone-500">
                          {places
                            .map(p =>
                              p === 'apart' ? t.script.pairs.apart : t.script.positions[p]
                            )
                            .join(', ')}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-700">{h.word}</h3>
            {word.length === 0 ? (
              <p className="text-sm text-stone-500">{h.emptyWord}</p>
            ) : (
              <div className="flex items-start gap-4">
                <ScriptLine latin={latin} className="h-48 text-5xl" />
                <div className="space-y-2">
                  <p className="font-buryat text-xl italic">{latin}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setWord(w => w.slice(0, -1))}
                      className={plain}
                    >
                      {h.deleteLast}
                    </button>
                    <button type="button" onClick={() => setWord([])} className={plain}>
                      {h.clearWord}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TraceTarget {
  paint: (ctx: CanvasRenderingContext2D, colour: string) => void;
  strokes?: Array<{ start: XY; end: XY }>;
}

// A word, written vertically as the page shows it: horizontal text turned 90° clockwise.
function wordTarget(latin: string): TraceTarget {
  const word = scriptWord(latin);
  const text = word ? wordText(word) : '';
  return {
    paint(ctx, colour) {
      ctx.save();
      ctx.font = `100px ${FONT}`;
      const size = Math.min(100, (100 * (H - 40)) / Math.max(1, ctx.measureText(text).width));
      ctx.font = `${size}px ${FONT}`;
      ctx.translate(W / 2, (H - ctx.measureText(text).width) / 2);
      ctx.rotate(Math.PI / 2);
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colour;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    },
  };
}

// A letter part from scriptStrokes.ts, its 40 × 56 box fitted to the canvas.
function partTarget(strokes: string[]): TraceTarget {
  const k = Math.min(W / 40, H / 56) * 0.9;
  const ox = (W - 40 * k) / 2;
  const oy = (H - 56 * k) / 2;
  const ends = strokes.map(d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    const length = path.getTotalLength();
    const map = (p: DOMPoint) => ({ x: ox + p.x * k, y: oy + p.y * k });
    return { start: map(path.getPointAtLength(0)), end: map(path.getPointAtLength(length)) };
  });
  return {
    strokes: ends,
    paint(ctx, colour) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(k, k);
      ctx.strokeStyle = colour;
      ctx.lineWidth = 14 / k;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const d of strokes) ctx.stroke(new Path2D(d));
      ctx.restore();
      if (colour !== GUIDE) return;
      ctx.fillStyle = '#a86812';
      for (const { start } of ends) {
        ctx.beginPath();
        ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    },
  };
}

// The guide's ink as points, read back from an offscreen canvas.
function guidePoints(target: TraceTarget): XY[] {
  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const ctx = off.getContext('2d');
  if (!ctx) return [];
  target.paint(ctx, '#000');
  const { data } = ctx.getImageData(0, 0, W, H);
  const points: XY[] = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 100) points.push({ x, y });
  return points;
}

function Tracer() {
  const { lang, t } = useI18n();
  const h = t.script.hand;
  const [kind, setKind] = useState<'word' | 'part'>('word');
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * SCRIPT_WORDS.length));
  const [partId, setPartId] = useState(STROKE_PARTS[0].id);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [fontReady, setFontReady] = useState(false);
  const [result, setResult] = useState<{
    percent: number;
    checks?: StrokeCheck[];
    extra?: number;
  } | null>(null);
  const word = SCRIPT_WORDS[wordIndex];
  const part = STROKE_PARTS.find(p => p.id === partId) ?? STROKE_PARTS[0];

  useEffect(() => {
    let live = true;
    void document.fonts.load(`100px ${FONT}`, 'ᠠ').then(() => live && setFontReady(true));
    return () => {
      live = false;
    };
  }, []);

  const target = useMemo(
    () => (kind === 'word' ? wordTarget(word.latin) : partTarget(part.strokes)),
    // fontReady: the word guide is measured with the font, so it is redrawn once that loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, word.latin, part.strokes, fontReady]
  );
  const guide = useCallback((ctx: CanvasRenderingContext2D) => target.paint(ctx, GUIDE), [target]);

  function reset() {
    setStrokes([]);
    setResult(null);
  }

  function check() {
    const { percent } = traceScore(guidePoints(target), strokes, TOLERANCE);
    const order = target.strokes ? strokeOrder(strokes, target.strokes) : null;
    setResult({ percent, checks: order?.checks, extra: order?.extra });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">{h.traceIntro}</p>
      <div role="group" aria-label={h.targetLabel} className="flex flex-wrap gap-2">
        {(['word', 'part'] as const).map(k => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              reset();
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              kind === k
                ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                : 'border-stone-200 text-stone-600 hover:border-buryat-300'
            }`}
          >
            {h.targets[k]}
          </button>
        ))}
      </div>
      {kind === 'word' ? (
        <div className="flex flex-wrap items-center gap-3">
          <p>
            <span className="font-buryat italic text-lg">{word.latin}</span>{' '}
            <span className="text-stone-500">{lang === 'en' ? word.en : word.ru}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setWordIndex(
                i =>
                  (i + 1 + Math.floor(Math.random() * (SCRIPT_WORDS.length - 1))) %
                  SCRIPT_WORDS.length
              );
              reset();
            }}
            className={plain}
          >
            {h.newWord}
          </button>
        </div>
      ) : (
        <select
          aria-label={t.script.strokes.label}
          value={partId}
          onChange={e => {
            setPartId(e.target.value);
            reset();
          }}
          className="rounded-lg border border-stone-200 px-3 py-2"
        >
          {STROKE_PARTS.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="space-y-2">
          <HandCanvas
            width={W}
            height={H}
            strokes={strokes}
            onChange={s => {
              setStrokes(s);
              setResult(null);
            }}
            guide={guide}
            label={h.canvasLabel}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={strokes.length === 0}
              onClick={check}
              className={button}
            >
              {h.check}
            </button>
            <Controls
              strokes={strokes}
              setStrokes={s => {
                setStrokes(s);
                setResult(null);
              }}
            />
          </div>
        </div>
        {result && (
          <div aria-live="polite" className="space-y-2">
            <p className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-900">{result.percent}%</span>
              <span className="font-medium text-stone-700">
                {t.script.game.verdict(result.percent)}
              </span>
            </p>
            {result.checks && (
              <ul className="text-sm space-y-0.5">
                {result.checks.map((c, i) => (
                  <li key={i} className={c === 'right' ? 'text-green-800' : 'text-red-700'}>
                    {h.order[c](i + 1)}
                  </li>
                ))}
                {result.extra ? (
                  <li className="text-red-700">{h.order.extra(result.extra)}</li>
                ) : null}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Handwriting() {
  const { t } = useI18n();
  const h = t.script.hand;
  const [mode, setMode] = useState<Mode>('recognise');
  return (
    <section className="card space-y-5">
      <p className="text-stone-600">{h.intro}</p>
      <div role="group" aria-label={h.modesLabel} className="flex flex-wrap gap-2">
        {(['recognise', 'trace'] as const).map(m => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              mode === m
                ? 'border-buryat-400 bg-buryat-50 text-buryat-800'
                : 'border-stone-200 text-stone-600 hover:border-buryat-300'
            }`}
          >
            {h.modes[m]}
          </button>
        ))}
      </div>
      {mode === 'recognise' ? <Recogniser /> : <Tracer />}
      <p className="text-xs text-stone-500">{h.fontNote}</p>
    </section>
  );
}
