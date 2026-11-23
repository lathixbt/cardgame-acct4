// audio.js — all sounds are synthesised in code with WebAudio: no audio files,
// nothing fetched. Short oscillator blips for play, echo, damage, heal, win
// and loss. Created lazily on the first user gesture (browsers block audio
// before that); a mute toggle silences everything.
let ctx = null;
let muted = false;

export function setMuted(value) { muted = value; }
export function isMuted() { return muted; }

function audio() {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, seconds, type, gain, when) {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, ac.currentTime + when);
    amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + seconds);
    osc.connect(amp).connect(ac.destination);
    osc.start(ac.currentTime + when);
    osc.stop(ac.currentTime + when + seconds);
  } catch {
    // Sound is garnish; a failure must never break the game.
  }
}

export const sfx = {
  play() { tone(520, 0.12, 'triangle', 0.12, 0); tone(780, 0.1, 'triangle', 0.08, 0.05); },
  echo() { tone(660, 0.1, 'sine', 0.12, 0); tone(990, 0.16, 'sine', 0.1, 0.07); },
  damage() { tone(160, 0.18, 'sawtooth', 0.14, 0); },
  bigHit() { tone(110, 0.3, 'sawtooth', 0.18, 0); tone(90, 0.35, 'square', 0.1, 0.08); },
  heal() { tone(440, 0.14, 'sine', 0.1, 0); tone(660, 0.2, 'sine', 0.08, 0.09); },
  draw() { tone(880, 0.06, 'sine', 0.06, 0); },
  turn() { tone(392, 0.09, 'triangle', 0.09, 0); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, i * 0.12)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.1, i * 0.14)); },
};
