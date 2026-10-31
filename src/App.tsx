import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import TabBar from './components/TabBar';
import RouteEffects from './components/RouteEffects';
import Home from './pages/Home';
import Phonology from './pages/Phonology';
import Cases from './pages/Cases';
import Verbs from './pages/Verbs';
import Modals from './pages/Modals';
import WordOrder from './pages/WordOrder';
import Vocabulary from './pages/Vocabulary';
import Practice from './pages/Practice';
import NotFound from './pages/NotFound';
import LanguageProvider from './i18n/LanguageProvider';
import { useI18n } from './i18n/context';

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-stone-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>
          {t.footer.sources}: Poppe 1960; Skribnik 2003; Учебник бурятского языка; Skribnik &amp;
          Darzhaeva 2020.
        </span>
        <a
          href="https://buryat.web-corpora.net/buryat_corpus/search"
          target="_blank"
          rel="noopener noreferrer"
          className="text-buryat-700 hover:underline underline-offset-2"
        >
          {t.footer.corpus} ↗
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <RouteEffects />
          {/* Full-height column: main grows, so the footer sits at the bottom of the screen
            on short pages. Below lg the bottom padding is the tab bar's height (48px row + border). */}
          <div className="min-h-dvh flex flex-col pb-[calc(49px+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/phonology" element={<Phonology />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/verbs" element={<Verbs />} />
                <Route path="/modals" element={<Modals />} />
                <Route path="/word-order" element={<WordOrder />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <TabBar />
        </BrowserRouter>
      </MotionConfig>
    </LanguageProvider>
  );
}
