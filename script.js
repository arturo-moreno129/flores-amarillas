const card = document.getElementById('card');
const openButton = document.getElementById('openLetter');
const musicButton = document.getElementById('musicToggle');

openButton.addEventListener('click', () => {
  const isOpen = card.classList.toggle('is-open');
  openButton.textContent = isOpen ? 'Volver atrás' : 'Abrir carta';

  if (isOpen) {
    startMusic();
  } else {
    stopMusic();
  }
});

const heartEls = document.querySelectorAll('.floating-hearts span');
heartEls.forEach((heart, index) => {
  heart.style.animationDuration = `${6 + index * 0.9}s`;
  heart.style.fontSize = `${1 + index * 0.15}rem`;
});

const petals = document.querySelectorAll('.petal-field span');
petals.forEach((petal, index) => {
  const left = (index / petals.length) * 100 + Math.random() * 10;
  const delay = index * 0.45 + Math.random() * 0.9;
  const duration = 9 + Math.random() * 5;
  const drift = (Math.random() - 0.5) * 120;
  const size = 12 + Math.random() * 18;

  petal.style.left = `${Math.min(96, left)}%`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.setProperty('--drift', `${drift}px`);
  petal.style.fontSize = `${size}px`;
  petal.style.opacity = `${0.35 + Math.random() * 0.65}`;
});

const sparkleEls = document.querySelectorAll('.sparkles span');
sparkleEls.forEach((sparkle, index) => {
  sparkle.style.width = `${6 + index * 2}px`;
  sparkle.style.height = sparkle.style.width;
  sparkle.style.left = `${10 + index * 14}%`;
  sparkle.style.top = `${12 + (index % 4) * 20}%`;
  sparkle.style.animationDelay = `${index * 0.5}s`;
});

let audioContext = null;
let melodyTimer = null;
let isPlaying = false;

const romanticProgression = [
  [220.0, 277.18, 329.63],
  [246.94, 293.66, 369.99],
  [196.0, 246.94, 293.66],
  [220.0, 277.18, 329.63],
  [174.61, 220.0, 261.63],
  [196.0, 246.94, 293.66],
  [220.0, 277.18, 349.23],
  [174.61, 220.0, 261.63]
];

function playChord(chord, startTime, duration, volume = 0.09) {
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.12);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  chord.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, startTime + index * 0.04);
    oscillator.connect(filter);
    oscillator.start(startTime + index * 0.04);
    oscillator.stop(startTime + duration + 0.08);
  });

  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (melodyTimer) {
    clearInterval(melodyTimer);
  }

  let step = 0;
  melodyTimer = setInterval(() => {
    const now = audioContext.currentTime;
    const chord = romanticProgression[step % romanticProgression.length];
    playChord(chord, now, 1.2, 0.08);
    step += 1;
  }, 1100);

  musicButton.textContent = '🔇 Pausar música';
  isPlaying = true;
}

function stopMusic() {
  if (melodyTimer) {
    clearInterval(melodyTimer);
    melodyTimer = null;
  }

  if (audioContext && audioContext.state !== 'closed') {
    audioContext.suspend();
  }

  musicButton.textContent = '🎵 Música';
  isPlaying = false;
}

musicButton.addEventListener('click', () => {
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});
