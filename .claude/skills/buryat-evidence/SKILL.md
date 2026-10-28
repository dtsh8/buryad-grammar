---
name: buryat-evidence
description: Check a Buryad grammar claim (a form, suffix, rule, case/voice name, or vocabulary entry) against the written sources and the Buryat National Corpus before changing the app, then record the evidence. Use whenever editing src/data/grammar.ts, src/utils/verbMorphology.ts or public/data/vocabulary.json, or when answering "is this form right?".
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
2. **Buryat National Corpus** (below): which forms exist, how often, and in whose texts.
3. **Engine output**: only shows what the rules produce, never evidence by itself.
4. **Native speaker**: meaning, evidentiality, dialect and naturalness. Add these to
   `docs/verification-questions.md` instead of guessing.

## 3. Search the Buryat National Corpus

https://buryat.web-corpora.net/buryat_corpus/search (fiction, folklore, press):

```bash
npm run corpus:bnc -- эдеэд эдеэгээд               # exact forms: tokens and documents
npm run corpus:bnc -- "*нхай" --top 30             # * is a wildcard
npm run corpus:bnc -- ябалай --sent 3              # with sentences, author, title, year
```

- Compare minimal pairs (*үзөөд* 240 vs *үзээд* 23), not single counts.
- **Read sentences before citing a form.** Homographs have fooled earlier checks:
  *табяад/хорёод/арбаад* are numerals ("about 50/20/10"), not converbs; *-лд-* is often a
  л-noun + dative + reflexive (*үбэлдөө*) or a lexical stem (*бэлдэ-*); *гаралай* and *үзэлэй*
  are genitives of nouns, not -лай verbs.
- Check how many documents and authors a rare form comes from: *-лай* verbs are real but come
  almost only from one writer (Д.-Д. Дугаров), so they aren't standard.
- Its automatic lemma and grammar tags are often wrong for verb forms (*эдеэд* is tagged as the
  plural of *эдеэн* "food"). Trust counts and sentences, not tags.
- A missing form is not proof that it is ungrammatical.
- It is a shared academic server: keep queries to what you need (the tool waits 1.5 s
  between requests).

## 4. Don't copy corpus texts into the app

Counts and single word forms are fine to cite. Sentences are not: burunen.ru allows
republication, even partial, only with its editors' written permission, and the National
Corpus (mostly copyrighted fiction) states no terms. The app links to the corpus instead,
through `corpusQuery` patterns in `grammar.ts` rendered by `CorpusLink`. Example sentences in
the app are constructed, from the textbook, or quoted with attribution from a scholarly paper.

## 5. Read a PDF source

PDF text layers of Soviet-era books are usually garbled, so read rendered page images:

```bash
python -m pip install --quiet --target "<scratchpad>/pylib" pymupdf
python -I render.py "<scratchpad>/pylib" book.pdf "<scratchpad>/pages/tb" 1 110
```

where `render.py` does `fitz.open(pdf)[i].get_pixmap(dpi=110).save(...)` for each page. Then
open the PNGs with the Read tool. Ask the user for the file path; don't search their drives.

## 6. Record what you found

- Code: a short comment citing the source (`// textbook p. 84`, `// BNC: абтаа 59, үгтэхэ 34`).
- Tests: add or adjust a GOLD row in `src/utils/verbMorphology.test.ts` whose `note` names the
  evidence; vocabulary verbs must round-trip through the engine (`verbLexicon.test.ts`).
- Docs: update the status table in `docs/verification-questions.md`; move answered questions
  out of the native-speaker list.
- Finish with `npm run validate`. On Windows run Prettier as
  `npx prettier --check --end-of-line auto "src/**/*.{ts,tsx,css}"` (the working copy has CRLF).
