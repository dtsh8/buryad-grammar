import { BookOpen, Mic, Grid, Code2, GitBranch, LayoutList, type LucideIcon } from 'lucide-react';

// The app's pages: drives the navbar, the Home section cards and the document title.
export const SECTIONS: Array<{ to: string; label: string; icon: LucideIcon; desc: string }> = [
  { to: '/', label: 'Overview', icon: BookOpen, desc: 'Language profile and typology' },
  {
    to: '/phonology',
    label: 'Phonology',
    icon: Mic,
    desc: 'Vowel harmony, consonants, long vowels',
  },
  { to: '/cases', label: 'Cases', icon: Grid, desc: '7 nominal cases with endings and examples' },
  { to: '/verbs', label: 'Verbs', icon: Code2, desc: 'Tense, person endings, converbs' },
  {
    to: '/word-order',
    label: 'Word Order',
    icon: GitBranch,
    desc: 'SOV, postpositions, modifiers',
  },
  {
    to: '/vocabulary',
    label: 'Vocabulary',
    icon: LayoutList,
    desc: 'Core words, phrases and numerals',
  },
];
