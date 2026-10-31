# Buryad Grammar

Interactive reference for literary Buryad. React 19, TypeScript, Vite, Tailwind, static on
GitHub Pages: no backend, and it should stay that way.

## Commands

- `npm run validate`: typecheck, lint, format check and tests. Run it before saying work is done.
- `npm run dev`, `npm run build`
- `npm run corpus:bnc -- <form>`: Buryat National Corpus counts
- `npm run attestation`: refresh corpus counts after a headword or engine rule changes

## Layout

- `src/pages/`: one file per route; `src/sections.ts` lists them
- `src/data/grammar.ts`: grammar content; `public/data/vocabulary.json`: the lexicon
- `src/utils/`: verb and noun engines, with `*.test.ts` gold rows
- `src/i18n/`: interface strings
- `docs/verification-questions.md`: open questions and written sources

## Rules

- Before changing a Buryad form, rule or `vocabulary.json`, use the `buryat-evidence` skill.
  Never change a form from memory or by analogy with Khalkha.
- Interface text: add the key to `src/i18n/en.ts`, then `ru.ts` and `bua.ts`; the type check
  enforces this. Buryad strings are drafts for native-speaker review (questions, section D).
- Vocabulary `id` is the headword in ASCII and `ipa` follows the sound table in `grammar.ts`;
  tests enforce both.
- Pages use `max-w-5xl mx-auto px-4 py-10 space-y-8` with a `motion.div` title and a
  `text-stone-500` intro. The top nav appears at `lg`; below that the bottom tab bar is used.
- Check new layouts with the long Russian and Buryad labels, not only English.

## Git

- Conventional Commits, types and scopes in `CONTRIBUTING.md`. Branch off `main`.
- Every task gets its own branch, created before the first file change; sessions that change
  nothing need none. A session with unrelated tasks uses one branch per task.
- When a task is done and `npm run validate` passes, commit, push and merge to `main` without
  asking. If validation fails, or a Buryad form is still unverified, stop and report instead.
- Merge with `git merge --no-ff <branch> -m "chore: merge <branch> — <summary>"`.
- Use `git pull --rebase=merges` before pushing: the Release workflow commits to `main` after
  each release.

## Working style

- Keep replies short. Read only the files needed; don't print whole files.
- On Windows, Prettier needs `--end-of-line auto` if the working copy has CRLF.
