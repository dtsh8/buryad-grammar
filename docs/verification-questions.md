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
| Textbook | *Учебник бурятского языка* (40 lessons, literary Buryad on the Khori base; Academia.edu 35182608) | Rules and paradigms; page numbers below refer to it, and PDF pages equal printed pages. For the past forms: -ба is simply "прошедшее время" (p. 37); -аа gets only the gloss *ерээ* "пришел" (p. 67), so it can't settle the -аа dispute under Badmaeva 2011; -һан began and ended in the past, with auxiliaries: *ерэһэн байна* (p. 68); -даг is a timeless participle (p. 60). Burlang.Nom (https://nom.buryat-lang.ru) repeats this book's text almost word for word, so it is not an independent source. Its reference list names Дондуков & Пахутова, *Учебник бурятского языка для знающих русский язык* (Улан-Удэ, 1990), probably this book's authors (unconfirmed). It gives 3pl *тэдэ уншаба* where the book has *уншабад*; BNC supports -д: *ерэбэд* 163, *ошобод* 99, *гарабад* 95, *ябабад* 79, *хэлэбэд* 31 |
| S&D 2020 | Скрибник Е. К., Даржаева Н. Б. Семантика обстоятельственного сложного предложения в бурятском языке и языковая картина мира // Вестник БГУ. Язык. Литература. Культура. 2020. № 4. С. 58–69 | Morpheme-by-morpheme glosses of Buryat National Corpus examples |
| D 2019 | Даржаева Н. Б. Квазисинонимические уступительные конструкции в бурятском языке // Oriental Studies. 2019. № 4. С. 682–690 | Concessive constructions |
| Sampilova 2003 | Сампилова С. Ц., Бальжинимаева Ц. Ц. Буряад хэлэн: 3-дахи класс. Улаан-Үдэ: Бэлиг, 2003 (school textbook, no answer key) | Question sentences in `QUESTION_EXAMPLES`, cited by printed page; the glosses and structure labels are ours |
| K&K 2011 | Khabtagaeva B., Kempf B. *Burját nyelvkönyv*. Szeged, 2011 (Hungarian-language textbook; open on core.ac.uk) | Definitions of the past forms (pp. 68–70), past particles (p. 166); cited by printed page, which is PDF page + 3 |
| Skribnik 2003 | Skribnik E. Buryat // Janhunen J. (ed.). *The Mongolic Languages*. London: Routledge, 2003. P. 102–128 | Names and functions of the past forms (pp. 114–115, 118–119) |
| S&A 2024 | Skribnik E., Aikhenvald A. Y. Evidentiality in Northern Asia. De Gruyter, 2024, ch. 18, https://doi.org/10.1515/9783111378381-018 | Buryat evidentiality (pp. 1024–1027), citing unpublished Skribnik & Darzhaeva and Цыдыпов 1972 |
| B&S 2018 | Brosig B., Skribnik E. Evidentiality in Mongolic // Aikhenvald A. Y. (ed.). *The Oxford Handbook of Evidentiality*. OUP, 2018. P. 554–579 | Only the abstract and S&A's summary read: Buryat lacks paradigmatic evidentiality. Full text not available |
| Badmaeva 2011 | Бадмаева Ю. Д. О системе видовременных форм в бурятском языке (новейшая категоризация) // Филологические науки. Вопросы теории и практики. 2011. № 3 (10). С. 13–18 | Definitions of the tenses; nine-form grid of simple, continuous and completed forms; examples from fiction |
| ТСБЯ | Сундуева и др. *Толковый словарь бурятского языка*. Улан-Батор: Нандир, 2022– (vols I–II checked) | Headwords and grammatical terms, cited as volume:page |
| Dambueva 2020 | Дамбуева П. П. О расширении круга модальной лексики в разговорном бурятском языке: функционально-модальные слова // Монголоведение. 2020. Т. 12. № 4. С. 644–651. https://doi.org/10.22162/2500-1523-2020-4-644-651 | The class of modal words: *аргатай* is possibility; *ёһотой, хэрэгтэй, ушартай, зэргэтэй* are necessity (pp. 646–647) |
| Radnaeva 2006 | Radnaeva L. Phonetic Research of the Sound Form of Modern Buryat Language // SPECOM 2006. P. 577–582, https://www.eurasip.org/Proceedings/Ext/SPECOM2006/papers/108.pdf | Allophonic transcription of a short text (p. 582); 4 standard speakers. Her 2003 doctoral thesis and ICPhS paper are still wanted |
| Staroverov 2020 | Staroverov P. Buriat dorsal epenthesis is not reproduced with novel morphemes // SPiL Plus 60. P. 43–69, https://doi.org/10.5842/60-0-756 | г and х by vowel harmony (p. 46). Fieldwork on Barguzin, which he says does not differ substantially from Standard Buriat |
| Urtegeshev 2023 | Уртегешев Н. С. Веляризация в бурятском языке // Теоретическая и прикладная лингвистика 9 (3). С. 165–181, https://doi.org/10.22250/24107190_2023_9_3_165 | MRI and acoustics from 4 speakers: consonants of hard and soft words differ in tongue position. Nothing on г or б specifically; ж is a fricative in the Alar dialect (p. 178) |
| Minlang | Расширенная грамматика бурятского языка, https://minlang.iling-ran.ru/grammar/rasshirennaya-grammatika-buryatskogo-yazyka | Short online survey: /b g/ turn fricative between vowels and after р; /x g ŋ/ velar in soft words, uvular in hard words. No page-level sources read |
| Poppe 1935 | Поппе Н. Н. Бурят-монгольское языкознание. Л., 1935 (dated May 1933), https://www.orientalstudies.ru/rus/images/pdf/add1/TIVAN_5_1933_poppe.pdf | His transcription table (p. 114) has separate signs for a fricative bilabial spelled b or v and a fricative g, without stating where they occur |
| Бадагаров | Бадагаров Ж. *Буряадаар дуугараял*, серии 1–16 (телекомпания АТВ), https://www.youtube.com/playlist?list=PL1dKDjO0_hMQ9h1c4VexKyLdLK63EN3kc | Spoken lessons on sounds and basic grammar, cited by episode and timestamp. Episode 13 ("two more unique tenses") has no captions and is unread. The author is a Buryad philologist and Mongolist and the owner treats the lesson as authoritative. Read from auto-generated Russian captions, which lose most Buryad examples |
| BNC | Buryat National Corpus, https://buryat.web-corpora.net/buryat_corpus/search (fiction, folklore, press, 1950s–2010s) | Frequencies and sentences of word forms (`npm run corpus:bnc`); its automatic grammar tags are often wrong for verb forms |

