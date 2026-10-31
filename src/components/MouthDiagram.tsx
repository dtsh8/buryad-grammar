import { motion } from 'framer-motion';
import type { ConsonantPlace } from '../data/grammar';

// Side view of the head, facing left. Each place has its own tongue shape; all shapes share the
// same path commands so framer-motion can morph between them.
const TONGUE: Record<ConsonantPlace, string> = {
  bilabial: 'M195 250 C200 200 185 172 150 172 C125 172 105 182 92 198 C100 212 130 225 170 230 Z',
  alveolar: 'M195 250 C200 205 185 195 150 192 C125 190 105 182 93 169 C96 195 130 225 170 230 Z',
  postalveolar:
    'M195 250 C200 205 185 190 150 178 C132 171 122 162 108 155 C100 190 130 225 170 230 Z',
  palatal: 'M195 250 C200 200 190 150 150 145 C128 142 124 192 92 200 C100 212 130 225 170 230 Z',
  velar: 'M195 250 C205 185 203 152 178 150 C154 148 136 200 92 202 C100 212 130 225 170 230 Z',
  pharyngeal:
    'M214 252 C226 222 214 178 160 178 C130 178 105 186 92 200 C100 212 130 225 170 230 Z',
};

// Where the sound is made, marked on the diagram.
const SPOT: Record<ConsonantPlace, [number, number]> = {
  bilabial: [66, 186],
  alveolar: [93, 165],
  postalveolar: [108, 151],
  palatal: [150, 141],
  velar: [180, 146],
  pharyngeal: [218, 215],
};

const transition = { duration: 0.35, ease: 'easeInOut' } as const;

interface Props {
  place: ConsonantPlace;
  color: string;
  label: string;
}

export default function MouthDiagram({ place, color, label }: Props) {
  const closed = place === 'bilabial';
  const [cx, cy] = SPOT[place];

  return (
    <svg viewBox="30 10 240 280" className="w-full max-w-xs mx-auto" role="img" aria-label={label}>
      {/* Head */}
      <path
        d="M262 290 L262 110 C262 50 215 18 160 18 C110 18 82 48 76 92 L72 112 L44 150 C41 158 48 162 62 163 L58 174 L58 202 L64 232 C68 256 88 264 122 262 L178 252 L186 290 Z"
        className="fill-stone-100 stroke-stone-400"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Mouth and throat */}
      <path
        d="M66 176 L82 174 L88 164 C104 148 122 139 150 138 C176 137 196 146 204 162 L212 176 L232 176 L232 290 L196 290 L196 250 L170 232 C130 232 100 222 66 200 Z"
        className="fill-white stroke-stone-400"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Upper and lower front teeth */}
      <path d="M82 174 L88 164 L92 176 L86 182 Z" className="fill-stone-300" />
      <path d="M82 208 L90 212 L92 200 L85 196 Z" className="fill-stone-300" />
      <motion.path
        d={TONGUE[place]}
        initial={false}
        animate={{ d: TONGUE[place] }}
        transition={transition}
        className="fill-rose-300 stroke-rose-500"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lips */}
      <motion.ellipse
        cx="64"
        rx="10"
        ry="6"
        initial={false}
        animate={{ cy: closed ? 180 : 175 }}
        transition={transition}
        className="fill-rose-400"
      />
      <motion.ellipse
        cx="64"
        rx="10"
        ry="6"
        initial={false}
        animate={{ cy: closed ? 191 : 202 }}
        transition={transition}
        className="fill-rose-400"
      />
      <motion.circle
        r="7"
        initial={false}
        animate={{ cx, cy }}
        transition={transition}
        fill={color}
        fillOpacity="0.85"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}
