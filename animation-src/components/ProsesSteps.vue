<script setup lang="ts">
import { computed } from 'vue';
import { useFilmClock } from '../film-clock';
import { prosesEnd, prosesFrame, prosesStill } from '../proses-film';

// Tahapan penelusuran portofolio sebagai empat kartu yang makin jelas. Tiap kartu
// dibuka angka besar dan ditutup bidang hasil. Kartu muncul bergantian, dihitung
// prosesFrame dari satu jam yang mulai saat daftarnya terlihat dan diputar sekali.
const props = defineProps<{ steps: readonly { name: string; text: string; result: string }[] }>();

const count = props.steps.length;
const { time } = useFilmClock({ duration: prosesEnd(count), still: prosesStill(count), chapters: [], loop: false });
const frame = computed(() => prosesFrame(time.value, count));
</script>

<template>
  <ol ref="film" class="proses">
    <li
      v-for="(step, index) in steps"
      :key="step.name"
      class="proses-step"
      :style="{ opacity: frame.steps[index]!.ink, filter: `blur(${frame.steps[index]!.blur}px)`, transform: `translateY(${frame.steps[index]!.rise}px)` }"
    >
      <div class="proses-body">
        <span class="proses-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <h4>{{ step.name }}</h4>
        <p class="proses-text">{{ step.text }}</p>
      </div>
      <p class="proses-result"><span>Di dalamnya</span>{{ step.result }}</p>
    </li>
  </ol>
</template>

<style scoped>
/* Langkah kerja sebagai jalur bertahap: warna kartu bergerak dari terang ke navy. */
.proses { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 28px; }
.proses-step {
  --step-bg: var(--heat-1);
  --step-ink: var(--ink-on-light);
  position: relative;
  /* Subgrid menyejajarkan garis sobekan di keempat kartu walau panjang teksnya berbeda. */
  display: grid;
  grid-row: span 2;
  grid-template-rows: subgrid;
  row-gap: 0;
  overflow: hidden;
  border-radius: 22px;
  background: var(--step-bg);
  color: var(--step-ink);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.18) inset, 0 26px 40px -28px color-mix(in srgb, var(--card-shadow) 80%, transparent);
  transition: box-shadow 0.3s ease;
}
.proses-step:nth-child(2) { --step-bg: var(--heat-2); }
.proses-step:nth-child(3) { --step-bg: var(--heat-3); --step-ink: var(--ink-on-dark); }
.proses-step:nth-child(4) { --step-bg: var(--heat-4); --step-ink: var(--ink-on-dark); }
.proses-step:hover { box-shadow: 0 1px 0 rgb(255 255 255 / 0.18) inset, 0 34px 48px -26px color-mix(in srgb, var(--card-shadow) 95%, transparent); }
.proses-body { padding: 26px 24px 28px; }
.proses-number { display: block; margin: 0 0 22px -0.04em; font-size: 72px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.06em; line-height: 0.8; }
.proses-step h4 { font-size: 22px; font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; }
.proses-text { margin-top: 10px; font-size: 15px; line-height: 1.55; opacity: 0.82; }
/* Hasil tiap langkah sebagai sobekan tiket: kertas terang dengan garis lubang dan dua takik di tepinya. */
.proses-result {
  position: relative;
  padding: 18px 24px 22px;
  border-top: 2px dashed color-mix(in srgb, var(--fg) 22%, transparent);
  background: var(--paper);
  color: var(--fg);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
}
.proses-result::before,
.proses-result::after { content: ''; position: absolute; top: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--bg); }
.proses-result::before { left: -10px; }
.proses-result::after { right: -10px; }
.proses-result span { display: block; margin-bottom: 4px; color: var(--muted); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }

@media (max-width: 900px) {
  .proses { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .proses { grid-template-columns: 1fr; }
  .proses-number { margin-bottom: 16px; font-size: 56px; }
}
</style>
