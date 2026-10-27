import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Phonology from './pages/Phonology';
import Cases from './pages/Cases';
import Verbs from './pages/Verbs';
import WordOrder from './pages/WordOrder';
import Vocabulary from './pages/Vocabulary';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phonology" element={<Phonology />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/verbs" element={<Verbs />} />
          <Route path="/word-order" element={<WordOrder />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
