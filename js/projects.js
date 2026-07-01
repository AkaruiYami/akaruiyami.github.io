const CACHE_KEY = "gh_repos";
const CACHE_AGE = 60 * 60 * 1000; // 1 hour

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("projects");
  if (!container) return;

  // Remove skeleton loaders
  container.querySelectorAll(".skeleton-card-wrap").forEach(el => el.remove());

  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
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
    const response = await fetch("https://api.github.com/users/AkaruiYami/repos");
    const repos = await response.json();

    if (!Array.isArray(repos)) return;

    // Cache the data
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() }));

    renderRepos(container, repos);
  } catch (err) {
    console.error("Failed to load GitHub repos:", err);
    container.innerHTML = `
      <p class="text-danger text-center mt-4">
        Failed to load projects. Try again later.
      </p>
    `;
  }
});

function renderRepos(container, repos) {
  const exclude = new Set([
    "AkaruiYami",
    "RandomAssignment",
    "Random-ISP-Thing",
    "LeetCode-2022",
    "dsc551-r",
    "AdventOfCode2021",
    "AdventOfCode"
  ]);

  repos
    .filter(repo => !repo.fork && !exclude.has(repo.name))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .forEach((repo, i) => {
      const col = document.createElement("div");
      col.className = "col";
      col.style.animation = `fadeUp 0.5s ease ${i * 0.06}s both`;

      const description = repo.description || "No description available";
      const updated = new Date(repo.updated_at).toLocaleDateString();
      const language = repo.language || "Unknown";

      col.innerHTML = `
        <div class="card h-100 project-card">
          <div class="card-body d-flex flex-column">

            <div class="mb-3">
              <h5 class="card-title">${repo.name}</h5>
              <p class="card-text">${description}</p>
            </div>

            <div class="mb-3 text-muted small">
              <span>${language}</span> · <span>Updated ${updated}</span>
            </div>

            <div class="mt-auto">
              ${repo.html_url
          ? `<a href="${repo.html_url}" target="_blank" class="btn btn-primary me-2">GitHub</a>`
          : `<button class="btn btn-secondary me-2" disabled>No Repo</button>`
        }

              ${repo.homepage
          ? `<a href="${repo.homepage}" target="_blank" class="btn btn-outline-accent">Website</a>`
          : ``
        }
            </div>

          </div>
        </div>
      `;

      container.appendChild(col);
    });
}
