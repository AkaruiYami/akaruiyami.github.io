const CACHE_KEY = "gh_repos_v2";
const CACHE_AGE = 60 * 60 * 1000; // 1 hour

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("projects");
  if (!container && !document.querySelector('.quest-row')) return;


  // Check cache first
  let cached;
  try { cached = localStorage.getItem(CACHE_KEY); } catch (_) { /* Storage is optional. */ }
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_AGE && Array.isArray(data)) {
        renderRepos(container, data);
        return;
      }
    } catch (_) { /* ignore stale cache */ }
  }

  try {
    const response = await fetch("https://api.github.com/users/AkaruiYami/repos?per_page=100&sort=updated");
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repos = await response.json();

    if (!Array.isArray(repos)) throw new Error("Unexpected GitHub response");

    // Cache the data
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() })); } catch (_) { /* Render without cache. */ }

    renderRepos(container, repos);
  } catch (err) {
    console.error("Failed to load GitHub repos:", err);
    if (!container) return;
    container.innerHTML = `
      <p class="text-danger text-center mt-4">
        Projects could not be loaded. <a href="https://github.com/AkaruiYami?tab=repositories">Explore the repositories on GitHub ↗</a>
      </p>
    `;
  }
});

function renderRepos(container, repos) {
  // Keep the static repository links as fallbacks if metadata is unavailable.
  document.querySelectorAll('.quest-row').forEach(link => {
    const repo = repos.find(repo => repo.html_url?.toLowerCase() === link.href.toLowerCase());
    if (!repo?.homepage?.trim()) return;
    try {
      const homepage = new URL(repo.homepage.trim());
      if (['https:', 'http:'].includes(homepage.protocol)) link.href = homepage.href;
    } catch (_) { /* Keep the repository link for invalid website URLs. */ }
  });
  if (!container) return;

  const exclude = new Set([
    "AkaruiYami",
    "RandomAssignment",
    "Random-ISP-Thing",
    "LeetCode-2022",
    "dsc551-r",
    "AdventOfCode2021",
    "AdventOfCode"
  ]);

  const selected = repos
    .filter(repo => !repo.fork && !exclude.has(repo.name))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
;
  container.replaceChildren();
  if (!selected.length) {
    container.textContent = "No projects to display yet. Explore the highlighted projects above.";
    return;
  }
  selected.forEach((repo, i) => {
      const col = document.createElement("div");
      col.className = "col";
      col.style.animation = `fadeUp 0.5s ease ${i * 0.06}s both`;

      const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
      const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? escape(url.href) : ''; } catch (_) { return ''; } };
      const description = escape(repo.description || "No description available");
      const repoUrl = safeUrl(repo.html_url);
      const homepage = safeUrl(repo.homepage);
      const updated = new Date(repo.updated_at).toLocaleDateString();
      const language = repo.language || "Unknown";

      col.innerHTML = `
        <div class="card h-100 project-card">
          <div class="card-body d-flex flex-column">

            <div class="mb-3">
              <h3 class="card-title">${escape(repo.name)}</h3>
              <p class="card-text">${description}</p>
            </div>

            <div class="mb-3 text-muted small">
              <span>${escape(language)}</span> · <span>Updated ${updated}</span>
            </div>

            <div class="mt-auto">
              ${repoUrl
          ? `<a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary me-2">GitHub</a>`
          : `<button class="btn btn-secondary me-2" disabled>No Repo</button>`
        }

              ${homepage
          ? `<a href="${homepage}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-accent">Website</a>`
          : ``
        }
            </div>

          </div>
        </div>
      `;

      container.appendChild(col);
    });
}
