import {
  House,
  Mic,
  Grid,
  Code2,
  GitBranch,
  LayoutList,
  Dumbbell,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import type { Messages } from './i18n/en';

// The app's pages: drives the navbar, the Home section cards and the document title.
// Labels and descriptions live in the i18n messages under `sections[key]`.
// `grammar` pages sit under the Grammar menu in both the navbar and the TabBar.
export const SECTIONS: Array<{
  to: string;
  key: keyof Messages['sections'];
  icon: LucideIcon;
  grammar?: boolean;
}> = [
  { to: '/', key: 'overview', icon: House },
  { to: '/phonology', key: 'phonology', icon: Mic, grammar: true },
  { to: '/cases', key: 'cases', icon: Grid, grammar: true },
  { to: '/verbs', key: 'verbs', icon: Code2, grammar: true },
  { to: '/modals', key: 'modals', icon: Scale, grammar: true },
  { to: '/word-order', key: 'wordOrder', icon: GitBranch, grammar: true },
  { to: '/vocabulary', key: 'vocabulary', icon: LayoutList },
  { to: '/practice', key: 'practice', icon: Dumbbell },
];

export const GRAMMAR_SECTIONS = SECTIONS.filter(s => s.grammar);
