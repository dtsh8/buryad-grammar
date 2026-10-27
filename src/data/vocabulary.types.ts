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
}

export interface VocabularyData {
  version: string;
  description: string;
  sources: string[];
  entries: Lexeme[];
}
