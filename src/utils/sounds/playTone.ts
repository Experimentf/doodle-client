import { getAudioContext, getMasterGain } from './audioContext';
import { isSoundEnabled } from './soundSettings';

interface PlayToneOptions {
  frequency: number;
  duration: number;
  startTime?: number;
  peakGain?: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  // Optional pitch bend target - sweeps from `frequency` to this instead of staying flat, for a "whoosh" character.
  sweepToFrequency?: number;
}

// Fade-in/out envelope avoids the click/pop of starting or stopping an oscillator at full volume.
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
  if (!isSoundEnabled()) return;

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
  noteGain.connect(getMasterGain());

  osc.start(start);
  osc.stop(stop);
};
