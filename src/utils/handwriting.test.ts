import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  normalise,
  prepare,
  recogniseCloud,
  resample,
  strokeOrder,
  traceScore,
  type TemplateData,
} from './handwriting';

const data = JSON.parse(
  readFileSync(new URL('../../public/data/script-templates.json', import.meta.url), 'utf-8')
) as TemplateData;
const templates = prepare(data);

describe('the template file', () => {
  it('holds clouds of the stated size, each with readings', () => {
    expect(data.templates.length).toBeGreaterThan(50);
    for (const t of data.templates) {
      expect(t.points, t.glyph).toHaveLength(data.points);
      expect(t.readings.length, t.glyph).toBeGreaterThan(0);
    }
  });

  it('gives o and u one shape, as the script does (Poppe § 64)', () => {
    const shapes = data.templates.filter(t =>
      t.readings.some(r => r.sound === 'o' && r.position === 'medial')
    );
    expect(shapes).toHaveLength(1);
    expect(shapes[0].readings.map(r => r.sound)).toContain('u');
  });
});

describe('resample', () => {
  it('spaces points evenly along a line', () => {
    const points = resample(
      [
        [
          { x: 0, y: 0 },
          { x: 0, y: 31 },
        ],
      ],
      32
    );
    expect(points).toHaveLength(32);
    points.forEach((p, i) => expect(p.y).toBeCloseTo(i, 5));
  });

  it('does not count the jump between strokes', () => {
    const points = resample(
      [
        [
          { x: 0, y: 0 },
          { x: 0, y: 10 },
        ],
        [
          { x: 100, y: 0 },
          { x: 100, y: 10 },
        ],
      ],
      8
    );
    expect(points.filter(p => p.x === 0)).toHaveLength(4);
  });
});

describe('recogniseCloud', () => {
  // A template drawn again: shifted, scaled, a little shaky.
  let seed = 1;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;

  const sounds = (t: (typeof data.templates)[number]) => new Set(t.readings.map(r => r.sound));

  // Some shapes differ only by a small joining stroke (initial and medial ba), and Poppe's own
  // table has final u and b alike (§ 98), so the test asks for the right sounds first and the
  // exact shape among the first two.
  it('reads a shaky copy of each template as the same sounds', () => {
    let right = 0;
    for (const { template } of templates) {
      const copy = template.points.map(([x, y]) => ({
        x: 300 + x * 1.7 + random() * 4,
        y: 50 + y * 1.7 + random() * 4,
      }));
      const [best, second] = recogniseCloud(normalise(copy), templates);
      const own = sounds(template);
      if ([...sounds(best.template)].some(s => own.has(s))) right++;
      expect([best.template, second.template], template.glyph).toContain(template);
    }
    expect(right / templates.length).toBeGreaterThan(0.95);
  });
});

describe('traceScore', () => {
  const guide = Array.from({ length: 50 }, (_, i) => ({ x: 20, y: i * 2 }));

  it('is 100 for a tracing on the guide and 0 far from it', () => {
    expect(
      traceScore(
        guide,
        [
          [
            { x: 20, y: 0 },
            { x: 20, y: 98 },
          ],
        ],
        6
      ).percent
    ).toBe(100);
    expect(
      traceScore(
        guide,
        [
          [
            { x: 80, y: 0 },
            { x: 80, y: 98 },
          ],
        ],
        6
      ).percent
    ).toBe(0);
  });

  it('marks down a tracing that covers only half the guide', () => {
    const half = traceScore(
      guide,
      [
        [
          { x: 20, y: 0 },
          { x: 20, y: 49 },
        ],
      ],
      6
    );
    expect(half.precision).toBe(1);
    expect(half.percent).toBeGreaterThan(55);
    expect(half.percent).toBeLessThan(75);
  });
});

describe('strokeOrder', () => {
  const expected = [
    { start: { x: 0, y: 0 }, end: { x: 0, y: 10 } },
    { start: { x: 5, y: 0 }, end: { x: 10, y: 5 } },
  ];

  it('checks each stroke’s turn and direction', () => {
    expect(
      strokeOrder(
        [
          [
            { x: 0, y: 0 },
            { x: 0, y: 10 },
          ],
          [
            { x: 10, y: 5 },
            { x: 5, y: 0 },
          ],
        ],
        expected
      )
    ).toEqual({ checks: ['right', 'reversed'], extra: 0 });
    expect(
      strokeOrder(
        [
          [
            { x: 0, y: 0 },
            { x: 0, y: 10 },
          ],
        ],
        expected
      ).checks[1]
    ).toBe('missing');
    expect(strokeOrder([[], [], []], expected).extra).toBe(1);
  });
});
