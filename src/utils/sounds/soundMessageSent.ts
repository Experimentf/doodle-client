import { playTone } from './playTone';

// A short, quiet, deliberately unmusical pop for the user's own chat
// message being sent. This is UI feedback, not a game event, so it's kept
// neutral on purpose - it shouldn't compete for attention with the sounds
// below, which are meant to carry meaning.
export function playMessageSentSound() {
  playTone({ frequency: 261.63, duration: 0.1, peakGain: 0.2 }); // C4
}
