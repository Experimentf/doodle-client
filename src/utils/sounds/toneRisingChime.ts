// AI GENERATED SOUNDS
export function toneRisingChime() {
  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.value = 0.35; // Slightly louder but still gentle
  gain.connect(context.destination);

  const playNote = (
    freq: number,
    delay: number,
    duration: number,
    fadeOut = false,
    type: OscillatorType = 'triangle'
  ) => {
    const osc = context.createOscillator();
    osc.type = type; // triangle or sine
    osc.frequency.value = freq;

    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0.35, context.currentTime + delay);

    if (fadeOut) {
      noteGain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + delay + duration
      );
    }

    osc.connect(noteGain);
    noteGain.connect(gain);

    osc.start(context.currentTime + delay);
    osc.stop(context.currentTime + delay + duration);
  };

  // Custom tone pattern: A3 → C4 → F3 → G3 → Bb3 → E4
  const notes = [220, 262, 175, 196, 233];
  const finalNote = 330; // E4
  const duration = 0.13;
  let time = 0;

  notes.forEach((freq, i) => {
    const wave = i % 2 === 0 ? 'triangle' : 'sine'; // alternate for richness
    playNote(freq, time, duration, false, wave);
    time += duration;
  });

  // Final note — soft, warm sine fade-out
  playNote(finalNote, time, 0.4, true, 'sine');
}
