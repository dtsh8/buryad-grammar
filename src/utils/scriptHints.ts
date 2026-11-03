import type { Messages } from '../i18n/en';
import { CYRILLIC_HINT, type Letter } from './mongolScript';

// The tooltip for one letter of the script: its sound, its place in the word, and the other
// sounds its shape stands for there.
export function letterHint(letter: Letter, t: Messages): string {
  const s = t.script;
  const position = s.positions[letter.position];
  const lines = [
    s.sound(letter.sound, CYRILLIC_HINT[letter.sound]),
    s.position(letter.detached ? `${position}, ${s.detached}` : position),
    letter.alsoReads.length > 0 ? s.alsoReads(letter.alsoReads.join(', ')) : s.unique,
  ];
  return lines.join('\n');
}
