// ─── Shared types for the corpus pipeline ─────────────────────────────────

export interface RawArticle {
  url: string;
  title: string;
  date: string;
  category: string;
  text: string; // full article body, cleaned
}

export interface Sentence {
  text: string;
  source: string; // article URL
  date: string;
}

export interface CorpusExample {
  sentence: string;
  source: string;
  date: string;
  matchedPattern: string;
}

export interface FeatureExamples {
  feature: string; // e.g. "ablative" | "causative"
  pattern: string; // human-readable description of the morpheme pattern
  examples: CorpusExample[];
}

export interface FreqEntry {
  word: string;
  count: number;
  perMille: number; // frequency per 1000 words
}

export interface CorpusVocab {
  totalWords: number;
  uniqueWords: number;
  generatedAt: string;
  entries: FreqEntry[];
}
