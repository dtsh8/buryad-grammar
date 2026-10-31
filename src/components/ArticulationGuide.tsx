import { forwardRef } from 'react';
import { CONSONANTS, type ConsonantPlace } from '../data/grammar';
import { useI18n } from '../i18n/context';
import MouthDiagram from './MouthDiagram';

export const PLACES: ConsonantPlace[] = [
  'bilabial',
  'alveolar',
  'postalveolar',
  'palatal',
  'velar',
  'pharyngeal',
];

export const PLACE_COLORS: Record<ConsonantPlace, string> = {
  bilabial: '#c8851a',
  alveolar: '#0e88ea',
  velar: '#16a34a',
  postalveolar: '#9333ea',
  palatal: '#db2777',
  pharyngeal: '#6b7280',
};

interface Props {
  place: ConsonantPlace;
  onSelect: (place: ConsonantPlace) => void;
}

// Pick a place of articulation to see it on the head diagram, with its letters.
const ArticulationGuide = forwardRef<HTMLDivElement, Props>(function ArticulationGuide(
  { place, onSelect },
  ref
) {
  const { t } = useI18n();
  const guide = t.phonology.guide;
  const letters = CONSONANTS.filter(c => c.place === place).map(c => c.letter);

  return (
    <div ref={ref} className="card space-y-4 scroll-mt-20">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">{guide.title}</h2>
        <p className="text-sm text-stone-500 mt-1">{guide.intro}</p>
      </div>
      <MouthDiagram
        place={place}
        color={PLACE_COLORS[place]}
        label={`${guide.diagramLabel}: ${guide.places[place].name}`}
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label={guide.placesLabel}>
        {PLACES.map(p => (
          <button
            key={p}
            type="button"
            aria-pressed={p === place}
            onClick={() => onSelect(p)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              p === place
                ? 'text-white border-transparent'
                : 'text-stone-600 border-stone-300 hover:bg-stone-50'
            }`}
            style={p === place ? { background: PLACE_COLORS[p] } : undefined}
          >
            {guide.places[p].name}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        <p className="text-sm text-stone-700">{guide.places[place].how}</p>
        <p className="font-buryat text-xl text-stone-800 mt-2">{letters.join(' ')}</p>
      </div>
    </div>
  );
});

export default ArticulationGuide;
