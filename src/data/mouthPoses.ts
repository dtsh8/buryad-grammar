import type { ConsonantPlace } from './grammar';

// Poses for MouthDiagram: a side view of the head, facing left. Every tongue shares the same path
// commands so framer-motion can morph between them.
export interface MouthPose {
  tongue: string;
  spot: [number, number]; // the dot: where the sound is made, or the tongue's highest point
  upperLip: number; // y of each lip
  lowerLip: number;
  lipX: number; // x of both lips; smaller pushes them forward
}

const OPEN_LIPS = { upperLip: 175, lowerLip: 202, lipX: 64 };

export const CONSONANT_POSES: Record<ConsonantPlace, MouthPose> = {
  bilabial: {
    tongue: 'M195 250 C200 200 185 172 150 172 C125 172 105 182 92 198 C100 212 130 225 170 230 Z',
    spot: [66, 186],
    upperLip: 180,
    lowerLip: 191,
    lipX: 64,
  },
  alveolar: {
    tongue: 'M195 250 C200 205 185 195 150 192 C125 190 105 182 93 169 C96 195 130 225 170 230 Z',
    spot: [93, 165],
    ...OPEN_LIPS,
  },
  postalveolar: {
    tongue: 'M195 250 C200 205 185 190 150 178 C132 171 122 162 108 155 C100 190 130 225 170 230 Z',
    spot: [108, 151],
    ...OPEN_LIPS,
  },
  palatal: {
    tongue: 'M195 250 C200 200 190 150 150 145 C128 142 124 192 92 200 C100 212 130 225 170 230 Z',
    spot: [150, 141],
    ...OPEN_LIPS,
  },
  velar: {
    tongue: 'M195 250 C205 185 203 152 178 150 C154 148 136 200 92 202 C100 212 130 225 170 230 Z',
    spot: [180, 146],
    ...OPEN_LIPS,
  },
  pharyngeal: {
    tongue: 'M214 252 C226 222 214 178 160 178 C130 178 105 186 92 200 C100 212 130 225 170 230 Z',
    spot: [218, 215],
    ...OPEN_LIPS,
  },
};

// Schematic, not measured. у, ү, өө follow the textbook's descriptions (p. 2), wide and narrow
// its classes (p. 3), and э, өө, ү the central values in Staroverov 2020, p. 45 and Бадагаров ep. 1,
// 02:03-03:32. а, о have their roots drawn back after Urtegeshev 2023 on hard words; и is plain.
export const VOWEL_POSES: Record<string, MouthPose & { wide: boolean }> = {
  а: {
    tongue: 'M214 252 C222 225 205 198 170 197 C140 197 110 200 92 204 C100 212 130 225 170 230 Z',
    spot: [172, 197],
    upperLip: 175,
    lowerLip: 206,
    lipX: 64,
    wide: true,
  },
  о: {
    tongue: 'M208 252 C216 215 205 188 175 186 C150 185 115 196 92 202 C100 212 130 225 170 230 Z',
    spot: [178, 186],
    upperLip: 177,
    lowerLip: 199,
    lipX: 60,
    wide: true,
  },
  у: {
    tongue: 'M205 250 C214 195 206 158 180 155 C155 153 130 195 95 202 C100 212 130 225 170 230 Z',
    spot: [182, 155],
    upperLip: 179,
    lowerLip: 194,
    lipX: 57,
    wide: false,
  },
  э: {
    tongue: 'M195 250 C200 210 185 178 150 175 C125 173 108 188 92 198 C100 212 130 225 170 230 Z',
    spot: [150, 175],
    upperLip: 175,
    lowerLip: 203,
    lipX: 64,
    wide: true,
  },
  ө: {
    tongue: 'M198 250 C205 205 195 172 165 168 C140 165 115 190 94 200 C100 212 130 225 170 230 Z',
    spot: [165, 168],
    upperLip: 178,
    lowerLip: 197,
    lipX: 59,
    wide: false,
  },
  ү: {
    tongue: 'M190 250 C198 205 185 168 142 153 C122 147 116 178 100 198 C106 212 130 225 170 230 Z',
    spot: [138, 152],
    upperLip: 179,
    lowerLip: 194,
    lipX: 59,
    wide: false,
  },
  и: {
    tongue: 'M195 250 C205 205 190 165 140 150 C115 143 105 175 92 198 C100 212 130 225 170 230 Z',
    spot: [132, 149],
    upperLip: 176,
    lowerLip: 196,
    lipX: 66,
    wide: false,
  },
};
