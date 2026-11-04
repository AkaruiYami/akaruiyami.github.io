(() => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const current = location.pathname === '/' ? '/index.html' : location.pathname;
  nav.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  const pages = ['/index.html', '/pages/about.html', '/pages/projects.html', '/pages/music.html', '/pages/contact.html'];
  let visited = [];
  try {
    const saved = JSON.parse(localStorage.getItem('ay-exploration') || '[]');
    if (Array.isArray(saved)) visited = [...new Set(saved.map(page => page === 'home' ? '/index.html' : page.startsWith('/') ? page : '/pages/' + page).filter(page => pages.includes(page)))];
    if (pages.includes(current) && !visited.includes(current)) visited.push(current);
    localStorage.setItem('ay-exploration', JSON.stringify(visited));
  } catch (_) { visited = pages.includes(current) ? [current] : []; }
  nav.querySelector('#explorer-count').textContent = `${visited.length}/${pages.length}`;
  const status = nav.querySelector('.explorer-status');
  status.title = visited.length === pages.length ? 'World explorer badge earned — all five pages discovered!' : 'Explore all five pages';
  status.setAttribute('aria-label', `Explored ${visited.length} of ${pages.length} pages`);
})();
