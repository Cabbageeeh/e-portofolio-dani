/* Edit daftar karya ini untuk mengubah judul dan keterangan karya. */
window.portfolioProjects = [
  { title: 'JurnalKita', meta: 'Semester 1 · Artikel kelompok · SMA Negeri 15 Surabaya', description: 'Karya kolaborasi untuk tugas artikel pada semester pertama.', kind: 'KARYA KELOMPOK', icon: 'book', details: ['Artikel kolaborasi', 'Semester 1 · SMA Negeri 15 Surabaya'] },
  { title: 'SIGAP', meta: 'Semester 2 · Proyek kepemimpinan · SMP Negeri 60 Surabaya', description: 'Karya kelompok pada mata kuliah Proyek Kepemimpinan semester kedua.', kind: 'PROYEK KELOMPOK', icon: 'checklist', details: ['Proyek Kepemimpinan', 'Semester 2 · SMP Negeri 60 Surabaya'] },
  {
    title: 'Ruang Belajar',
    meta: 'Karya inovasi pendidikan · Ruang Bertumbuh · Individu',
    description: 'Platform pembelajaran Informatika terdiferensiasi yang menghubungkan asesmen awal, bahan belajar sesuai kesiapan, dan evaluasi yang tetap adil.',
    kind: 'KARYA INOVASI PENDIDIKAN',
    icon: 'monitor',
    target: 'ruang-belajar-inovasi',
    action: 'Baca rancangan inovasi',
    details: ['Dirancang dan dikembangkan secara individu', 'Untuk pembelajaran Informatika kelas 7 SMP'],
    innovation: {
      product: 'Ruang Bertumbuh',
      summary: 'Platform ini membantu guru menyiapkan pembelajaran Informatika per bab. Setiap murid menjalani alur belajar yang sama, sementara dukungan dan bahan belajarnya dapat disesuaikan dengan kesiapan masing-masing.',
      problem: 'Dalam satu kelas, kesiapan belajar dan cara murid mengakses materi dapat berbeda. Guru memerlukan cara untuk memberi dukungan yang sesuai tanpa mengubah tujuan serta standar evaluasi bersama.',
      role: 'Perancangan dan pengembangan produk secara individu.',
      flow: [
        { title: 'Asesmen awal', description: 'Memetakan pemahaman awal murid pada bab yang dipelajari.' },
        { title: 'Kelompok belajar', description: 'Guru menetapkan atau menyesuaikan kelompok berdasarkan kesiapan.' },
        { title: 'Bahan belajar', description: 'Materi disediakan dalam pilihan teks, audio, video/gambar, atau interaktif.' },
        { title: 'Evaluasi bersama', description: 'Murid mengerjakan paket ujian yang sama untuk menjaga penilaian tetap adil.' }
      ],
      principles: [
        'Kelompok belajar adalah dukungan pembelajaran, bukan label kemampuan permanen.',
        'Murid dapat memilih media yang disukai; sistem tidak menebak gaya belajarnya.',
        'Asesmen awal membantu menentukan dukungan, sedangkan ujian akhir menjadi tolok ukur bersama.'
      ],
      note: 'Bagian ini menjelaskan rancangan produk. Dampak pembelajaran perlu ditinjau melalui penerapan dan bukti belajar yang nyata.'
    }
  },
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
    const target = project.target || 'jadwal';
    return `<article class="project-card project-text-card project-tone-${index % 3}" data-index="${index}">
      <span class="project-watermark" aria-hidden="true">${projectIcon(project.icon, 'project-watermark-svg')}</span>
      <span class="project-icon" aria-hidden="true">${icon}</span>
      <p class="project-meta">${escapeHTML(project.meta)}</p>
      <div class="project-copy"><p class="project-index">0${index + 1} / ${escapeHTML(project.kind || 'KARYA PPG')}</p><h3>${escapeHTML(project.title)}</h3><p class="project-description">${escapeHTML(project.description)}</p></div>
      <div class="project-ticket"><p>Ringkasan karya</p><ul>${points}</ul></div>
      <a class="project-link" href="#${escapeHTML(target)}" data-project-target="${escapeHTML(target)}">${escapeHTML(project.action || 'Lihat preview interaktif')} </a>
    </article>`;
  }
  function featuredInnovationCard(project, index) {
    const innovation = project.innovation;
    if (!innovation) return '';
    const flow = innovation.flow.map((step, stepIndex) => `<li class="innovation-feature-step"><span>${String(stepIndex + 1).padStart(2, '0')}</span><div><strong>${escapeHTML(step.title)}</strong><p>${escapeHTML(step.description)}</p></div></li>`).join('');
    const details = (project.details || []).map((detail) => `<li>${escapeHTML(detail)}</li>`).join('');
    const target = project.target || 'ruang-belajar-inovasi';
    return `<article class="project-card project-text-card project-feature-card project-tone-2" data-index="${index}" aria-labelledby="featured-project-title">
      <span class="project-watermark" aria-hidden="true">${projectIcon(project.icon, 'project-watermark-svg')}</span>
      <div class="project-feature-copy">
        <div class="project-feature-topline"><span class="project-icon" aria-hidden="true">${projectIcon(project.icon, 'project-icon-svg')}</span><span class="project-feature-tag">INOVASI UTAMA · INDIVIDU</span></div>
        <p class="project-index">01 / ${escapeHTML(project.kind)}</p>
        <p class="project-feature-product">${escapeHTML(innovation.product)} <span>·</span> INFORMATIKA KELAS 7</p>
        <h3 id="featured-project-title">${escapeHTML(project.title)}</h3>
        <p class="project-feature-description">${escapeHTML(project.description)}</p>
        <div class="project-ticket"><p>Ringkasan inovasi</p><ul>${details}</ul></div>
        <a class="project-link" href="#${escapeHTML(target)}" data-project-target="${escapeHTML(target)}">Lihat rancangan inovasi </a>
      </div>
      <div class="project-feature-flow" aria-label="Alur pembelajaran Ruang Belajar">
        <div class="project-feature-flow-head"><div><span>RUANG BERTUMBUH</span><strong>Alur belajar per bab</strong></div><b>04 TAHAP</b></div>
        <ol>${flow}</ol>
        <p class="project-feature-flow-note">Tujuan belajar tetap sama; dukungan disesuaikan dengan kesiapan murid.</p>
      </div>
    </article>`;
  }
  function innovationPanel(projects) {
    const project = projects.find((item) => item.innovation);
    if (!project) return '';
    const innovation = project.innovation;
    const stages = innovation.flow.map((step, index) => `<article class="innovation-stage"><span>${String(index + 1).padStart(2, '0')}</span><div><h4>${escapeHTML(step.title)}</h4><p>${escapeHTML(step.description)}</p></div></article>`).join('');
    const principles = innovation.principles.map((principle) => `<li>${escapeHTML(principle)}</li>`).join('');
    return `<section class="innovation-case" id="${escapeHTML(project.target)}" aria-labelledby="innovation-title">
      <div class="innovation-case-head"><p class="eyebrow">KARYA INOVASI PENDIDIKAN · INDIVIDU</p><span>INFORMATIKA SMP · KELAS 7</span></div>
      <div class="innovation-case-grid">
        <div class="innovation-case-intro"><span class="innovation-case-icon" aria-hidden="true">${projectIcon(project.icon, 'project-icon-svg')}</span><p class="innovation-product-name">PRODUK · ${escapeHTML(innovation.product)}</p><h3 id="innovation-title">${escapeHTML(project.title)}</h3><p class="innovation-case-summary">${escapeHTML(innovation.summary)}</p><div class="innovation-role"><span>PERAN SAYA</span><strong>${escapeHTML(innovation.role)}</strong></div></div>
        <div class="innovation-case-design"><p class="eyebrow">TANTANGAN YANG DIJAWAB</p><p class="innovation-case-problem">${escapeHTML(innovation.problem)}</p><p class="eyebrow innovation-flow-label">ALUR PEMBELAJARAN PER BAB</p><div class="innovation-stages">${stages}</div></div>
      </div>
      <div class="innovation-principles"><p>PRINSIP DESAIN</p><ul>${principles}</ul></div>
      <p class="innovation-case-note">${escapeHTML(innovation.note)}</p>
    </section>`;
  }
  function mount() {
    const slot = document.querySelector('#karya');
    if (!slot || slot.querySelector('#portfolio-projects')) return;
    const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
    const featured = projects.find((project) => project.innovation);
    const collaborations = projects.filter((project) => !project.innovation);
    const featuredIndex = Math.max(0, projects.indexOf(featured));
    slot.innerHTML = `<section class="mas-section mas-projects" id="portfolio-projects" aria-labelledby="projects-title">
      <div class="mas-section-head"><div><p class="eyebrow">03 / KARYA PILIHAN</p><h2 id="projects-title">Inovasi pendidikan yang saya kembangkan.</h2><p class="mas-lead">Ruang Belajar menjadi karya utama dari perjalanan PPG ini. JurnalKita dan SIGAP melengkapi pengalaman kolaborasi saya.</p></div><span class="mas-index">01 INOVASI · 02 KOLABORASI</span></div>
      ${featured ? `<div class="project-featured-wrap">${featuredInnovationCard(featured, featuredIndex)}</div>` : ''}
      <div class="project-collaboration-head"><div><p class="eyebrow">KARYA KOLABORASI</p><h3>Gagasan yang diwujudkan bersama.</h3></div><span>SEMESTER 1 · SEMESTER 2</span></div>
      <div class="project-list project-collaboration-grid">${collaborations.map((project) => projectCard(project, projects.indexOf(project))).join('')}</div>
      ${innovationPanel(projects)}
      <div id="jadwal" class="masrama-schedule-root project-schedule-preview" data-portfolio-animations="featured"></div>
    </section>`;
    window.PortfolioMotion?.reveal(slot);
    slot.querySelectorAll('.project-card').forEach((card) => {
      card.querySelector('.project-link')?.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = card.querySelector('.project-link')?.dataset.projectTarget || 'jadwal';
        const preview = slot.querySelector(`#${targetId}`);
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
