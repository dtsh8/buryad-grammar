import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import RouteEffects from './components/RouteEffects';
import Home from './pages/Home';
import Phonology from './pages/Phonology';
import Cases from './pages/Cases';
import Verbs from './pages/Verbs';
import WordOrder from './pages/WordOrder';
import Vocabulary from './pages/Vocabulary';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <RouteEffects />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phonology" element={<Phonology />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/verbs" element={<Verbs />} />
            <Route path="/word-order" element={<WordOrder />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-stone-200 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1 justify-between">
            <span>
              Sources: Poppe 1960; Skribnik 2003; Учебник бурятского языка; Skribnik &amp; Darzhaeva
              2020.
            </span>
            <a
              href="https://buryat.web-corpora.net/buryat_corpus/search"
              target="_blank"
              rel="noopener noreferrer"
              className="text-buryat-700 hover:underline underline-offset-2"
            >
              Buryat National Corpus ↗
            </a>
          </div>
        </footer>
      </BrowserRouter>
    </MotionConfig>
  );
}
