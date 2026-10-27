<script setup lang="ts">
import { computed } from 'vue';
import { useFilmClock } from '../film-clock';
import { papanCycle, papanFrame, papanStill } from '../papan-film';

// Papan karya di portofolio: papan tanpa bingkai yang menempel di halaman. papanFrame menghitung tampilannya dari
// jam film; papan berhenti saat disorot penunjuk.
const props = defineProps<{
  queue: readonly { field: { id: string; name: string }; work: { brand?: string; name: string; detail: string }; number: number }[];
}>();

const orders = props.queue.map((entry) => ({ brand: entry.work.brand ?? '', detail: entry.work.detail }));
const { time, playing, reduced } = useFilmClock({ duration: papanCycle * props.queue.length, still: papanStill, chapters: [] });
const frame = computed(() => papanFrame(time.value, orders));
const entry = computed(() => props.queue[frame.value.featured.index]!);
const pad = (value: number) => String(value).padStart(2, '0');
function hold(stop: boolean): void {
  if (!reduced.value) playing.value = !stop;
}
</script>

<template>
  <figure ref="film" class="papan" aria-hidden="true" @pointerenter="hold(true)" @pointerleave="hold(false)">
    <div class="papan-head">
      <span>Papan karya</span>
      <span class="papan-count"><b>{{ pad(entry.number) }}</b> / {{ pad(queue.length) }}</span>
    </div>
    <div class="papan-queue">
      <i v-for="(fill, at) in frame.queue" :key="at" :class="{ 'is-current': at === frame.current && frame.status === 'diracik' }"><b :style="{ transform: `scaleX(${fill})` }" /></i>
    </div>

    <div
      class="papan-order"
      :data-brand="entry.work.brand"
      :style="{ opacity: frame.featured.opacity, filter: frame.featured.blur ? `blur(${frame.featured.blur}px)` : undefined, transform: `translateY(${frame.featured.lift}em)` }"
    >
      <p class="papan-meta" :style="{ opacity: frame.featured.meta }">
        <span class="papan-field"><i :style="{ background: `var(--tone-${entry.field.id})` }" />{{ entry.field.name }}</span>
        <span :class="['papan-lamp', `is-${frame.featured.status}`]">{{ frame.featured.status === 'tersaji' ? 'Tersaji' : 'Disusun' }}</span>
      </p>
      <p class="papan-brand">
        <template v-if="frame.featured.settled">{{ entry.work.brand }}</template>
        <template v-else>
          <span
            v-for="(glyph, column) in frame.featured.glyphs"
            :key="column"
            :class="['ch', { 'is-rolling': glyph.reel.length > 1 }]"
            :style="{ opacity: glyph.opacity, filter: glyph.blur ? `blur(${glyph.blur}em)` : undefined }"
            ><span class="ch-final">{{ glyph.char }}</span
            ><span v-if="glyph.reel.length > 1" class="ch-reel" :style="{ transform: `translateY(${-glyph.offset * 1.1}em)` }"
              ><span v-for="(char, step) in glyph.reel" :key="step">{{ char }}</span></span
            ></span
          >
        </template>
      </p>
      <p class="papan-name" :style="{ opacity: frame.featured.name }">{{ entry.work.name }}</p>
      <p class="papan-detail">
        <template v-for="(word, at) in frame.featured.words" :key="at"
          ><span :style="{ opacity: word.opacity, filter: word.blur ? `blur(${word.blur}px)` : undefined, transform: `translateY(${word.y}em)` }">{{ word.text }}</span
          >{{ ' ' }}</template
        >
      </p>
    </div>

    <p class="papan-label">Sebelumnya</p>
    <ol class="papan-history">
      <li
        v-for="line in frame.history"
        :key="line.order"
        class="papan-row"
        :data-brand="queue[line.index]!.work.brand"
        :style="{ top: `calc(var(--row) * ${line.slot})`, opacity: line.opacity }"
      >
        <span class="papan-row-no">{{ pad(queue[line.index]!.number) }}</span>
        <span class="papan-row-brand">{{ queue[line.index]!.work.brand }}</span>
        <span class="papan-row-name">{{ queue[line.index]!.work.name }}</span>
        <svg viewBox="0 0 16 16" class="papan-row-done"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </li>
    </ol>
  </figure>
