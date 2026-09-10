import { LocalStorageKeys } from '@/constants/LocalStorage';

import { getMasterGain } from './audioContext';

// Short, not instant - an abrupt jump to 0 mid-waveform is itself an
// audible click.
const MUTE_RAMP_SECONDS = 0.02;

export const isSoundEnabled = (): boolean =>
  localStorage.getItem(LocalStorageKeys.SOUND_ENABLED) !== 'false';

export const setSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem(LocalStorageKeys.SOUND_ENABLED, String(enabled));

  // Silence (or restore) audio already in flight, not just future sounds.
  const gain = getMasterGain();
  const { currentTime } = gain.context;
  gain.gain.cancelScheduledValues(currentTime);
  gain.gain.linearRampToValueAtTime(
    enabled ? 1 : 0,
    currentTime + MUTE_RAMP_SECONDS
  );
};
