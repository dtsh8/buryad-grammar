import {
  BookOpen,
  Mic,
  Grid,
  Code2,
  GitBranch,
  LayoutList,
  Dumbbell,
  type LucideIcon,
} from 'lucide-react';
import type { Messages } from './i18n/en';

// The app's pages: drives the navbar, the Home section cards and the document title.
// Labels and descriptions live in the i18n messages under `sections[key]`.
export const SECTIONS: Array<{ to: string; key: keyof Messages['sections']; icon: LucideIcon }> = [
  { to: '/', key: 'overview', icon: BookOpen },
  { to: '/phonology', key: 'phonology', icon: Mic },
  { to: '/cases', key: 'cases', icon: Grid },
  { to: '/verbs', key: 'verbs', icon: Code2 },
  { to: '/word-order', key: 'wordOrder', icon: GitBranch },
  { to: '/vocabulary', key: 'vocabulary', icon: LayoutList },
  { to: '/practice', key: 'practice', icon: Dumbbell },
];
