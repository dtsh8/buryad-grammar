import { describe, expect, it } from 'vitest';
import { englishForms } from './englishForms';

describe('englishForms', () => {
  it.each([
    ['go', 'goes'],
    ['teach', 'teaches'],
    ['carry', 'carries'],
    ['play', 'plays'],
    ['be', 'is'],
    ['have', 'has'],
    ['do', 'does'],
  ])('thirdPerson(%s) = %s', (verb, expected) => {
    expect(englishForms(verb).thirdPerson).toBe(expected);
  });

  it.each([
    ['be', 'being'],
    ['lie', 'lying'],
    ['die', 'dying'],
    ['see', 'seeing'],
    ['love', 'loving'],
    ['make', 'making'],
    ['run', 'running'],
    ['play', 'playing'],
  ])('gerund(%s) = %s', (verb, expected) => {
    expect(englishForms(verb).gerund).toBe(expected);
  });

  it('irregular past forms', () => {
    expect(englishForms('go')).toMatchObject({ past: 'went', pastPart: 'gone' });
    expect(englishForms('love')).toMatchObject({ past: 'loved', pastPart: 'loved' });
  });
});
