(() => {
  const secret = document.querySelector('.map-secret');
  if (!secret) return;
  const message = document.createElement('p');
  message.className = 'discovery-message';
  message.setAttribute('role', 'status');
  secret.closest('.world-panel').append(message);
  secret.addEventListener('click', () => {
    message.textContent = '✦ Hidden curiosity discovered. Badge earned: Star seeker!';
    secret.classList.add('discovered');
    secret.setAttribute('aria-label', 'Star seeker badge discovered');
  });
})();
