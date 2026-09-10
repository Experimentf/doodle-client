import { playTone } from './playTone';

// An ascending three-note arpeggio into a held final note, announcing a
// new round.
export function playRoundStartSound() {
  const notes = [261.63, 329.63, 392.0]; // C4, E4, G4
  const finalNote = 523.25; // C5
  const noteDuration = 0.14;
  const step = 0.11;

  notes.forEach((frequency, i) => {
    playTone({
      frequency,
      startTime: i * step,
      duration: noteDuration,
      type: 'triangle',
    });
  });

  playTone({
    frequency: finalNote,
    startTime: notes.length * step,
    duration: 0.35,
    peakGain: 0.3,
    type: 'triangle',
  });
}
