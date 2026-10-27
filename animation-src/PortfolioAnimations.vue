<script setup lang="ts">
import JadwalFilm from './components/JadwalFilm.vue';
import KavlingFilm from './components/KavlingFilm.vue';
import MesinFilm from './components/MesinFilm.vue';
import PapanFilm from './components/PapanFilm.vue';
import ProsesSteps from './components/ProsesSteps.vue';
import PerjalananFilm from './components/PerjalananFilm.vue';

const props = withDefaults(defineProps<{ mode?: 'featured' | 'hero' | 'supporting' }>(), { mode: 'supporting' });

const projectQueue = [
  {
    field: { id: 'semester-1', name: 'Semester 1 · Kelompok' },
    work: { brand: 'JURNAL', name: 'JurnalKita', detail: 'Karya kelompok untuk artikel Semester 1 di SMA Negeri 15 Surabaya.' },
    number: 1,
  },
  {
    field: { id: 'semester-2', name: 'Semester 2 · Kelompok' },
    work: { brand: 'SIGAP', name: 'SIGAP', detail: 'Proyek kepemimpinan kelompok pada praktik di SMP Negeri 60 Surabaya.' },
    number: 2,
  },
  {
    field: { id: 'inovasi', name: 'Inovasi · Individu' },
    work: { brand: 'RUANG', name: 'Ruang Belajar', detail: 'Karya inovasi pembelajaran Informatika yang dikembangkan secara pribadi.' },
    number: 3,
  },
];

const readingSteps = [
  { name: 'Kenali konteks', text: 'Mulai dari profil dan sekolah tempat PPL berlangsung.', result: 'Profil dan perjalanan dua semester' },
  { name: 'Telusuri artefak', text: 'Buka perangkat, media, video, dan dokumentasi praktik.', result: 'Bukti pembelajaran' },
  { name: 'Baca analisis', text: 'Pahami tujuan, kelebihan, tantangan, dan kaitan teori.', result: 'Analisis setiap artefak' },
  { name: 'Temukan refleksi', text: 'Ikuti catatan pengalaman dan arah pengembangan diri.', result: 'Refleksi profesional' },
];

</script>

<template>
  <div class="ppg-motion-kit" :class="{ 'ppg-motion-kit--hero': props.mode === 'hero' }">
    <section v-if="props.mode === 'featured'" class="schedule-feature" aria-labelledby="schedule-feature-title">
      <div class="schedule-copy">
        <p class="eyebrow">PREVIEW PROYEK · PENJADWALAN SEKOLAH</p>
        <h2 id="schedule-feature-title">Jadwal mengajar yang menyusun dirinya sendiri.</h2>
        <p class="schedule-problem-label">Masalahnya</p>
        <p class="schedule-problem">Menyusun jadwal guru dengan tangan berarti berhari-hari menghindari bentrok, jam kosong guru, dan mapel yang harus dua jam berurutan.</p>
        <p class="schedule-built-label">Alur yang divisualisasikan</p>
        <p>Preview interaktif ini menunjukkan bagaimana penjadwalan membaca aturan, menempatkan setiap mapel, menghindari bentrok, dan menjelaskan jika jadwal tidak mungkin disusun.</p>
        <p class="schedule-footnote">Jadwal dan nama guru di animasi ini adalah ilustrasi, bukan data aktual sekolah.</p>
      </div>
      <JadwalFilm />
    </section>

    <section v-else-if="props.mode === 'hero'" class="hero-project-showcase" aria-label="Animasi karya PPG">
      <PapanFilm :queue="projectQueue" />
    </section>

    <template v-else>
    <div class="motion-panels">
      <section class="motion-panel process-panel" aria-labelledby="reading-path-title">
        <div class="motion-panel-head">
          <p class="eyebrow">ALUR PENELUSURAN · TAHAP BERURUTAN</p>
          <h3 id="reading-path-title">Ikuti proses di balik pembelajaran.</h3>
          <p>Empat tahap ini membantu dosen menelusuri konteks, bukti, analisis, lalu refleksi.</p>
        </div>
        <ProsesSteps :steps="readingSteps" />
      </section>
    </div>

    <div class="source-motion-list">
      <section class="motion-panel" aria-labelledby="system-flow-title">
        <div class="motion-panel-head">
          <p class="eyebrow">SIMULASI KONSEP INFORMATIKA</p>
          <h3 id="system-flow-title">Alur digital tetap berjalan.</h3>
          <p>Visualisasi konsep ketahanan sistem: sesi berpindah saat satu simpul mengalami gangguan. Ini ilustrasi pembelajaran, bukan klaim tentang fitur JurnalKita atau SIGAP.</p>
        </div>
        <MesinFilm />
      </section>

      <section class="motion-panel" aria-labelledby="artifact-map-title">
        <div class="motion-panel-head">
          <p class="eyebrow">PETA KARYA · SIMULASI</p>
          <h3 id="artifact-map-title">Pilih karya untuk melihat alurnya.</h3>
          <p>Peta interaktif ini menggambarkan cara menelusuri karya dan bukti. Status yang muncul hanya visual contoh, bukan status pengumpulan artefakmu.</p>
        </div>
        <KavlingFilm />
      </section>

      <section class="motion-panel" aria-labelledby="semester-journey-title">
        <div class="motion-panel-head">
          <p class="eyebrow">CERITA PERJALANAN · DARI TEKNIK KE PEDAGOGIK</p>
          <h3 id="semester-journey-title">Dari Informatika murni menuju guru Informatika.</h3>
          <p>Sebelum PPG, pedagogik adalah hal baru bagiku. Pilih satu tahap untuk menelusuri bagaimana kuliah, praktik di sekolah, dan karya memperluas cara pandangku tentang mengajar.</p>
        </div>
        <PerjalananFilm />
      </section>
    </div>
    </template>
  </div>
