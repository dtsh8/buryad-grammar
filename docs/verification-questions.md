# Buryad grammar: questions to verify

These points in the app are uncertain or possibly wrong. For each one, please give the correct
form or rule and a source: a book and page (Poppe 1960, Skribnik 2003, Цыдендамбаев, a school
grammar), or "native speaker" plus dialect.

Each question gives the app's current claim and where it lives, so the answer can be applied
directly. Priority A questions affect whole sections of the site; B and C affect single forms
or labels.

## Corpus evidence so far

Searched the local burunen.ru corpus (`data/corpus/raw_articles.json`: 41 news articles,
~36,000 words, written standard Buryad). Counts are tokens. Usage shows which forms exist, but
it can't settle meanings, names or IPA, and a small corpus can miss rare forms.

| Q   | Finding                                                                                                                                                                                                                                                  | Verdict                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| A1  | No verb ends in *-лай*: all 582 *-лай/-лэй/-лой* tokens are genitives of л-stems (*жэлэй, соёлой, малай*) or the auxiliary *бэлэй*. Past tenses in news reports: *-аа/-ээ* (*хүдэлөө, хэлээ*), *-һан* (942), *-ба* (55), *… бэлэй*.                          | **App likely wrong.** Remove *-лай* past. |
| A2  | -лса: *оролсохо* "take part", *хабаадалсаха* "participate", *танилсаха* "get acquainted". -лда: *барилдаха* "wrestle", *заргалдаха* "sue each other", *дайралдаха* "run into each other", *хубаалдаха* "share out".                                           | Supports the swap: -лса = joint, -лда = each other. |
| A3  | 1sg *-б*: *байнаб, хүргэнэб, байгааб, ябааб*. 2sg *-ш*: *ойлгонош*. 1pl *-бди*: *байнабди, мэдэнэбди, ябаабди, болообди, хэлэдэгбди*. 2pl *-т*: *мэдэнэт*.                                                                                             | **Confirmed** (draft table correct; perfect = ябааб / ябаабди). |
| A4  | *ахамни, дүүмни* (-мни); *багшашни* (-шни); *багшамнай* (-мнай); *биитнай* (-тнай); *ажалдань, хоёрынь* (-нь/-ынь). Case before possessive: *нютагтамнай, байхадамни, ажалдань*. Reflexive: *нютагтаа, орондоо*.                                         | **Confirmed**; case + possessive order confirmed. |
| B1  | *эдеэд* (1×, "суглуулжа эдеэд"); *эдеэгээд* 0×. *эдидэг* 1×.                                                                                                                                                                                             | **Table right** (эдеэд); engine needs an exception. |
| B2  | *-даггүй/-дэггүй* 26× (*ябадаггүй, байдаггүй, хэлэдэггүй*); single-г *-дагүй* 0× as habitual.                                                                                                                                                           | **App wrong**: ябадаггүй.             |
| B3  | ү/ө first syllable + -өөд: *хүрөөд, үгөөд, бүтөөд, хүдэлөөд, хөөрэлдөөд*. Instrumental likewise (*үндэрөөр, зүбөөр, мүнгөөр*). But **long үү in first syllable → ээ** (*дүүргээд* 25×, *һүүлээр, үүлээр*) and **non-initial long ээ blocks** (*бүтээгээд*, not \*бүтээгөөд). | Rule confirmed with two refinements. |
| B5  | -та/-тэ after **д** (plural *-ууд-та*), **г**, **р** (*гэртэ*). After л, м, й, н the dative is -да (*ажалда, замда, ойдо, тушаалда*); the apparent -лта/-мта forms are lexical (*амжалта, хамта, сайта*). в, с, б, к: too few to tell.      | Partly answered.                     |
| B6  | *-иие* after н and и (*тэрэниие, зониие, хүниие, һургуулиие*); *-ые* after consonants and short vowels (*ректорые, ябахые, үгые*); *-е* after й (*ойе, зайе*).                                                                                             | Mostly answered (long vowels not seen). |
| C3  | *руу* 69×, always written as a separate word (*хотонууд руу*).                                                                                                                                                                                           | Postposition: 7 cases is defensible. |
| C6  | Progressive = converb + *байна* (*хүдэлжэ байна, уража байна*).                                                                                                                                                                                          | -даг is habitual only.                |
| C10 | Concessive *-башье/-бэшье/-бошье* 20× (*байбашье, гарабашье, тиигэбэшье*); *-шьегүй* only in lexical *уданшьегүй* "soon".                                                                                                                                 | **App wrong**: use -башье.            |

Not answerable from a news corpus: A2 meanings beyond these examples, B4 (reflexive), C1/C2
(terminology), C4/C5 (IPA), C7 (the scraper strips digits), C8, C9.

