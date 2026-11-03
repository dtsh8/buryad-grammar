#!/usr/bin/env python3
# ─── script_templates.py ──────────────────────────────────────────────────
# Builds public/data/script-templates.json for the Script page's handwriting tab: every shape the
# Old Mongolian script uses, as a cloud of points along the middle of its strokes, with the sounds
# it can stand for and its place in the word. The shapes come from the font the page uses, shaped
# by HarfBuzz the way a browser does, so they include the ligatures of a consonant and its vowel
# (bi, kü, ge …: Poppe §§ 69, 76) and the forms letters take only beside others (dotted γ and n
# between vowels, ö and ü with their tooth in a first syllable). Shapes the font draws alike are
# one template, so o and u, or medial a, e and n, come back together, as in the script itself.
#
#   python scripts/script_templates.py <NotoSansMongolian-Regular.ttf> [--preview <dir>]
#
# Needs uharfbuzz, fonttools, freetype-py, numpy and scikit-image. The font is Google Fonts'
# "Noto Sans Mongolian". --preview writes a PNG of each template.

import json
import re
import sys
from pathlib import Path

import numpy as np
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.freetypePen import FreeTypePen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from skimage.morphology import skeletonize

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'data' / 'script-templates.json'
WORDS = ROOT / 'src' / 'data' / 'scriptWords.ts'
POINTS = 32  # the $P recogniser's cloud size; the page resamples drawings to the same
BOX = 100  # template coordinates are scaled into 0..BOX
SCALE = 0.12  # pixels per font unit when drawing a glyph: about 100 px for a tall one
MARGIN = 3
ZWJ = '‍'
MVS = '᠎'

# Transliteration → letter, as in src/utils/mongolScript.ts.
LETTERS = {
    'a': 'ᠠ', 'e': 'ᠡ', 'i': 'ᠢ', 'o': 'ᠣ', 'u': 'ᠤ',
    'ö': 'ᠥ', 'ü': 'ᠦ', 'n': 'ᠨ', 'ng': 'ᠩ', 'b': 'ᠪ',
    'p': 'ᠫ', 'q': 'ᠬ', 'k': 'ᠬ', 'γ': 'ᠭ', 'g': 'ᠭ',
    'm': 'ᠮ', 'l': 'ᠯ', 's': 'ᠰ', 'š': 'ᠱ', 't': 'ᠲ',
    'd': 'ᠳ', 'č': 'ᠴ', 'ǰ': 'ᠵ', 'y': 'ᠶ', 'r': 'ᠷ',
    'w': 'ᠸ',
}
BACK, FRONT = ['a', 'o', 'u'], ['e', 'ö', 'ü']
CONSONANTS = [l for l in LETTERS if l not in BACK + FRONT + ['i']]
BACK_ONLY, FRONT_ONLY = {'q', 'γ'}, {'k', 'g'}


def units(words):
    """Words to shape: lists of transliteration letters, with '+' for a joiner and '|' for the
    vowel separator."""
    out = []
    # k and g share the letters of q and γ and take their own shapes only beside a front
    # vowel, so they come in only with one.
    for l in LETTERS:
        if l not in FRONT_ONLY:
            out += [[l], [l, '+'], ['+', l, '+'], ['+', l]]
    for c in CONSONANTS:
        for v in BACK + FRONT + ['i']:
            # qi and γi are pre-classical; the script writes ki and gi even in back words (§ 99).
            if (c in BACK_ONLY and v in FRONT + ['i']) or (c in FRONT_ONLY and v in BACK):
                continue
            a = 'e' if v in FRONT or c in FRONT_ONLY else 'a'
            out += [[c, v, '+'], [a, c, v, '+'], [a, c, v]]
        a = 'e' if c in FRONT_ONLY else 'a'
        out.append([a, c, a])
        if c != 'k':  # k never ends a word (§ 76)
            out.append([a, c])
    for v in ('a', 'e'):
        out.append(['γ' if v == 'a' else 'g', '|', v])
    return out + words


def word_list():
    """The spelling game's words, so every shape it asks for is there."""
    tokens = sorted(LETTERS, key=len, reverse=True)
    words = []
    for latin in re.findall(r"latin: '([^']+)'", WORDS.read_text(encoding='utf-8')):
        letters, rest = [], latin.replace('-', '|')
        while rest:
            if rest[0] == '|':
                letters.append('|')
                rest = rest[1:]
                continue
            hit = next(t for t in tokens if rest.startswith(t))
            letters.append(hit)
            rest = rest[len(hit):]
        words.append(letters)
    return words


