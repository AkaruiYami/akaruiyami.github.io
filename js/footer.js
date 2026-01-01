(async () => {
  try {
    const res = await fetch("/components/footer.html");
    const html = await res.text();

    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = html;

    const yearEl = footerContainer.querySelector("#copyright-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  } catch (err) {
    console.error("Failed to load footer:", err);
  }
})();
