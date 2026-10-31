import type { ReactNode } from 'react';
import { MODAL_DOUBLE_NEGATION as D } from '../data/grammar';
import { gloss } from '../i18n/lang';
import { useI18n } from '../i18n/context';

const LAYER_STYLE = [
  'border-green-300 bg-green-50',
  'border-red-300 bg-red-50',
  'border-mongol-300 bg-mongol-50',
];

// Each box wraps the layer before it, so the nesting shows what each negation applies to.
export default function DoubleNegation() {
  const { lang } = useI18n();

  const nested = D.layers.reduce<ReactNode>(
    (inner, layer, i) => (
      <div className={`rounded-xl border-2 p-2.5 sm:p-3 space-y-2 ${LAYER_STYLE[i]}`}>
        {inner}
        <p className="text-sm">
          <span lang="bua" className="font-buryat font-semibold text-stone-800">
            {layer.buryad}
          </span>
          <span className="block text-stone-600">{gloss(layer.meaning, lang)}</span>
        </p>
      </div>
    ),
    null
  );

  return (
    <div className="space-y-3">
      <p lang="bua" className="font-buryat text-buryat-700 text-base">
        {D.buryad}
      </p>
      <p className="text-sm italic text-stone-600">
        '{gloss(D.translation, lang)}'{' '}
        <span className="not-italic text-xs text-stone-500">{D.source}</span>
      </p>
      {nested}
    </div>
  );
}
