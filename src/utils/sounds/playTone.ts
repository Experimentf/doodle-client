import { getAudioContext } from './audioContext';

interface PlayToneOptions {
  frequency: number;
  duration: number;
  startTime?: number;
  peakGain?: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  // Optional pitch bend target - lets a single tone sweep from `frequency`
  // to this value instead of staying flat, for a sound with a distinct
  // "whoosh" character rather than a discrete note.
  sweepToFrequency?: number;
}

// Plays a single note with a short fade-in/out envelope. Starting or
// stopping an oscillator at full volume creates an audible click/pop at
// the note boundary - that's what made the game's sounds feel harsh rather
// than pleasant, regardless of which notes were chosen.
export const playTone = ({
  frequency,
  duration,
  startTime = 0,
  peakGain = 0.3,
  type = 'sine',
  attack = 0.01,
  release = Math.min(0.08, duration / 2),
  sweepToFrequency,
}: PlayToneOptions) => {
  const context = getAudioContext();
  const start = context.currentTime + startTime;
  const releaseStart = Math.max(start + attack, start + duration - release);
  const stop = start + duration;

  const osc = context.createOscillator();
  osc.type = type;
  if (sweepToFrequency !== undefined) {
    osc.frequency.setValueAtTime(frequency, start);
    osc.frequency.linearRampToValueAtTime(sweepToFrequency, stop);
  } else {
    osc.frequency.value = frequency;
  }

  const noteGain = context.createGain();
  noteGain.gain.setValueAtTime(0, start);
  noteGain.gain.linearRampToValueAtTime(peakGain, start + attack);
  noteGain.gain.setValueAtTime(peakGain, releaseStart);
  noteGain.gain.linearRampToValueAtTime(0.0001, stop);

  osc.connect(noteGain);
  noteGain.connect(context.destination);

  osc.start(start);
  osc.stop(stop);
};
