import { useState, useEffect } from 'react';
import type { AudioManifest } from '../utils/audio';

// Module-level cache — the manifest is fetched once and shared by every play button.
let cache: AudioManifest['clips'] | null = null;
let pending: Promise<AudioManifest['clips']> | null = null;

function load(): Promise<AudioManifest['clips']> {
  pending ??= fetch(import.meta.env.BASE_URL + 'audio/manifest.json')
    .then(r => (r.ok ? (r.json() as Promise<AudioManifest>) : { clips: {} }))
    .then(m => (cache = m.clips))
    // No manifest (or offline): no play buttons, nothing else breaks.
    .catch(() => (cache = {}));
  return pending;
}

// Recorded clips, clip key → file name. Empty until loaded.
export function useAudioClips(): AudioManifest['clips'] {
  const [clips, setClips] = useState(() => cache ?? {});

  useEffect(() => {
    if (cache !== null) return;
    load().then(setClips);
  }, []);

  return clips;
}
