// Pronunciation clips live in public/audio/, one file per word, named after the word it
// says (see clipKey). `npm run audio` scans that folder and writes manifest.json, so the
// app shows a play button only for words that have been recorded.

export const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.ogg', '.wav', '.webm'] as const;

export interface AudioManifest {
  clips: Record<string, string>; // clip key → file name in public/audio/
}

// File name (without extension) for a word: lowercase, punctuation dropped, spaces as
// underscores. "Сайн байна уу?" → "сайн_байна_уу", "яба!" → "яба", "Улаан-Үдэдэ" keeps its hyphen.
export function clipKey(word: string): string {
  return word
    .normalize('NFC')
    .toLowerCase()
    .replace(/[!?.,;:…"'«»()]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

// Manifest for the files found in public/audio/. Files whose extension isn't an audio
// type (manifest.json itself, notes) are skipped; the key is the normalised base name, so a
// file saved as "Гэр.MP3" still matches гэр.
export function buildManifest(fileNames: string[]): AudioManifest {
  const clips: Record<string, string> = {};
  for (const name of [...fileNames].sort()) {
    const dot = name.lastIndexOf('.');
    if (dot <= 0) continue;
    const ext = name.slice(dot).toLowerCase();
    if (!(AUDIO_EXTENSIONS as readonly string[]).includes(ext)) continue;
    clips[clipKey(name.slice(0, dot))] ??= name;
  }
  return { clips };
}
