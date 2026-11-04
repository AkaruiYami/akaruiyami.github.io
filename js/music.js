/* Only entries in /statics/featured-music.json are featured. No channel feed. */
(async () => {
  const stage = document.getElementById('music-stage');
  const selection = document.getElementById('music-selection');
  if (!stage || !selection) return;
  const title = document.getElementById('music-title');
  const description = document.getElementById('music-description');
  const note = document.getElementById('music-playback-note');
  const watch = document.getElementById('music-watch-link');
  const status = document.getElementById('music-status');
  try {
    const response = await fetch('/statics/featured-music.json');
    if (!response.ok) throw new Error('Music selection unavailable');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid music selection');
    const videoId = track => {
      if (typeof track.id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(track.id)) return track.id;
      try {
        const url = new URL(track.url);
        if (!['https:', 'http:'].includes(url.protocol)) return '';
        const host = url.hostname.toLowerCase();
        let id = '';
        if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
        if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
          id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\/([^/]+)/.exec(url.pathname)?.[2];
        }
        return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : '';
      } catch (_) { return ''; }
    };
    const tracks = data.filter(track => track && typeof track.title === 'string')
      .map(track => ({ ...track, id: videoId(track) })).filter(track => track.id);
    if (!tracks.length) return;
    const buttons = [];
    const select = index => {
      const track = tracks[index];
      title.textContent = track.title;
      description.textContent = track.description || '';
      watch.href = `https://www.youtube.com/watch?v=${track.id}`;
      note.hidden = false;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'music-poster';
      play.setAttribute('aria-label', `Play ${track.title}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`;
      thumbnail.alt = '';
      const label = document.createElement('span');
      label.className = 'music-play';
      label.textContent = '▶ Play music video';
      play.append(thumbnail, label);
      play.addEventListener('click', () => {
        const frame = document.createElement('iframe');
        frame.title = `${track.title} — music video`;
        frame.src = `https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&rel=0`;
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        stage.replaceChildren(frame);
        status.textContent = `Player loaded for ${track.title}. If playback is unavailable, use the watch on YouTube link.`;
        frame.focus();
      });
      stage.replaceChildren(play);
    };
    tracks.forEach((track, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'music-track';
      button.textContent = `${String(index + 1).padStart(2, '0')} / ${track.title}`;
      button.addEventListener('click', () => { select(index); status.textContent = `Selected ${track.title}`; });
      selection.append(button);
      buttons.push(button);
    });
    selection.hidden = tracks.length < 2;
    select(0);
  } catch (error) {
    console.warn('Featured music could not be loaded. The channel link remains available.', error);
  }
})();
