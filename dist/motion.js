(() => {
  const selector = '.section-head, .profile, .semester-card, .path-step, .tile, .project-card, .schedule-copy, .schedule-board, .motion-panel, .artifact, .page-head, .reading';
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let observer;

  function reveal(root = document) {
    const items = root.matches?.(selector)
      ? [root, ...root.querySelectorAll(selector)]
      : [...root.querySelectorAll(selector)];

    if (reducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    observer ||= new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

    items.forEach((item) => {
      if (item.dataset.motionReady) return;
      item.dataset.motionReady = 'true';
      item.classList.add('reveal-item');
      const staggered = item.matches('.semester-card, .path-step, .tile, .project-card, .motion-panel');
      const index = staggered ? [...item.parentElement.children].indexOf(item) : 0;
      item.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 55}ms`);
      observer.observe(item);
    });
  }

  window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', (event) => {
    if (event.matches) document.querySelectorAll('.reveal-item').forEach((item) => item.classList.add('is-visible'));
  });

  window.PortfolioMotion = { reveal };
})();
