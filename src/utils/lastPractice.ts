// Remembers the last Practice drill in this browser, for the "Continue" card on Today.
// Storage can be unavailable (private mode, blocked site data), so every access is guarded.

export type DrillId = 'conjugation' | 'cases';

const KEY = 'buryad:last-practice';

export function saveLastPractice(drill: DrillId): void {
  try {
    localStorage.setItem(KEY, drill);
  } catch {
    // not remembered; the card falls back to a default
  }
}

export function loadLastPractice(): DrillId | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'conjugation' || v === 'cases' ? v : null;
  } catch {
    return null;
  }
}
