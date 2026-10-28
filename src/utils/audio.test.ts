/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { buildManifest, clipKey } from './audio';
import { audioInventory } from './audioInventory';
import type { VocabularyData } from '../data/vocabulary.types';

const AUDIO_DIR = new URL('../../public/audio/', import.meta.url);
const vocabulary = (
  JSON.parse(
    readFileSync(new URL('../../public/data/vocabulary.json', import.meta.url), 'utf8')
  ) as VocabularyData
).entries;

describe('clipKey', () => {
  it('lowercases, drops punctuation and joins words with underscores', () => {
    expect(clipKey('Сайн байна уу?')).toBe('сайн_байна_уу');
    expect(clipKey('яба!')).toBe('яба');
    expect(clipKey('Минии нэрэн…')).toBe('минии_нэрэн');
    expect(clipKey('галта тэрэгээр')).toBe('галта_тэрэгээр');
  });

  it('keeps hyphens inside a word', () => {
    expect(clipKey('Улаан-Үдэдэ')).toBe('улаан-үдэдэ');
  });

  it('treats decomposed й the same as precomposed', () => {
    expect(clipKey('гэрэй')).toBe(clipKey('гэрэй'));
  });
});

describe('buildManifest', () => {
  it('maps normalised base names to files and skips non-audio files', () => {
    expect(buildManifest(['Гэр.MP3', 'ном.m4a', 'manifest.json', 'notes.txt', '.mp3'])).toEqual({
      clips: { гэр: 'Гэр.MP3', ном: 'ном.m4a' },
    });
  });

  it('keeps the first file when two names normalise to the same key', () => {
    expect(buildManifest(['гэр.ogg', 'гэр.mp3']).clips).toEqual({ гэр: 'гэр.mp3' });
  });
});

describe('public/audio/manifest.json', () => {
  it('matches the clips in public/audio/ (run `npm run audio` after adding one)', () => {
    const committed = JSON.parse(readFileSync(new URL('manifest.json', AUDIO_DIR), 'utf8'));
    expect(committed).toEqual(buildManifest(readdirSync(AUDIO_DIR)));
  });
});

describe('audioInventory', () => {
  const inventory = audioInventory(vocabulary);

  it('lists each clip once', () => {
    const keys = inventory.map(i => i.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every word a usable file name', () => {
    for (const { key, word } of inventory) {
      expect(key, word).not.toBe('');
      expect(key, word).not.toMatch(/[\\/:*?"<>|\s]/);
    }
  });

  it('covers the vocabulary and the paradigm tables', () => {
    const keys = new Set(inventory.map(i => i.key));
    for (const l of vocabulary) expect(keys).toContain(clipKey(l.buryad));
    expect(keys).toContain('гэрһээ');
    expect(keys).toContain('ябаг');
  });
});
