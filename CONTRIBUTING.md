# Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic semantic versioning.

## Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

## Types → Version bumps

| Type | Description | Version bump |
|------|-------------|-------------|
| `feat` | New page, section, or interactive feature | `minor` (1.x.0) |
| `fix` | Fix broken functionality or incorrect grammar data | `patch` (1.0.x) |
| `content` | Update or add linguistic content (grammar rules, vocabulary) | `patch` |
| `perf` | Performance improvement | `patch` |
| `refactor` | Code restructuring, no behavior change | `patch` |
| `docs` | README or inline documentation | `patch` |
| `style` | CSS/styling only changes | no release |
| `chore` | Build configuration, deps | no release |
| `BREAKING CHANGE` | Incompatible data format change | `major` (x.0.0) |

## Scopes (optional)

`phonology`, `cases`, `verbs`, `word-order`, `vocabulary`, `ui`, `data`, `ci`

## Examples

```bash
# New grammar section → v1.1.0
git commit -m "feat(cases): add comitative case interactive examples"

# Fix data → v1.0.1
git commit -m "fix(phonology): correct IPA transcription for ү vowel"

# Add vocabulary → v1.0.2
git commit -m "content(vocabulary): add 50 common verbs to lexicon"

# New major feature → v2.0.0
git commit -m "feat!: redesign data model for multi-dialect support

BREAKING CHANGE: grammar.ts interface changed"
```
