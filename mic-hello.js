(() => {
  const button = document.querySelector('[data-mic-hello]');
  const audio = document.querySelector('#micGreeting');
  const hero = document.querySelector('.home-hero');
  const label = document.querySelector('#micLabel');
  const status = document.querySelector('#micStatus');
  if (!button || !audio || !hero) return;
  let started = false;
  let pending = false;
  const settle = () => {
    hero.classList.remove('mic-playing');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Play Irfan’s welcome greeting');
    label.textContent = started ? 'One more hello?' : 'Tap the mic. Meet your emcee.';
    pending = false;
  };
  button.addEventListener('click', async () => {
    if (pending || !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      settle();
      status.textContent = 'Greeting stopped.';
      return;
    }
    pending = true;
    label.textContent = 'Getting the mic ready…';
    try {
      // play() stays in the tap handler for iPhone/Safari compatibility.
      await audio.play();
    } catch (_) {
      settle();
      status.textContent = 'Audio could not play. Tap the mic to try again, or keep exploring.';
    }
  });
  audio.addEventListener('playing', () => {
    pending = false;
    started = true;
    hero.classList.add('mic-playing');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Stop Irfan’s welcome greeting');
    label.textContent = 'A little hello from Irfan.';
    status.textContent = 'Welcome greeting playing. Tap the mic to stop.';
  });
  audio.addEventListener('ended', () => { settle(); status.textContent = 'Welcome! Make yourself at home.'; });
  audio.addEventListener('pause', settle);
  audio.addEventListener('error', () => { settle(); status.textContent = 'Audio is unavailable right now. You can still explore the website.'; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) { audio.pause(); audio.currentTime = 0; }
  });
  document.addEventListener('play', event => {
    if (event.target !== audio && !audio.paused) audio.pause();
  }, true);
  button.hidden = false;
})();
