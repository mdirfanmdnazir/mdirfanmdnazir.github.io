/* On-demand YouTube playback, with direct links for local previews. */
(() => {
  const localPreview = window.IRFAN_LOCAL_PREVIEW || window.location.protocol === 'file:';
  const youtubeLink = id => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;

  for (const poster of document.querySelectorAll('[data-video-play]')) {
    poster.addEventListener('click', () => {
      const id = poster.dataset.videoPlay;
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return;

      // Local HTML has no HTTP Referer, so YouTube iframe playback may fail with Error 153.
      // Opening YouTube itself avoids presenting a misleading broken embedded player.
      if (localPreview) {
        window.open(youtubeLink(id), '_blank', 'noopener,noreferrer');
        return;
      }

      const frame = document.createElement('iframe');
      const label = poster.closest('.video-card')?.querySelector('.video-meta span')?.textContent || 'Event video';
      frame.title = `Irfan Beremcee · ${label}`;
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.loading = 'eager';

      const host = document.createElement('div');
      host.className = 'video-poster';
      host.setAttribute('aria-label', 'YouTube video player. If playback is restricted, use the Watch on YouTube link below.');
      host.append(frame);
      poster.replaceWith(host);
    });
  }
})();
