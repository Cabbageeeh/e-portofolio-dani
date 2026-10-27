import { createApp } from 'vue';
import PortfolioAnimations from './PortfolioAnimations.vue';
import './motion-theme.css';

const mountedApps = new Map();

function mountPortfolioAnimations() {
  for (const [host, app] of mountedApps) {
    if (!host.isConnected) {
      app.unmount();
      mountedApps.delete(host);
    }
  }
  document.querySelectorAll('[data-portfolio-animations]').forEach((host) => {
    if (mountedApps.has(host)) return;
    const app = createApp(PortfolioAnimations, { mode: host.dataset.portfolioAnimations });
    app.mount(host);
    mountedApps.set(host, app);
    window.PortfolioMotion?.reveal(host);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountPortfolioAnimations, { once: true });
else mountPortfolioAnimations();
new MutationObserver(mountPortfolioAnimations).observe(document.body, { childList: true, subtree: true });
