import { useEffect, useRef, type PointerEvent } from 'react';
import type { Stroke } from '../utils/handwriting';

const INK = '#1c1917';

// A surface to write on with a finger, pen or mouse. Strokes are in CSS pixels from the top left;
// `guide` paints whatever should show under the ink (a shape to trace).
export default function HandCanvas({
  width,
  height,
  strokes,
  onChange,
  guide,
  label,
}: {
  width: number;
  height: number;
  strokes: Stroke[];
  onChange: (strokes: Stroke[]) => void;
  guide?: (ctx: CanvasRenderingContext2D) => void;
  label: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    el.width = width * ratio;
    el.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    guide?.(ctx);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of strokes) {
      if (s.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (const p of s.slice(1)) ctx.lineTo(p.x, p.y);
      if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y);
      ctx.stroke();
    }
  }, [width, height, strokes, guide]);

  function at(e: PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * width) / r.width,
      y: ((e.clientY - r.top) * height) / r.height,
    };
  }

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label}
      style={{ width, height, touchAction: 'none' }}
      className="block max-w-full rounded-xl border-2 border-dashed border-stone-300 bg-white cursor-crosshair"
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drawing.current = true;
        onChange([...strokes, [at(e)]]);
      }}
      onPointerMove={e => {
        if (!drawing.current) return;
        const last = strokes[strokes.length - 1] ?? [];
        onChange([...strokes.slice(0, -1), [...last, at(e)]]);
      }}
      onPointerUp={() => (drawing.current = false)}
      onPointerCancel={() => (drawing.current = false)}
    />
  );
}
