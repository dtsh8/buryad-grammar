---
name: buryat-evidence
description: Check a Buryad grammar claim (a form, suffix, rule, case/voice name, or vocabulary entry) against the written sources and the burunen.ru corpus before changing the app, then record the evidence. Use whenever editing src/data/grammar.ts, src/utils/verbMorphology.ts, public/data/vocabulary.json or scripts/lib/features.ts, or when answering "is this form right?".
---

# Verifying Buryad grammar

The app teaches literary Buryad (Khori-based standard). Never change a form from memory or
from Khalkha Mongolian analogy: find evidence first, then cite it in code and docs.

## 1. Find the claim

Locate the form in `src/data/grammar.ts`, the engine (`src/utils/verbMorphology.ts`), its
tests (`*.test.ts`, GOLD rows), and `docs/verification-questions.md`, which holds the
status of every open question and the list of written sources.

## 2. Evidence, strongest first

1. **Written sources** (listed in `docs/verification-questions.md` → "Written sources"):
   - *Учебник бурятского языка*: rules and paradigms; cite printed page numbers.
   - Skribnik & Darzhaeva 2020: morpheme-by-morpheme glosses of Buryat National Corpus examples.
   - Darzhaeva 2019: concessive constructions. Poppe 1960, Skribnik 2003.
2. **Corpora** (below): which forms exist and how often. Prefer the Buryat National Corpus
   (large, literary and folklore); the local news corpus is small but fast and offline.
3. **Engine output**: only shows what the rules produce, never evidence by itself.
4. **Native speaker**: meaning, evidentiality, dialect and naturalness. Add these to
   `docs/verification-questions.md` instead of guessing.

## 3. Search the corpora

**Buryat National Corpus** (https://buryat.web-corpora.net/buryat_corpus/search), online:

```bash
npm run corpus:bnc -- эдеэд эдеэгээд               # exact forms: tokens and documents
npm run corpus:bnc -- "*нхай" --top 30             # * is a wildcard
npm run corpus:bnc -- ябалай --sent 3              # with sentences, author, title, year
```

- Compare minimal pairs (*үзөөд* 240 vs *үзээд* 23), not single counts.
- Check how many documents and authors a rare form comes from: *-лай* verbs are real but
  come almost only from one writer (Д.-Д. Дугаров), so they aren't standard.
- Its automatic lemma and grammar tags are often wrong for verb forms (*эдеэд* is tagged as the
  plural of *эдеэн* "food"). Trust counts and sentences, not tags.
- It is a shared academic server: keep queries to what you need (the tool waits 1.5 s
  between requests).

**Local news corpus** (*Буряад үнэн*, offline):

```bash
npm run corpus:search -- эдихэ эдеэхэ              # exact forms
npm run corpus:search -- ".+(даг|дэг|дог)гүй" --top 30
npm run corpus:search -- табяад баряад --ctx 3      # ALWAYS read contexts before citing
```

- Needs `data/corpus/raw_articles.json` (gitignored). If missing: `npm run corpus:scrape`
  (polite, about 1.5 s per request; ask before re-scraping everything with `--refresh`).
- Patterns are whole-word regexes over lower-cased words.
- **Read the contexts.** Homographs fooled earlier checks: *табяад/хорёод/арбаад* are
  numerals ("about 50/20/10"), not converbs; *-лд-* is often a л-noun + dative + reflexive
  (*үбэлдөө*) or a lexical stem (*бэлдэ-*); *буряад* is not a converb.
- It is news text (~140k words): bookish forms are over-represented (-башье), and a missing form
  is not proof that it is ungrammatical.
- The site often types Latin h for һ; `scripts/lib/text.ts` repairs it. If counts of һ-words
  look low, check that the raw file was scraped with the current cleaner.

## 4. Read a PDF source

PDF text layers of Soviet-era books are usually garbled, so read rendered page images:

```bash
python -m pip install --quiet --target "<scratchpad>/pylib" pymupdf
python -I render.py "<scratchpad>/pylib" book.pdf "<scratchpad>/pages/tb" 1 110
```

where `render.py` does `fitz.open(pdf)[i].get_pixmap(dpi=110).save(...)` for each page. Then
open the PNGs with the Read tool. Ask the user for the file path; don't search their drives.

## 5. Record what you found

- Code: a short comment citing the source (`// textbook p. 84`, `// corpus: абтаа, үгтэнэ`).
- Tests: add or adjust a GOLD row in `src/utils/verbMorphology.test.ts` whose `note` names the
  evidence; vocabulary verbs must round-trip through the engine (`verbLexicon.test.ts`).
- Docs: update the status table in `docs/verification-questions.md`; move answered questions
  out of the native-speaker list.
- If you changed `scripts/lib/features.ts`, run `npm run corpus:build` and check the matched
  words in `public/data/corpus_examples.json` by eye.
- Finish with `npm run validate`. On Windows run Prettier as
  `npx prettier --check --end-of-line auto "src/**/*.{ts,tsx,css}"` (the working copy has CRLF).
