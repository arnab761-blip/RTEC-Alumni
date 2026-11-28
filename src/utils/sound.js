/**
 * Play a subtle, professional confirmation chime using Web Audio API.
 * Safe no-op if AudioContext is unavailable or blocked.
 */
export function playSubmitSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 pleasant triad chime
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);

      gain.gain.setValueAtTime(0.0001, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.3);
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Ignore audio errors on restricted environments
  }
}

/**
 * Play a warm, celebratory thank-you chime (rising major 9th arpeggio + soft shimmer)
 * for treat/support submissions.
 */
export function playTreatCelebrationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Warm rising C major 9th arpeggio: C5 -> E5 -> G5 -> B5 -> D6
    const notes = [
      { freq: 523.25, delay: 0.0, dur: 0.35, vol: 0.11, type: 'sine' },
      { freq: 659.25, delay: 0.07, dur: 0.35, vol: 0.11, type: 'sine' },
      { freq: 783.99, delay: 0.14, dur: 0.38, vol: 0.12, type: 'sine' },
      { freq: 987.77, delay: 0.21, dur: 0.42, vol: 0.1, type: 'triangle' },
      { freq: 1174.66, delay: 0.29, dur: 0.55, vol: 0.09, type: 'sine' }
    ];

    notes.forEach(({ freq, delay, dur, vol, type }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(vol, now + delay + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.02);
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1100);
  } catch {
    // Ignore audio errors on restricted environments
  }
}
