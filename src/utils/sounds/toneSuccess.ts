// AI GENERATED SOUNDS
export function toneSuccess() {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.value = 0.4; // Medium volume for pleasant audibility
  gain.connect(context.destination);

  const playNote = (freq: number, duration: number) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine'; // Smooth, relaxing sine wave
    oscillator.frequency.value = freq;

    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0.4, context.currentTime); // Slightly louder than default for clarity
    noteGain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    ); // Soft fade-out for smooth end

    oscillator.connect(noteGain);
    noteGain.connect(gain);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  // Play a soft ascending tone for success (C4 → E4 → G4)
  playNote(261.63, 0.2); // C4
  setTimeout(() => {
    playNote(329.63, 0.2); // E4
  }, 200); // Slight delay for the ascending feel
  setTimeout(() => {
    playNote(392.0, 0.2); // G4 (this is the major third interval for positive tone)
  }, 400); // Delay to complete the progression
}