| Q   | Finding | Status |
| --- | ------- | ------ |
| A1  | -ба is the past tense and takes person endings: *уншабаб, уншабаш, уншабабди, уншабат, уншабад* (Textbook p. 37). -аа, -нхай, -һан are "past participles" (p. 67); S&D 2020 gloss -ба PST, -аа PC.PRS, -һан PC.PST, -нхай PC.RES. -лай is not in the textbook or S&D; Badmaeva 2011 (p. 14) lists it as a fifth simple past (*уншалай, хэлэй, гаралай*) but gives no definition or example sentence, and *гаралай* is also a genitive. The BNC has it only as a rare literary narrative past (see the BNC row). Skribnik 2003 and S&A 2024: the -ба/-аа/-һан/-нхай forms do not mark evidentiality, and -лай is obsolete (see "Evidentiality in specialist sources"). | **Answered** from written sources; speaker confirmation in A1 |
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
| IPA | Vocabulary `ipa` now follows the sound table in `grammar.ts`: х /x/, һ /h/, word-initial е /je/ (ябаха [jaβaxa], ерэбэ [jɛrɛbɛ]), long vowels with ː. *хүдэлхэ* 214 vs *хүдэхэ* 0 in the BNC. | **Applied** (2026-10-30); ы and о/э still open (C12, C13) |

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

### Past forms in Khabtagaeva & Kempf 2011 (2026-10-31)

