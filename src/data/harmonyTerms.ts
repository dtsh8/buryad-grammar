// Explanations of the vowel-harmony classes, shown as tooltips wherever the app says
// "back", "front" or "neutral". Terms from Учебник бурятского языка, pp. 3 and 5:
// гласные заднего ряда (эрэ), переднего ряда (эмэ), нейтральные (эрсэ). Russian-language
// Mongolic grammars also call the rows твердорядные / мягкорядные ("hard" / "soft" words);
// not to be confused with hard / soft consonants (халуун vs халюун, textbook p. 4).

export type HarmonyClass = 'back' | 'front' | 'neutral';

export const HARMONY_TIP: Record<HarmonyClass, string> = {
  back: 'Back vowels: а, о, у and their long forms аа, оо, уу. In Russian grammars гласные заднего ряда: заднерядные, also твердорядные (твёрдые); in Buryad эрэ. A word with them takes back suffixes: гараар, газарһаа.',
  front:
    'Front vowels: э, ө, ү and their long forms ээ, өө, үү. In Russian grammars гласные переднего ряда: переднерядные, also мягкорядные (мягкие); in Buryad эмэ. A word with them takes front suffixes: гэрээр, гэрһээ.',
  neutral:
    'Neutral vowels: и, ии, ы. In Buryad эрсэ. They occur in both back and front words and do not decide the suffix vowel.',
};