</template>

<style scoped>
/* Papan karya tanpa bingkai: memakai warna halaman sehingga ikut mode terang dan gelap. Letak, putaran huruf,
   dan isian antrean dihitung papanFrame dari jam film; tidak ada transisi CSS. */
.papan { margin: 0; container-type: inline-size; color: var(--fg); }
.papan-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.papan-count { font-variant-numeric: tabular-nums; letter-spacing: 0.08em; }
.papan-count b { color: var(--fg); }
/* Strip antrean: satu ruas per pesanan bernama. */
.papan-queue { display: flex; gap: 3px; margin-top: 12px; }
.papan-queue i { flex: 1; height: 3px; overflow: hidden; border-radius: 2px; background: var(--line); }
.papan-queue b { display: block; height: 100%; background: var(--fg); transform-origin: left; }
.papan-queue i.is-current b { background: var(--signal-wait); }

.papan-order { margin-top: clamp(28px, 5cqi, 40px); }
.papan-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
}
.papan-field { display: inline-flex; align-items: center; gap: 8px; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.papan-field i { flex: none; width: 8px; height: 8px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.14); }
.papan-lamp { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; }
.papan-lamp::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 16%, transparent); }
.papan-lamp.is-diracik { color: var(--signal-wait); }
.papan-lamp.is-tersaji { color: var(--signal-ok); }
.papan-brand {
  margin-top: 14px;
  overflow: hidden;
  font-size: clamp(2.1rem, 9.4cqi, 4rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.1;
  white-space: pre;
}
.papan-name { margin-top: 10px; font-size: clamp(1rem, 3.4cqi, 1.15rem); font-weight: 700; letter-spacing: -0.01em; }
.papan-detail {
  display: -webkit-box;
  min-height: calc(1.55em * 3);
  margin-top: 6px;
  overflow: hidden;
  color: var(--muted);
  font-size: clamp(0.9rem, 3cqi, 1rem);
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.papan-detail span { display: inline-block; }
/* Di layar sempit kalimatnya lebih panjang ke bawah; ruangnya tetap agar papan tidak naik-turun. */
@container (max-width: 420px) {
  .papan-meta { letter-spacing: 0.1em; }
  .papan-detail { min-height: calc(1.55em * 4); -webkit-line-clamp: 4; }
}

/* Satu huruf yang sedang berputar: lebar mengikuti huruf tujuannya, gulungan di atasnya terpotong setinggi satu baris. */
.ch { position: relative; display: inline-block; height: 1.1em; overflow-x: visible; overflow-y: clip; vertical-align: top; white-space: pre; }
.ch.is-rolling .ch-final { visibility: hidden; }
.ch-reel { position: absolute; top: 0; left: 50%; display: flex; flex-direction: column; translate: -50% 0; }
.ch-reel span { display: block; height: 1.1em; text-align: center; }

.papan-label {
  margin-top: clamp(22px, 4cqi, 30px);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
/* Daftar "Sebelumnya": kolom tetap sehingga nomor, nama produk, dan nama sistem lurus di setiap baris. */
.papan-history {
  --row: 3.1rem;
  position: relative;
  height: calc(var(--row) * 3);
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent);
  mask-image: linear-gradient(to bottom, #000 55%, transparent);
}
.papan-row {
  position: absolute;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 2.25rem auto minmax(0, 1fr) auto;
  column-gap: 14px;
  align-items: center;
  height: var(--row);
  border-bottom: 1px solid var(--line);
}
.papan-row-no { color: var(--muted); font-size: 0.85rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.papan-row-brand { font-size: 1.05rem; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
.papan-row-name { overflow: hidden; color: var(--muted); font-size: 0.88rem; white-space: nowrap; text-overflow: ellipsis; }
.papan-row-done { width: 16px; height: 16px; color: var(--signal-ok); }
</style>
