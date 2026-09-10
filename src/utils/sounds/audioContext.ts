import { isSoundEnabled } from './soundSettings';

// Shared across every game sound - creating a new AudioContext per call leaks handles and adds startup latency.
let sharedContext: AudioContext | undefined;
// Every sound routes through this so muting can silence audio already in flight, not just future sounds.
let masterGain: GainNode | undefined;

export const getAudioContext = (): AudioContext => {
  if (!sharedContext) {
    sharedContext = new AudioContext();
    masterGain = sharedContext.createGain();
    masterGain.gain.value = isSoundEnabled() ? 1 : 0;
    masterGain.connect(sharedContext.destination);
  }
  // Browsers may start a context suspended until a user gesture resumes it.
  if (sharedContext.state === 'suspended') sharedContext.resume();
  return sharedContext;
};

export const getMasterGain = (): GainNode => {
  getAudioContext();
  return masterGain as GainNode;
};
