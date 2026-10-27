/* Edit daftar karya ini untuk mengubah judul dan keterangan karya. */
window.portfolioProjects = [
  { title: 'JurnalKita', meta: 'Semester 1 · Artikel kelompok · SMA Negeri 15 Surabaya', description: 'Karya kolaborasi untuk tugas artikel pada semester pertama.', kind: 'KARYA KELOMPOK' },
  { title: 'SIGAP', meta: 'Semester 2 · Proyek kepemimpinan · SMP Negeri 60 Surabaya', description: 'Karya kelompok pada mata kuliah Proyek Kepemimpinan semester kedua.', kind: 'PROYEK KELOMPOK' },
  { title: 'Ruang Belajar', meta: 'Inovasi pembelajaran · Karya individu', description: 'Inovasi pembelajaran Informatika yang dikembangkan secara pribadi.', kind: 'KARYA INDIVIDU' },
];

(() => {
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function projectCard(project, index) {
    return `<article class="project-card project-text-card" data-index="${index}">
      <p class="project-meta"><span class="case-dot"></span>${escapeHTML(project.meta)}</p>
      <p class="project-index">0${index + 1} / ${escapeHTML(project.kind || 'KARYA PPG')}</p>
      <h3>${escapeHTML(project.title)}</h3>
      <p class="project-description">${escapeHTML(project.description)}</p>
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
