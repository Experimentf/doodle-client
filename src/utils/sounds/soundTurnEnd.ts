import { playTone } from './playTone';

// A soft two-note descending motif - the opposite contour of the round
// start sound - for "this turn is wrapping up".
export function playTurnEndSound() {
  playTone({ frequency: 392.0, duration: 0.16, peakGain: 0.25 }); // G4
  playTone({
    frequency: 293.66,
    startTime: 0.13,
    duration: 0.22,
    peakGain: 0.25,
  }); // D4
}
