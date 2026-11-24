// Web Audio API Synthesizer for Campus Ambient Sound (Birdsong & Wind) and Speech
class CampusSoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.isPlaying = false;
    this.birdTimer = null;
    this.windNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);
  }

  startAmbient() {
    if (this.isPlaying) return;
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    // Gentle wind sound using filtered noise
    this.startWind();

    // Occasional gentle campus birdsong chirps
    this.startBirdLoop();
  }

  stopAmbient() {
    this.isPlaying = false;
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.windNode) {
      try { this.windNode.stop(); } catch (e) {}
    }
    if (this.ctx && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
  }

  startWind() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low pass filter for soft breeze sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.ambientGain);

    whiteNoise.start();
    this.windNode = whiteNoise;
  }

  playBirdChirp() {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    const baseFreq = 2400 + Math.random() * 800;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  startBirdLoop() {
    const nextChirp = () => {
      if (!this.isPlaying) return;
      this.playBirdChirp();
      if (Math.random() > 0.4) {
        setTimeout(() => this.playBirdChirp(), 150 + Math.random() * 200);
      }
      this.birdTimer = setTimeout(nextChirp, 3000 + Math.random() * 5000);
    };
    nextChirp();
  }

  speak(text, lang = 'bn-BD', onEnd) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const campusSound = new CampusSoundEngine();
