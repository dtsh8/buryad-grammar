import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTIONS } from '../sections';

const SITE = 'Буряад Хэлэн — Buryad Grammar';

// Per-page document title, and back to the top on a page change. Tab changes only touch
// ?tab=, so they keep the scroll position.
export default function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    const section = SECTIONS.find(s => s.to === pathname);
    document.title = section && section.to !== '/' ? `${section.label} · ${SITE}` : SITE;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
