<script setup lang="ts">
import type { CaptionFrame } from '../motion';
import type { FilmFormat } from '../film-clock';

// Bingkai film bersama: gambar SVG dari film masing-masing, papan keterangan di atas, dan teks bawah.
// Satuan --u adalah satu titik komposisi, jadi teks di atas film ikut mengecil bersama gambarnya.
export interface FilmChip {
  text: string;
  color: string;
  /** dot: titik bercahaya di depan teks; pill: kapsul berwarna; plain: teks redup saja. */
  kind: 'dot' | 'pill' | 'plain';
  /** Disembunyikan di layar tegak agar papan keterangan tidak berdesakan. */
  wideOnly?: boolean;
}

defineProps<{
  width: number;
  height: number;
  format: FilmFormat;
  title: string;
  subtitle: string;
  chips: readonly FilmChip[];
  caption: CaptionFrame | null;
}>();
</script>

<template>
  <div :class="['film-frame', `film-frame--${format}`]" :style="{ aspectRatio: `${width} / ${height}`, '--u': `calc(100cqw / ${width})` }">
    <slot />
    <div class="film-hud" aria-hidden="true">
      <p class="film-title">
        <strong>{{ title }}</strong>
        <span>{{ subtitle }}</span>
      </p>
      <p class="film-meta">
        <span
          v-for="chip in chips"
          :key="chip.text"
          :class="[`film-chip-${chip.kind}`, { 'film-chip-wide': chip.wideOnly }]"
          :style="{ color: chip.color }"
        ><i v-if="chip.kind === 'dot'" />{{ chip.text }}</span>
      </p>
    </div>
    <p v-if="caption" class="film-caption" aria-hidden="true">
      <i :style="{ background: caption.tone }" />
      <span>
        <template v-for="(word, index) in caption.words" :key="index">
          <span class="film-word" :style="{ opacity: word.opacity, transform: `translateY(${word.y}em)` }">{{ word.text }}</span>{{ ' ' }}
        </template>
      </span>
    </p>
  </div>
</template>

<style scoped>
/* Layar film selalu gelap seperti video, di mode terang maupun gelap. */
.film-frame {
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  border-radius: 16px;
  background: #140d09;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.28), 0 30px 60px -38px rgb(0 0 0 / 0.75);
}
.film-hud {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: calc(var(--u) * 12);
  padding: calc(var(--u) * 16) calc(var(--u) * 20);
  color: #f5f0e8;
  font-size: calc(var(--u) * 11.5);
  line-height: 1.35;
  pointer-events: none;
}
.film-title strong { display: block; font-size: calc(var(--u) * 13.5); }
.film-title span { color: #bba791; font-variant-numeric: tabular-nums; }
.film-meta { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: calc(var(--u) * 6) calc(var(--u) * 12); font-weight: 600; font-variant-numeric: tabular-nums; }
.film-chip-dot { display: inline-flex; align-items: center; gap: calc(var(--u) * 6); }
.film-chip-dot i { width: calc(var(--u) * 7); height: calc(var(--u) * 7); border-radius: 50%; background: currentColor; box-shadow: 0 0 calc(var(--u) * 8) currentColor; }
.film-chip-pill { padding: calc(var(--u) * 2) calc(var(--u) * 8); border-radius: 999px; background: color-mix(in srgb, currentColor 16%, transparent); }
.film-frame--tall .film-chip-wide { display: none; }

.film-caption {
  position: absolute;
  inset: auto calc(var(--u) * 22) calc(var(--u) * 18);
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 10);
  color: #f5f0e8;
  font-size: calc(var(--u) * 19);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-wrap: balance;
  pointer-events: none;
}
.film-frame--tall .film-caption { font-size: calc(var(--u) * 20); }
.film-caption > i { flex: none; width: calc(var(--u) * 8); height: calc(var(--u) * 8); border-radius: 50%; transform: translateY(calc(var(--u) * -2)); }
.film-word { display: inline-block; will-change: transform, opacity; }
</style>
