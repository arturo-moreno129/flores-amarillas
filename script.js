const card = document.getElementById('card');
const openButton = document.getElementById('openLetter');
const musicButton = document.getElementById('musicToggle');
const backgroundTrack = document.getElementById('backgroundTrack');

openButton.addEventListener('click', () => {
  const isOpen = card.classList.toggle('is-open');
  openButton.textContent = isOpen ? 'Volver atrás' : 'Abrir carta';

  if (isOpen) {
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
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

let isPlaying = false;

function startBackgroundMusic() {
  if (!backgroundTrack) return;

  backgroundTrack.volume = 0.75;
  backgroundTrack.currentTime = 0;
  backgroundTrack.load();

  const playPromise = backgroundTrack.play();
  if (playPromise) {
    playPromise.catch(() => {
      // El navegador puede bloquear la reproducción hasta la interacción del usuario.
    });
  }

  musicButton.textContent = '🔇 Pista';
  isPlaying = true;
}

function stopBackgroundMusic() {
  if (!backgroundTrack) return;

  backgroundTrack.pause();
  backgroundTrack.currentTime = 0;
  musicButton.textContent = '🎵 Música';
  isPlaying = false;
}

musicButton.addEventListener('click', () => {
  if (isPlaying) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
});
