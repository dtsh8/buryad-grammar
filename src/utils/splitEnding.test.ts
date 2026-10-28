import { describe, expect, it } from 'vitest';
import { splitEnding } from './splitEnding';

describe('splitEnding', () => {
  it('splits off what follows the shared part, so a dropped н shows', () => {
    expect(splitEnding('морин', 'мориной')).toEqual(['морин', 'ой']);
    expect(splitEnding('морин', 'мориие')).toEqual(['мори', 'ие']);
    expect(splitEnding('морин', 'морёор')).toEqual(['мор', 'ёор']);
    expect(splitEnding('хара', 'хараад')).toEqual(['хара', 'ад']);
  });

  it('keeps the original case and handles an unchanged form', () => {
    expect(splitEnding('Москва', 'Москваһаа')).toEqual(['Москва', 'һаа']);
    expect(splitEnding('гэр', 'гэр')).toEqual(['гэр', '']);
  });
});
