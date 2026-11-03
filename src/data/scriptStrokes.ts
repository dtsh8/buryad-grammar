// The named parts that letters of the script are built from, with the order of their strokes:
// Скородумова Л. Г. Введение в старописьменный монгольский язык. М., 2000, pp. 4–5. Names are
// spelt as she prints them. Shapes are redrawn from her handwritten column, in a 40 × 56 box with
// the letter's spine at x = 22; each path runs in writing direction, and the strokes are in
// writing order. Glosses are given only for names whose words are plain.
export interface StrokePart {
  id: string;
  name: string;
  en?: string;
  ru?: string;
  strokes: string[];
}

export const STROKE_PARTS: StrokePart[] = [
  {
    id: 'titim',
    name: 'титим',
    en: 'crown',
    ru: 'корона',
    strokes: ['M31 5 C25 5 19 9 15 15 L22 13 L22 50'],
  },
  {
    id: 'shud',
    name: 'шүд буюу ацаг',
    en: 'tooth, or fork',
    ru: 'зуб, или развилка',
    strokes: ['M24 12 L15 21 L22 20 L22 50'],
  },
  { id: 'nuruu', name: 'нуруу', en: 'back, spine', ru: 'спина', strokes: ['M22 10 L22 50'] },
  {
    id: 'shuluun',
    name: 'шулуун шилбэ',
    en: 'straight shin',
    ru: 'прямая голень',
    strokes: ['M22 10 L22 22 L12 33', 'M22 22 L22 50'],
  },
  {
    id: 'etter',
    name: 'эттэр шилбэ',
    strokes: ['M22 10 L22 22 L12 32 Q9 33 9 30', 'M22 22 L22 50'],
  },
  {
    id: 'mattar',
    name: 'маттар шилбэ',
    strokes: ['M22 10 L22 22 Q13 25 12 31 Q13 35 18 33', 'M22 22 L22 50'],
  },
  {
    id: 'urgust',
    name: 'өргөстэй шилбэ',
    en: 'thorny shin',
    ru: 'колючая голень',
    strokes: ['M22 10 L22 22 L12 32', 'M12 21 L20 29', 'M22 22 L22 50'],
  },
  {
    id: 'gogtsoo',
    name: 'гогцоотой шилбэ',
    en: 'shin with a loop',
    ru: 'голень с петлёй',
    strokes: ['M22 10 L22 23 C14 21 10 28 13 31 C16 34 21 30 22 27 L22 50'],
  },
  {
    id: 'khundii',
    name: 'хөндий шилбэ',
    en: 'hollow shin',
    ru: 'полая голень',
    strokes: ['M22 10 L22 20 L10 27 L22 33 L22 50'],
  },
  {
    id: 'khult',
    name: 'хөлтэй шилбэ',
    en: 'shin with a foot',
    ru: 'голень со ступнёй',
    strokes: ['M26 6 L19 14 L25 16 C21 26 13 34 5 38 Q3 37 6 34'],
  },
  {
    id: 'aryn',
    name: 'арын гэдэс',
    en: 'back belly',
    ru: 'задний живот',
    strokes: ['M22 9 C33 5 35 20 22 19 L22 50'],
  },
  {
    id: 'gedes',
    name: 'гэдэс',
    en: 'belly',
    ru: 'живот',
    strokes: ['M22 12 C11 9 9 25 22 24 L22 50'],
  },
  {
    id: 'zavj',
    name: 'завьж',
    en: 'corner of the mouth',
    ru: 'уголок рта',
    strokes: ['M13 17 Q19 9 31 10', 'M22 11 L22 50'],
  },
  {
    id: 'orkhits',
    name: 'орхиц буюу цацлага',
    strokes: ['M31 8 Q24 30 11 40 Q8 41 9 37'],
  },
  {
    id: 'suul',
    name: 'сүүл',
    en: 'tail',
    ru: 'хвост',
    strokes: ['M12 6 L12 30 Q13 42 25 38 Q29 36 32 32'],
  },
  {
    id: 'num',
    name: 'нум',
    en: 'bow',
    ru: 'лук',
    strokes: ['M12 11 Q24 7 26 18 Q25 27 15 31'],
  },
  {
    id: 'ever',
    name: 'эвэр',
    en: 'horn',
    ru: 'рог',
    strokes: ['M11 34 Q20 41 24 31 L24 17'],
  },
  {
    id: 'gezeg',
    name: 'гэзэг',
    en: 'braid',
    ru: 'коса',
    strokes: ['M10 10 Q22 5 22 16 L22 42'],
  },
  {
    id: 'zhalzhgar',
    name: 'жалжгар эвэр',
    strokes: ['M22 6 L22 50', 'M11 7 Q11 21 22 22'],
  },
  {
    id: 'seree',
    name: 'сэрээ эвэр',
    en: 'forked horn',
    ru: 'рог-вилка',
    strokes: ['M22 6 L22 50', 'M12 8 L12 20 L22 22'],
  },
  {
    id: 'yattar',
    name: 'яттар зартиг',
    strokes: ['M12 12 L18 8 Q25 10 20 18', 'M20 18 Q28 24 17 31'],
  },
  {
    id: 'zadgai',
    name: 'задгай зартиг',
    strokes: ['M24 6 L24 50', 'M17 8 Q25 12 18 20', 'M18 20 Q8 22 11 31'],
  },
  {
    id: 'bituu',
    name: 'битүү зартиг',
    strokes: ['M24 6 L24 50', 'M17 8 Q25 12 18 20 Q8 24 12 30 Q19 31 24 25'],
  },
  {
    id: 'delben',
    name: 'дэлбэн чих',
    strokes: ['M15 9 Q9 15 16 18', 'M17 8 Q31 12 27 24 Q23 32 14 36'],
  },
  {
    id: 'serten',
    name: 'сэртэн чих',
    strokes: ['M20 8 Q32 12 27 26 Q21 32 14 34', 'M11 10 Q20 14 18 22'],
  },
];