def shape(font, order, letters):
    """(glyph name, sounds it writes, place in the word) for each glyph of a word."""
    chars = [ZWJ if l == '+' else MVS if l == '|' else LETTERS[l] for l in letters]
    buf = hb.Buffer()
    buf.add_str(''.join(chars))
    buf.guess_segment_properties()
    hb.shape(font, buf)
    infos = buf.glyph_infos
    out = []
    for i, info in enumerate(infos):
        start = info.cluster
        # Up to the next glyph of another letter: dots are glyphs of their own in the same cluster.
        end = next((g.cluster for g in infos[i + 1 :] if g.cluster > start), len(chars))
        sounds = ''.join(l for l in letters[start:end] if l not in '+|')
        if not sounds:
            continue
        joined_before = start > 0 and letters[start - 1] != '|'
        joined_after = end < len(letters) and letters[end] != '|'
        if start > 0 and letters[start - 1] == '|':
            place = 'apart'
        elif joined_before and joined_after:
            place = 'medial'
        elif joined_before:
            place = 'final'
        elif joined_after:
            place = 'initial'
        else:
            place = 'isolated'
        out.append((order[info.codepoint], sounds, place))
    return out


def outline(glyphset, name):
    pen = DecomposingRecordingPen(glyphset)
    glyphset[name].draw(pen)
    return repr(pen.value)


def cloud(glyphset, name):
    bounds = BoundsPen(glyphset)
    glyphset[name].draw(bounds)
    if bounds.bounds is None:
        return None, None
    x0, y0, x1, y1 = bounds.bounds
    pen = FreeTypePen(glyphset)
    glyphset[name].draw(pen)
    image = pen.array(
        width=int((x1 - x0) * SCALE) + 2 * MARGIN,
        height=int((y1 - y0) * SCALE) + 2 * MARGIN,
        transform=(SCALE, 0, 0, SCALE, -x0 * SCALE + MARGIN, -y0 * SCALE + MARGIN),
    )
    # The page shows the script vertically: browsers turn each glyph 90° clockwise.
    image = np.rot90(image, k=-1)
    rows, cols = np.nonzero(skeletonize(image > 0.5))
    if len(rows) < 2:
        return None, image
    order = np.lexsort((cols, rows))
    pick = order[np.linspace(0, len(order) - 1, POINTS).round().astype(int)]
    xs, ys = cols[pick].astype(float), rows[pick].astype(float)
    scale = max(xs.max() - xs.min(), ys.max() - ys.min()) or 1.0
    points = [
        [round((x - xs.min()) / scale * BOX, 1), round((y - ys.min()) / scale * BOX, 1)]
        for x, y in zip(xs, ys)
    ]
    return points, image


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit('usage: script_templates.py <font.ttf> [--preview <dir>]')
    font_path = args[0]
    preview = Path(args[args.index('--preview') + 1]) if '--preview' in args else None
    tt = TTFont(font_path)
    glyphset = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    font = hb.Font(hb.Face(hb.Blob.from_file_path(font_path)))

    # Grouped by drawing, not glyph name: the font has separate glyphs for medial o and
    # medial u, but draws them alike.
    shapes = {}  # outline → (first glyph name, readings)
    for letters in units(word_list()):
        for name, sounds, place in shape(font, order, letters):
            readings = shapes.setdefault(outline(glyphset, name), (name, []))[1]
            reading = {'sound': sounds, 'position': place}
            if reading not in readings:
                readings.append(reading)

    templates = []
    for name, readings in shapes.values():
        points, image = cloud(glyphset, name)
        if not points:
            continue
        templates.append({'glyph': name, 'readings': readings, 'points': points})
        if preview:
            from skimage.io import imsave

            preview.mkdir(parents=True, exist_ok=True)
            imsave(preview / f'{len(templates):03d}-{name}.png', (255 - image * 255).astype(np.uint8))

    version = tt['name'].getDebugName(5)
    OUT.write_text(
        json.dumps(
            {'font': f'Noto Sans Mongolian, {version}', 'points': POINTS, 'templates': templates},
            ensure_ascii=False,
            separators=(',', ':'),
        ),
        encoding='utf-8',
    )
    print(f'{len(templates)} shapes, {sum(len(t["readings"]) for t in templates)} readings → {OUT}')


if __name__ == '__main__':
    main()
