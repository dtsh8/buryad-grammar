import { useAttestation } from '../hooks/useAttestation';

// How often a form occurs in the Buryat National Corpus (precomputed by npm run attestation).
// Shows nothing for forms that were never checked.
export default function AttestBadge({ form }: { form: string }) {
  const count = useAttestation()(form);
  if (count === undefined) return null;

  const found = count > 0;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 text-[11px] font-sans font-normal align-middle whitespace-nowrap ${
        found
          ? 'border-green-200 bg-green-50 text-green-800'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
      title={
        found
          ? `Found ${count.toLocaleString()} times in the Buryat National Corpus`
          : 'Not found in the Buryat National Corpus. Built by rule: it may be rare or unused.'
      }
    >
      {found ? (
        <>
          <span aria-hidden="true">✓</span>
          <span className="sr-only">Found in the corpus:</span>&nbsp;{count.toLocaleString()}
        </>
      ) : (
        'not found'
      )}
    </span>
  );
}
