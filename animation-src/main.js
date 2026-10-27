import { createApp } from 'vue';
import PortfolioAnimations from './PortfolioAnimations.vue';
import './motion-theme.css';

let mountedHost;
let app;

function mountPortfolioAnimations() {
  const host = document.querySelector('#portfolio-animation-root');
  if (host === mountedHost) return;
  app?.unmount();
  app = undefined;
  mountedHost = host;
  if (!host) return;
  app = createApp(PortfolioAnimations);
  app.mount(host);
  window.PortfolioMotion?.reveal(host);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountPortfolioAnimations, { once: true });
else mountPortfolioAnimations();
window.addEventListener('hashchange', mountPortfolioAnimations);