| Form | K&K name and definition | Check | App |
| ---- | ----------------------- | ----- | --- |
| -ба (-бо, -бэ) | *богони үнгэрһэн саг*, "szemtanú múlt": completed actions the speaker witnessed (p. 68); *һая* "recently" in an example | Conflicts with narrative use: BNC *түрэбэ* has Chinggis's birth in the 1990 *Монголой нюуса тобшо*, and "хүбүү түрэбэ гэхэ" ("… they say"); *1905 … хэдэн жэл үнгэрбэ*. Own birth has -аа (*тэндэ би түрөөб*), and none of the 3 *түрэбэб* hits is a literal "I was born". | Definition attributed, **not** taught as a rule; see A1 |
| -аа (-ээ, -оо, -өө; -яа/-еэ/-ёо after short и; -гаа after long vowels and diphthongs) | *үнгэрһэн саг*: began in the past and continues now, or remote past (p. 69). Listed as a tense, but "múlt idejű igenév" on p. 201 | Allomorphs match the engine. S&D's PC.PRS fits "continues now"; ТСБЯ II:342–343 has a *мүнөөнэй-үнгэрһэн саг* "настояще-прошедшее" without naming its suffix, possibly this form. | Note extended; still "participle", following the textbook |
| -һан (-һэн, -һон) | *үнгэрһэн сагай причасти*, general past participle: any past action (p. 69). P. 137 instead heads it "közelmúlt" (near past), an internal inconsistency | | Note extended, "general" kept |
| -нхай (-нхэй, -нхой) | *үни үнгэрһэн сагай причасти*, "régmúlt" (p. 69); the term is also in ТСБЯ I:127 | The name disagrees with K&K's own examples (*гэртээ ябанхай* "has gone home", with "is not here") and ТСБЯ II:343 *мүнөөнэй ерэнхэйб* "only just arrived". Confirms the state-perfect analysis above. | Note extended; attributive use added |
| Negation | -аагүй "almost exclusively" for all pasts (p. 70) | Overstated: BNC *ерээгүй* 178 / *ерэбэгүй* 44, *ошоогүй* 131 / *ошобогүй* 11, *хэлээгүй* 232 / *хэлэбэгүй* 137. *ерэһэнгүй* 3. | -аагүй "usual"; -багүй stays |

K&K also treat *һэн* and *бэлэй* as past particles with person endings (*һураа һэмби*, *ошоһон
бэлэйб*; p. 166; ТСБЯ I:376 *бэлэй*). They are not taught in the app yet. The timeline keeps -ба
furthest from NOW and -аа reaching it, which fits Skribnik's simple past and actual past, though
no source gives -ба a distance.

### Evidentiality in specialist sources (2026-10-31)

This overrides K&K's "eyewitness past" for -ба, which rests on a textbook label. The narrative
use above already spoke against it.

| Form | Skribnik 2003 | S&A 2024 |
| ---- | ------------- | -------- |
| -ба | terminative, general past tense (pp. 114, 118) | continues Middle Mongol's **evidentially neutral** -bA; a "general past" (p. 1024) |
| -аа | imperfective participle, "actual past" (p. 118); pairs with -һан in negation (p. 115) | present participle (p. 1025), but glossed PST for last night's escape in (23) |
| -һан | perfective participle, "perfective past" (p. 118); also recent: *hayaa … yabahan* (p. 114); negative normally -аагүй (p. 115) | -һан бай- is perfect-cum-resultative with inferential and mirative readings (p. 1025; Цыдыпов 1972: 161) |
| -нхай | resultative past, close to the perfective participle (pp. 115, 118) | -нхай бай- marks a visible result; -нхай байба is counterexpectation, -нхай байгаа "hot news" (p. 1026) |
| -лай | "confirmative": obsolete in the standard; declarative past and a caution, *unalaish* "you can fall" (p. 114) | reflex of Middle Mongol's **direct evidential** -lUGA, reanalysed as preventive (p. 1024) |

So -лай is why the app once had an "evidential past": the label was historically true of an old
form, not of modern Buryat. BNC: *ябалайш* 2, *уналайш* 0. Modern evidential strategies are
constructions: *гэхэ* hearsay (Skribnik p. 119), *гэлсэнэ* reportative, -һан/-нхай + *бай-*
inference and surprise. *бэлэй* and *һэн* are past copulas; with -ха they are counterfactual
(*суглаан болохо һэн* "there should have been a meeting", p. 119). Not taught in the app yet.
Skribnik (p. 118) has *-даг байна* as habitual, against Badmaeva's progressive.

Read through third-party copies; check page numbers against the printed book before quoting. The
Barguzin paper on -нхай (Lomonosov 2018, finite use, non-telic verbs too) is known only from a
search excerpt, because its link no longer resolves.

### Tenses in Badmaeva 2011 (2026-10-31)

Her simple past is five forms. -ба is the most neutral, a statement of fact, and can report what
has just happened (*суглаан эхилэбэ*, p. 14). -нхай is "тесно связанное с настоящим", which
agrees with the state-perfect analysis above. -һан is universal, far or recent past, with
predicative *юм*. She negates -ба regularly (*уншабагүй*), which agrees with the counts above.

