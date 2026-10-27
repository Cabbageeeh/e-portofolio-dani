<script setup lang="ts">
import { computed } from 'vue';
import { useFilmClock } from '../film-clock';
import { sangraiEnd, sangraiFrame, sangraiStill, type SangraiEntry, type SangraiYear } from '../sangrai-film';

// Layar mesin sangrai: seluruh gambar dihitung ulang oleh sangraiFrame dari jam film. Film diputar sekali saat
// layarnya terlihat; setiap catatan di bawahnya bisa diklik untuk memutar ulang dari tahap itu.
const props = defineProps<{ years: readonly SangraiYear[]; entries: readonly SangraiEntry[]; total: number }>();

const { time, format, playing, reduced } = useFilmClock({ duration: sangraiEnd, still: sangraiStill, chapters: [], loop: false });
const frame = computed(() => sangraiFrame(time.value, format.value, { years: props.years, entries: props.entries, total: props.total }));
const number = new Intl.NumberFormat('id-ID');

function replayFrom(index: number): void {
  const at = frame.value.entries[index]!.at;
  time.value = reduced.value ? at + 1 : at;
  if (!reduced.value) playing.value = true;
}
function control(): void {
  if (frame.value.state === 'served') return replayFrom(0);
  playing.value = !playing.value;
}
const controlLabel = computed(() => (frame.value.state === 'served' ? 'Putar ulang perjalanan' : playing.value ? 'Jeda perjalanan' : 'Lanjutkan perjalanan'));
</script>

