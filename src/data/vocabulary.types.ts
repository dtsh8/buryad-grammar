// ─── Vocabulary types (shared between grammar.ts and vocabulary.json) ──────

export type LexemeCategory =
  'noun' | 'verb' | 'adjective' | 'pronoun' | 'numeral' | 'phrase' | 'adverb' | 'particle';

export interface Lexeme {
  id: string;
  buryad: string;
  ipa: string;
  english: string;
  russian?: string;
  category: LexemeCategory;
  tags?: string[];
  example?: { buryad: string; translation: string };
  // Nouns ending in н: whether the н stays (хүн → хүниие), drops in the accusative,
  // instrumental and comitative (морин → мориие), or is a back н (ан → ангые).
  // Set from Buryat National Corpus counts; see src/utils/nounMorphology.ts.
  nStem?: 'stable' | 'unstable' | 'velar';
}

export interface VocabularyData {
  version: string;
  description: string;
  sources: string[];
  entries: Lexeme[];
}