Her -аа is a long-ago past "практически никак не связанное с настоящим моментом" (p. 14). That
conflicts with K&K's "continues now", S&D's PC.PRS and the app's perfect label, and one of her own
examples is "in recent years". BNC test, with the verbs *ерэ-, ошо-, хэлэ-, боло-, үнгэр-, үзэ-*
and the adverb 1–8 words before the verb. Counts are sentences (per 1,000 tokens of those forms):

| Adverb | -ба (8,618) | -аа (7,816) | -һан (7,341) | -нхай (865) |
| ------ | ----------- | ----------- | ------------ | ----------- |
| *үсэгэлдэр* "yesterday" | 10 (1.2) | 41 (5.2) | 32 (4.4) | 1 (1.2) |
| *һаяхан/һая* "recently" | 47 (5.5) | 74 (9.5) | 120 (16.3) | 10 (11.6) |
| *мүнөөдэр* "today" | 19 (2.2) | 17 (2.2) | 19 (2.6) | 3 (3.5) |

-аа is well attested for yesterday's news (*үсэгэлдэр Зоригто ахаймнай бусажа ерээ*), so "long
ago" can't be a general rule; the app keeps "relevant now" and states the disagreement. -ба also
has real just-now uses (*мүнөөл һая дуулабаб*). The counts are unfiltered and mix genres (-ба is
narrative, -аа common in dialogue) and include some conditional *-аа һаа*. "Remote" adverbs were
tried and dropped: *эртэ* mostly means "early in the day" and *үни болоо* is noise.

Her grid (pp. 15, 17): simple, continuous (converb + *бай-*), completed (-аад, -һан or -нхай +
*бай-*). Adjacent pairs in the BNC: *ерэжэ* + *байба* 37, *байна* 52, *байха* 40; *ерээд* +
*байба* 84, *байна* 169, *байха* 50 (unfiltered; *ерээд байна* "has arrived" and *болоод байха*
"will have become" confirmed in sentences); *ерэһэн байгаа* 113; *ерэдэг байгаа* 16. Now a table on
the Tenses tab. Her paradigm lists contain slips (*ерэхэ* as present, p. 15), so the table uses
regular forms. She pairs *-даг байна* with progressives; the app keeps -даг as habitual.

### Modal words (2026-10-31)

The Modals page (`/modals`, data in `src/data/grammar.ts` → "Modal words") rests on these checks.
Example sentences come from the textbook, K&K 2011 or ТСБЯ by printed page, or are marked
"constructed". No corpus sentence is copied into the app.

| Claim | Evidence |
| ----- | -------- |
| хэрэгтэй is often dative, ёһотой nominative with the person ending; ёһотой is stronger (advice vs duty) | K&K p. 215, with minimal pairs |
| *-жа болохо* means "may"; K&K limit that sense to the -ха form | K&K pp. 200–201; ТСБЯ 1:270 (sense 5). The limit is too strict: *-жа болоно* and *-жа болоногүй* occur (Textbook p. 104; BNC), and *-жа болоо* can be "may have" |
| *-ха ёһогүй* means "must not", not "need not" | ТСБЯ 2:37 "не должен"; 95 of 100 sampled *ёһогүй* follow -ха. BNC *ёһогүй\** 234 |
| *-хагүй ёһотой* is both "must not" and "surely will not" | ТСБЯ 2:41 gives the "должно быть" sense; our reading of 24 BNC sentences splits about evenly, and context decides |
| *-ха ёһотой бэшэ* is mostly rhetorical | 9 of 100 sampled sentences have the sequence; 7 are questions of the "shouldn't I…?" type |
| Epistemic ёһотой follows participles and *-жа байгаа* | ТСБЯ 2:41; 16 of 100 sampled sentences |
| "need not" is *-һанай хэрэггүй* or *-ха хэрэггүй* | K&K pp. 103, 119; Textbook p. 69. BNC sentences: *-һанай хэрэггүй* 178 (97 of 100 sampled are adjacent, so about 170); *-ха хэрэггүй* 287 (25 of 100, so about 70) |
| *хэрэгтэй бэшэ* goes with nouns | 44 of 100 sampled sentences have the sequence; none has a verb in -ха |
| *-хагүй хэрэгтэй* is rare | 5 of 83 sentences |
| *-ха аргагүй*, *-хын аргагүй*; *аргагүй* + adjective = "extremely" | ТСБЯ 1:137; Textbook pp. 38, 97, 106. BNC *аргагүй* 1,616, *аргатай* 184. Of 100 sampled *аргагүй*, 34 follow -ха, 21 -хын |
| *аргатай бэшэ* is marginal | 1 of 8 sentences |
| шадаха negates in every tense | BNC *шадахагүй* 692, *шадаагүй* 244, *шадабагүй* 180, *шаданагүй* 82 |
| *-нгүй байжа болохогүй* = "must" (double negation) | ТСБЯ 1:270 quotes Ц. Шагжин; 6 of 28 BNC sentences with *байжа болохогүй* |

