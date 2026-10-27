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
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
  const times = ['07.00', '08.00', '09.00', '10.00'];
  const sampleLessons = [
    { day: 0, period: 0, title: 'Informatika' },
    { day: 1, period: 1, title: 'Matematika' },
    { day: 2, period: 2, title: 'Praktik' },
    { day: 3, period: 0, title: 'Diskusi' },
    { day: 4, period: 3, title: 'Proyek' },
  ];

  function scheduleMarkup() {
    const headers = `<div class="schedule-corner">WAKTU</div>${days.map((day, index) => `<div class="schedule-day" style="grid-column:${index + 2};grid-row:1">${day}</div>`).join('')}`;
    const slots = times.map((time, row) => {
      const gridRow = row + 2;
      return `<div class="schedule-time" style="grid-column:1;grid-row:${gridRow}">${time}</div>${days.map((_, day) => `<span class="schedule-slot" aria-hidden="true" style="grid-column:${day + 2};grid-row:${gridRow}"></span>`).join('')}`;
    }).join('');
    const lessons = sampleLessons.map((lesson, index) => `<div class="schedule-block" style="--order:${index};grid-column:${lesson.day + 2};grid-row:${lesson.period + 2}">${lesson.title}</div>`).join('');
    return `<div class="schedule-grid" aria-hidden="true">${headers}${slots}${lessons}</div>`;
  }

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
      <div class="schedule-feature">
        <div class="schedule-copy"><p class="eyebrow">VISUALISASI INTERAKTIF</p><h3>Jadwal belajar, tersusun bertahap.</h3><p>Balok pelajaran muncul satu per satu untuk menggambarkan bagaimana jadwal mingguan dapat dibaca dengan cepat.</p><button class="schedule-replay" type="button" aria-controls="schedule-board">Putar ulang simulasi <span aria-hidden="true">↻</span></button><p class="schedule-footnote">Contoh visual saja; bukan jadwal aktual sekolah.</p></div>
        <div class="schedule-board" id="schedule-board" role="img" aria-label="Ilustrasi jadwal mingguan lima hari dengan beberapa pelajaran yang tersusun pada slot waktu.">
          <div class="schedule-board-head"><span>JADWAL MINGGUAN</span><span class="schedule-state"><i></i> ILUSTRASI</span></div>
          ${scheduleMarkup()}
          <p class="schedule-board-caption">Slot contoh · Senin—Jumat</p>
        </div>
      </div>`;
    main.append(section);

    const board = section.querySelector('#schedule-board');
    const replay = section.querySelector('.schedule-replay');
    const play = () => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      board.classList.remove('is-playing');
      void board.offsetWidth;
      board.classList.add('is-playing');
    };
    replay.addEventListener('click', play);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      board.classList.add('is-playing');
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return;
        play();
        observer.disconnect();
      }, { threshold: 0.35 });
      observer.observe(board);
    }
  }

  mount();
  window.addEventListener('hashchange', () => requestAnimationFrame(mount));
})();
