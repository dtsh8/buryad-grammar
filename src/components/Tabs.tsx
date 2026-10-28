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

  // The grey baseline is drawn behind the row, so the active underline covers it without any
  // tab sticking out of the row; that 1px of overflow made browsers show a vertical scrollbar.
  // Narrow screens still scroll the row sideways (swipe, trackpad, arrow keys) with no visible bar.
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-stone-200" />
      <div
        role="tablist"
        aria-label={label}
        className="relative flex gap-1 overflow-x-auto overflow-y-hidden no-scrollbar"
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
            className={`flex items-center gap-1.5 pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
              active === id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
