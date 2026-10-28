import { splitEnding } from '../utils/splitEnding';

// A Buryad form with its ending in amber: whatever follows the part shared with the base,
// so a dropped н shows by itself (морин → мори|ие, мор|ёор).
export default function Suffixed({
  base,
  form,
  className = '',
}: {
  base: string;
  form: string;
  className?: string;
}) {
  const [stem, ending] = splitEnding(base, form);
  return (
    <span lang="bua" className={`font-buryat ${className}`}>
      {stem}
      {ending && <span className="text-buryat-500">{ending}</span>}
    </span>
  );
}
