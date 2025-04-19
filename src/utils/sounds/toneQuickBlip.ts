// AI GENERATED SOUNDS
export function toneQuickBlip() {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.value = 0.35; // Increased volume for better audibility
  gain.connect(context.destination);

  const playNote = (freq: number, duration: number) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine'; // Smooth, soothing sine wave
    oscillator.frequency.value = freq;

    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0.35, context.currentTime); // Slightly louder for clarity
    noteGain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    ); // Gentle fade-out

    oscillator.connect(noteGain);
    noteGain.connect(gain);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  // Play a soft tone (C4 for warmth, gentle notification)
  playNote(261.63, 0.15); // C4 - soothing, non-irritating tone
}
