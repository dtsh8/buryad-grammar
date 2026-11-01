import { useAttestation } from '../hooks/useAttestation';
import { useI18n } from '../i18n/context';
import Tooltip from './Tooltip';

// How often a form occurs in the Buryat National Corpus (precomputed by npm run attestation).
// Shows nothing for forms that were never checked. Hover, focus or tap explains the number.
export default function AttestBadge({ form }: { form: string }) {
  const { t } = useI18n();
  const count = useAttestation()(form);
  if (count === undefined) return null;

  const found = count > 0;
  return (
    <Tooltip
      text={found ? t.attest.found(count.toLocaleString()) : t.attest.notFound}
      className={`inline-flex items-center rounded-full border px-1.5 text-[11px] font-sans font-normal align-middle whitespace-nowrap ${
        found
          ? 'border-green-200 bg-green-50 text-green-800'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      {found ? (
        <>
          <span aria-hidden="true">✓</span>
          <span className="sr-only">{t.attest.foundLabel}</span>&nbsp;{count.toLocaleString()}
        </>
      ) : (
        t.attest.notFoundBadge
      )}
    </Tooltip>
  );
}
