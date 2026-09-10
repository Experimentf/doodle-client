import { playTone } from './playTone';

// A short upward pitch sweep - the only "sweep" sound in the game, so
// drawing time beginning is unmistakable even without looking at the
// screen.
export function playGameStartSound() {
  playTone({
    frequency: 220,
    sweepToFrequency: 440,
    duration: 0.18,
    type: 'triangle',
    peakGain: 0.32,
  });
}
