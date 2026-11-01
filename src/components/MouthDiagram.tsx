import { motion } from 'framer-motion';
import type { MouthPose } from '../data/mouthPoses';

const transition = { duration: 0.35, ease: 'easeInOut' } as const;

interface Props {
  pose: MouthPose;
  color: string;
  label: string;
}

export default function MouthDiagram({ pose, color, label }: Props) {
  const [cx, cy] = pose.spot;

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
        d={pose.tongue}
        initial={false}
        animate={{ d: pose.tongue }}
        transition={transition}
        className="fill-rose-300 stroke-rose-500"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lips */}
      <motion.ellipse
        rx="10"
        ry="6"
        initial={false}
        animate={{ cx: pose.lipX, cy: pose.upperLip }}
        transition={transition}
        className="fill-rose-400"
      />
      <motion.ellipse
        rx="10"
        ry="6"
        initial={false}
        animate={{ cx: pose.lipX, cy: pose.lowerLip }}
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
