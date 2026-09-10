import { playTone } from './playTone';

// Two identical quick pips - no melodic movement, unlike every other sound
// here - so it reads as "your attention is needed" rather than "something
// happened", for when a word needs to be chosen.
export function playChooseWordPromptSound() {
  playTone({ frequency: 587.33, duration: 0.09, type: 'triangle' }); // D5
  playTone({
    frequency: 587.33,
    startTime: 0.14,
    duration: 0.09,
    type: 'triangle',
  });
}
