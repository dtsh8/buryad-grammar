import { useState, useEffect } from 'react';
import type { AttestationData } from '../data/attestation.types';
import { attestationKey } from '../utils/attestationForms';

// Module-level cache — the file is fetched once and shared by every badge.
let cache: Record<string, number> | null = null;
let pending: Promise<Record<string, number>> | null = null;

function load(): Promise<Record<string, number>> {
  pending ??= fetch(import.meta.env.BASE_URL + 'data/attestation.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<AttestationData>;
    })
    .then(d => d.counts);
  return pending;
}

// Corpus count for a form: a number, or undefined if the form was never checked
// (e.g. a verb typed into the Verb Builder that isn't in the vocabulary).
export function useAttestation(): (form: string) => number | undefined {
  const [counts, setCounts] = useState<Record<string, number> | null>(() => cache);

  useEffect(() => {
    if (cache !== null) return;
    load()
      .then(c => {
        cache = c;
        setCounts(c);
      })
      .catch(() => {
        pending = null; // badges are optional; try again on the next mount
      });
  }, []);

  return form => counts?.[attestationKey(form)];
}
