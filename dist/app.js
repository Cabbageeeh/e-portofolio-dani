const P = window.portfolio;
const slug = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safe = (value) => { try { const url = new URL(value, location.href); const localFile = location.protocol === 'file:' && url.protocol === 'file:' && url.pathname.startsWith(new URL('.', location.href).pathname); return ['http:', 'https:'].includes(url.protocol) || localFile ? url.href : ''; } catch { return ''; } };
const pages = new Map();
const main = document.querySelector('#main');
const landingScreen = document.querySelector('#landingScreen');
const portfolioShell = document.querySelector('#portfolioShell');
const homeAnchorIds = new Set(['tentang', 'jadwal', 'semester', 'karya', 'proses', 'artefak', 'refleksi', 'portfolio-animation-root']);
const finals = ['Model Guru', 'Refleksi Akhir Praktik', 'Filosofi Mengajar', 'Rencana Tindak Lanjut', 'Harapan Pendidikan Indonesia', 'Upaya Menjadi Guru yang Profesional'];
const add = (id, title, kind, semester) => pages.set(id, { id, title, kind, semester });
const navLink = (id, label) => `<a href="#${id}" data-page="${id}">${esc(label)}</a>`;

function landing() {
  const profile = P.profil;
  return `<section class="intro-cover landing-cover" aria-labelledby="intro-title">
    <div class="intro-copy">
      <p class="intro-eyebrow">PORTOFOLIO PPG <span>·</span> 2026</p>
      <p class="intro-overline">PENDIDIKAN PROFESI GURU / INFORMATIKA</p>
      <h1 id="intro-title">Muhammad<br><span>Abduramadani.</span></h1>
      <p class="intro-role">Calon Guru Informatika<br><span>Universitas Negeri Surabaya</span></p>
      <p class="intro-summary">Dokumentasi praktik, karya, dan refleksi dari dua semester perjalanan PPL.</p>
      <div class="intro-actions"><button id="enterPortfolio" type="button">JELAJAHI PORTOFOLIO <span aria-hidden="true">↘</span></button><a id="landingArtifacts" href="#artefak-s2">LIHAT ARTEFAK <span aria-hidden="true">↗</span></a></div>
      <div class="intro-meta"><div><span>SEMESTER 01</span><b>SMA Negeri 15 Surabaya</b></div><div><span>SEMESTER 02</span><b>SMP Negeri 60 Surabaya</b></div></div>
    </div>
    <div class="intro-visual" role="group" aria-label="Potret Muhammad Abduramadani"><span class="intro-year" aria-hidden="true">26</span><span class="intro-vertical">UNIVERSITAS NEGERI SURABAYA</span><div class="intro-seal"><span>PPG</span><small>INFORMATIKA</small></div><img class="intro-portrait" src="${esc(safe(profile.foto))}" alt="${esc(profile.nama)}" fetchpriority="high"><span class="intro-count">01 <i>—</i> 02</span></div>
    <div class="intro-trajectory" role="group" aria-label="Lintasan belajar dari Teknik Informatika menuju praktik mengajar"><div class="intro-trajectory-story"><div class="intro-trajectory-head"><span>LINIMASA BELAJAR</span><b>3 TAHAP</b></div><h2 class="intro-trajectory-title">Dari Informatika menuju ruang kelas</h2><p class="intro-trajectory-copy">Belajar memahami peserta didik, merancang pembelajaran, lalu berlatih mengajar.</p></div><div class="intro-trajectory-steps"><div class="intro-trajectory-track" aria-hidden="true"><i></i><i></i><i></i><span></span></div><div class="intro-trajectory-labels"><span><b>01</b> Teknik</span><span><b>02</b> Pedagogik</span><span><b>03</b> Praktik</span></div></div></div>
    <span class="intro-footnote">BELAJAR · MENGAJAR · BERTUMBUH</span>
  </section>`;
}
function enterPortfolio() {
  if (document.body.classList.contains('landing-closing')) return;
  const finish = () => {
    landingScreen.hidden = true;
    landingScreen.classList.remove('is-leaving');
    document.body.classList.remove('landing-active', 'landing-pending', 'landing-closing');
    portfolioShell.inert = false;
    portfolioShell.removeAttribute('aria-hidden');
    if (!location.hash) history.replaceState(null, '', '#beranda');
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
  document.body.classList.add('landing-closing');
  landingScreen.classList.add('is-leaving');
  let done = false;
  const reveal = () => { if (done) return; done = true; finish(); };
  landingScreen.addEventListener('transitionend', (event) => { if (event.target === landingScreen) reveal(); }, { once: true });
  window.setTimeout(reveal, 500);
}
function initLanding() {
  landingScreen.innerHTML = landing();
  portfolioShell.inert = true;
  portfolioShell.setAttribute('aria-hidden', 'true');
  document.body.classList.add('landing-active');
  landingScreen.querySelector('#enterPortfolio').addEventListener('click', enterPortfolio);
  landingScreen.querySelector('#landingArtifacts').addEventListener('click', enterPortfolio);
}

let nav = navLink('beranda', '⌂  Beranda');
for (const semester of P.semester) {
  add(`artefak-s${semester.nomor}`, `Artefak Semester ${semester.nomor}`, 'index', semester);
  add(`refleksi-s${semester.nomor}`, `Refleksi Mata Kuliah S${semester.nomor}`, 'reflection-index', semester);
  nav += `<div class="nav-label">SEMESTER ${semester.nomor}</div><details><summary>Artefak Semester ${semester.nomor}</summary>${navLink(`artefak-s${semester.nomor}`, 'Semua artefak')}`;
  for (const title of semester.artefak) { const id = `s${semester.nomor}-${slug(title)}`; add(id, title, 'artifact', semester); nav += navLink(id, title); }
  nav += `</details><details><summary>Refleksi Mata Kuliah S${semester.nomor}</summary>${navLink(`refleksi-s${semester.nomor}`, 'Semua refleksi')}`;
  for (const title of semester.mataKuliah) { const id = `refleksi-s${semester.nomor}-${slug(title)}`; add(id, title, 'reflection', semester); nav += navLink(id, title); }
  nav += '</details>';
}
nav += '<div class="nav-label">REFLEKSI & ARAH DIRI</div>';
for (const title of finals) { const id = slug(title); add(id, title, 'reflection'); nav += navLink(id, title); }
document.querySelector('#navigation').innerHTML = nav;

const tile = (id, title, subtitle, tag = '↗') => `<a class="tile" href="#${id}"><span class="tile-icon">${tag}</span><h3>${esc(title)}</h3><p>${esc(subtitle)}</p><span class="tile-bottom">JELAJAHI <span>↗</span></span></a>`;
function semesterCards() {
  return P.semester.map((semester) => '<article class="semester-card mas-semester-card"><span class="semester-number">0' + semester.nomor + '</span><p class="eyebrow">PRAKTIK PENGALAMAN LAPANGAN</p><h3>Semester ' + semester.nomor + '</h3><p class="mas-school">' + esc(semester.sekolah) + '</p><p class="mas-semester-note">' + semester.artefak.length + ' kategori artefak · ' + semester.mataKuliah.length + ' refleksi mata kuliah</p><div class="semester-links"><a href="#artefak-s' + semester.nomor + '">Telusuri artefak <span>↗</span></a><a href="#refleksi-s' + semester.nomor + '">Baca refleksi <span>↗</span></a></div></article>').join('');
}
function semesterArchive(semester) {
  return semester.artefak.map((title) => {
    const id = `s${semester.nomor}-${slug(title)}`;
    const artefak = Array.isArray(P.isi?.[id]?.artefak) ? P.isi[id].artefak : [];
    return { id, title, artefak, semester };
  });
}
const archiveCategoryInfo = {
  'lkpd': { icon: '▤', motif: '▧', description: 'Lembar kerja untuk memandu peserta didik mengeksplorasi konsep dan menyelesaikan aktivitas belajar.' },
  'media-pembelajaran': { icon: '▣', motif: '◉', description: 'Media digital dan alat bantu yang dirancang agar konsep Informatika lebih mudah dipahami.' },
  'video-pembelajaran': { icon: '▶', motif: '▰', description: 'Dokumentasi pembelajaran dalam format video beserta konteks dan analisis praktiknya.' },
  'modul-ajar': { icon: '▥', motif: '▤', description: 'Perencanaan pembelajaran yang memuat tujuan, langkah kegiatan, dan asesmen.' },
  'penilaian-praktik-mengajar': { icon: '✓', motif: '⌁', description: 'Bukti dan catatan penilaian selama praktik mengajar di kelas.' },
  'penilaian-penyusunan-perangkat': { icon: '⌘', motif: '▦', description: 'Dokumentasi proses menyusun dan meninjau perangkat pembelajaran.' },
  'video-ppl-terbimbing': { icon: '▷', motif: '▰', description: 'Rekaman praktik mengajar dengan pendampingan dan masukan dari guru pamong.' },
  'video-ppl-mandiri': { icon: '▷', motif: '◫', description: 'Rekaman praktik mengajar mandiri sebagai bagian dari pengalaman PPL.' },
  'kegiatan-non-mengajar': { icon: '⌂', motif: '⌗', description: 'Pengalaman berkontribusi dalam kegiatan sekolah di luar pembelajaran kelas.' },
  'instrumen-penilaian': { icon: '☷', motif: '✓', description: 'Instrumen untuk mengumpulkan bukti belajar dan menilai ketercapaian tujuan.' },
  'materi-pembelajaran': { icon: '▧', motif: '▤', description: 'Bahan ajar yang digunakan untuk mendukung proses belajar Informatika.' }
};
let archiveCategories = [];
function archiveArtifactCard(artifact, category) {
  const details = [['konteks', 'Konteks pembelajaran'], ['tujuan', 'Tujuan pembelajaran'], ['kelebihan', 'Kelebihan'], ['kekurangan', 'Tantangan & perbaikan'], ['teori', 'Keterkaitan teori']]
    .filter(([key]) => artifact[key])
    .map(([key, label]) => `<div><h4>${label}</h4><p>${esc(artifact[key])}</p></div>`).join('');
  const link = artifact.url && safe(artifact.url)
    ? `<a class="archive-work-link" href="${esc(safe(artifact.url))}" target="_blank" rel="noopener noreferrer">Buka artefak <span aria-hidden="true">↗</span></a>`
    : '<span class="archive-work-pending">Berkas belum ditambahkan</span>';
  return `<article class="archive-work"><div class="archive-work-head"><div><p class="archive-work-kicker">${esc(artifact.jenis || 'ARTEFAK PEMBELAJARAN')}${artifact.siklus ? ` · SIKLUS ${esc(artifact.siklus)}` : ''}</p><h4>${esc(artifact.judul || category.title)}</h4></div>${link}</div>${artifact.deskripsi ? `<p class="archive-work-description">${esc(artifact.deskripsi)}</p>` : ''}${details ? `<details class="archive-work-analysis"><summary>Lihat analisis artefak <span aria-hidden="true">＋</span></summary><div>${details}</div></details>` : ''}</article>`;
}
function archiveCategoryPanel(categories, activeKey) {
  const active = categories.find((category) => category.key === activeKey) || categories[0];
  if (!active) return '';
  const total = active.entries.reduce((sum, entry) => sum + entry.artefak.length, 0);
  const semesterSections = active.entries.map((entry) => {
    const content = entry.artefak.length
      ? entry.artefak.map((artifact) => archiveArtifactCard(artifact, active)).join('')
      : `<div class="archive-work-empty"><span aria-hidden="true">＋</span><div><strong>Artefak Semester ${entry.semester.nomor} belum ditambahkan.</strong><p>Bagian ini siap diisi saat kamu mengunggah hasil praktik.</p></div></div>`;
    return `<section class="archive-semester-group archive-semester-group--s${entry.semester.nomor}"><div class="archive-semester-heading"><span>SEMESTER 0${entry.semester.nomor}</span><strong>${esc(entry.semester.sekolah)}</strong></div>${content}</section>`;
  }).join('');
  return `<div class="archive-detail ${active.tone}" data-archive-detail="${active.key}" aria-live="polite"><div class="archive-detail-intro"><span class="archive-detail-icon" aria-hidden="true">${active.icon}</span><p class="archive-content-label">RUANG PEMBELAJARAN · ${active.entries.length} SEMESTER</p><h3>${esc(active.title)}</h3><p>${esc(active.description)}</p><div class="archive-detail-count"><strong>${total}</strong><span>artefak tersedia</span></div></div><div class="archive-detail-work">${semesterSections}</div><span class="archive-detail-watermark" aria-hidden="true">${active.motif}</span></div>`;
}
function archiveCards() {
  const byTitle = new Map();
  P.semester.flatMap(semesterArchive).forEach((entry) => {
    const key = slug(entry.title);
    if (!byTitle.has(key)) byTitle.set(key, { key, title: entry.title, entries: [], ...archiveCategoryInfo[key] });
    const category = byTitle.get(key);
    category.entries.push(entry);
    if (!category.icon) Object.assign(category, { icon: '▦', motif: '⌘', description: 'Dokumentasi dan bukti pengalaman belajar selama praktik PPG.' });
  });
  const categories = [...byTitle.values()].map((category, index) => ({ ...category, tone: `tone-${index % 10}`, count: category.entries.reduce((sum, entry) => sum + entry.artefak.length, 0) }));
  archiveCategories = categories;
  const selected = categories[0]?.key || '';
  const cards = categories.map((category, index) => `<article class="archive-index-card ${category.tone}${category.key === selected ? ' is-selected' : ''}" data-archive-card="${category.key}"><span class="archive-index-icon" aria-hidden="true">${category.icon}</span><button class="archive-index-toggle" type="button" data-archive-select="${category.key}" aria-label="Lihat rincian ${esc(category.title)}" aria-expanded="${category.key === selected}"><span aria-hidden="true">↘</span></button><h3>${esc(category.title)}</h3><p>${esc(category.description)}</p><div class="archive-index-motif" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><strong>${category.count} <span>artefak</span></strong><span class="archive-index-number">${String(index + 1).padStart(2, '0')}</span></article>`).join('');
  return `<div class="archive-index-summary"><span class="archive-summary-mark" aria-hidden="true">⌘</span><p><strong>${categories.length} kategori pembelajaran</strong><span>Artefak dari ${P.semester.length} semester praktik · isi menyusul saat kamu mengunggahnya</span></p></div><div class="archive-index-grid">${cards}</div><div class="archive-detail-slot">${archiveCategoryPanel(categories, selected)}</div>`;
}
function reflectionCards() {
  return finals.map((title) => tile(slug(title), title, 'Catatan dan arah pengembangan sebagai calon guru.')).join('');
}
function home() {
  const profile = P.profil;
  return `<div class="masrama-page">
    <section class="editorial-hero" id="portfolio-hero" aria-labelledby="hero-title">
      <div class="navy-field"><span class="hero-kicker">${esc(profile.nama)} / CALON GURU INFORMATIKA · 2026</span><span class="orb orb-one"></span><span class="orb orb-two"></span></div>
      <div class="white-field"><nav class="hero-nav" aria-label="Navigasi cepat"><a href="#karya">KARYA</a><a href="#semester">PERJALANAN</a><button class="hero-menu" type="button" aria-label="Buka semua menu" aria-expanded="false">☰</button></nav></div>
      <div class="editorial-copy"><p class="eyebrow">BELAJAR UNTUK MEMBERI MAKNA.</p><h1 id="hero-title">BELAJAR.<br>MENGAJAR.</h1><p>Merancang pembelajaran.<br>Menumbuhkan potensi.</p><a class="hero-button" href="#karya">JELAJAHI KARYA <span>↗</span></a></div>
      <img class="hero-portrait" src="${esc(safe(profile.foto))}" alt="Potret ${esc(profile.nama)}" fetchpriority="high">
      <div id="hero-project-board" class="hero-project-board" data-portfolio-animations="hero" aria-label="Papan animasi karya pilihan"></div>
      <div class="hero-bottom-left"><span class="mini-index">01 — 02</span><p>Dua semester.<br>Satu perjalanan menjadi pendidik.</p></div>
      <span class="hero-caption">E-PORTOFOLIO / 2026</span>
    </section>
    <div class="hero-strip"><span>PENDIDIKAN PROFESI GURU</span><span>INFORMATIKA</span><span>UNIVERSITAS NEGERI SURABAYA</span><a href="#tentang">LANJUTKAN PERJALANAN ↓</a></div>

    <section class="mas-section mas-about" id="tentang" aria-labelledby="about-title">
      <div class="mas-section-head"><div><p class="eyebrow">01 / TENTANG SAYA</p><h2 id="about-title">Menjadi guru, dimulai dari terus belajar.</h2></div><span class="mas-index">PPG · 2026</span></div>
      <div class="mas-about-grid"><div class="mas-about-copy"><p class="mas-lead">${esc(profile.bio)}</p><p>Portofolio ini merangkum praktik pembelajaran, perangkat yang disusun, karya kolaborasi, dan refleksi selama pendidikan profesi guru.</p><a class="mas-text-link" href="#semester">Lihat perjalanan dua semester <span>↗</span></a></div>
        <dl class="mas-facts"><div><dt>NAMA</dt><dd>${esc(profile.nama)}</dd></div><div><dt>NIM</dt><dd>${esc(profile.nim)}</dd></div><div><dt>BIDANG STUDI</dt><dd>Informatika</dd></div><div><dt>PERGURUAN TINGGI</dt><dd>${esc(profile.kampus)}</dd></div></dl>
      </div>
    </section>

    <section class="mas-section mas-journey" id="semester" aria-labelledby="semester-title">
      <div class="mas-section-head"><div><p class="eyebrow">02 / JEJAK PPL</p><h2 id="semester-title">Dua semester, dua konteks belajar.</h2><p class="mas-lead">Perjalanan praktik berlangsung di lingkungan sekolah yang berbeda. Pilih semester untuk menelusuri artefak dan refleksinya.</p></div><span class="mas-index">01 / 02</span></div>
      <div class="semester-grid mas-semester-grid">${semesterCards()}</div>
    </section>

    <div id="karya"></div>

    <section class="mas-section mas-process" id="proses" aria-labelledby="process-title">
      <div class="mas-section-head"><div><p class="eyebrow">03 / CARA MENELUSURI</p><h2 id="process-title">Bukti, analisis, lalu refleksi.</h2><p class="mas-lead">Susunan portofolio membantu pembaca melihat konteks lebih dulu sebelum menilai hasil pembelajaran.</p></div></div>
      <div class="learning-path mas-reading-path"><div class="path-step"><span class="step-number">01</span><h3>Kenali konteks</h3><p>Mulai dari profil dan sekolah tempat praktik berlangsung.</p></div><div class="path-step"><span class="step-number">02</span><h3>Telusuri artefak</h3><p>Buka perangkat, media, dan dokumentasi pada tiap kategori.</p></div><div class="path-step"><span class="step-number">03</span><h3>Baca analisis</h3><p>Tinjau tujuan, kelebihan, tantangan, dan kaitan dengan teori.</p></div><div class="path-step"><span class="step-number">04</span><h3>Temukan refleksi</h3><p>Ikuti catatan pengalaman dan rencana pengembangan diri.</p></div></div>
    </section>

    <section class="mas-section mas-archive" id="artefak" aria-labelledby="archive-title">
      <div class="mas-section-head"><div><p class="eyebrow">04 / ARSIP PEMBELAJARAN</p><h2 id="archive-title">Ruang untuk setiap bukti belajar.</h2><p class="mas-lead">Pilih panah pada kategori untuk melihat arsip per semester. Konten dapat bertambah saat artefakmu diunggah.</p></div><span class="mas-index">PPG · INFORMATIKA</span></div>
      <div class="mas-archive-grid">${archiveCards()}</div>
    </section>

    <section class="mas-section mas-reflection" id="refleksi" aria-labelledby="reflection-title">
      <div class="mas-section-head"><div><p class="eyebrow">05 / REFLEKSI PROFESIONAL</p><h2 id="reflection-title">Pengalaman menjadi arah bertumbuh.</h2><p class="mas-lead">Catatan tentang filosofi, praktik, dan rencana pengembangan diri.</p></div><span class="mas-index">REFLEKSI</span></div>
      <div class="tiles mas-reflection-grid">${reflectionCards()}</div>
    </section>
  </div>`;
}
function empty(title, description) { return `<div class="empty"><span class="empty-icon">▤</span><h2>${title}</h2><p>${description}</p><span class="pill">MENUNGGU MATERI</span></div>`; }
function render() {
  const requested = decodeURIComponent(location.hash.slice(1)) || 'beranda';
  const anchorTarget = homeAnchorIds.has(requested) ? requested : null;
  const id = anchorTarget ? 'beranda' : requested;
  const page = pages.get(id);
  document.querySelectorAll('[data-page]').forEach((link) => {
    const active = link.dataset.page === id;
    link.classList.toggle('active', active);
    link.removeAttribute('aria-current');
    if (active) { link.setAttribute('aria-current', 'page'); if (link.closest('details')) link.closest('details').open = true; }
  });
  if (id === 'beranda') main.innerHTML = home();
  else if (!page) main.innerHTML = '<section class="section"><h1>Halaman tidak ditemukan</h1><a class="button" href="#beranda">Kembali ke beranda</a></section>';
  else {
    const content = P.isi[id] || {};
    let body = '';
    if (page.kind.includes('index')) {
      const items = page.kind === 'index' ? page.semester.artefak : page.semester.mataKuliah;
      const availableItems = page.kind === 'index' ? items.filter((title) => (P.isi[`s${page.semester.nomor}-${slug(title)}`]?.artefak || []).length > 0) : items;
      body = availableItems.length
        ? '<div class="tiles">' + availableItems.map((title) => { const key = (page.kind === 'index' ? 's' : 'refleksi-s') + page.semester.nomor + '-' + slug(title); const count = (P.isi[key]?.artefak || []).length; return tile(key, title, page.kind === 'index' ? count + ' artefak tersedia' : 'Refleksi pengalaman belajar'); }).join('') + '</div>'
        : page.kind === 'index' ? empty('Arsip sedang disusun.', 'Kategori dengan artefak yang sudah ditambahkan akan tampil di sini.') : '<div class="tiles">' + items.map((title) => tile(`refleksi-s${page.semester.nomor}-${slug(title)}`, title, 'Refleksi pengalaman belajar')).join('') + '</div>';
    } else if (page.kind === 'artifact') {
      body = '<div class="artifact-list">' + ((content.artefak || []).map((artifact) => '<article class="artifact"><p class="eyebrow">' + esc(artifact.jenis || 'DOKUMEN') + (artifact.siklus ? ' / SIKLUS ' + esc(artifact.siklus) : '') + '</p><h2>' + esc(artifact.judul) + '</h2><p>' + esc(artifact.deskripsi || '') + '</p>' + (artifact.url && safe(artifact.url) ? '<a class="button" target="_blank" rel="noopener noreferrer" href="' + esc(safe(artifact.url)) + '">Lihat artefak ↗</a>' : '<span class="pill">Berkas belum ditambahkan</span>') + '<div class="analysis">' + [['konteks', 'Konteks pembelajaran'], ['tujuan', 'Tujuan'], ['kelebihan', 'Kelebihan'], ['kekurangan', 'Kekurangan & perbaikan'], ['teori', 'Keterkaitan teori mata kuliah']].map(([key, label]) => '<div><h3>' + label + '</h3><p>' + esc(artifact[key] || 'Analisis belum ditambahkan.') + '</p></div>').join('') + '</div></article>').join('') || empty('Artefak belum ditambahkan.', 'Dokumen, foto, dan tautan video dapat ditampilkan di sini beserta analisisnya.')) + '</div>';
    } else {
      body = '<article class="reading">' + ((content.paragraf || []).map((paragraph) => '<p>' + esc(paragraph) + '</p>').join('') || empty('Refleksi belum ditambahkan.', 'Catatan pengalaman, kekuatan, tantangan, dan rencana perbaikan dapat ditampilkan di sini.')) + (content.bagian || []).map((section) => '<h2>' + esc(section.judul) + '</h2><p>' + esc(section.teks) + '</p>').join('') + '</article>';
    }
    const backId = page.semester ? (page.kind === 'artifact' ? `artefak-s${page.semester.nomor}` : page.kind === 'reflection' ? `refleksi-s${page.semester.nomor}` : 'beranda') : 'beranda';
    main.innerHTML = '<a class="back-button" href="#' + backId + '"><span aria-hidden="true">←</span> Kembali<span class="back-context"> ke ' + esc(pages.get(backId)?.title || 'Beranda') + '</span></a><section class="page-head"><a href="#beranda" class="breadcrumb">Beranda / ' + (page.semester ? 'Semester ' + page.semester.nomor : 'Pengembangan diri') + '</a><p class="eyebrow">' + (page.semester ? esc(page.semester.sekolah) : 'REFLEKSI PROFESIONAL') + '</p><h1>' + esc(page.title) + '</h1><p>' + (page.kind === 'artifact' ? 'Bukti pembelajaran dan analisis pengalaman praktik.' : 'Dokumentasi perjalanan belajar menuju guru profesional.') + '</p></section><section class="section">' + body + '</section>';
  }
  document.body.classList.toggle('is-home', id === 'beranda');
  window.PortfolioMotion?.reveal(main);
  document.title = (page && id !== 'beranda' ? `${page.title} — ` : '') + 'Muhammad Abduramadani | Portofolio';
  document.body.classList.remove('menu-open');
  document.querySelector('#menuToggle').setAttribute('aria-expanded', 'false');
  if (anchorTarget) requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(anchorTarget)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })));
  else window.scrollTo(0, 0);
}

