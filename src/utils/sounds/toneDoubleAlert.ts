// AI GENERATED SOUNDS
export function toneDoubleAlert(rising = false) {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.value = 0.4; // Softer volume to reduce harshness
  gain.connect(context.destination);

  const playTone = (freq: number, start: number, duration: number) => {
    const osc = context.createOscillator();
    osc.type = 'sine'; // Using a smooth sine wave for clarity
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(context.currentTime + start);
    osc.stop(context.currentTime + start + duration);
  };

  if (rising) {
    // For player joining: Quick, smooth rising tone (A4 → C5)
    playTone(440, 0, 0.05); // A4 - a short, clear note
    playTone(523.25, 0.05, 0.05); // C5 - a gentle rise (immediately after A4)
  } else {
    // For player leaving: Smooth falling tone (C5 → A4)
    playTone(523.25, 0, 0.05); // C5 - initial tone for the exit
    playTone(440, 0.05, 0.05); // A4 - soft fall to signify leaving
  }
}
