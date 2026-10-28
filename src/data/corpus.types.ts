// ─── Corpus example types (shared between scripts/build_corpus.ts and the app) ─

export interface CorpusExample {
  sentence: string;
  match: string; // the word that shows the feature, as it appears in the sentence
  url: string;
  title: string;
}

export interface CorpusFeature {
  label: string;
  description: string;
  total: number; // matching sentences in the whole corpus
  examples: CorpusExample[];
}

export interface CorpusExamplesData {
  source: string;
  generatedAt: string;
  articles: number;
  sentences: number;
  words: number;
  features: Record<string, CorpusFeature>;
}

// Raw scraped article (data/corpus/raw_articles.json, not deployed).
export interface RawArticle {
  url: string;
  title: string;
  date: string;
  category: string;
  text: string;
}
