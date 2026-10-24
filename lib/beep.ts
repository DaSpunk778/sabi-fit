// The "rest's over" alert: two short beeps (Web Audio) and a buzz.
//
// Browsers only let a page play sound after the user has tapped something.
// unlockAudio() is called from a tap (ticking a set), which prepares the
// audio so beep() can play later, when the rest ends with no tap involved.

let audio: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  audio ??= new AudioContext();
  if (audio.state === "suspended") void audio.resume();
}

function tone(start: number) {
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 880; // a clear, high "ding"

  // Fade in and out quickly so it doesn't click.
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);

  oscillator.connect(volume).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.3);
}

/** Two short beeps, if sound was unlocked by a tap earlier. */
export function beep() {
  if (!audio || audio.state !== "running") return;
  const now = audio.currentTime;
  tone(now);
  tone(now + 0.35);
}

/** A short buzz, on phones that support it (not iPhones). */
export function buzz() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(200);
  }
}
