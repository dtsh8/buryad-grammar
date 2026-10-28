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

The local burunen.ru corpus has since been removed: the site allows republication only with
its editors' written permission. The counts below are kept as a research record; new checks
use the Buryat National Corpus (`npm run corpus:bnc`, BNC row below).

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

## Written sources

| Short name | Source | Used for |
| ---------- | ------ | -------- |
| Textbook | *Учебник бурятского языка* (40 lessons, literary Buryad on the Khori base; Academia.edu 35182608) | Rules and paradigms; page numbers below refer to it |
| S&D 2020 | Скрибник Е. К., Даржаева Н. Б. Семантика обстоятельственного сложного предложения в бурятском языке и языковая картина мира // Вестник БГУ. Язык. Литература. Культура. 2020. № 4. С. 58–69 | Morpheme-by-morpheme glosses of Buryat National Corpus examples |
| D 2019 | Даржаева Н. Б. Квазисинонимические уступительные конструкции в бурятском языке // Oriental Studies. 2019. № 4. С. 682–690 | Concessive constructions |
| BNC | Buryat National Corpus, https://buryat.web-corpora.net/buryat_corpus/search (fiction, folklore, press, 1950s–2010s) | Frequencies and sentences of word forms (`npm run corpus:bnc`); its automatic grammar tags are often wrong for verb forms |

| Q   | Finding | Status |
| --- | ------- | ------ |
| A1  | -ба is the past tense and takes person endings: *уншабаб, уншабаш, уншабабди, уншабат, уншабад* (Textbook p. 37). -аа, -нхай, -һан are "past participles" (p. 67); S&D 2020 gloss -ба PST, -аа PC.PRS, -һан PC.PST, -нхай PC.RES. -лай is in neither the textbook nor the papers; the BNC has it only as a rare literary narrative past (see the BNC row). | **Answered**, except evidentiality (see A1) |
| A2  | One "взаимно-совместный" voice: -лда = two parties with each other (*Дамба Дашатай барилдаба*, *хөөрэлдэбэ*); -лса = joining someone (*город ошолсобо*, *таиралсажа үгэбэ*) (p. 86). | **Answered** |
| A3  | 1sg -б/-м, 2sg -ш, 1pl -бди/-мди, 2pl -т, **3pl -д** (*тэдэ бэшэнэд*) (p. 28); in questions the ending goes on the particle (*бэшэнэ гүш?*); also on nouns and pronouns (p. 74). Corpus 3pl: *ябанад, хүдэлнэд*. | **Answered** |
| A4  | -мни, -шни, -нь/-иинь/-ынь, -мнай, -тнай; case before possessive (*мориндомни*); shortened in the instrumental (*мориёорни*) (pp. 47–49). | **Answered** |
| B1  | и-stems: short suffixes attach as is (corpus *эдихэ, эдидэг, эдижэ; бариха, барижа*), long ones fuse into iotated vowels (*эдеэд, баряад, табяа, болёод*; S&D 2020 *үрдеэд, уряа*; corpus *табяад* is the numeral "about fifty"). The stem is *эди-*, not *эдеэ-*. | **Answered**: *эдеэд* by rule |
| B2  | *ябадаггүй*; also *ябанагүй* "is not going", *ерэбэгүй* "didn't come"; -дүй "not yet": *ябаадүй* (p. 54). Corpus: *алданагүй, мэдэнэгүй*. | **Answered** |
| B4  | No reflexive voice in the textbook. -да occurs only as a passive variant: *оло → олдохо* (p. 84). | **Answered**: reflexive removed |
| B5  | -да after л, м, н, ж, з, vowels and clusters; -та after other consonants: *эбтэ, бараста, богто, театрта, класста* (p. 39). | **Answered** |
| B6  | -ые after short vowels and consonants; -иие after и and stable н; -е after long vowels and diphthongs (*шанаае, бороое, баабгайе*); -гые after back н (*ангые*) (pp. 33–34). | **Answered** |
| C1  | Нэрын, Хамаанай, Зүгэй, Үйлын, Зэбсэгэй, Хамтын, Гаралай падеж (p. 8). | **Answered** |
| C3  | Seven cases (p. 8). | **Answered** |
| C4  | ү "very close to Russian у"; у "between Russian о and у"; ө always long, "close to Russian о" (p. 2). | Supports у [ʊ], ү [u], ө [oː]; speaker to confirm |
| BNC | Buryat National Corpus (buryat.web-corpora.net, `npm run corpus:bnc`): *эдихэ* 539, *эдижэ* 304, *эдеэд* 154, every *эдеэ-* infinitive/present/past form 0, *эдеэгээд* 0; 3pl *ябанад* 146, *ерэбэд* 163; *ябанагүй* 39, *ерэбэгүй* 44; *абтаа* 59, *үгтэхэ* 34, *олдохо* 174; *угаадаха* 0; *үзөөд* 240 vs *үзээд* 23, *үгөөд* 410 vs 0, *дүүргээд* 373 vs *дүүргөөд* 0, *бүтээгээд* 39 vs 0; *байнхай* 49. -лай as a verb: *ошолой* 13, *ерэлэй* 11, *ябалай* 1, almost all Д.-Д. Дугаров (1969–71), vivid narrative past. | Confirms the applied changes; -лай is a rare literary form, not an evidential |
| C10 | -ААшье һаа is the common concessive (Khori, any person); -башье is bookish, 3rd person only, from western/northern dialects (D 2019, citing Poppe 1938). | **Answered** |

