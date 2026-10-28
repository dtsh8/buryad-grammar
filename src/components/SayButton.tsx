import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useAudioClips } from '../hooks/useAudioClips';
import { clipKey } from '../utils/audio';

// One clip plays at a time: starting another stops the current one.
let current: HTMLAudioElement | null = null;

// Plays a native-speaker recording of `word`. Renders nothing until that word is recorded.
export default function SayButton({ word, className = '' }: { word: string; className?: string }) {
  const clips = useAudioClips();
  const [playing, setPlaying] = useState(false);
  const file = clips[clipKey(word)];
  if (!file) return null;

  function play(e: React.MouseEvent) {
    e.stopPropagation(); // the button sits inside clickable rows and cards
    current?.pause();
    const audio = new Audio(import.meta.env.BASE_URL + 'audio/' + encodeURIComponent(file));
    current = audio;
    setPlaying(true);
    const stop = () => setPlaying(false);
    audio.addEventListener('ended', stop);
    audio.addEventListener('pause', stop);
    audio.addEventListener('error', stop);
    audio.play().catch(stop);
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={`Play pronunciation of ${word}`}
      title="Listen"
      className={`inline-flex items-center justify-center align-middle rounded-full p-1 transition-colors ${
        playing
          ? 'text-buryat-700 bg-buryat-100'
          : 'text-stone-500 hover:text-buryat-700 hover:bg-buryat-50'
      } ${className}`}
    >
      <Volume2 size={16} aria-hidden="true" />
    </button>
  );
}