</template>

<style scoped>
.ppg-motion-kit {
  --fg: var(--text);
  --line: var(--border);
  --paper: var(--surface);
  --signal-wait: var(--accent);
  --signal-ok: #278766;
  --heat-1: #e6f3fb;
  --heat-2: #c8e4f5;
  --heat-3: #438dbb;
  --heat-4: #143b5d;
  --ink-on-light: #12324d;
  --ink-on-dark: #f2f9fe;
  --card-shadow: rgba(13, 47, 77, .22);
  display: grid;
  gap: 18px;
  color: var(--text);
}
.ppg-motion-kit--hero {
  --tone-semester-1: #2187c5;
  --tone-semester-2: #75bce5;
  --tone-inovasi: #62b897;
  display: block;
  width: 100%;
  height: 100%;
}
.hero-project-showcase,
.hero-project-showcase :deep(.papan) { width: 100%; }
.hero-project-showcase { height: 100%; min-width: 0; }
:root[data-theme="dark"] .ppg-motion-kit {
  --signal-ok: #7ce0b7;
  --heat-1: #d9edf9;
  --heat-2: #a8d2ed;
  --heat-3: #28668e;
  --heat-4: #15344e;
  --ink-on-light: #12324d;
  --ink-on-dark: #eef7ff;
  --card-shadow: rgba(0, 0, 0, .38);
}
.schedule-feature { margin-top: 0; }
.schedule-feature h2 { max-width: 11ch; margin: 0 0 34px; font-size: clamp(36px, 4.6vw, 64px); font-weight: 750; line-height: .99; letter-spacing: -.065em; }
.schedule-problem-label, .schedule-built-label { display: flex; align-items: center; gap: 14px; margin: 24px 0 8px; color: var(--text); font-size: 13px; font-weight: 750; }
.schedule-problem-label::after, .schedule-built-label::after { width: 72px; height: 1px; background: var(--border); content: ''; }
.schedule-problem { margin: 0; color: var(--text); font-size: clamp(18px, 2vw, 26px); font-weight: 550; line-height: 1.5; letter-spacing: -.025em; }
.schedule-copy > p:not(.eyebrow):not(.schedule-footnote):not(.schedule-problem-label):not(.schedule-built-label) { color: var(--muted); font-size: clamp(14px, 1.5vw, 19px); line-height: 1.75; }
.schedule-feature > .film { min-width: 0; }
.schedule-footnote { margin: 13px 0 0; color: var(--muted); font-size: 9px; line-height: 1.6; }
.motion-panels { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
.source-motion-list { display: grid; gap: 18px; }
.motion-panel {
  min-width: 0;
  padding: clamp(18px, 2.6vw, 28px);
  overflow: hidden;
  border: 1px solid var(--glass-line);
  border-radius: 20px;
  background: linear-gradient(145deg, var(--glass-strong), var(--glass));
  box-shadow: var(--glass-shadow);
}
.motion-panel-head { margin-bottom: 24px; }
.motion-panel-head .eyebrow { margin: 0 0 10px; color: var(--accent); font-size: 9px; font-weight: 800; letter-spacing: .13em; }
.motion-panel-head h3 { margin: 0 0 8px; font-size: clamp(20px, 2.1vw, 28px); font-weight: 700; letter-spacing: -.05em; line-height: 1.14; }
.motion-panel-head > p:last-child { max-width: 440px; margin: 0; color: var(--muted); font-size: 11px; line-height: 1.7; }
.process-panel .proses { margin-top: 8px; }
.source-motion-list > .motion-panel {
  display: grid;
  grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
  align-items: center;
  column-gap: clamp(28px, 4vw, 56px);
  width: 100%;
  max-width: 1320px;
  margin-inline: auto;
}
.source-motion-list > .motion-panel > .motion-panel-head {
  grid-column: 2;
  grid-row: 1;
  margin: 0;
}
.source-motion-list > .motion-panel > .film,
.source-motion-list > .motion-panel > .journey-film {
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
  width: min(100%, 560px);
  margin: 0;
}
.source-motion-list > .motion-panel > .motion-panel-head h3 { max-width: 18ch; }
.source-motion-list > .motion-panel > .motion-panel-head > p:last-child { max-width: 46ch; font-size: 12px; }
@media (max-width: 1050px) {
  .motion-panels { grid-template-columns: 1fr; }
}
@media (max-width: 1100px) {
  .source-motion-list > .motion-panel {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 20px;
  }
  .source-motion-list > .motion-panel > .motion-panel-head,
  .source-motion-list > .motion-panel > .film,
  .source-motion-list > .motion-panel > .journey-film {
    grid-column: 1;
    grid-row: auto;
  }
}
@media (max-width: 760px) {
  .motion-panels { gap: 12px; }
  .source-motion-list { gap: 12px; }
  .motion-panel { padding: 18px 15px; border-radius: 16px; }
  .motion-panel-head { margin-bottom: 18px; }
  .source-motion-list > .motion-panel { row-gap: 18px; }
  .source-motion-list > .motion-panel > .motion-panel-head { margin: 0; }
  .schedule-feature { padding: 19px 15px; }
  .schedule-feature h2 { max-width: 17ch; margin-bottom: 20px; font-size: clamp(34px, 10vw, 48px); }
  .schedule-problem { font-size: 18px; }
}
</style>