<template>
  <figure ref="film" :class="['sangrai', `sangrai--${frame.format}`]" :data-state="frame.state">
    <figcaption class="sangrai-head">
      <span class="sangrai-name">
        <button v-if="!reduced" type="button" class="sangrai-control" :aria-label="controlLabel" @click="control">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path v-if="frame.state === 'served'" class="sangrai-control-line" d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" />
            <path v-else-if="playing" class="sangrai-control-line" d="M5.5 3.5v9M10.5 3.5v9" />
            <path v-else class="sangrai-control-fill" d="M5 3v10l8-5z" />
          </svg>
        </button>
        <span>
          <strong>Perjalanan karya PPG</strong>
          <small>Garis waktu ilustratif dari dua semester praktik</small>
        </span>
      </span>
      <p class="sangrai-readout" :aria-label="`${number.format(total)} karya dalam portofolio`">
        <span aria-hidden="true">{{ number.format(frame.readout) }}</span>
        <small aria-hidden="true">karya yang didokumentasikan</small>
      </p>
    </figcaption>

    <svg class="sangrai-chart" :viewBox="`0 0 ${frame.width} ${frame.height}`" aria-hidden="true">
      <defs>
        <linearGradient id="sgr-heat" :x1="frame.x0" :x2="frame.x1" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#9dd3f0" />
          <stop offset="0.5" stop-color="#4d9bd0" />
          <stop offset="0.75" stop-color="#3fc4b2" />
          <stop offset="1" stop-color="#c8f4ff" />
        </linearGradient>
        <linearGradient id="sgr-haze" x1="0" x2="0" :y1="frame.top" :y2="frame.base" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#4d9bd0" stop-opacity="0.3" />
          <stop offset="1" stop-color="#4d9bd0" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="sgr-glow">
          <stop offset="0" stop-color="#c8f4ff" stop-opacity="0.8" />
          <stop offset="0.35" stop-color="#3fc4b2" stop-opacity="0.32" />
          <stop offset="1" stop-color="#3fc4b2" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="sgr-light">
          <stop offset="0" stop-color="#72b8e2" stop-opacity="0.15" />
          <stop offset="1" stop-color="#72b8e2" stop-opacity="0" />
        </radialGradient>
        <clipPath id="sgr-drawn">
          <rect x="0" y="0" :width="frame.reveal" :height="frame.height" />
        </clipPath>
        <filter id="sgr-bloom" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <!-- Cahaya bara yang mengikuti ujung kurva, seperti lampu ruang sangrai. -->
      <circle :cx="frame.tip.x" :cy="frame.tip.y" r="260" fill="url(#sgr-light)" :opacity="frame.glow" />

      <g :opacity="frame.lit">
        <text v-for="cell in frame.display" :key="cell.label" :x="cell.x" :y="cell.labelY" class="sangrai-cell-label">{{ cell.label }}</text>
        <text
          v-for="cell in frame.display"
          :key="`${cell.label}-value`"
          :x="cell.x"
          :y="cell.valueY"
          class="sangrai-cell-value"
          :style="{ fontSize: `${frame.displayRow.size}px` }"
        >{{ cell.value }}</text>

        <g v-for="row in frame.grid" :key="row.temp">
          <line class="sangrai-grid" :x1="frame.x0" :x2="frame.x1" :y1="row.y" :y2="row.y" />
        <text class="sangrai-temp" :x="frame.x0 + 4" :y="row.y - 7">{{ row.temp }}%</text>
        </g>
        <line class="sangrai-base" :x1="frame.x0" :x2="frame.x1" :y1="frame.base" :y2="frame.base" />
        <text
          v-for="entry in frame.years"
          :key="entry.year"
          :class="['sangrai-year', { 'sangrai-year--passed': entry.passed, 'sangrai-year--now': entry.current }]"
          :x="entry.x"
          :y="frame.yearY"
          text-anchor="middle"
        >S{{ entry.year }}</text>

        <g v-for="phase in frame.phases" :key="phase.label">
          <rect class="sangrai-phase" :x="phase.x" :y="frame.phaseY" :width="phase.w" height="5" rx="2.5" />
          <rect class="sangrai-phase-fill" :x="phase.x" :y="frame.phaseY" :width="phase.w * phase.fill" height="5" rx="2.5" />
          <text :class="['sangrai-phase-label', { 'sangrai-phase-label--done': phase.done }]" :x="phase.x" :y="frame.phaseY + 22">{{ phase.label }}</text>
          <text
            v-if="phase.done"
            class="sangrai-phase-share"
            :x="frame.phaseStacked ? phase.x : phase.x + phase.w"
            :y="frame.phaseY + (frame.phaseStacked ? 38 : 22)"
            :text-anchor="frame.phaseStacked ? 'start' : 'end'"
          >{{ phase.share }}</text>
        </g>
      </g>

      <g clip-path="url(#sgr-drawn)">
        <path class="sangrai-haze" :d="`${frame.curve} L${frame.x1} ${frame.base} L${frame.x0} ${frame.base} Z`" />
        <path class="sangrai-curve-bloom" :d="frame.curve" filter="url(#sgr-bloom)" />
        <path class="sangrai-curve" :d="frame.curve" />
      </g>

      <line v-if="frame.playhead > 0" class="sangrai-playhead" :x1="frame.tip.x" :x2="frame.tip.x" :y1="frame.top - 18" :y2="frame.base" :opacity="frame.playhead" />

      <g v-for="point in frame.entries" :key="point.year" class="sangrai-point">
        <circle v-if="point.ring" :cx="point.x" :cy="point.y" :r="point.ring.r" class="sangrai-ring" :stroke="point.bean" :opacity="point.ring.opacity" />
        <circle :cx="point.x" :cy="point.y" r="8" :fill="point.bean" :opacity="point.opacity" />
      </g>

      <circle v-for="(ember, index) in frame.embers" :key="`ember-${index}`" :cx="ember.x" :cy="ember.y" :r="ember.r" :fill="ember.color" :opacity="ember.opacity" />

      <g v-if="frame.glow > 0">
        <circle :cx="frame.tip.x" :cy="frame.tip.y" :r="22 + 14 * frame.glow" fill="url(#sgr-glow)" :opacity="frame.glow" />
        <circle :cx="frame.tip.x" :cy="frame.tip.y" r="4" :fill="frame.state === 'served' ? frame.smokeAt.bean : '#fff1d6'" />
      </g>

      <g :transform="`translate(${frame.smokeAt.x} ${frame.smokeAt.y - 14})`">
        <path
          v-for="wisp in frame.smoke"
          :key="wisp.x"
          class="sangrai-smoke"
          :d="`M${wisp.x} 0 c-8 -10 8 -18 0 -28 c-8 -10 8 -18 0 -28`"
          :transform="`translate(0 ${wisp.y})`"
          :opacity="wisp.opacity"
        />
      </g>
    </svg>

    <ol class="sangrai-log">
      <li v-for="(entry, index) in frame.log" :key="entry.year" :class="`sangrai-stage--${entry.state}`">
        <button type="button" class="sangrai-entry" :aria-current="entry.state === 'now' ? 'step' : undefined" @click="replayFrom(index)">
          <span class="sangrai-bean" :style="{ background: entry.bean }"></span>
          <p class="sangrai-when"><strong>Semester {{ Math.ceil(entry.year) }}</strong>{{ entry.roast }}</p>
          <p class="sangrai-what">{{ entry.text }}</p>
        </button>
      </li>
    </ol>
  </figure>
</template>