let preference;
try { preference = localStorage.getItem('dani-theme'); } catch {}
function setTheme(value) {
  document.documentElement.dataset.theme = value;
  document.querySelector('#themeToggle').setAttribute('aria-label', value === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  document.querySelector('#themeToggle').setAttribute('aria-pressed', String(value === 'dark'));
}
setTheme(preference || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
document.querySelector('#themeToggle').onclick = () => {
  const value = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(value);
  try { localStorage.setItem('dani-theme', value); } catch {}
};

let menuTrigger;
const menuPanel = document.querySelector('#sidebar');
menuPanel.setAttribute('aria-label', 'Menu portofolio');
document.querySelector('#menuToggle').setAttribute('aria-controls', 'sidebar');
function positionMenu(trigger) {
  const rect = trigger.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const width = Math.min(350, viewportWidth - 24);
  menuPanel.style.width = `${width}px`;
  menuPanel.style.right = `${Math.max(12, Math.min(viewportWidth - rect.right, viewportWidth - width - 12))}px`;
  const top = Math.max(12, Math.min(rect.bottom + 12, innerHeight - 180));
  menuPanel.style.top = `${top}px`;
  menuPanel.style.maxHeight = `${innerHeight - top - 12}px`;
}
function closeMenu(restoreFocus = false) {
  document.body.classList.remove('menu-open');
  document.querySelectorAll('#menuToggle, .hero-menu').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  menuPanel.inert = true;
  if (restoreFocus) menuTrigger?.focus();
}
function toggleMenu(trigger) {
  if (document.body.classList.contains('menu-open')) return closeMenu();
  menuTrigger = trigger;
  positionMenu(trigger);
  menuPanel.inert = false;
  document.body.classList.add('menu-open');
  document.querySelectorAll('#menuToggle, .hero-menu').forEach((button) => button.setAttribute('aria-expanded', 'true'));
}
menuPanel.inert = true;
document.querySelector('#menuToggle').onclick = (event) => toggleMenu(event.currentTarget);
document.addEventListener('click', (event) => {
  if (document.body.classList.contains('menu-open') && !menuPanel.contains(event.target) && !event.target.closest('#menuToggle, .hero-menu')) closeMenu();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(true); });
menuPanel.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', (event) => { const trigger = event.target.closest('.hero-menu'); if (trigger) toggleMenu(trigger); });
window.addEventListener('resize', () => { if (document.body.classList.contains('menu-open')) positionMenu(menuTrigger); });
window.addEventListener('scroll', () => { if (document.body.classList.contains('menu-open')) closeMenu(); }, { passive: true });
document.querySelector('.skip').onclick = (event) => { event.preventDefault(); main.focus(); };
let routeTransition;
function navigatePage() {
  closeMenu();
  const requested = decodeURIComponent(location.hash.slice(1)) || 'beranda';
  if (homeAnchorIds.has(requested) && !document.body.classList.contains('landing-active')) {
    render();
    main.focus({ preventScroll: true });
    return;
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { render(); main.focus({ preventScroll: true }); return; }
  if (document.startViewTransition) {
    routeTransition?.skipTransition();
    routeTransition = document.startViewTransition(() => { render(); main.focus({ preventScroll: true }); });
    routeTransition.finished.catch(() => {});
  } else {
    main.getAnimations().forEach((animation) => animation.cancel());
    render();
    main.focus({ preventScroll: true });
    main.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}
main.addEventListener('click', (event) => {
  const button = event.target.closest('[data-archive-select]');
  if (!button) return;
  const selectedKey = button.dataset.archiveSelect;
  const category = archiveCategories.find((item) => item.key === selectedKey);
  const grid = button.closest('.mas-archive-grid');
  const slot = grid?.querySelector('.archive-detail-slot');
  if (!category || !slot) return;
  grid.querySelectorAll('[data-archive-card]').forEach((card) => {
    const active = card.dataset.archiveCard === selectedKey;
    card.classList.toggle('is-selected', active);
    card.querySelector('[data-archive-select]')?.setAttribute('aria-expanded', String(active));
  });
  slot.innerHTML = archiveCategoryPanel(archiveCategories, selectedKey);
  requestAnimationFrame(() => {
    const panel = slot.querySelector('.archive-detail');
    panel?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
});
window.addEventListener('hashchange', navigatePage);
document.querySelector('#year').textContent = new Date().getFullYear();
initLanding();
render();
