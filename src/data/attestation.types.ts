// public/data/attestation.json, written by scripts/attestation.ts.
export interface AttestationData {
  source: string;
  generatedAt: string;
  counts: Record<string, number>; // word form (lower case) → tokens in the corpus
}