## Already applied to the app: please confirm

These corpus findings are now in the app. A native speaker's ✓ or correction is still wanted
for each.

1. The "evidential past -лай" is removed. The Tenses tab now shows three past forms (-ба, -аа,
   -һан) without claiming how they differ. **See A1 for the question.**
2. Reciprocal = -лда (*барилдаха* "wrestle"), cooperative = -лса (*оролсохо* "take part").
3. Person endings on verbs (new "Person" tab) and possessive suffixes (Cases page), with corpus
   examples. Built by rule but not seen in the corpus: *ябанаш*, *ябааш*, *ябанат*, *ябаат*.
4. Negative habitual *ябадаггүй*; concessive *-башье* (corpus sentences as examples).
5. *эдеэ-* is an irregular stem: *эдеэд, эдидэг, эдижэ*. Also set, but unattested: perfect
   *эдеэ*, negative past *эдеэгүй*.
6. Dative -та after д, г, р; accusative -иие after н, -е after й.
7. "Habitual / Progressive" relabelled "Habitual"; the progressive is *-жа байна*.

---

## A. Questions that affect whole sections

### A1. How do the three past forms differ?

- **App now says:** *ябаба* (-ба), *ябаа* (-аа, "perfect"), *ябаһан* (-һан, past participle)
  all mean "went"; the difference is marked "under review". The former "evidential past
  *ябалай*" was removed, because the corpus has no such verb form.
- **Please answer:**
  1. When would you say *Тэрэ ябаба*, *Тэрэ ябаа*, and *Тэрэ ябаһан*? Do they differ in how
     the speaker knows (saw it vs heard about it), in how recent the event is, or in style?
  2. Does *ябалай* exist at all? If so, what does it mean?
  3. Can *ябаба* take person endings (*ябабаб*?), as *ябаа* does (*ябааб*)?

### A2. Are the reciprocal and cooperative suffixes swapped?