Passive variants (p. 84): -гда after vowels (*тари → таригдаха*); -да after л + vowel
(*оло → олдохо*); -та after р, г, б + short vowel (*аба → абтаха*, *үгэ → үгтэхэ*). The same page
has *хара → харагдаха* and *бари → баригдаха*, so the -да/-та stems are listed one by one in the
engine instead of following a general rule.

### Full check against the Buryat National Corpus (2026-10-28)

Every Buryad word form in the app (450 forms in `src/` and `public/data/vocabulary.json`) and
every form the Verb Builder generates for the vocabulary verbs (464) was looked up.

Fixed, with BNC counts (wrong form → right form):

| Where | Was | Now | Evidence |
| ----- | --- | --- | -------- |
| Vocabulary | *бид* "we" (Khalkha) | *бидэ* | 0 vs 2,127 |
| Vocabulary | *муур* "cat" (Khalkha) | *миисгэй* | 0 vs 52 |
| Vocabulary | *өрөө* "room" (Khalkha) | *таһалга* | 0 vs 356 |
| Vocabulary | *шальһин* "wind" | *һалхин* | 0 vs 341 |
| Vocabulary | *сонсохо* "hear/listen" (Khalkha) | *шагнаха* "listen" | 0 vs 115 (*дуулаха* "hear" 209 is already "sing") |
| Phrases | *Уучлаарай* "sorry" (Khalkha) | *Хүлисэгты* | 0 vs 258 |
| Phrases | *Таны нэрэн хэн бэ?*, *Минии нэрэн…* | *Танай нэрэ…*, *Минии нэрэ…* | *таны* 0, *танай* 1,440; *нэрэн* 2 ("lighting"), *нэрэ* 1,114 |
| Phrases | *Би ойлгохогүйб* | *Би ойлгоногүйб* | 1 vs 116 |
| Cases | *галта тэрэгэ(эр)* "train" | *галта тэргэ(эр)* | 1 vs 511 / 67 |
| Cases | *Юугаар?* "with what?" | *Юугээр?* | 0 vs 121 |
| Cases | *Юуниие?* "what (acc.)?" | *Юуе?* (textbook p. 33) | 2 vs 2 |
| Phonology | *газаараар* (typo) | *газараар* | 0 vs 184 |
| Verbs | *Босоод* "having got up" (Khalkha) | *Бодоод* | 0 vs 827 |
| Engine | causative always -уул; -гуул after long vowels | -лга/-лгэ after long vowels and й, -юул for и-stems, listed stems | *һуулгаха* 38, *байлгаха* 68, *гүйлгэхэ* 14, *эдюулхэ* 33, *барюулха* 43, *гаргаха* 284, *болгохо* 300; *һуугуулха, гаруулха* 0 |
| Engine | й-stems got a vowel before -гда/-лда/-лса (*гүйэлдэхэ*) | attached directly | *гүйлдэхэ* 29 |

