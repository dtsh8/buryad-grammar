# Buryad Grammar — Буряад хэлэн

> Interactive grammar reference for the **Buryad (Буряат) language** — an agglutinative, SOV, vowel-harmonic Mongolic tongue of Eastern Siberia.

[![CI](https://github.com/dtsh8/buryad-grammar/actions/workflows/ci.yml/badge.svg)](https://github.com/dtsh8/buryad-grammar/actions/workflows/ci.yml)
[![Release](https://github.com/dtsh8/buryad-grammar/actions/workflows/release.yml/badge.svg)](https://github.com/dtsh8/buryad-grammar/actions/workflows/release.yml)

**Live demo:** https://dtsh8.github.io/buryad-grammar/

## Features

- 🔊 **Phonology** — Vowel harmony (back/front), consonant inventory, syllable structure
- 📐 **7 Cases** — Interactive case selector with examples and analogies
- ⚡ **Verb System** — Tense forms, person endings, converbs, voices, and a Verb Builder
- 📰 **Corpus examples** — Real sentences from *Буряад үнэн* for each case, tense, converb and voice
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

Example sentences come from Buryad-language news articles on [burunen.ru](https://burunen.ru/bur/news/).
The raw text stays local (`data/corpus/`, gitignored); only `public/data/corpus_examples.json` is committed.

```bash
npm run corpus:scrape                 # download new articles (add -- --refresh to re-download all)
npm run corpus:build                  # pick example sentences → public/data/corpus_examples.json
npm run corpus:search -- ".+нхай"     # count word forms (whole-word regex); add --ctx 2 for contexts
npm run corpus:bnc -- "*нхай" --sent 3 # same question to the online Buryat National Corpus
```

For checking grammar claims, the [Buryat National Corpus](https://buryat.web-corpora.net/buryat_corpus/search)
(fiction, folklore and press) is much larger than the news sample; `corpus:bnc` queries it.

Features are matched by word ending (`scripts/lib/features.ts`), so a few examples may be wrong.

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
- *Буряад үнэн* news corpus (burunen.ru).
- Buryat National Corpus — https://buryat.web-corpora.net/buryat_corpus/search
- WALS Online — Feature data for Buryat (bua).
- ISO 639-3: `bua` (Buriat).

## License

MIT
