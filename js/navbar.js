(async () => {
  try {
    const res = await fetch("/components/navbar.html");
    const html = await res.text();

    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    navbarContainer.innerHTML = html;

    const collapseEl = navbarContainer.querySelector("#navbarNav");
    const toggler = navbarContainer.querySelector(".navbar-toggler");

    if (collapseEl && toggler) {
      toggler.addEventListener("click", () => {
        const bsCollapse =
          bootstrap.Collapse.getInstance(collapseEl) ||
          new bootstrap.Collapse(collapseEl, { toggle: false });
        bsCollapse.toggle();
      });
    }
  } catch (err) {
    console.error("Failed to load navbar:", err);
  }
})();
