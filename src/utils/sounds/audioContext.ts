import { isSoundEnabled } from './soundSettings';

// A single shared AudioContext, reused across every game sound instead of
// creating (and never closing) a new one per call - that was leaking audio
// handles and adding audio-thread startup latency that made sounds land a
// beat late. Browsers may also start a context suspended until a user
// gesture resumes it, so resume it defensively on every use.
let sharedContext: AudioContext | undefined;
// Every sound routes through this instead of straight to the destination,
// so muting can silence audio already in flight, not just future sounds.
let masterGain: GainNode | undefined;

export const getAudioContext = (): AudioContext => {
  if (!sharedContext) {
    sharedContext = new AudioContext();
    masterGain = sharedContext.createGain();
    masterGain.gain.value = isSoundEnabled() ? 1 : 0;
    masterGain.connect(sharedContext.destination);
  }
  if (sharedContext.state === 'suspended') sharedContext.resume();
  return sharedContext;
};

export const getMasterGain = (): GainNode => {
  getAudioContext();
  return masterGain as GainNode;
};
