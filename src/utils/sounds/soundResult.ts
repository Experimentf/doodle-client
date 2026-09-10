import { playTone } from './playTone';

// The biggest sound in the game: a longer ascending run into a held
// three-note chord, reserved for the final results screen.
export function playResultSound() {
  const run = [392.0, 493.88, 587.33, 659.25]; // G4, B4, D5, E5
  const step = 0.1;
  const runDuration = 0.13;

  run.forEach((frequency, i) => {
    playTone({
      frequency,
      startTime: i * step,
      duration: runDuration,
      type: 'triangle',
    });
  });

  const chordStart = run.length * step;
  const chord = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
  chord.forEach((frequency) => {
    playTone({
      frequency,
      startTime: chordStart,
      duration: 0.7,
      peakGain: 0.22,
    });
  });
}
