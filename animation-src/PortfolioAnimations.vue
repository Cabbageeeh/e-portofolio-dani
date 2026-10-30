<script setup lang="ts">
import JadwalFilm from './components/JadwalFilm.vue';
import PapanFilm from './components/PapanFilm.vue';
import PerjalananFilm from './components/PerjalananFilm.vue';

const props = withDefaults(defineProps<{ mode?: 'featured' | 'hero' | 'journey' }>(), { mode: 'featured' });

const projectQueue = [
  {
    field: { id: 'semester-1', name: 'Semester 1 · Kelompok' },
    work: { brand: 'JurnalKita', name: 'Jurnal Kelas Digital', detail: 'Karya kelompok untuk artikel Semester 1 di SMA Negeri 15 Surabaya.' },
    number: 1,
  },
  {
    field: { id: 'semester-2', name: 'Semester 2 · Kelompok' },
    work: { brand: 'SIGAP', name: 'Sistem Informasi Sekolah', detail: 'Proyek kepemimpinan kelompok pada praktik di SMP Negeri 60 Surabaya.' },
    number: 2,
  },
  {
    field: { id: 'inovasi', name: 'Inovasi · Individu' },
    work: { brand: 'RuangBelajar', name: 'Ruang Kelas Digital', detail: 'Karya inovasi pembelajaran Informatika yang dikembangkan secara pribadi.' },
    number: 3,
  },
];

</script>

<template>
  <div class="ppg-motion-kit" :class="{ 'ppg-motion-kit--hero': props.mode === 'hero' }">
    <section v-if="props.mode === 'featured'" class="schedule-feature" aria-labelledby="schedule-feature-title">
      <div class="schedule-copy">
        <p class="eyebrow">PREVIEW PROYEK · PENJADWALAN SEKOLAH</p>
        <h2 id="schedule-feature-title">Susun jadwal. Hindari bentrok.</h2>
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

    <section v-else-if="props.mode === 'journey'" class="journey-feature" aria-labelledby="semester-journey-title">
      <div class="motion-panel-head">
        <p class="eyebrow">CERITA PERJALANAN · DARI TEKNIK KE PEDAGOGIK</p>
        <h3 id="semester-journey-title">Dari Informatika murni menuju guru Informatika.</h3>
        <p>Sebelum PPG, pedagogik adalah hal baru bagiku. Pilih satu tahap untuk menelusuri bagaimana kuliah, praktik di sekolah, dan karya memperluas cara pandangku tentang mengajar.</p>
      </div>
      <PerjalananFilm />
    </section>
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
.journey-feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: clamp(18px, 2.5vw, 28px);
  width: 100%;
  max-width: 1440px;
  margin: clamp(30px, 5vw, 64px) auto;
}
.journey-feature > .motion-panel-head { max-width: 820px; margin: 0; }
.journey-feature > .journey-film { width: 100%; margin: 0; }
.journey-feature > .motion-panel-head .eyebrow { margin-bottom: 16px; font-size: 10px; }
.journey-feature > .motion-panel-head h3 { max-width: 18ch; margin: 0 0 12px; font-size: clamp(36px, 4.2vw, 60px); font-weight: 650; letter-spacing: -.065em; line-height: 1.02; }
.journey-feature > .motion-panel-head > p:last-child { max-width: 68ch; margin: 0; color: var(--muted); font-size: clamp(15px, 1.3vw, 18px); line-height: 1.8; }
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
@media (max-width: 1100px) { .journey-feature { row-gap: 20px; } }
@media (max-width: 760px) {
  .journey-feature { row-gap: 18px; margin-block: 36px; }
  .journey-feature > .motion-panel-head .eyebrow { margin-bottom: 10px; }
  .journey-feature > .motion-panel-head h3 { max-width: 16ch; font-size: clamp(30px, 8vw, 42px); }
  .journey-feature > .motion-panel-head > p:last-child { font-size: 14px; }
  .schedule-feature { padding: 19px 15px; }
  .schedule-feature h2 { max-width: 17ch; margin-bottom: 20px; font-size: clamp(34px, 10vw, 48px); }
  .schedule-problem { font-size: 18px; }
}
</style>
