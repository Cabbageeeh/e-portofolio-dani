/* Edit daftar karya ini untuk mengubah judul dan keterangan karya. */
window.portfolioProjects = [
  { title: 'JurnalKita', meta: 'Semester 1 · Artikel kelompok · SMA Negeri 15 Surabaya', description: 'Karya kolaborasi untuk tugas artikel pada semester pertama.', kind: 'KARYA KELOMPOK', icon: 'book', details: ['Artikel kolaborasi', 'Semester 1 · SMA Negeri 15 Surabaya'] },
  { title: 'SIGAP', meta: 'Semester 2 · Proyek kepemimpinan · SMP Negeri 60 Surabaya', description: 'Karya kelompok pada mata kuliah Proyek Kepemimpinan semester kedua.', kind: 'PROYEK KELOMPOK', icon: 'checklist', details: ['Proyek Kepemimpinan', 'Semester 2 · SMP Negeri 60 Surabaya'] },
  { title: 'Ruang Belajar', meta: 'Inovasi pembelajaran · Karya individu', description: 'Inovasi pembelajaran Informatika yang dikembangkan secara pribadi.', kind: 'KARYA INDIVIDU', icon: 'monitor', details: ['Inovasi pembelajaran Informatika', 'Dikembangkan secara individu'] },
];

(() => {
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const iconPaths = {
    book: '<path d="M12 7v14m0-14C9 4 6 4 3 5v13c3-1 6-1 9 2m0-13c3-3 6-3 9-2v13c-3-1-6-1-9 2"/><path d="M7 10h2m-2 3h2m6-3h2m-2 3h2"/>',
    checklist: '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4M9 9l-2 2 2 2m6-4 2 2-2 2"/>'
  };
  const projectIcon = (name, className) => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.monitor}</svg>`;
  function projectCard(project, index) {
    const points = (project.details || []).map((detail) => `<li>${escapeHTML(detail)}</li>`).join('');
    const icon = projectIcon(project.icon, 'project-icon-svg');
    return `<article class="project-card project-text-card project-tone-${index % 3}" data-index="${index}">
      <span class="project-watermark" aria-hidden="true">${projectIcon(project.icon, 'project-watermark-svg')}</span>
      <span class="project-icon" aria-hidden="true">${icon}</span>
      <p class="project-meta">${escapeHTML(project.meta)}</p>
      <div class="project-copy"><p class="project-index">0${index + 1} / ${escapeHTML(project.kind || 'KARYA PPG')}</p><h3>${escapeHTML(project.title)}</h3><p class="project-description">${escapeHTML(project.description)}</p></div>
      <div class="project-ticket"><p>Ringkasan karya</p><ul>${points}</ul></div>
      <a class="project-link" href="#jadwal">Lihat preview interaktif <span aria-hidden="true">↘</span></a>
    </article>`;
  }
  function mount() {
    const slot = document.querySelector('#karya');
    if (!slot || slot.querySelector('#portfolio-projects')) return;
    const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
    slot.innerHTML = `<section class="mas-section mas-projects" id="portfolio-projects" aria-labelledby="projects-title">
      <div class="mas-section-head"><div><p class="eyebrow">03 / KARYA PILIHAN</p><h2 id="projects-title">Pembelajaran yang diwujudkan bersama.</h2><p class="mas-lead">Karya kolaborasi dan inovasi pribadi dari perjalanan PPG. Preview interaktif menampilkan simulasi alur penjadwalan sekolah.</p></div><span class="mas-index">02 KELOMPOK · 01 INDIVIDU</span></div>
      <div class="project-list">${projects.map(projectCard).join('')}</div>
      <div id="jadwal" class="masrama-schedule-root project-schedule-preview" data-portfolio-animations="featured"></div>
      <div id="portfolio-animation-root" class="portfolio-animation-root" data-portfolio-animations="supporting"></div>
    </section>`;
    window.PortfolioMotion?.reveal(slot);
    slot.querySelectorAll('.project-card').forEach((card) => {
      card.querySelector('.project-link')?.addEventListener('click', (event) => {
        event.preventDefault();
        const preview = slot.querySelector('#jadwal');
        preview?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      });
      card.addEventListener('pointermove', (event) => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-x', `${(-y * 1.8).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 1.8).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); });
    });
  }
  mount();
  window.addEventListener('hashchange', () => requestAnimationFrame(mount));
})();
