document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("projects");
  if (!container) return;

  try {
    const response = await fetch("https://api.github.com/users/AkaruiYami/repos");
    const repos = await response.json();

    if (!Array.isArray(repos)) return;

    // Names to exclude
    const exclude = new Set(["AkaruiYami", "RandomAssignment", "Random-ISP-Thing", "LeetCode-2022", "dsc551-r", "AdventOfCode2021", "AdventOfCode"]);

    repos
      .filter(repo => !repo.fork && !exclude.has(repo.name)) // filter forks + excluded names
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // sort by last update
      .forEach(repo => {
        const col = document.createElement("div");
        col.className = "col";

        const description = repo.description || "No description available";

        col.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${repo.name}</h5>
              <p class="card-text">${description}</p>
              ${repo.html_url
            ? `<a href="${repo.html_url}" target="_blank" class="btn btn-primary mt-3">View Project</a>`
            : `<button class="btn btn-secondary mt-3" disabled>No Link Available</button>`
          }
            </div>
          </div>
        `;

        container.appendChild(col);
      });
  } catch (err) {
    console.error("Failed to load GitHub repos:", err);
    container.innerHTML = `<p class="text-danger">Failed to load projects. Try again later.</p>`;
  }
});
