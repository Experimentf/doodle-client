// A single shared AudioContext, reused across every game sound instead of
// creating (and never closing) a new one per call - that was leaking audio
// handles and adding audio-thread startup latency that made sounds land a
// beat late. Browsers may also start a context suspended until a user
// gesture resumes it, so resume it defensively on every use.
let sharedContext: AudioContext | undefined;

export const getAudioContext = (): AudioContext => {
  if (!sharedContext) sharedContext = new AudioContext();
  if (sharedContext.state === 'suspended') sharedContext.resume();
  return sharedContext;
};
