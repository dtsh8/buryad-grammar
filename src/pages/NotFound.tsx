import { Link } from 'react-router-dom';
import { SECTIONS } from '../sections';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <p className="text-sm font-mono text-stone-500">404</p>
      <h1 className="text-3xl font-bold text-stone-900">Page not found</h1>
      <p className="text-stone-600">There is no page at this address. Try one of these:</p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {SECTIONS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-sm text-stone-700 hover:border-buryat-300 hover:text-buryat-700"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