- **App says:** reciprocal ("each other") = **-лса**; cooperative ("together") = **-лда**.
  [grammar.ts:538-554](../src/data/grammar.ts#L538-L554), also the Verb Builder derivations.
- **Suspicion:** by analogy with Khalkha (-лц = together, -лд = each other) it may be the
  reverse: **-лса = together**, **-лда = each other**.
- **Please answer:** the meaning of *дуулалсаха* vs *дуулалдаха*, and of *дурлалсаха* vs
  *дурлалдаха*.

### A3. Personal predicative suffixes (new section)

The app currently shows no person marking. Please confirm or correct this draft:

| Person | Suffix (draft) | ябана- (PRS) | ябаба- (PST) | ябаа (PERF) |
| ------ | -------------- | ------------ | ------------ | ----------- |
| 1sg    | -б             | ябанаб       | ?            | ?           |
| 2sg    | -ш             | ябанаш       | ?            | ?           |
| 3      | ∅              | ябана        | ябаба        | ябаа        |
| 1pl    | -бди           | ябанабди     | ?            | ?           |
| 2pl / polite | -т (-та?) | ябанат?   | ?            | ?           |

- Do the suffixes attach to the habitual and the future-participle forms too (*ябадагби?*)?
- Are they used with nominal predicates (*багшаб* "I am a teacher")?

### A4. Possessive suffixes (new section)

Please confirm or correct:

| Person         | Suffix (draft)      | гэр "house" |
| -------------- | ------------------- | ----------- |
| 1sg            | -мни                | гэрмни?     |
| 2sg            | -шни                | гэршни?     |
| 3              | -нь                 | гэрынь?     |
| 1pl            | -мнай               | ?           |
| 2pl            | -тнай               | ?           |
| reflexive      | -аа/-ээ/-оо/-өө     | гэрээ       |

- Does the possessive come after the case suffix (*гэртэмни*)?
- *эхэдээ* vs *эхэдэнь* ("to his own mother" vs "to his/her mother"): is that distinction right?

---

## B. Single forms

### B1. The sequential converb of эдеэхэ: *эдеэд* or *эдеэгээд*?

- **App table:** *эдеэд* ([grammar.ts:471](../src/data/grammar.ts#L471)). **Engine rule** (long
  final vowel → epenthetic г, as in *угаагаад*): *эдеэгээд*. Currently flagged in the tests.

### B2. The present negative: *ябадагүй* or *ябадаггүй*?

- **App:** *ябадагүй* ([grammar.ts:335](../src/data/grammar.ts#L335),
  [grammar.ts:399](../src/data/grammar.ts#L399), engine
  [verbMorphology.ts:158](../src/utils/verbMorphology.ts#L158)). Khalkha writes *явдаггүй*.
- Also: is the "present-future negative" really the habitual negative, or is there a separate
  *ябанагүй* / *ябахагүй* form?

### B3. Rounding of long suffix vowels: please check the engine's output

The engine now follows this rule. Please mark each form ✓ or give the correct one:

| Root    | Converb (engine) | Rule exercised                              |
| ------- | ---------------- | ------------------------------------------- |
| үзэ-    | үзөөд            | ү in first syllable → өө                    |
| үгэ-    | үгөөд            | same                                        |
| хүдэл-  | хүдэлөөд         | same, consonant stem                        |
| үзүүл-  | үзүүлээд         | non-initial үү blocks rounding              |
| оруул-  | оруулаад         | non-initial уу blocks о-rounding            |
| ороо-   | ?                | (please give one long-о stem to add)        |
| түү-    | түүгээд          | long үү in first syllable does not round    |
| дүүргэ- | дүүргээд         | same (corpus ×25)                           |
| бүтээ-  | бүтээгээд        | non-initial long ээ blocks rounding (corpus) |
| хөөрэлдэ- | хөөрэлдөөд     | long өө in first syllable rounds (corpus)   |
| мэдэ-   | мэдээд           | unrounded                                   |
| уя-     | уяад             | я stem                                      |

Also: does the same rule apply to the instrumental case (*үнэнөөр*, *гэрээр*)?

### B4. Reflexive `-да/-дэ`: is it productive?

- **App:** *угаадаха* "to wash oneself" ([grammar.ts:523](../src/data/grammar.ts#L523)), and the
  Verb Builder derives a reflexive for every verb.
- **Suspicion:** reflexivity is usually expressed with the reflexive possessive (*гараа угааха*),
  not a verbal suffix. If it isn't productive, the Verb Builder should drop it.

### B5. Which consonants take the dative `-та/-тэ/-то`?

- **App now says:** -да after vowels; -та after "some consonants" (only *гэртэ* annotated).
- **Please give:** the full list of triggering consonants (р, г, в, б, с, д…?).

### B6. Accusative allomorphs

- **App:** `-ые/-е` for all stems ([grammar.ts:221](../src/data/grammar.ts#L221)).
- **Please give:** the forms after a short vowel, a long vowel or diphthong (*-гые*?), and
  н-stems (*-иие*, as in *тэрэниие*).

---

## C. Labels and facts

| #   | App says                                                             | Where                                                        | Question                                                                             |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| C1  | Case names: Харьяалалай, Зүгэй, Үйлэдэгдэхүүнэй, Холдолгын…          | [grammar.ts:168-265](../src/data/grammar.ts#L168-L265)       | What are the standard Buryad-language case names used in school grammars?            |
| C2  | Voice names: Үйлдүүлэгшэ, Эдлүүлэгшэ, Хэлсэлэй, Хамтаршалай           | [grammar.ts:494-554](../src/data/grammar.ts#L494-L554)       | Standard Buryad terms for causative / passive / reciprocal / cooperative?            |
| C3  | "7 cases"                                                            | [grammar.ts:836](../src/data/grammar.ts#L836)                | 7 or 8? Is the directive (-руу/-рүү) a case or a postposition?                       |
| C4  | Vowel IPA: у [u], ү [y], ө [ø]                                       | [grammar.ts:59-89](../src/data/grammar.ts#L59-L89)           | Likely у [ʊ], ү [u], ө [ɵ]. Correct?                                                 |
| C5  | ж = [dʒ] affricate                                                   | [grammar.ts:131](../src/data/grammar.ts#L131)                | Likely [ʒ] fricative in Buryad. Correct?                                             |
| C6  | "Habitual / Progressive" for -даг                                    | [grammar.ts:701](../src/data/grammar.ts#L701)                | Habitual only? What expresses the progressive (*ябажа байна*)?                       |
| C7  | Speakers: 461,000                                                    | [grammar.ts:9](../src/data/grammar.ts#L9)                    | That's roughly the ethnic population. What speaker figure should we cite, from which census? |
| C8  | "Nominative–Accusative (with ergative tendencies)"                   | [grammar.ts:15](../src/data/grammar.ts#L15)                  | Any basis for "ergative tendencies"? Otherwise remove.                               |
| C9  | Latin script 1929–1939                                               | [grammar.ts:10](../src/data/grammar.ts#L10)                  | Correct years for the Latin alphabet?                                                |
| C10 | Concessive example *Ябашьегүй үзэгдэнэ*                              | grammar.ts, `CONVERBS`                                       | Is this natural? Is the concessive *-башье* (*ябабашье*)?                            |
| C11 | Agglutination demo: дура → дурла- → дурлалса- (reciprocal)           | [grammar.ts:904](../src/data/grammar.ts#L904)                | Depends on A2.                                                                       |
