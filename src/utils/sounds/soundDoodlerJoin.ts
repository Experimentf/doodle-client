import { playTone } from './playTone';

// A bright, welcoming two-note "ding" in the game's highest register, so a
// doodler joining is easy to tell apart from every other sound by ear
// alone. Leaving intentionally has no sound.
export function playDoodlerJoinSound() {
  playTone({ frequency: 659.25, duration: 0.14 }); // E5
  playTone({ frequency: 880, startTime: 0.1, duration: 0.22 }); // A5
}
