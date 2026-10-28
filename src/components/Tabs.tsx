import { useRef, type KeyboardEvent } from 'react';
import type { TabDef } from '../hooks/useTab';

// WAI-ARIA tablist: one tab stop, arrow keys / Home / End move between tabs.
export default function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: ReadonlyArray<TabDef<T>>;
  active: T;
  onChange: (t: T) => void;
  label: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent, i: number) {
    const n = tabs.length;
    const next = {
      ArrowRight: (i + 1) % n,
      ArrowLeft: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className="border-b border-stone-200 flex gap-1 overflow-x-auto"
    >
      {tabs.map(({ id, label, icon }, i) => (
        <button
          key={id}
          ref={el => {
            refs.current[i] = el;
          }}
          role="tab"
          id={`tab-${id}`}
          aria-selected={active === id}
          aria-controls={`panel-${id}`}
          tabIndex={active === id ? 0 : -1}
          onClick={() => onChange(id)}
          onKeyDown={e => onKeyDown(e, i)}
          className={`-mb-px flex items-center gap-1.5 pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
            active === id ? 'tab-active' : 'tab-inactive'
          }`}
        >
          {icon && <span aria-hidden="true">{icon}</span>}
          {label}
        </button>
      ))}
    </div>
  );
}
