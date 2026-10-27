/* Edit daftar karya ini untuk mengubah judul, keterangan, atau tautan repositori. */
window.portfolioProjects = [
  {
    title: 'JurnalKita',
    meta: 'Semester 1 · Artikel kelompok',
    description: 'Sistem jurnal kelas digital untuk SMA Negeri 15 Surabaya yang menghubungkan jadwal pelajaran, jurnal harian, dan presensi.',
    mark: 'JK',
    href: 'https://github.com/MasRama/jurnalkita',
    linkLabel: 'Repositori kolaborasi',
  },
  {
    title: 'SIGAP',
    meta: 'Semester 2 · Proyek kepemimpinan kelompok',
    description: 'Sistem informasi guru, absensi, dan prestasi dengan alur jadwal mengajar, jurnal, nilai, serta informasi untuk orang tua.',
    mark: 'SG',
    href: 'https://github.com/Cabbageeeh/sigap',
    linkLabel: 'Repositori proyek',
  },
  {
    title: 'Ruang Belajar',
    meta: 'Inovasi pembelajaran · Individu',
    description: 'Inovasi pembelajaran Informatika tingkat SMP untuk membantu guru menyajikan materi dan aktivitas secara berdiferensiasi.',
    mark: 'RB',
    href: 'https://github.com/Cabbageeeh/ruang-belajar',
    linkLabel: 'Repositori proyek',
  },
];

(() => {
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function projectCard(project, index) {
    const href = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(project.href) ? project.href : '#';
    return `<article class="project-card">
      <div class="project-card-head"><span class="project-index">0${index + 1}</span><span class="project-mark">${escapeHTML(project.mark)}</span></div>
      <p class="project-meta">${escapeHTML(project.meta)}</p>
      <h3>${escapeHTML(project.title)}</h3>
      <p class="project-description">${escapeHTML(project.description)}</p>
      <a class="project-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function mount() {
    const main = document.querySelector('#main');
    if (!main?.querySelector('#portfolio-hero') || main.querySelector('#portfolio-projects')) return;
    const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
    const section = document.createElement('section');
    section.className = 'section portfolio-projects';
    section.id = 'portfolio-projects';
    section.innerHTML = `<div class="section-head"><div><p class="eyebrow">05 / KARYA PILIHAN</p><h2>Karya yang berangkat dari kebutuhan belajar.</h2><p class="projects-lead">Kolaborasi pengelolaan kelas dan inovasi pembelajaran dari perjalanan PPG.</p></div><span class="pill">2 KELOMPOK · 1 INDIVIDU</span></div>
      <div class="project-grid">${projects.map(projectCard).join('')}</div>
      <div id="portfolio-animation-root" class="portfolio-animation-root"></div>`;
    main.append(section);
    window.PortfolioMotion?.reveal(section);
    section.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-x', `${(x * 4).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(-y * 4).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  mount();
  window.addEventListener('hashchange', () => requestAnimationFrame(mount));
})();
