# Buryad Grammar — Буряад хэлэн

> Interactive grammar reference for the **Buryad (Буряат) language** — an agglutinative, SOV, vowel-harmonic Mongolic tongue of Eastern Siberia.

[![CI](https://github.com/YOUR_USERNAME/buryad-grammar/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/buryad-grammar/actions/workflows/ci.yml)
[![Release](https://github.com/YOUR_USERNAME/buryad-grammar/actions/workflows/release.yml/badge.svg)](https://github.com/YOUR_USERNAME/buryad-grammar/actions/workflows/release.yml)

**Live demo:** https://YOUR_USERNAME.github.io/buryad-grammar/

## Features

- 🔊 **Phonology** — Vowel harmony (back/front), consonant inventory, syllable structure
- 📐 **7 Cases** — Interactive case selector with examples and analogies
- ⚡ **Verb System** — Tense forms, evidentiality, converbs with flow diagram
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
npm run lint     # TypeScript check
```

## Versioning

Releases follow [Semantic Versioning](https://semver.org/) driven by [Conventional Commits](CONTRIBUTING.md):

- `feat:` → minor bump (new linguistic section or feature)
- `fix:` / `content:` → patch bump
- `feat!:` / `BREAKING CHANGE` → major bump

## Linguistic sources

- Poppe, N. (1960). *Buriat Grammar*. Indiana University.
- Skribnik, E. & Sesenova, B. (2006). *Practical Buryat*. LINCOM.
- WALS Online — Feature data for Buryat (bua).
- ISO 639-3: `bua` (Buriat).

## License

MIT
