import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

const GAP = 6; // px between the trigger and the bubble
const MARGIN = 8; // px kept clear of the screen edges

// A small explanation bubble for a badge. Opens on hover, keyboard focus and tap (phones have
// no hover); closes on leave, blur, Escape, a second tap, or scrolling. Rendered in a portal
// with fixed positioning so scrolling tables and lists can't clip it.
export default function Tooltip({
  text,
  children,
  className = '',
}: {
  text: string;
  children: ReactNode;
  className?: string; // classes for the trigger (the badge itself)
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const pointer = useRef<string>(''); // type of the last pointer press: mouse, touch or pen
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Place above the trigger, or below if there's no room; keep inside the screen.
  useLayoutEffect(() => {
    if (!open || !trigger.current || !bubble.current) return;
    const t = trigger.current.getBoundingClientRect();
    const b = bubble.current.getBoundingClientRect();
    const above = t.top - GAP - b.height;
    const top = above >= MARGIN ? above : t.bottom + GAP;
    const centred = t.left + t.width / 2 - b.width / 2;
    const left = Math.min(Math.max(centred, MARGIN), window.innerWidth - b.width - MARGIN);
    setPos({ top, left });
  }, [open]);

  // A fixed bubble would drift away from its badge when the page scrolls, so close it.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true, capture: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-describedby={open ? id : undefined}
        // A tap fires (emulated) hover, focus and click in a row, so each input opens it its own
        // way: the mouse by hovering, the keyboard by focusing, touch by toggling on tap.
        onPointerDown={e => (pointer.current = e.pointerType)}
        onPointerEnter={e => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={e => e.pointerType === 'mouse' && setOpen(false)}
        onFocus={e => e.currentTarget.matches(':focus-visible') && setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={e => {
          e.stopPropagation();
          setOpen(o => (pointer.current === 'mouse' ? true : !o));
        }}
        onKeyDown={onKeyDown}
        className={`cursor-help ${className}`}
      >
        {children}
      </button>
      {open &&
        createPortal(
          <div
            ref={bubble}
            id={id}
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              visibility: pos ? 'visible' : 'hidden',
            }}
            className="z-[60] max-w-64 rounded-lg bg-stone-800 px-3 py-2 text-xs leading-snug text-white shadow-lg pointer-events-none font-sans font-normal normal-case tracking-normal text-left"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}