<style scoped>
/* Layar mesin sangrai selalu gelap, di mode terang maupun gelap. */
.sangrai {
  --ink: #f4e9da;
  --ink-muted: #b9a58f;
  position: relative;
  margin: clamp(32px, 4vw, 48px) 0 0;
  padding: clamp(20px, 3vw, 36px);
  border-radius: 28px;
  background:
    radial-gradient(120% 90% at 85% 0%, rgb(255 110 50 / 0.18), transparent 60%),
    radial-gradient(80% 60% at 0% 100%, rgb(143 174 93 / 0.1), transparent 60%),
    #1b120d;
  color: var(--ink);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.04), 0 40px 60px -36px color-mix(in srgb, var(--card-shadow) 80%, transparent);
  overflow: hidden;
}
.sangrai-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 24px; }
.sangrai-name { display: flex; align-items: center; gap: 14px; }
.sangrai-head strong { display: block; font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; }
.sangrai-head small { display: block; color: var(--ink-muted); font-size: 13.5px; }
.sangrai-control {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgb(255 220 180 / 0.2);
  border-radius: 50%;
  background: rgb(255 220 180 / 0.06);
  color: var(--ink);
  cursor: pointer;
}
.sangrai-control:hover { background: rgb(255 220 180 / 0.12); }
.sangrai-control:focus-visible, .sangrai-entry:focus-visible { outline: 2px solid #ffb36b; outline-offset: 3px; }
.sangrai-control svg { width: 14px; height: 14px; }
.sangrai-control-line { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.sangrai-control-fill { fill: currentColor; }
.sangrai-readout { text-align: right; }
.sangrai-readout span {
  display: block;
  font-size: clamp(2.6rem, 6vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(180deg, #ffd38a, #ff6a2c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 18px rgb(255 106 44 / 0.35));
}
.sangrai-readout small { margin-top: 4px; }

.sangrai-chart { display: block; width: 100%; height: auto; margin-top: 22px; overflow: visible; }
.sangrai-cell-label { fill: var(--ink-muted); font-size: 12px; font-weight: 700; }
.sangrai-cell-value { fill: var(--ink); font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.sangrai-grid { stroke: rgb(255 220 180 / 0.07); stroke-dasharray: 3 7; }
.sangrai-base { stroke: rgb(255 220 180 / 0.18); }
.sangrai-temp { fill: rgb(255 220 180 / 0.32); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
.sangrai-year { fill: var(--ink-muted); font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; opacity: 0.4; }
.sangrai-year--passed { opacity: 1; }
.sangrai-year--now { fill: #ffd38a; }
.sangrai-phase { fill: rgb(255 220 180 / 0.08); }
.sangrai-phase-fill { fill: url(#sgr-heat); }
.sangrai-phase-label { fill: var(--ink-muted); font-size: 12.5px; font-weight: 700; opacity: 0.55; }
.sangrai-phase-label--done { opacity: 1; }
.sangrai-phase-share { fill: var(--ink); font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.sangrai-haze { fill: url(#sgr-haze); }
.sangrai-curve, .sangrai-curve-bloom { fill: none; stroke: url(#sgr-heat); stroke-linecap: round; stroke-linejoin: round; }
.sangrai-curve { stroke-width: 5; }
.sangrai-curve-bloom { stroke-width: 9; opacity: 0.5; }
.sangrai-playhead { stroke: rgb(255 220 180 / 0.35); stroke-width: 1; stroke-dasharray: 2 4; }
.sangrai-point circle:last-child { stroke: #1b120d; stroke-width: 4; }
.sangrai-ring { fill: none; stroke-width: 2; }
.sangrai-smoke { fill: none; stroke: rgb(255 240 225 / 0.8); stroke-width: 2.5; stroke-linecap: round; }

.sangrai-log { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 12px; margin: 20px 0 0; padding: 16px 0 0; border-top: 1px dashed rgb(255 220 180 / 0.16); list-style: none; }
.sangrai-entry {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  align-content: start;
  gap: 2px 10px;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 14px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.sangrai-entry:hover { background: rgb(255 220 180 / 0.05); }
.sangrai-stage--next .sangrai-entry { opacity: 0.38; }
.sangrai-stage--now .sangrai-entry { background: rgb(255 154 60 / 0.1); box-shadow: inset 0 0 0 1px rgb(255 154 60 / 0.28); }
.sangrai-bean { grid-row: span 2; width: 13px; height: 17px; margin-top: 3px; border-radius: 50%; box-shadow: inset -3px 0 0 rgb(0 0 0 / 0.25), 0 0 0 1px rgb(255 255 255 / 0.12); }
.sangrai-when { color: var(--ink-muted); font-size: 13.5px; }
.sangrai-when strong { margin-right: 8px; color: var(--ink); font-variant-numeric: tabular-nums; }
.sangrai-what { font-size: 14px; line-height: 1.5; }

.sangrai--tall .sangrai-cell-label, .sangrai--tall .sangrai-temp { font-size: 12.5px; }
.sangrai--tall .sangrai-year { font-size: 12.5px; }
.sangrai--tall .sangrai-phase-label, .sangrai--tall .sangrai-phase-share { font-size: 12px; }

@media (max-width: 900px) {
  .sangrai-log { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .sangrai-log { grid-template-columns: 1fr; }
  .sangrai-readout { text-align: left; }
}
</style>
