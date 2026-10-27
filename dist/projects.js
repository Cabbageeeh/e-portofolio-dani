/* Edit daftar karya ini untuk mengubah judul, keterangan, atau tautan repositori. */
window.portfolioProjects = [
  { title: 'JurnalKita', meta: 'Semester 1 · Artikel kelompok · SMA Negeri 15 Surabaya', description: 'Karya kolaborasi untuk mendukung pengelolaan kegiatan pembelajaran dan artikel pada semester pertama.', mark: 'JK', href: 'https://github.com/MasRama/jurnalkita', linkLabel: 'Repositori kolaborasi', kind: 'KARYA KELOMPOK' },
  { title: 'SIGAP', meta: 'Semester 2 · Proyek kepemimpinan · SMP Negeri 60 Surabaya', description: 'Proyek kelompok pada mata kuliah Proyek Kepemimpinan di semester kedua.', mark: 'SG', href: 'https://github.com/Cabbageeeh/sigap', linkLabel: 'Repositori proyek', kind: 'PROYEK KELOMPOK' },
  { title: 'Ruang Belajar', meta: 'Inovasi pembelajaran · Karya individu', description: 'Karya inovasi pembelajaran Informatika yang dikembangkan secara pribadi.', mark: 'RB', href: 'https://github.com/Cabbageeeh/ruang-belajar', linkLabel: 'Repositori proyek', kind: 'KARYA INDIVIDU' },
];

(() => {
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  function projectCard(project, index) {
    const href = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(project.href) ? project.href : '#';
    const scenes = [
      '<div class="project-scene-window"><span class="scene-topline">JURNAL / PEMBELAJARAN</span><div class="scene-columns"><i></i><div><b></b><b></b><b></b><span></span></div></div><div class="scene-foot"><span>ARTIKEL</span><span>SEMESTER 01</span></div></div>',
      '<div class="project-scene-window"><span class="scene-topline">SIGAP / KEPEMIMPINAN</span><div class="scene-columns"><i></i><div><b></b><b></b><b></b><span></span></div></div><div class="scene-foot"><span>PROYEK KELOMPOK</span><span>SEMESTER 02</span></div></div>',
      '<div class="project-scene-window"><span class="scene-topline">RUANG BELAJAR / INFORMATIKA</span><div class="scene-columns"><i></i><div><b></b><b></b><b></b><span></span></div></div><div class="scene-foot"><span>INOVASI</span><span>INDIVIDU</span></div></div>',
    ];
    return `<article class="project-card case-study ${index % 2 ? 'case-study--reverse' : ''}" data-index="${index}">
      <div class="case-copy"><p class="project-meta"><span class="case-dot"></span>${escapeHTML(project.meta)}</p><h3>${escapeHTML(project.title)}</h3><p class="project-description">${escapeHTML(project.description)}</p><div class="case-facts"><span>0${index + 1}</span><b>${escapeHTML(project.kind || 'PORTOFOLIO PPG')}</b></div><a class="project-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} <span aria-hidden="true">↗</span></a></div>
      <div class="case-art case-art--${index + 1}" aria-label="Ilustrasi abstrak ${escapeHTML(project.title)}" role="img"><span class="case-orbit case-orbit--one"></span><span class="case-orbit case-orbit--two"></span><div class="project-scene">${scenes[index] || scenes[0]}</div><span class="case-art-index">PPG / 2026</span></div>
    </article>`;
  }
  function mount() {
    const slot = document.querySelector('#karya');
    if (!slot || slot.querySelector('#portfolio-projects')) return;
    const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
    slot.innerHTML = `<section class="mas-section mas-projects" id="portfolio-projects" aria-labelledby="projects-title">
      <div class="mas-section-head"><div><p class="eyebrow">03 / KARYA PILIHAN</p><h2 id="projects-title">Pembelajaran yang diwujudkan bersama.</h2><p class="mas-lead">Karya kolaborasi dan inovasi pribadi dari perjalanan PPG. Ilustrasi antarmuka di samping hanya elemen visual, bukan tangkapan layar produk.</p></div><span class="mas-index">02 KELOMPOK · 01 INDIVIDU</span></div>
      <div class="project-list">${projects.map(projectCard).join('')}</div>
      <div id="portfolio-animation-root" class="portfolio-animation-root" data-portfolio-animations="supporting"></div>
    </section>`;
    window.PortfolioMotion?.reveal(slot);
    slot.querySelectorAll('.project-card').forEach((card) => {
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