Confirmed as they were: *Сайн байна* (greeting, attested), *Баярлаа* (69; *баярлалаа* 0), *хэлыт*
(70), *хариха* (41) with *харяад* (10).

Not found but kept, because another source has them: *таиралсажа*, *шанаае* (textbook),
*шагнагданхай*, *хэлэдэгбди* (news). Not found and **unverified**: the voice names
*Үйлдүүлэгшэ, Эдлүүлэгшэ, Хэлсэлэй, Хамтаршалай* (C2).

The Verb Builder applies every voice to every verb, so it also builds reciprocals, cooperatives
and passives that no text uses (*унтагдаха* "be slept", *уншалдаха*). The suffixes are right;
whether such a verb exists is lexical.

### Future in -ха (2026-10-28)

The textbook (p. 40, "Будущее время") gives *ерэхэ* "придёт", *уншаха* "будет читать": the
infinitive form ending a sentence is a future. The Buryat National Corpus confirms it is finite,
because it takes person endings: 1sg *-хаб/-хэб/-хоб* 6,901 tokens (*ерэхэб* 180, *ошохоб* 143,
*ябахаб* 114), 1pl *-хабди* 2,260 (*ошохобди* 86, *ябахабди* 60), 2sg *ябахаш* 63, 2pl
*ябахат* 14, negative 1sg *-хагүйб* 1,119 (*ошохогүйб* 90, *мартахагүйб* 51). No 3pl *-д*
(*ябахад, ерэхэд, ошоход*: 0). Sentences: «Харин би ябахаб», «Ошохобди хоюулан», «Шамайе
мартахагүйб». The app now has a Future tense, a Future column in the person table and a Future
option in the conjugation drill.

### -на is the present, not a present-future (2026-10-28)

