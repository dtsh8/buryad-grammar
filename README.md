# Buryad Grammar — Буряад хэлэн

> Interactive grammar reference for the **Buryad (Буряат) language** — an agglutinative, SOV, vowel-harmonic Mongolic tongue of Eastern Siberia.

[![CI](https://github.com/dtsh8/buryad-grammar/actions/workflows/ci.yml/badge.svg)](https://github.com/dtsh8/buryad-grammar/actions/workflows/ci.yml)
[![Release](https://github.com/dtsh8/buryad-grammar/actions/workflows/release.yml/badge.svg)](https://github.com/dtsh8/buryad-grammar/actions/workflows/release.yml)

**Live demo:** https://dtsh8.github.io/buryad-grammar/

## Features

- 🔊 **Phonology** — Vowel harmony (back/front), consonant inventory, syllable structure
- 📐 **7 Cases** — Interactive case selector with examples and analogies
- ⚡ **Verb System** — Tense forms, person endings, converbs, voices, and a Verb Builder
- 🔎 **Corpus links** — Each case, tense, converb and voice points to real examples in the Buryat National Corpus
- 🔀 **Word Order** — SOV diagrams, postpositions, pre-nominal modifiers
- 📖 **Vocabulary** — Core lexicon with IPA, searchable and filterable
- 📊 **Comparison** — Radar chart vs. Mongolian, Turkish, English
- 🧩 **Agglutination** — Step-by-step morpheme stacking diagrams

## Tech stack

| Tool | Purpose |
|------|---------|
| Vite + React 19 + TypeScript | App framework |
| Tailwind CSS 3 | Styling |
| Recharts | Charts (radar, bar) |
| Framer Motion | Page transitions |
| React Router 7 | Navigation |

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint
npm run test     # Vitest
npm run validate # typecheck + lint + format check + tests
```

## Corpus

Grammar claims are checked against the [Buryat National Corpus](https://buryat.web-corpora.net/buryat_corpus/search)
(fiction, folklore and press). The app links to it rather than copying its texts.

```bash
npm run corpus:bnc -- эдеэд эдеэгээд     # counts and documents per word form
npm run corpus:bnc -- "*нхай" --sent 3   # * is a wildcard; --sent adds example sentences
npm run attestation                      # count every form the app builds → public/data/attestation.json
```

`attestation.json` holds corpus counts (no text) for every form the app generates for its
vocabulary: verb paradigms, voices, person endings and noun cases. The app shows them as
"✓ 240" / "not found" badges. Run `npm run attestation` after changing `vocabulary.json` or an
engine rule; a test fails until the file covers every form.

An earlier version also showed sentences from *Буряад үнэн* (burunen.ru). They were removed
because the site allows republication, even partial, only with the editors' written permission.

## Pronunciation

No text-to-speech model covers Buryad, so pronunciation comes from native-speaker recordings.
Put one clip per word in `public/audio/`, named after the word (`гэрһээ.mp3`), and run:

```bash
npm run audio   # updates public/audio/manifest.json and docs/audio-checklist.md
```

A word gets a play button everywhere it appears once its clip is listed in the manifest.
[docs/audio-checklist.md](docs/audio-checklist.md) lists every word still to record, with its file name.

## Versioning

Releases follow [Semantic Versioning](https://semver.org/) driven by [Conventional Commits](CONTRIBUTING.md):

- `feat:` → minor bump (new linguistic section or feature)
- `fix:` / `content:` → patch bump
- `feat!:` / `BREAKING CHANGE` → major bump

## Linguistic sources

- Poppe, N. (1960). *Buriat Grammar*. Indiana University.
- Skribnik, E. & Sesenova, B. (2006). *Practical Buryat*. LINCOM.
- Skribnik, E. (2003). Buryat. In J. Janhunen (ed.), *The Mongolic Languages*. Routledge.
- *Учебник бурятского языка* (school textbook of literary Buryad).
- Скрибник Е. К., Даржаева Н. Б. (2020). Семантика обстоятельственного сложного предложения в бурятском языке. *Вестник БГУ* 4: 58–69.
- Даржаева Н. Б. (2019). Квазисинонимические уступительные конструкции в бурятском языке. *Oriental Studies* 4: 682–690.
- *Буряад үнэн* news articles (burunen.ru): word-form counts only, used during verification.
- Buryat National Corpus — https://buryat.web-corpora.net/buryat_corpus/search
- WALS Online — Feature data for Buryat (bua).
- ISO 639-3: `bua` (Buriat).

## License

MIT
