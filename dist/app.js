const P = window.portfolio;
const slug = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safe = (value) => { try { const url = new URL(value, location.href); const localFile = location.protocol === 'file:' && url.protocol === 'file:' && url.pathname.startsWith(new URL('.', location.href).pathname); return ['http:', 'https:'].includes(url.protocol) || localFile ? url.href : ''; } catch { return ''; } };
const pages = new Map();
const main = document.querySelector('#main');
const landingScreen = document.querySelector('#landingScreen');
const portfolioShell = document.querySelector('#portfolioShell');
const homeAnchorIds = new Set(['tentang', 'jadwal', 'semester', 'karya', 'ruang-belajar-inovasi', 'proses', 'artefak', 'refleksi-mata-kuliah', 'refleksi', 'portfolio-animation-root']);
const finals = ['Refleksi Program PPG', 'Model Guru', 'Refleksi Akhir Praktik', 'Filosofi Mengajar', 'Rencana Tindak Lanjut', 'Harapan Pendidikan Indonesia', 'Upaya Menjadi Guru yang Profesional'];
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

const reflectionTonePalette = ['green', 'mustard', 'teal', 'sand', 'rust', 'orange'];
function reflectionIconFor(title) {
  const value = title.toLowerCase();
  if (value.includes('kebugaran')) return 'activity';
  if (value.includes('mental') || value.includes('sosial emosional')) return 'heart';
  if (value.includes('growth')) return 'spark';
  if (value.includes('inklusi')) return 'people';
  if (value.includes('kepemimpinan')) return 'flag';
  if (value.includes('seminar')) return 'school';
  if (value.includes('ppp') || value.includes('pmad') || value.includes('pmal')) return 'bookCode';
  if (value.includes('ppkpt')) return 'shield';
  if (value.includes('sppg')) return 'school';
  return 'clipboardCheck';
}
function tile(id, title, subtitle, semester = 1, index = 0, kind = 'reflection-index') {
  const icon = archiveIcon(reflectionIconFor(title), 'archive-svg-icon');
  const isArtifact = kind === 'index';
  const sectionLabel = isArtifact ? 'ARTEFAK PEMBELAJARAN' : 'REFLEKSI MATA KULIAH';
  const ticketLabel = isArtifact ? 'KATEGORI ARTEFAK' : 'CATATAN REFLEKSI';
  const ticketText = isArtifact ? 'Bukti pembelajaran dan dokumentasi praktik' : 'Pengalaman, pemahaman, dan tindak lanjut';
  const action = isArtifact ? 'TELUSURI ARTEFAK' : 'BACA REFLEKSI';
  return `<a class="tile reflection-tile reflection-tone-${reflectionTonePalette[index % reflectionTonePalette.length]}" href="#${id}">
    <span class="reflection-tile-watermark" aria-hidden="true">${icon}</span>
    <span class="tile-icon" aria-hidden="true">${icon}</span>
    <p class="reflection-tile-kicker">SEMESTER 0${semester} · ${sectionLabel}</p>
    <h3>${esc(title)}</h3>
    <p class="reflection-tile-description">${esc(subtitle)}</p>
    <span class="reflection-tile-ticket"><span>${ticketLabel}</span><strong>${ticketText}</strong></span>
    <span class="tile-bottom">${action} <span aria-hidden="true">↗</span></span>
  </a>`;
}
function semesterCards() {
  return P.semester.map((semester) => '<article class="semester-card mas-semester-card"><span class="semester-number">0' + semester.nomor + '</span><p class="eyebrow">PRAKTIK PENGALAMAN LAPANGAN</p><h3>Semester ' + semester.nomor + '</h3><p class="mas-school">' + esc(semester.sekolah) + '</p><p class="mas-semester-note">' + semester.artefak.length + ' kategori artefak · ' + semester.mataKuliah.length + ' refleksi mata kuliah</p><div class="semester-links"><a href="#artefak-s' + semester.nomor + '">Telusuri artefak <span>↗</span></a><a href="#refleksi-s' + semester.nomor + '">Baca refleksi <span>↗</span></a></div></article>').join('');
}
function reflectionSemesterCards() {
  return P.semester.map((semester) => {
    const number = String(semester.nomor).padStart(2, '0');
    const courses = semester.mataKuliah.map((title) => `<a href="#refleksi-s${semester.nomor}-${slug(title)}">${esc(title)}<span aria-hidden="true">↗</span></a>`).join('');
    return `<article class="course-reflection-card course-reflection-card--s${semester.nomor}">
      <span class="course-reflection-watermark" aria-hidden="true">${archiveIcon('bookCode', 'archive-watermark-svg')}</span>
      <div class="course-reflection-top"><span class="course-reflection-icon" aria-hidden="true">${archiveIcon('bookCode', 'archive-svg-icon')}</span><span class="course-reflection-count"><strong>${String(semester.mataKuliah.length).padStart(2, '0')}</strong><small>MATA KULIAH</small></span></div>
      <p class="eyebrow">REFLEKSI MATA KULIAH · SEMESTER ${number}</p>
      <h3>Semester ${semester.nomor}</h3>
      <p class="course-reflection-school">${esc(semester.sekolah)}</p>
      <div class="course-reflection-links" aria-label="Pilih mata kuliah">${courses}</div>
      <a class="course-reflection-all" href="#refleksi-s${semester.nomor}">Buka semua refleksi <span aria-hidden="true">↗</span></a>
    </article>`;
  }).join('');
}
function semesterArchive(semester) {
  return semester.artefak.map((title) => {
    const id = `s${semester.nomor}-${slug(title)}`;
    const artefak = Array.isArray(P.isi?.[id]?.artefak) ? P.isi[id].artefak : [];
    return { id, title, artefak, semester };
  });
}
const archiveCategoryInfo = {
  'lkpd': { icon: 'worksheet', description: 'Lembar kerja untuk memandu peserta didik mengeksplorasi konsep dan menyelesaikan aktivitas belajar.' },
  'media-pembelajaran': { icon: 'monitorCode', description: 'Media digital dan alat bantu yang dirancang agar konsep Informatika lebih mudah dipahami.' },
  'video-pembelajaran': { icon: 'video', description: 'Dokumentasi pembelajaran dalam format video beserta konteks dan analisis praktiknya.' },
  'modul-ajar': { icon: 'bookCode', description: 'Perencanaan pembelajaran yang memuat tujuan, langkah kegiatan, dan asesmen.' },
  'penilaian-praktik-mengajar': { icon: 'clipboardCheck', description: 'Bukti dan catatan penilaian selama praktik mengajar di kelas.' },
  'penilaian-penyusunan-perangkat': { icon: 'layoutCheck', description: 'Dokumentasi proses menyusun dan meninjau perangkat pembelajaran.' },
  'video-ppl': { icon: 'camera', description: 'Dokumentasi praktik mengajar terbimbing dan mandiri selama PPL.' },
  'kegiatan-non-mengajar': { icon: 'school', description: 'Pengalaman berkontribusi dalam kegiatan sekolah di luar pembelajaran kelas.' },
  'instrumen-penilaian': { icon: 'checklist', description: 'Instrumen untuk mengumpulkan bukti belajar dan menilai ketercapaian tujuan.' },
  'materi-pembelajaran': { icon: 'bookCode', description: 'Bahan ajar yang digunakan untuk mendukung proses belajar Informatika.' }
};
const archiveIconPaths = {
  worksheet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  monitorCode: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4M9 9l-2 2 2 2m6-4 2 2-2 2"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3zM7 3h5"/>',
  bookCode: '<path d="M12 7v14m0-14C9 4 6 4 3 5v13c3-1 6-1 9 2m0-13c3-3 6-3 9-2v13c-3-1-6-1-9 2"/><path d="m7 10-2 2 2 2m3-4 2 2-2 2"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  heart: '<path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 8.8 2.5Z"/><path d="M4 12h4l2-3 3.5 6 2-3H20"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.6V20"/>',
  flag: '<path d="M5 21V4m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  clipboardCheck: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5ZM8 11l1.5 1.5L12 10m2 2h2m-8 4 1.5 1.5L12 15m2 2h2"/>',
  layoutCheck: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11m4-7 1.5 1.5L17 11m-3 4h3"/>',
  camera: '<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>',
  school: '<path d="m3 10 9-6 9 6M5 9v11h14V9M3 20h18M9 20v-6h6v6M9 10h.01M15 10h.01"/>',
  checklist: '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M10 10h4v4h-4z"/>'
};
const archiveCategoryAliases = { 'video-ppl-terbimbing': 'video-ppl', 'video-ppl-mandiri': 'video-ppl' };
function archiveIcon(name, className) {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${archiveIconPaths[name] || archiveIconPaths.chip}</svg>`;
}
let archiveCategories = [];
function archiveArtifactCard(artifact, category) {
  const details = [['konteks', 'Konteks pembelajaran'], ['tujuan', 'Tujuan pembelajaran'], ['kelebihan', 'Kelebihan'], ['kekurangan', 'Tantangan & perbaikan'], ['teori', 'Keterkaitan teori']]
    .filter(([key]) => artifact[key])
    .map(([key, label]) => `<div><h4>${label}</h4><p>${esc(artifact[key])}</p></div>`).join('');
  const link = artifact.url && safe(artifact.url)
    ? `<a class="archive-work-link" href="${esc(safe(artifact.url))}" data-preview-artifact data-artifact-title="${esc(artifact.judul || category.title)}">Buka artefak <span aria-hidden="true">↗</span></a>`
    : '<span class="archive-work-pending">Berkas belum ditambahkan</span>';
  return `<article class="archive-work"><div class="archive-work-head"><div><p class="archive-work-kicker">${esc(artifact.jenis || 'ARTEFAK PEMBELAJARAN')}${artifact.siklus ? ` · SIKLUS ${esc(artifact.siklus)}` : ''}</p><h4>${esc(artifact.judul || category.title)}</h4></div>${link}</div>${artifact.deskripsi ? `<p class="archive-work-description">${esc(artifact.deskripsi)}</p>` : ''}${details ? `<details class="archive-work-analysis"><summary>Lihat analisis artefak <span aria-hidden="true">＋</span></summary><div>${details}</div></details>` : ''}</article>`;
}
const artifactPreviewOrigin = 'https://e-portofolio-dani.vercel.app/';
let artifactPreviewReturnFocus = null;
function artifactPreviewModal() {
  let modal = document.querySelector('#artifactPreview');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'artifactPreview';
  modal.className = 'artifact-preview';
  modal.hidden = true;
  modal.innerHTML = '<div class="artifact-preview-scrim" data-preview-close aria-hidden="true"></div><section class="artifact-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="artifactPreviewTitle"><header class="artifact-preview-header"><div><p class="artifact-preview-kicker">PRATINJAU ARTEFAK</p><h2 id="artifactPreviewTitle"></h2></div><div class="artifact-preview-actions"><a class="artifact-preview-download" data-preview-download target="_blank" rel="noopener noreferrer">Unduh berkas asli <span aria-hidden="true">↗</span></a><button class="artifact-preview-close" type="button" data-preview-close aria-label="Tutup pratinjau">×</button></div></header><div class="artifact-preview-stage" data-preview-stage></div><p class="artifact-preview-note" data-preview-note></p></section>';
  document.body.append(modal);
  return modal;
}
function artifactPreviewSource(fileUrl, extension) {
  const url = new URL(fileUrl, location.href);
  if (['pptx', 'docx'].includes(extension)) {
    const isLocal = url.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(url.hostname);
    if (isLocal) {
      const appPath = new URL('.', location.href).pathname;
      const relativePath = url.pathname.startsWith(appPath) ? url.pathname.slice(appPath.length) : url.pathname.replace(/^\/+/, '');
      return new URL(relativePath, artifactPreviewOrigin).href;
    }
  }
  return url.href;
}
function openArtifactPreview(link) {
  const fileUrl = safe(link.href);
  if (!fileUrl) return;
  const url = new URL(fileUrl, location.href);
  const extension = url.pathname.split('.').pop().toLowerCase();
  const title = link.dataset.artifactTitle || link.closest('.archive-work, .artifact')?.querySelector('h2, h4')?.textContent?.trim() || 'Artefak pembelajaran';
  const modal = artifactPreviewModal();
  const stage = modal.querySelector('[data-preview-stage]');
  const note = modal.querySelector('[data-preview-note]');
  const source = artifactPreviewSource(fileUrl, extension);
  const officeFile = ['pptx', 'docx'].includes(extension);
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(source)}`;
  modal.querySelector('#artifactPreviewTitle').textContent = title;
  modal.querySelector('[data-preview-download]').href = fileUrl;
  if (extension === 'pdf') {
    stage.innerHTML = `<iframe class="artifact-preview-frame" title="Pratinjau ${esc(title)}" src="${esc(url.href)}#toolbar=1&view=FitH"></iframe>`;
    note.textContent = 'Dokumen PDF ditampilkan langsung. Gunakan tombol unduh untuk menyimpan salinan berkas.';
  } else if (officeFile) {
    stage.innerHTML = `<iframe class="artifact-preview-frame" title="Pratinjau ${esc(title)}" src="${esc(officeUrl)}" allowfullscreen></iframe>`;
    note.textContent = 'Pratinjau PowerPoint atau Word dimuat melalui Microsoft Office Online. Jika belum muncul, gunakan tombol unduh berkas asli.';
  } else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
    stage.innerHTML = `<img class="artifact-preview-image" src="${esc(url.href)}" alt="Pratinjau ${esc(title)}">`;
    note.textContent = 'Gambar ditampilkan pada ukuran yang menyesuaikan layar.';
  } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
    stage.innerHTML = `<video class="artifact-preview-video" src="${esc(url.href)}" controls playsinline></video>`;
    note.textContent = 'Video pembelajaran. Gunakan kontrol pemutar untuk melihat isinya.';
  } else {
    stage.innerHTML = '<div class="artifact-preview-fallback"><span aria-hidden="true">↗</span><h3>Pratinjau belum tersedia untuk jenis berkas ini.</h3><p>Kamu tetap bisa membuka atau menyimpan berkas aslinya.</p></div>';
    note.textContent = '';
  }
  artifactPreviewReturnFocus = link;
  modal.hidden = false;
  document.body.classList.add('artifact-preview-open');
  modal.querySelector('.artifact-preview-close').focus();
}
function closeArtifactPreview() {
  const modal = document.querySelector('#artifactPreview');
  if (!modal || modal.hidden) return;
  modal.querySelectorAll('iframe, video').forEach((media) => { if (media.tagName === 'VIDEO') media.pause(); });
  modal.hidden = true;
  modal.querySelector('[data-preview-stage]').replaceChildren();
  document.body.classList.remove('artifact-preview-open');
  artifactPreviewReturnFocus?.focus();
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
  return `<div class="archive-detail ${active.tone}" data-archive-detail="${active.key}" aria-live="polite"><div class="archive-detail-intro"><span class="archive-detail-icon" aria-hidden="true">${archiveIcon(active.icon, 'archive-svg-icon')}</span><p class="archive-content-label">RUANG PEMBELAJARAN · ${active.entries.length} SEMESTER</p><h3>${esc(active.title)}</h3><p>${esc(active.description)}</p><div class="archive-detail-count"><strong>${total}</strong><span>artefak tersedia</span></div></div><div class="archive-detail-work">${semesterSections}</div><span class="archive-detail-watermark" aria-hidden="true">${archiveIcon(active.icon, 'archive-watermark-svg')}</span></div>`;
}
function buildArchiveCategories(semesters = P.semester) {
  const byTitle = new Map();
  semesters.flatMap(semesterArchive).forEach((entry) => {
    const originalKey = slug(entry.title);
    const key = archiveCategoryAliases[originalKey] || originalKey;
    const title = key === 'video-ppl' ? 'Video PPL' : entry.title;
    if (!byTitle.has(key)) byTitle.set(key, { key, title, entries: [], ...archiveCategoryInfo[key] });
    const category = byTitle.get(key);
    const sameSemester = category.entries.find((item) => item.semester.nomor === entry.semester.nomor);
    if (sameSemester) sameSemester.artefak.push(...entry.artefak);
    else category.entries.push({ ...entry });
    if (!category.icon) Object.assign(category, { icon: 'chip', description: 'Dokumentasi dan bukti pengalaman belajar selama praktik PPG.' });
  });
  return [...byTitle.values()].map((category, index) => ({ ...category, tone: `tone-${index % 10}`, count: category.entries.reduce((sum, entry) => sum + entry.artefak.length, 0) }));
}
function archiveCategoryCards(categories, summary, detailLabel) {
  archiveCategories = categories;
  const selected = categories[0]?.key || '';
  const cards = categories.map((category) => `<article class="archive-index-card ${category.tone}${category.key === selected ? ' is-selected' : ''}" data-archive-card="${category.key}"><span class="archive-index-icon" aria-hidden="true">${archiveIcon(category.icon, 'archive-svg-icon')}</span><button class="archive-index-toggle" type="button" data-archive-select="${category.key}" aria-label="Lihat rincian ${esc(category.title)}" aria-expanded="${category.key === selected}"><span aria-hidden="true">↘</span></button><h3>${esc(category.title)}</h3><p>${esc(category.description)}</p><div class="archive-index-motif" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><strong>${category.count} <span>artefak</span></strong><span class="archive-index-watermark" aria-hidden="true">${archiveIcon(category.icon, 'archive-watermark-svg')}</span></article>`).join('');
  return `<div class="archive-index-summary"><span class="archive-summary-mark" aria-hidden="true">${archiveIcon('chip', 'archive-svg-icon')}</span><p><strong>${summary}</strong><span>${detailLabel}</span></p></div><div class="archive-index-grid">${cards}</div><div class="archive-detail-slot">${archiveCategoryPanel(categories, selected)}</div>`;
}
function archiveCards() {
  const categories = buildArchiveCategories();
  return archiveCategoryCards(categories, `${categories.length} kategori pembelajaran`, `Artefak dari ${P.semester.length} semester praktik · isi menyusul saat kamu mengunggahnya`);
}
function archiveCardsForSemester(semester) {
  const categories = buildArchiveCategories([semester]);
  return `<div class="mas-archive-grid semester-archive-grid">${archiveCategoryCards(categories, `${categories.length} kategori artefak`, `Semester 0${semester.nomor} · ${esc(semester.sekolah)} · unggah artefakmu untuk melengkapi arsip ini`)}</div>`;
}
function reflectionCards() {
  const tones = ['#4f6b45', '#e0b257', '#3e6c78', '#e8d3b6', '#b4553f', '#c98a4b'];
  const inks = ['#f4efe4', '#2a1d15', '#f4efe4', '#2a1d15', '#fff6ee', '#2a1d15'];
  const icons = ['school', 'worksheet', 'bookCode', 'layoutCheck', 'chip', 'clipboardCheck'];
  const prompts = ['Pengalaman selama praktik', 'Pemahaman yang bertambah', 'Langkah pengembangan diri'];
  return finals.map((title, index) => {
    const id = slug(title);
    const content = P.isi?.[id] || {};
    const paragraphs = (content.paragraf || []).filter(Boolean);
    const sections = (content.bagian || []).filter((section) => section?.judul || section?.teks);
    const hasContent = paragraphs.length > 0 || sections.length > 0;
    const summary = (paragraphs[0] || sections[0]?.teks || 'Catatan pengalaman dan arah pengembangan diri sebagai calon guru.').trim();
    const excerpt = summary.length > 170 ? `${summary.slice(0, 167).trimEnd()}…` : summary;
    const points = sections.length
      ? sections.map((section) => section.judul || section.teks).filter(Boolean).slice(0, 4)
      : paragraphs.length
        ? paragraphs.slice(0, 3).map((paragraph) => paragraph.length > 105 ? `${paragraph.slice(0, 102).trimEnd()}…` : paragraph)
        : prompts;
    const tone = `reflection-tone-${index % 6}`;
    const icon = icons[index % icons.length];
    return `<article class="reflection-menu-card ${tone}"><span class="reflection-menu-watermark" aria-hidden="true">${archiveIcon(icon, 'reflection-watermark-svg')}</span><span class="reflection-menu-icon" aria-hidden="true">${archiveIcon(icon, 'archive-svg-icon')}</span><div class="reflection-menu-copy"><h3>${esc(title)}</h3><p>${esc(excerpt)}</p></div><div class="reflection-menu-paper"><p>${hasContent ? 'Pokok refleksi' : 'Kerangka refleksi'}</p><ul>${points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul></div><a class="reflection-menu-link" href="#${id}">Baca refleksi <span aria-hidden="true">↗</span></a></article>`;
  }).join('');
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
      <div class="about-journey" data-portfolio-animations="journey" aria-label="Animasi jejak perjalanan PPG"></div>
      <div class="identity-direction-grid" aria-label="Visi dan misi sebagai calon guru Informatika">
        <article class="identity-direction-card identity-direction-card--vision"><p class="identity-direction-kicker">ARAH PENGEMBANGAN DIRI</p><h3>Visi</h3><p>${esc(profile.visi || '')}</p></article>
        <article class="identity-direction-card identity-direction-card--mission"><p class="identity-direction-kicker">LANGKAH YANG DIUPAYAKAN</p><h3>Misi</h3><ol>${(profile.misi || []).map((mission) => `<li>${esc(mission)}</li>`).join('')}</ol></article>
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

    <section class="mas-section mas-course-reflections" id="refleksi-mata-kuliah" aria-labelledby="course-reflections-title">
      <div class="mas-section-head"><div><p class="eyebrow">05 / REFLEKSI MATA KULIAH</p><h2 id="course-reflections-title">Setiap mata kuliah memberi perspektif baru.</h2><p class="mas-lead">Pilih mata kuliah untuk membaca refleksi, atau buka daftar lengkap per semester.</p></div><span class="mas-index">${P.semester.reduce((total, semester) => total + semester.mataKuliah.length, 0)} REFLEKSI</span></div>
      <div class="course-reflection-grid">${reflectionSemesterCards()}</div>
    </section>

    <section class="mas-section mas-reflection" id="refleksi" aria-labelledby="reflection-title">
      <div class="mas-section-head"><div><p class="eyebrow">06 / REFLEKSI PROFESIONAL</p><h2 id="reflection-title">Pengalaman menjadi arah bertumbuh.</h2><p class="mas-lead">Catatan tentang filosofi, praktik, dan rencana pengembangan diri.</p></div><span class="mas-index">REFLEKSI</span></div>
      <div class="reflection-menu-grid">${reflectionCards()}</div>
    </section>

    <section class="mas-section learning-closing" id="penutup-ppg" aria-labelledby="learning-closing-title">
      <div class="learning-closing-copy">
        <p class="eyebrow">07 / PENUTUP · PERJALANAN PPG 2026</p>
        <h2 id="learning-closing-title">Dari kode, tumbuh menjadi pendidik.</h2>
        <p class="learning-closing-lead">Berangkat dari Teknik Informatika murni, perjalanan PPG mengenalkanku pada pedagogik, praktik di sekolah, dan cara baru merancang pembelajaran yang berpihak pada peserta didik.</p>
        <div class="learning-closing-actions"><a class="learning-closing-button" href="#karya">Telusuri karya <span aria-hidden="true">↗</span></a><a class="learning-closing-link" href="#refleksi">Baca refleksi <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="learning-emblem" data-learning-emblem aria-hidden="true">
        <svg class="learning-emblem-svg" viewBox="0 0 400 400" role="presentation" focusable="false">
          <defs>
            <radialGradient id="learning-aura" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#ffffff"/><stop offset=".68" stop-color="#e8f5ff"/><stop offset="1" stop-color="#c7e5f6"/></radialGradient>
            <linearGradient id="learning-core" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#12395c"/><stop offset="1" stop-color="#1c72a2"/></linearGradient>
            <linearGradient id="learning-page" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#d8efff"/></linearGradient>
            <linearGradient id="learning-route" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#74c5ec"/><stop offset="1" stop-color="#70e0bd"/></linearGradient>
            <filter id="learning-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="15" stdDeviation="13" flood-color="#102d46" flood-opacity=".22"/></filter>
            <path id="learning-orbit-path" d="M200 200m-174 0a174 174 0 1 1 348 0a174 174 0 1 1-348 0"/>
          </defs>
          <circle class="learning-aura" cx="200" cy="200" r="156" fill="url(#learning-aura)"/>
          <circle class="learning-ring learning-ring--outer" cx="200" cy="200" r="158"/>
          <circle class="learning-ring learning-ring--inner" cx="200" cy="200" r="132"/>
          <g class="learning-orbit-copy"><text textLength="1088" lengthAdjust="spacing"><textPath href="#learning-orbit-path">INFORMATIKA ✦ PEDAGOGIK ✦ PRAKTIK ✦ REFLEKSI ✦ INFORMATIKA ✦ PEDAGOGIK ✦ PRAKTIK ✦ REFLEKSI ✦</textPath></text></g>
          <g class="learning-book" filter="url(#learning-shadow)">
            <circle class="learning-disc" cx="200" cy="200" r="91" fill="url(#learning-core)"/>
            <circle class="learning-disc-line" cx="200" cy="200" r="91"/>
            <path class="learning-book-page learning-book-page--left" d="M200 234c-22-15-47-20-73-15v-65c27-5 51 0 73 16z"/>
            <path class="learning-book-page learning-book-page--right" d="M200 170c22-16 46-21 73-16v65c-26-5-51 0-73 15z"/>
            <path class="learning-book-line" d="M200 171v63M140 176c17-2 34 1 48 8M140 190c17-2 34 1 48 8M212 184c14-7 31-10 48-8M212 198c14-7 31-10 48-8"/>
            <path class="learning-route-line" d="M145 216c17-13 34 8 51-1s30-11 43-2 18-6 28-12"/>
            <circle class="learning-route-node learning-route-node--one" cx="146" cy="215" r="4.5"/><circle class="learning-route-node learning-route-node--two" cx="200" cy="215" r="4.5"/><circle class="learning-route-node learning-route-node--three" cx="267" cy="201" r="4.5"/>
            <text class="learning-code-mark" x="200" y="145" text-anchor="middle">&lt;/&gt;</text>
          </g>
          <circle class="learning-spark learning-spark--one" cx="84" cy="170" r="4"/><circle class="learning-spark learning-spark--two" cx="317" cy="237" r="5"/><circle class="learning-spark learning-spark--three" cx="255" cy="86" r="3"/>
        </svg>
      </div>
      <p class="learning-closing-foot">Belajar · Mengajar · Bertumbuh</p>
    </section>
  </div>`;
}
function empty(title, description) { return `<div class="empty"><span class="empty-icon">▤</span><h2>${title}</h2><p>${description}</p><span class="pill">MENUNGGU MATERI</span></div>`; }
let learningEmblemObserver;
function observeLearningEmblem() {
  learningEmblemObserver?.disconnect();
  const emblem = document.querySelector('[data-learning-emblem]');
  if (!emblem) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    emblem.classList.add('is-visible');
    return;
  }
  learningEmblemObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      emblem.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  learningEmblemObserver.observe(emblem);
}
document.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  const emblem = event.target.closest?.('[data-learning-emblem]');
  if (!emblem) return;
  const rect = emblem.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
  const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)));
  emblem.style.setProperty('--learning-tilt-x', `${(-y * 7).toFixed(2)}deg`);
  emblem.style.setProperty('--learning-tilt-y', `${(x * 7).toFixed(2)}deg`);
});
document.addEventListener('pointerout', (event) => {
  const emblem = event.target.closest?.('[data-learning-emblem]');
  if (!emblem || event.relatedTarget?.closest?.('[data-learning-emblem]') === emblem) return;
  emblem.style.removeProperty('--learning-tilt-x');
  emblem.style.removeProperty('--learning-tilt-y');
});
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
  if (id === 'beranda') { main.innerHTML = home(); observeLearningEmblem(); }
  else if (!page) main.innerHTML = '<section class="section"><h1>Halaman tidak ditemukan</h1><a class="button" href="#beranda">Kembali ke beranda</a></section>';
  else {
    const content = P.isi[id] || {};
    let body = '';
    if (page.kind === 'index') {
      body = archiveCardsForSemester(page.semester);
    } else if (page.kind === 'reflection-index') {
      const items = page.semester.mataKuliah;
      body = '<div class="tiles">' + items.map((title, index) => tile(`refleksi-s${page.semester.nomor}-${slug(title)}`, title, 'Refleksi pengalaman belajar', page.semester.nomor, index, page.kind)).join('') + '</div>';
    } else if (page.kind === 'artifact') {
      body = '<div class="artifact-list">' + ((content.artefak || []).map((artifact) => '<article class="artifact"><p class="eyebrow">' + esc(artifact.jenis || 'DOKUMEN') + (artifact.siklus ? ' / SIKLUS ' + esc(artifact.siklus) : '') + '</p><h2>' + esc(artifact.judul) + '</h2><p>' + esc(artifact.deskripsi || '') + '</p>' + (artifact.url && safe(artifact.url) ? '<a class="button" data-preview-artifact data-artifact-title="' + esc(artifact.judul) + '" href="' + esc(safe(artifact.url)) + '">Lihat artefak ↗</a>' : '<span class="pill">Berkas belum ditambahkan</span>') + '<div class="analysis">' + [['konteks', 'Konteks pembelajaran'], ['tujuan', 'Tujuan'], ['kelebihan', 'Kelebihan'], ['kekurangan', 'Kekurangan & perbaikan'], ['teori', 'Keterkaitan teori mata kuliah']].map(([key, label]) => '<div><h3>' + label + '</h3><p>' + esc(artifact[key] || 'Analisis belum ditambahkan.') + '</p></div>').join('') + '</div></article>').join('') || empty('Artefak belum ditambahkan.', 'Dokumen, foto, dan tautan video dapat ditampilkan di sini beserta analisisnya.')) + '</div>';
    } else {
      body = '<article class="reading">' + ((content.paragraf || []).map((paragraph) => '<p>' + esc(paragraph) + '</p>').join('') || empty('Refleksi belum ditambahkan.', 'Catatan pengalaman, kekuatan, tantangan, dan rencana perbaikan dapat ditampilkan di sini.')) + (content.bagian || []).map((section) => '<h2>' + esc(section.judul) + '</h2><p>' + esc(section.teks) + '</p>').join('') + '</article>';
    }
    const backId = page.semester ? (page.kind === 'artifact' ? `artefak-s${page.semester.nomor}` : page.kind === 'reflection' ? `refleksi-s${page.semester.nomor}` : 'beranda') : 'beranda';
    const isSemesterIndex = Boolean(page.semester && (page.kind === 'index' || page.kind === 'reflection-index'));
    const isCourseReflection = Boolean(page.kind === 'reflection' && page.semester);
    const courseReflectionIndex = isCourseReflection ? page.semester.mataKuliah.indexOf(page.title) : -1;
    const courseReflectionTone = reflectionTonePalette[(courseReflectionIndex < 0 ? 0 : courseReflectionIndex) % reflectionTonePalette.length];
    const pageHeadClass = isSemesterIndex
      ? `page-head page-head--semester page-head--s${page.semester.nomor}`
      : isCourseReflection
        ? `page-head page-head--course reflection-tone-${courseReflectionTone}`
        : 'page-head';
    const pageContentClass = isSemesterIndex ? `section page-content--semester-${page.kind === 'index' ? 'artifacts' : 'reflections'} page-content--s${page.semester.nomor}` : 'section';
    const pageDescription = page.kind === 'artifact'
      ? 'Bukti pembelajaran dan analisis pengalaman praktik.'
      : page.kind === 'index'
        ? 'Pilih kategori untuk menelusuri dan melengkapi artefak pembelajaran pada semester ini.'
      : page.kind === 'reflection-index'
        ? 'Refleksi mata kuliah yang mendukung perjalanan menjadi guru Informatika.'
        : 'Dokumentasi perjalanan belajar menuju guru profesional.';
    const courseReflectionIcon = isCourseReflection ? archiveIcon(reflectionIconFor(page.title), 'archive-svg-icon') : '';
    const courseReflectionTop = isCourseReflection
      ? '<div class="page-head-course-top"><span class="page-head-course-icon" aria-hidden="true">' + courseReflectionIcon + '</span><span class="page-head-course-label">REFLEKSI MATA KULIAH · SEMESTER 0' + page.semester.nomor + '</span><span class="page-head-course-arrow" aria-hidden="true">↘</span></div>'
      : '';
    const courseReflectionWatermark = isCourseReflection ? '<span class="page-head-course-watermark" aria-hidden="true">' + courseReflectionIcon + '</span>' : '';
    main.innerHTML = '<a class="back-button" href="#' + backId + '"><span class="back-arrow" aria-hidden="true">←</span><span class="back-label">Kembali</span><span class="back-context">ke ' + esc(pages.get(backId)?.title || 'Beranda') + '</span></a><section class="' + pageHeadClass + '">' + courseReflectionTop + courseReflectionWatermark + '<a href="#beranda" class="breadcrumb">Beranda / ' + (page.semester ? 'Semester ' + page.semester.nomor : 'Pengembangan diri') + '</a><p class="eyebrow">' + (page.semester ? esc(page.semester.sekolah) : 'REFLEKSI PROFESIONAL') + '</p><h1>' + esc(page.title) + '</h1><p>' + pageDescription + '</p></section><section class="' + pageContentClass + '">' + body + '</section>';
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
  const previewLink = event.target.closest('[data-preview-artifact]');
  if (previewLink) {
    event.preventDefault();
    openArtifactPreview(previewLink);
    return;
  }
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
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-preview-close]')) closeArtifactPreview();
});
document.addEventListener('keydown', (event) => {
  const modal = document.querySelector('#artifactPreview');
  if (!modal || modal.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeArtifactPreview();
    return;
  }
  if (event.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), iframe')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('hashchange', navigatePage);
document.querySelector('#year').textContent = new Date().getFullYear();
initLanding();
render();