The textbook calls -на "Настоящее время" (p. 28: *морин ябана* "конь идёт", *бэшэнэб* "я
пишу"). The app called it "Present-Future"; the corpus does not support that. Two-word BNC
searches (time word, then a 1sg verb within 3–4 words):

| Time word             | + *-наб*    | + *-хаб* |
| --------------------- | ----------- | -------- |
| *үглөөдэр* "tomorrow" | 5 sentences | 20       |
| *хожом* "later"       | 6           | 11       |
| *мүнөө* "now"         | 202         | 104      |

The *-наб* hits after "tomorrow" and "later" are the speaker's present state (*һананаб* "I
think", *найданаб* "I hope", *бэлдэжэ байнаб* "I am preparing"); the planned action itself is
*-ха* (*Үглөөдэр Хойто-Ага гарахаб*). With *мүнөө* the *-хаб* hits are mostly modal ("what will
come of it"). The app now calls -на "Present" and -жа байна "Present Continuous"; the latter
also has a past, *-жа байба* "was …-ing" (1,367 sentences).

### -нхай is a state perfect, not a long-ago past (2026-10-28)

The textbook (p. 67) calls -нхай "причастие давно прошедшего времени": *ерэнхэй* "давно пришел",
*ошонхой* "давно ушел". Skribnik & Darzhaeva (2020) gloss it PC.RES, resultative. The corpus
supports the second: two-word BNC searches find *мүнөө* "now" + *-нхай* in 101 sentences,
*һаяхан* "just recently" + *-нхай* in 15, and *эртэ* "early, long ago" + *-нхай* in only 9.
The common forms are states: *баринхай* "holding" 176, *һуунхай* "sitting" 73, *ерэнхэй* 133.
The present-perfect reading shows in «Мягмар Хэшэгмаа хоёр Улаан-Үдэ ошонхой, Ешигмаа гастрольдо
ябанхай» ("have gone to Ulan-Ude … is away on tour"). With a past auxiliary the state is in the
past (*-нхай байба* 128 sentences, *үнинэй аяланхай һэн* "had long since gone"). The timeline now
puts -нхай just before NOW with its result reaching NOW, and the glosses say "has gone, is away".
The textbook wording is kept as a quotation in the note.

### Declension engine (2026-10-28)

`src/utils/nounMorphology.ts` builds the six oblique cases from the textbook rules (pp. 31,
33–34, 36, 39, 41, 44; summary table p. 46). Nouns in н need a lexical type (`nStem` in
`vocabulary.json`), decided from BNC counts:

| Type | Behaviour | Evidence |
| ---- | --------- | -------- |
| stable | н stays everywhere | *хүниие* 1,473, *хүнөөр* 116, *хүнһөө* 298; *үнэниие* 46, *үнэнөөр* 110 |
| unstable | н stays in gen/dat/abl, drops in acc/ins/com | *мориной* 464, *мориндо* 81, *моринһоо* 177; *мориие* 49, *морёор* 170, *моритой* 339; *модоной* 582, *модые* 24, *модоор* 129 |
| velar | back н takes г | *ангай* 95, *ангые* 8, *ангаар* 4 (textbook *ангһаа*) |

Of the 22 н-nouns in the vocabulary, *хүн* and *үнэн* are stable and the rest unstable;
*наран* and *шулуун* show both, unstable being the majority. ю counts as ү in front words
(*нюдөөр* 577, *нюдэнһөө* 195), which the verb engine now shares.

All 372 forms generated for the vocabulary nouns were looked up: 362 occur. The ten that don't
are regular but rare (instrumentals of people and animals: *эхээр, ахаар, миисгэйгээр*).
Declining every noun also exposed four wrong lemmas, now fixed: *уул* → *уула* "mountain"
(*уулын* 258, *уулада* 58); *зүрхэ* → *зүрхэн* "heart" (*зүрхэнэй* 123); *эдеэ* → *эдеэн*
"food" (*эдеэнэй* 227); *дура* → *дуран* "love, wish" (*дуранай* 136, *дуратай* 1,146).

**Still open for the native speaker:** whether the past forms differ in evidentiality (A1);
what the literary -лай past (*Тогоошо ябалай*) means and whether anyone says it (A1);
the Buryad names of the voices (C2); IPA of у/ү/ө and ж (C4, C5); speaker numbers (C7); the
"ergative tendencies" claim (C8); the years of the Latin script (C9); and whether the
speaker's own dialect differs from the literary forms above.

## Already applied to the app: please confirm

These findings are now in the app. A native speaker's ✓ or correction is still wanted
for each.

1. The "evidential past -лай" is removed (a rare literary -лай past exists; see the BNC row).
   The Tenses tab shows four past forms: -ба (past
   tense), -аа (perfect), -һан (past participle) and -нхай (resultative). **See A1 for the
   remaining question.**
2. Reciprocal = -лда (*барилдаха* "wrestle"), cooperative = -лса (*ошолсохо* "go along with").
3. Person endings on verbs (Person tab), including 3pl -д and the -ба past, and possessive
   suffixes (Cases page). Built by rule but not seen in the corpus: *ябанаш*, *ябааш*,
   *ябанат*, *ябаат*, *ябабаш*.
4. Negatives *ябадаггүй, ябаагүй, ерэбэгүй, ябанагүй, ябахагүй*, and "not yet" *ябаадүй*.
5. *эди-* "eat" is a regular и-stem: *эдихэ, эдинэ, эдидэг, эдижэ, эдеэ, эдеэд*. The engine
   rule also gives *баряад, табяад, болёод*.
6. Dative and accusative rules as in B5 and B6; case names as in C1.
7. "Habitual / Progressive" relabelled "Habitual"; the progressive (Present Continuous) is
   *-жа байна*.
   "Present-Future" -на relabelled "Present"; the future is -ха.
8. Reflexive voice removed; passive -да/-та for *аба-, үгэ-, оло-*.
9. Concessive: -ААшье һаа shown first, -башье as the bookish variant.

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
- **Speaker note (2026-10-28):** the forms are hard to tell apart by ear in back-vowel verbs,
  because б between vowels there sounds like English w: *ябаба* [jaβaβa] is close to *ябаа*
  [jabaː]. In front-vowel words б stays [b], so ask with front verbs: *ерэбэ / ерээ / ерэһэн*,
  *хэлэбэ / хэлээ / хэлэһэн*. The app shows б ~[β] on the Phonology page as unconfirmed; a
  written source (Бураев 1959, Poppe 1960) is still wanted.

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