Sample figures are from `search_sent` with random order and at most 100 sentences per query. The
server ignores word-distance settings, so sequences were found by filtering the sentence text.

Not shown as main forms because the evidence is thin: *хабатай* (Textbook p. 75 *ойлгохо хабатай*,
but most BNC hits are the adjective "strong"), *зэргэтэй* (ТСБЯ 2:217, BNC 157, also the noun
"rank"), *баатай* (ТСБЯ 1:183).

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

**Still open for the native speaker:** whether speech matches the written sources on evidentiality (A1);
what the literary -лай past (*Тогоошо ябалай*) means and whether anyone says it (A1);
the Buryad names of the voices (C2); IPA of у/ү/ө and ж (C4, C5); speaker numbers (C7); the
"ergative tendencies" claim (C8); the years of the Latin script (C9); and whether the
speaker's own dialect differs from the literary forms above.

### Reader vocabulary (2026-10-31)

Added so the Reader page can gloss ordinary text. K&K pages are printed pages.

| Entry | Evidence |
| --- | --- |
| *амар*, *мэндэ*, *Амар мэндэ* | ТСБЯ I:107 (спокойный, благополучный), II:368 (здоровье; привет); K&K p. 56 *Амар мэндэ!* as a greeting; BNC 634, 606 |
| *гэхэ*, *олохо*, *зохёохо* | ТСБЯ I:543, II:593, II:154, with "obtain" from *дүршэл олохо* (I:675); textbook p. 69 lists the stem *зохёо*; BNC *гэжэ* 50209, *олоһон* 309, *зохёохо* 65 |
| *зохёогшо* | ТСБЯ II:153 (автор, создатель); K&K p. 58 *хүгжэм зохёогшо*; BNC 8. *зохёогшоор* is 0, but the same -оор is regular on such nouns: *багшаар* 20, *орлогшоор* 5 |
| *нэрэтэй* | ТСБЯ II:519; BNC 624, *нэрэтэйб* 29 |
| *бүхы*, *минии*, *дүршэл* | ТСБЯ I:359, II:291, I:675; BNC 2860, 3764, 125 |
| *намайе*, *удангүй* | Textbook pp. 14, 33; K&K p. 196 *удангүй*; BNC 2529, 554 |
| *тиимэһээ* | K&K p. 61 (*emiatt*, "therefore"); textbook p. 30 in context; BNC 1108 |
| *хэрэг*, *хэрэггүй* | Textbook pp. 21, 69; K&K p. 222 *үйлэ хэрэг* (matter, affair); ТСБЯ I:42 *хэрэггүй* (бесполезный) in a definition, since the Х volume isn't available; K&K p. 103 *хүлеэхэ хэрэггүй*; BNC 1621, 846 |
| *һэлгэхэ* | ТСБЯ I:55, in a definition (менять, обменивать), since the Һ volume isn't available; BNC 39 |

Not added, because no source supports them: *программна* (BNC 0; *программа* 13, *программын* 5),
*хангамжа* (BNC 0, not in the checked sources; *хангаха* 38, *хангалта* 2) and the abbreviation
*ИИ*. See B8.

