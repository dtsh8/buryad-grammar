// Handwriting on the Script page: recognising one drawn letter shape, and scoring a tracing.
//
// Recognition is the $P point-cloud recogniser (Vatavu, Anthony & Wobbrock, "Gestures as point
// clouds", ICMI 2012): the drawing and each template are resampled to the same number of points,
// scaled and centred, and compared as unordered clouds, so stroke order and direction don't
// matter. Templates come from the page's font (scripts/script_templates.py).

export interface XY {
  x: number;
  y: number;
}

interface CloudPoint extends XY {
  stroke: number;
}

export type Stroke = XY[];

export interface TemplateReading {
  sound: string; // one letter or a ligature: "o", "kü"
  position: 'isolated' | 'initial' | 'medial' | 'final' | 'apart';
}

export interface ShapeTemplate {
  glyph: string;
  readings: TemplateReading[];
  points: Array<[number, number]>;
}

export interface TemplateData {
  font: string;
  points: number;
  templates: ShapeTemplate[];
}

export interface Match {
  template: ShapeTemplate;
  distance: number;
}

const dist = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);

function pathLength(points: CloudPoint[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++)
    if (points[i].stroke === points[i - 1].stroke) length += dist(points[i - 1], points[i]);
  return length;
}

// n points evenly spaced along the strokes; the gaps between strokes don't count.
export function resample(strokes: Stroke[], n: number): CloudPoint[] {
  const points: CloudPoint[] = strokes.flatMap((s, stroke) => s.map(p => ({ ...p, stroke })));
  if (points.length === 0) return [];
  const step = pathLength(points) / (n - 1);
  if (step === 0) return Array.from({ length: n }, () => ({ ...points[0] }));
  const out: CloudPoint[] = [{ ...points[0] }];
  let carried = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].stroke !== points[i - 1].stroke) continue;
    const d = dist(points[i - 1], points[i]);
    if (carried + d >= step) {
      const t = (step - carried) / d;
      const q = {
        x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
        y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
        stroke: points[i].stroke,
      };
      out.push(q);
      points.splice(i, 0, q);
      carried = 0;
    } else carried += d;
  }
  while (out.length < n) out.push({ ...points[points.length - 1] });
  return out.slice(0, n);
}

// Scaled to fit a unit box without changing the proportions, then centred on the origin.
export function normalise(points: XY[]): XY[] {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const size = Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0) || 1;
  const scaled = points.map(p => ({ x: (p.x - x0) / size, y: (p.y - y0) / size }));
  const cx = scaled.reduce((s, p) => s + p.x, 0) / scaled.length;
  const cy = scaled.reduce((s, p) => s + p.y, 0) / scaled.length;
  return scaled.map(p => ({ x: p.x - cx, y: p.y - cy }));
}

function cloudDistance(a: XY[], b: XY[], start: number): number {
  const n = a.length;
  const matched = new Array<boolean>(n).fill(false);
  let sum = 0;
  let i = start;
  do {
    let best = Infinity;
    let index = -1;
    for (let j = 0; j < n; j++) {
      if (matched[j]) continue;
      const d = dist(a[i], b[j]);
      if (d < best) {
        best = d;
        index = j;
      }
    }
    matched[index] = true;
    const weight = 1 - ((i - start + n) % n) / n;
    sum += weight * best;
    i = (i + 1) % n;
  } while (i !== start);
  return sum;
}

export function cloudMatch(a: XY[], b: XY[]): number {
  const n = a.length;
  const step = Math.floor(Math.sqrt(n)); // n^(1 - ε), ε = 0.5
  let best = Infinity;
  for (let i = 0; i < n; i += step)
    best = Math.min(best, cloudDistance(a, b, i), cloudDistance(b, a, i));
  return best;
}

// Templates ready for matching: points normalised once.
export interface PreparedTemplate {
  template: ShapeTemplate;
  cloud: XY[];
}

export function prepare(data: TemplateData): PreparedTemplate[] {
  return data.templates.map(template => ({
    template,
    cloud: normalise(template.points.map(([x, y]) => ({ x, y }))),
  }));
}

// The closest template shapes to a drawing, best first.
export function recognise(
  strokes: Stroke[],
  templates: PreparedTemplate[],
  n: number,
  top = 4
): Match[] {
  if (strokes.flat().length < 2) return [];
  return recogniseCloud(normalise(resample(strokes, n)), templates, top);
}

export function recogniseCloud(cloud: XY[], templates: PreparedTemplate[], top = 4): Match[] {
  return templates
    .map(({ template, cloud: t }) => ({ template, distance: cloudMatch(cloud, t) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, top);
}

// ─── Tracing ──────────────────────────────────────────────────────────────

// Points every `spacing` along each stroke, so a fast line counts as much as a slow one.
export function densify(strokes: Stroke[], spacing: number): XY[] {
  const out: XY[] = [];
  for (const s of strokes) {
    if (s.length === 0) continue;
    out.push(s[0]);
    for (let i = 1; i < s.length; i++) {
      const d = dist(s[i - 1], s[i]);
      const steps = Math.max(1, Math.ceil(d / spacing));
      for (let k = 1; k <= steps; k++)
        out.push({
          x: s[i - 1].x + ((s[i].x - s[i - 1].x) * k) / steps,
          y: s[i - 1].y + ((s[i].y - s[i - 1].y) * k) / steps,
        });
    }
  }
  return out;
}

// Share of `points` with a point of `target` within `tolerance`.
function share(points: XY[], target: XY[], tolerance: number): number {
  if (points.length === 0) return 0;
  const cell = tolerance;
  const grid = new Map<string, XY[]>();
  for (const p of target) {
    const key = `${Math.floor(p.x / cell)},${Math.floor(p.y / cell)}`;
    const list = grid.get(key);
    if (list) list.push(p);
    else grid.set(key, [p]);
  }
  let near = 0;
  for (const p of points) {
    const cx = Math.floor(p.x / cell);
    const cy = Math.floor(p.y / cell);
    let found = false;
    for (let dx = -1; dx <= 1 && !found; dx++)
      for (let dy = -1; dy <= 1 && !found; dy++)
        found = (grid.get(`${cx + dx},${cy + dy}`) ?? []).some(q => dist(p, q) <= tolerance);
    if (found) near++;
  }
  return near / points.length;
}

// How well a tracing covers the guide: precision is how much of the ink lies on the guide, recall
// how much of the guide is inked over; the score is their harmonic mean, in per cent.
export function traceScore(guide: XY[], strokes: Stroke[], tolerance: number) {
  const drawn = densify(strokes, tolerance / 2);
  const precision = share(drawn, guide, tolerance);
  const recall = share(guide, drawn, tolerance);
  const percent =
    precision + recall === 0 ? 0 : Math.round((200 * precision * recall) / (precision + recall));
  return { percent, precision, recall };
}

export type StrokeCheck = 'right' | 'reversed' | 'missing';

// Whether each expected stroke was drawn, in its turn and from the right end.
export function strokeOrder(
  strokes: Stroke[],
  expected: Array<{ start: XY; end: XY }>
): { checks: StrokeCheck[]; extra: number } {
  const checks = expected.map((e, i): StrokeCheck => {
    const s = strokes[i];
    if (!s || s.length < 2) return 'missing';
    const first = s[0];
    const last = s[s.length - 1];
    return dist(first, e.start) + dist(last, e.end) <= dist(first, e.end) + dist(last, e.start)
      ? 'right'
      : 'reversed';
  });
  return { checks, extra: Math.max(0, strokes.length - expected.length) };
}
