import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTIONS } from '../sections';
import { useI18n } from '../i18n/context';

// Per-page document title, and back to the top on a page change. Tab changes only touch
// ?tab=, so they keep the scroll position.
export default function RouteEffects() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Separate from the scroll: switching language retitles the page without moving it.
  useEffect(() => {
    const section = SECTIONS.find(s => s.to === pathname);
    document.title =
      section && section.to !== '/'
        ? `${t.sections[section.key].label} · ${t.siteTitle}`
        : t.siteTitle;
  }, [pathname, t]);

  return null;
}