The Reader queries the [Burlang](https://burlang.ru) dictionary API live for words outside the
vocabulary. Its glosses are not evidence for this file, and none are stored in the repo: the API
states no licence, and the site is marked © Burlang (checked 2026-10-31). Burlang lists headwords,
so the Reader also asks for the infinitives the verb engine can derive from a word (*хэлэжэ* →
*хэлэхэ*). That is a lookup aid only: it uses the engine's forms plus the conditional -бал
(BNC: *ябабал*, *хүдэлбэл*) and adds no forms to the app. Its phrase rules
([phrases.ts](../src/utils/phrases.ts)) only choose what to machine-translate as a unit; the
phrases and sentences shown are unchecked Google output, labelled as such.

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
  all mean "went"; none marks how the speaker knows (Skribnik 2003, S&A 2024). The former "evidential past
  *ябалай*" was removed, because the corpus has no such verb form.
- **Please answer:**
  1. When would you say *Тэрэ ябаба*, *Тэрэ ябаа*, and *Тэрэ ябаһан*? Do they differ in how
     the speaker knows (saw it vs heard about it), in how recent the event is, or in style?
  2. Does *ябалай* exist at all? If so, what does it mean?
  3. Can *ябаба* take person endings (*ябабаб*?), as *ябаа* does (*ябааб*)?
  4. Specialists call -ба neutral; K&K 2011 (p. 68) call it the eyewitness past and name it the
     "short past". Would you say *тэрэ ерэбэ* about something you only heard? Is *Баатар Москва
     ошоһон байна* "has gone, it turns out" natural? (Narrative prose can't answer this.)
  5. Badmaeva 2011 (p. 14) calls -аа a long-ago past with no link to the present, yet the BNC has
     it for yesterday's events. Is *тэрэ үсэгэлдэр ерээ* natural? How does it differ from *тэрэ
     үсэгэлдэр ерэбэ*?
- **Speaker note (2026-10-28):** the forms are hard to tell apart by ear in back-vowel verbs,
  because б between vowels there sounds like English w: *ябаба* [jaβaβa] is close to *ябаа*
  [jabaː]. In front-vowel words б stays [b], so ask with front verbs: *ерэбэ / ерээ / ерэһэн*,
  *хэлэбэ / хэлээ / хэлэһэн*.
- **Бадагаров (ep. 4, 03:54–10:44) teaches -аа + person as the plain past,** "я ушёл": *ябааб*, *һуугааб*, *гүйгөөб*, *баряаб*, *эдеэб*. The textbook's -ба does not appear in that lesson. In ep. 16 (18:51) a past form in the Buryat anthem is read as "begun earlier and still going". This is not evidence against the textbook: the owner notes the TV series deliberately keeps things simple for learners, so -аа here is a teaching choice, and the app keeps following the textbook. Ep. 13 has no captions; forms here are rebuilt from garbled captions, so check against the audio.
- **Speaker note (2026-10-31), replaces the harmony claim above:** harmony does not matter for
  б; the neighbouring sound does. *баабгай* starts with [b], and the second б, before г, is the
  lighter [β]. Written support: Radnaeva 2006, p. 582 has [β] in *хабар, ябадаг, һабартай* and
  [p] before т in *добтолдог*; Minlang has fricative б between vowels with no harmony condition.
  The app now says this. Still open: is б [β] in front-vowel *ерэбэ, хэлэбэ, эбэр, тэбэрихэ*, as
  the new rule predicts? If so, front verbs don't avoid the *-ба / -аа* problem by ear. Does б
  also lighten before л, н, р? Бураев 1959 is the source to check; the biliq.ru PDF returned 404
  on 2026-10-31.

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

### B7. Modal words: how do these differ in speech?

- **App now says:** see the Modals page and "Modal words" above.
- **Please answer:**
  1. *Би ябаха ёһогүйб* and *Би ябахагүй ёһотойб*: same meaning, or different?
  2. Does *Тэрэ ерэхэгүй ёһотой* sound like "surely won't come" or "must not come"?
  3. *Намда ябаха хэрэгтэй* and *Би ябаха хэрэгтэй*: are both natural? Do they differ?
  4. *Хэлэхэ хэрэггүй* and *Хэлэһэнэй хэрэггүй*: does the second mean "no point in saying" or
     simply "don't say"?
  5. Are the constructed examples natural: *Намда ном уншаха хэрэгтэй байгаа*, *Тэрэ ерэхэгүй
     ёһотой*, *Багша хүлеэжэ байгаа ёһотой*?
  6. Is *-ха һанаатай* still "intend", or more "want"?

### B8. "Software" in Buryad

- **App now says:** nothing. The Reader's example text has *программна хангамжа* ("software"),
  but neither word is in the corpus or the written sources, so neither is in the vocabulary.
- **Please answer:** Is *программна хангамжа* the usual term? Is *хангамжа* literary Buryad or a
  borrowing from Khalkha *хангамж*? Is *ИИ* used for "artificial intelligence"?

## C. Labels and facts

| #   | App says                                                             | Where                                                        | Question                                                                             |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| C1  | Case names: Харьяалалай, Зүгэй, Үйлэдэгдэхүүнэй, Холдолгын…          | [grammar.ts:168-265](../src/data/grammar.ts#L168-L265)       | What are the standard Buryad-language case names used in school grammars?            |
| C2  | Voice names: Үйлдүүлэгшэ, Эдлүүлэгшэ, Хэлсэлэй, Хамтаршалай           | [grammar.ts:494-554](../src/data/grammar.ts#L494-L554)       | Standard Buryad terms for causative / passive / reciprocal / cooperative?            |
| C3  | "7 cases"                                                            | [grammar.ts:836](../src/data/grammar.ts#L836)                | 7 or 8? Is the directive (-руу/-рүү) a case or a postposition?                       |
| C4  | Vowel IPA: у [u], ү [y], ө [ø]                                       | grammar.ts, `VOWELS`                                         | Likely у [ʊ], ү [u], ө [ɵ]. Correct? The Phonology page says these symbols are under review and gives the textbook's description (p. 2). Бадагаров (02:03, 03:03) reaches өө from Russian ы and ү from и with rounded lips, and Staroverov 2020 (p. 45) writes ʉ, u, ɵː, which points to central vowels. |
| C5  | ж = [dʒ] affricate                                                   | grammar.ts, `CONSONANTS`                                     | Likely [ʒ] fricative in Buryad. Correct? The textbook (p. 1) says letters shared with Russian keep the Russian sound, but says nothing about ж itself; the Phonology page marks /dʒ/ as unconfirmed. Radnaeva 2006 (p. 582) writes [ʒ] in *дайралдажа, тэжээдэг*, and Urtegeshev 2023 (p. 178) finds a fricative in Alar. |
| C6  | "Habitual / Progressive" for -даг                                    | [grammar.ts:701](../src/data/grammar.ts#L701)                | Habitual only? What expresses the progressive (*ябажа байна*)? Бадагаров ep. 12 agrees with the app: -даг is the "regular" tense, -жа байна the continuous one, negated with the plain present negative. |
| C7  | Speakers: 461,000                                                    | [grammar.ts:9](../src/data/grammar.ts#L9)                    | That's roughly the ethnic population. What speaker figure should we cite, from which census? |
| C8  | "Nominative–Accusative (with ergative tendencies)"                   | [grammar.ts:15](../src/data/grammar.ts#L15)                  | Any basis for "ergative tendencies"? Otherwise remove.                               |
| C9  | Latin script 1929–1939                                               | [grammar.ts:10](../src/data/grammar.ts#L10)                  | Correct years for the Latin alphabet?                                                |
| C10 | Concessive example *Ябашьегүй үзэгдэнэ*                              | grammar.ts, `CONVERBS`                                       | Is this natural? Is the concessive *-башье* (*ябабашье*)?                            |
| C11 | Agglutination demo: дура → дурла- → дурлалса- (reciprocal)           | [grammar.ts:904](../src/data/grammar.ts#L904)                | Depends on A2.                                                                       |
| C12 | ы has no sound in the table; vocabulary has *Үгы* /yɡy/, *хэлыт* /xelit/, *Хүлисэгты* /xylisəɡtə/ | [grammar.ts](../src/data/grammar.ts), `vocabulary.json` | What is the IPA of ы, and is it long? These three stay as they are until answered. |
| C14 | һ = pharyngeal fricative, voiceless at the start of a word and voiced inside one (textbook p. 2); the table had glottal, and its place is now pharyngeal | grammar.ts, `CONSONANTS` | The IPA stays /h/ here and in `vocabulary.json`. Which symbols fit: [ħ] and [ɦ], [ʕ], or something else? Is the voiced sound right for speech? Radnaeva 2006 (p. 582) writes [ɦ] even at the start of a word (*һабартай*), against the textbook's voiceless start. |
| C15 | "How to say it" notes on the Phonology page rest on the textbook's general statement that shared letters sound as in Russian (p. 1). Placing д, т, н at the teeth comes from its note on н (p. 3) | grammar.ts, `how` | Applied for т, д, н: Бадагаров (11:40) says the tongue touches the upper teeth and alveoli, unlike Russian and further forward than English; the textbook (p. 3) calls н "as Russian" but also places it at the upper teeth. Is any other consonant noticeably unlike Russian, for example р, л, с, з? |
| C16 | г varies with harmony: [ɢ], often [ʁ] between vowels, in back-vowel words; [g], sometimes [ɣ], in front-vowel words (Staroverov 2020, p. 46; Radnaeva 2006, p. 582; Minlang). х likewise: [χ] in *хабар, болохо*, [x] in *нүхэн, ехэ*. Wikipedia cites the same for г to Poppe 1960, p. 11; not checked | grammar.ts, `CONSONANTS` | Applied as a note; IPA stays /ɡ/, /x/. Does Khori speech match? Radnaeva writes final г as [kʰ] (*ябадаг*) and has [g] in *олдоогүй*. |
| C17 | э: named э, but inside words not Russian э (Бадагаров 17:37-18:05, comparing an English vowel; the captions lose the word). Staroverov 2020 (p. 45) and Minlang write [ɘ]. о lacks Russian's у-like glide (05:59). Word-initial vowels sound "with effort" (17:05; captions unclear) | grammar.ts, `VOWELS` | Notes applied; IPA stays /e/, /ɔ/. Which English vowel is meant? Is the effort at 17:05 a glottal catch? |
| C18 | нх often sounds like нт: *сэнхир* as *сэнтир*, "very common" (Бадагаров ep. 15, 17:04). Stress on the syllable before -гүй (ep. 2, 07:05; ep. 5, 00:50). Short mid-word vowels drop out, *дуратай* near *дуртай* (ep. 7, 00:58; ep. 15, 15:56) | grammar.ts, `vowelGuide` | Applied as notes. Does нх as нт also hold for -нхай? The textbook has [ŋ] in *анха* (p. 3). The textbook (p. 6) puts stress on the first syllable, so where else does stress move? |
| C13 | Vowel table: о [ɔ]; *ерэбэ* [jɛrɛbɛ]. Vocabulary `ipa`: о /o/ (23 entries), э /e/ (43 entries) | [grammar.ts:35-106](../src/data/grammar.ts#L35-L106) | Which symbols are right, ɔ or o, e or ɛ? Decide with C4; then change both places together. |

C7–C9 also appear on the Home page, whose text now lives in the interface translations
([en.ts](../src/i18n/en.ts), [ru.ts](../src/i18n/ru.ts), [bua.ts](../src/i18n/bua.ts),
`home.profile` and `home.stats`): a correction there needs all three files.

## D. Interface translation

The interface has a Buryad / English / Russian switcher. The Buryad strings in
[bua.ts](../src/i18n/bua.ts) are a draft written without a native speaker. Please read them
through and correct anything unnatural, in particular:

| #   | App says                                                     | Question                                                                       |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| D1  | Эгшэгүүдэй зохилдоон / Эгшэгэй зохилдоон (vowel harmony)     | What is the school-grammar term for сингармонизм?                              |
| D2  | Дайбар үйлэ үгэ (converb), хойто үгэ (postposition)          | Standard terms for деепричастие and послелог?                                  |
| D3  | Нэрлэгшэ — нэмэлтэ — хэлэгшэ (subject — object — predicate)  | Standard terms for подлежащее, дополнение, сказуемое?                          |
| D4  | Тойм, Фонетикэ, Падежнүүд, Үйлэ үгэ, Үгын дараалал, Үгын сан, Дасхал | Natural menu names for Overview, Phonology, Cases, Verbs, Word order, Vocabulary, Practice? |
| D5  | хэнэй? юугээр? хэнтэй? (cues before the genitive, instrumental, comitative of the word of the day) | Natural case questions, and is *юугээр* the right form?                 |
| D6  | Асуудалай янзанууд, асуудалай үгэ, асуудалай тэмдэг, and the rest of `wordOrder.questions` | Natural terms and wording for "question structures", "question word" and "question marker"? |
| D7  | Phonology guide: хоёр уруулай, шүдэнэй, таглайн, хойто таглайн, хоолойн (bilabial … pharyngeal). BNC: уруул 3, таглай 1, хоолой 403, шүдэн 40 | Standard terms for the places of articulation? Do уруул and таглай mean lip and palate here? Please also read the guide's sentences in `phonology.guide` and `phonology.vowelGuide`. |
| D6  | Imperatives: үргэлжэлүүлыт, эхилыт, шэлэгты, бүтээгыт         | Right polite imperative endings?                                               |

Only the app shell, the Home page, page titles and tabs, and the Vocabulary page are translated.
The grammar explanations inside each page are still English in every interface language.
