import { useSearchParams } from 'react-router-dom';

export interface TabDef<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

// The active tab lives in ?tab= so a tab can be linked to and survives a reload.
// The default tab is left out of the URL; replace keeps tab clicks out of history.
export function useTab<T extends string>(tabs: ReadonlyArray<TabDef<T>>): [T, (t: T) => void] {
  const [params, setParams] = useSearchParams();
  const fallback = tabs[0].id;
  const raw = params.get('tab');
  const tab = tabs.find(t => t.id === raw)?.id ?? fallback;
  const setTab = (t: T) => setParams(t === fallback ? {} : { tab: t }, { replace: true });
  return [tab, setTab];
}

export function tabPanelProps(id: string) {
  return { role: 'tabpanel', id: `panel-${id}`, 'aria-labelledby': `tab-${id}` } as const;
}
