import { playTone } from './playTone';

// A quick three-note ascending arpeggio for a correct guess mid-round -
// smaller and faster than the round-start/result sounds, so it reads as a
// "small win" rather than a phase change.
export function playCorrectGuessSound() {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const noteDuration = 0.16;
  const step = 0.11;

  notes.forEach((frequency, i) => {
    playTone({ frequency, startTime: i * step, duration: noteDuration });
  });
}
