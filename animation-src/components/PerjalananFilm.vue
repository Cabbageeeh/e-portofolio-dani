<script setup lang="ts">
import { computed } from 'vue';
import { useFilmClock } from '../film-clock';
import { journeyDuration, journeyEntries, journeyStill, perjalananFrame } from '../perjalanan-film';

const chapters = journeyEntries.map((entry, index) => ({
  label: entry.context,
  start: 0.55 + (index / (journeyEntries.length - 1)) * 12,
  still: 0.75 + (index / (journeyEntries.length - 1)) * 12,
}));

const { time, format, playing, reduced } = useFilmClock({
  duration: journeyDuration,
  still: journeyStill,
  chapters,
  loop: false,
});
const frame = computed(() => perjalananFrame(time.value, format.value));

function replayFrom(index: number): void {
  time.value = reduced.value ? chapters[index]!.still : chapters[index]!.start;
  if (!reduced.value) playing.value = true;
}

function control(): void {
  if (frame.value.complete) {
    replayFrom(0);
    return;
  }
  playing.value = !playing.value;
}

const controlLabel = computed(() => (
  frame.value.complete ? 'Putar ulang perjalanan' : playing.value ? 'Jeda perjalanan' : 'Lanjutkan perjalanan'
));
</script>

<template>
  <figure ref="film" :class="['journey-film', 'journey-film--' + frame.format]" :data-state="frame.complete ? 'complete' : 'learning'">
    <figcaption class="journey-head">
      <span class="journey-name">
        <button v-if="!reduced" type="button" class="journey-control" :aria-label="controlLabel" @click="control">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path v-if="frame.complete" class="journey-control-line" d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" />
            <path v-else-if="playing" class="journey-control-line" d="M5.5 3.5v9M10.5 3.5v9" />
            <path v-else class="journey-control-fill" d="M5 3v10l8-5z" />
          </svg>
        </button>
        <span>
          <strong>Jejak perjalanan PPG</strong>
          <small>Dari latar Informatika murni menuju calon guru Informatika</small>
        </span>
      </span>
      <p class="journey-readout" :aria-label="'Tahap ' + frame.readout">
        <span>{{ frame.readout }}</span>
        <small>tahap perjalanan</small>
      </p>
    </figcaption>

    <div class="journey-contexts" aria-label="Ringkasan perjalanan">
      <div><span>TITIK BERANGKAT</span><strong>Teknik Informatika murni</strong></div>
      <div><span>HAL BARU</span><strong>Pedagogik dan praktik mengajar</strong></div>
      <div><span>ARAH</span><strong>Guru Informatika yang terus belajar</strong></div>
    </div>

    <div class="journey-focus" aria-live="polite">
      <div class="journey-focus-label">
        <span class="journey-focus-dot" :style="{ background: frame.nodes[frame.current]!.color }"></span>
        <span>TAHAP {{ frame.readout }}</span>
        <span class="journey-focus-context">{{ frame.currentEntry.context }}</span>
      </div>
      <h4>{{ frame.currentEntry.title }}</h4>
      <p>{{ frame.currentEntry.detail }}</p>
      <span v-if="frame.currentEntry.work" class="journey-work">{{ frame.currentEntry.work }}</span>
    </div>

    <svg class="journey-chart" :viewBox="'0 0 ' + frame.width + ' ' + frame.height" role="img" aria-label="Lintasan refleksi dari Teknik Informatika murni melalui pembelajaran PPG dan praktik sekolah menuju guru Informatika">
      <defs>
        <linearGradient id="journey-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#9dd3f0" />
          <stop offset="0.5" stop-color="#4d9bd0" />
          <stop offset="0.78" stop-color="#68d7b0" />
          <stop offset="1" stop-color="#c8f4ff" />
        </linearGradient>
        <linearGradient id="journey-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4d9bd0" stop-opacity="0.22" />
          <stop offset="1" stop-color="#4d9bd0" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="journey-glow">
          <stop offset="0" stop-color="#c8f4ff" stop-opacity="0.7" />
          <stop offset="0.4" stop-color="#4d9bd0" stop-opacity="0.25" />
          <stop offset="1" stop-color="#4d9bd0" stop-opacity="0" />
        </radialGradient>
        <clipPath id="journey-reveal">
          <rect x="0" y="0" :width="frame.tip.x" :height="frame.height" />
        </clipPath>
      </defs>
      <g class="journey-grid">
        <line v-for="line in frame.grid" :key="line" :x1="frame.x0" :x2="frame.x1" :y1="line" :y2="line" />
      </g>
      <line class="journey-base" :x1="frame.x0" :x2="frame.x1" :y1="frame.base" :y2="frame.base" />
      <path class="journey-area" :d="frame.area" clip-path="url(#journey-reveal)" />
      <path class="journey-curve-base" :d="frame.curve" pathLength="100" />
      <path class="journey-curve" :d="frame.curve" pathLength="100" :stroke-dasharray="frame.dashArray" />
      <line v-if="frame.progress > 0 && !frame.complete" class="journey-playhead" :x1="frame.tip.x" :x2="frame.tip.x" :y1="frame.top" :y2="frame.base" />
      <g v-for="(node, index) in frame.nodes" :key="node.marker" :class="['journey-node', 'journey-node--' + node.state]" :opacity="Math.max(0.38, node.opacity)">
        <circle v-if="node.active" class="journey-node-glow" :cx="node.x" :cy="node.y" :r="27 + node.ring * 8" />
        <circle v-if="node.active" class="journey-node-ring" :cx="node.x" :cy="node.y" :r="13 + node.ring * 4" :stroke="node.color" />
        <circle class="journey-node-core" :cx="node.x" :cy="node.y" r="8" :fill="node.color" />
        <line class="journey-tick" :x1="node.x" :x2="node.x" :y1="node.y + 11" :y2="node.labelY - 9" />
        <text class="journey-marker" :x="node.x" :y="node.labelY" text-anchor="middle">{{ node.marker }}</text>
        <text class="journey-step-number" :x="node.x" :y="node.labelY + 16" text-anchor="middle">{{ String(index + 1).padStart(2, '0') }}</text>
      </g>
    </svg>

    <div class="journey-phase-list" aria-label="Rangkaian perjalanan">
      <div v-for="phase in frame.phases" :key="phase.label" class="journey-phase">
        <span class="journey-phase-track"><i :style="{ width: (phase.fill * 100) + '%' }"></i></span>
        <span>{{ phase.label }}</span>
      </div>
    </div>

    <ol class="journey-log" aria-label="Pilih tahap perjalanan untuk membaca ulang">
      <li v-for="(node, index) in frame.nodes" :key="node.marker" :class="'journey-stage--' + node.state">
        <button type="button" class="journey-entry" :aria-current="node.active ? 'step' : undefined" @click="replayFrom(index)">
          <span class="journey-entry-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="journey-entry-copy">
            <strong>{{ node.context }}</strong>
            <small>{{ node.teaser }}</small>
          </span>
          <span class="journey-entry-arrow" aria-hidden="true">↗</span>
        </button>
      </li>
    </ol>
    <p class="journey-footnote">Lintasan ini adalah visualisasi refleksi perjalanan belajar, bukan skor kompetensi.</p>
  </figure>
</template>

<style scoped>
.journey-film {
  --journey-ink: #eaf6ff;
  --journey-muted: #9bb6ca;
  position: relative;
  margin: clamp(28px, 4vw, 44px) 0 0;
  padding: clamp(18px, 2.6vw, 32px);
  overflow: hidden;
  border: 1px solid rgb(157 211 240 / .14);
  border-radius: 24px;
  background:
    radial-gradient(110% 90% at 86% 0%, rgb(77 155 208 / .18), transparent 62%),
    radial-gradient(75% 65% at 0% 100%, rgb(63 196 178 / .1), transparent 65%),
    #071a2b;
  color: var(--journey-ink);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .06), 0 36px 64px -42px var(--card-shadow);
}
.journey-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 24px; }
.journey-name { display: flex; align-items: center; gap: 14px; }
.journey-name > span:last-child { min-width: 0; }
.journey-head strong { display: block; font-size: 1.15rem; font-weight: 800; letter-spacing: -.02em; }
.journey-head small { display: block; color: var(--journey-muted); font-size: 13px; line-height: 1.5; }
.journey-control {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgb(157 211 240 / .22);
  border-radius: 50%;
  background: rgb(157 211 240 / .06);
  color: var(--journey-ink);
  cursor: pointer;
  transition: background .2s ease, transform .2s ease;
}
.journey-control:hover { transform: translateY(-1px); background: rgb(120 190 230 / .14); }
.journey-control:focus-visible, .journey-entry:focus-visible { outline: 2px solid #72bee5; outline-offset: 3px; }
.journey-control svg { width: 14px; height: 14px; }
.journey-control-line { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.journey-control-fill { fill: currentColor; }
.journey-readout { text-align: right; }
.journey-readout span { display: block; color: transparent; background: linear-gradient(180deg, #c8f4ff, #4d9bd0); background-clip: text; filter: drop-shadow(0 0 18px rgb(77 155 208 / .3)); font-size: clamp(2.4rem, 5vw, 3.7rem); font-weight: 850; letter-spacing: -.055em; line-height: 1; font-variant-numeric: tabular-nums; }
.journey-readout small { margin-top: 5px; }
.journey-contexts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 24px; padding: 15px 18px; border: 1px solid rgb(157 211 240 / .1); border-radius: 16px; background: rgb(157 211 240 / .035); }
.journey-contexts div { min-width: 0; }
.journey-contexts span { display: block; margin-bottom: 5px; color: var(--journey-muted); font-size: 9px; font-weight: 800; letter-spacing: .12em; }
.journey-contexts strong { display: block; font-size: 13px; line-height: 1.4; }
.journey-focus { margin-top: 15px; padding: 16px 18px 17px; border: 1px solid rgb(157 211 240 / .14); border-left: 3px solid #68d7b0; border-radius: 14px; background: linear-gradient(100deg, rgb(77 155 208 / .11), rgb(157 211 240 / .025)); }
.journey-focus-label { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: #9dd3f0; font-size: 9px; font-weight: 800; letter-spacing: .1em; }
.journey-focus-dot { width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 12px currentColor; }
.journey-focus-context { margin-left: auto; color: var(--journey-muted); letter-spacing: .04em; text-align: right; }
.journey-focus h4 { margin: 9px 0 5px; font-size: clamp(18px, 2vw, 24px); letter-spacing: -.035em; line-height: 1.2; }
.journey-focus p { max-width: 760px; margin: 0; color: #c4d9e8; font-size: 13px; line-height: 1.65; }
.journey-work { display: inline-flex; margin-top: 10px; padding: 5px 9px; border: 1px solid rgb(104 215 176 / .27); border-radius: 999px; color: #9be6ce; font-size: 10px; font-weight: 700; }
.journey-chart { display: block; width: 100%; height: auto; margin-top: 16px; overflow: visible; }
.journey-grid line { stroke: rgb(157 211 240 / .07); stroke-dasharray: 3 7; }
.journey-base { stroke: rgb(157 211 240 / .2); }
.journey-area { fill: url(#journey-area); }
.journey-curve-base, .journey-curve { fill: none; stroke: url(#journey-line); stroke-linecap: round; stroke-linejoin: round; }
.journey-curve-base { stroke-width: 3; opacity: .16; }
.journey-curve { stroke-width: 5; filter: drop-shadow(0 0 8px rgb(77 155 208 / .42)); }
.journey-playhead { stroke: rgb(157 211 240 / .35); stroke-width: 1; stroke-dasharray: 3 5; }
.journey-node-glow { fill: url(#journey-glow); }
.journey-node-ring { fill: none; stroke-width: 2; opacity: .72; }
.journey-node-core { stroke: #071a2b; stroke-width: 4; }
.journey-tick { stroke: rgb(157 211 240 / .32); stroke-width: 1; }
.journey-marker { fill: #c4d9e8; font-size: 11px; font-weight: 750; letter-spacing: .035em; }
.journey-step-number { fill: #7f9caf; font-size: 9px; font-weight: 700; }
.journey-node--next .journey-node-core { fill: #9bb6ca; }
.journey-node--now .journey-marker { fill: #c8f4ff; }
.journey-phase-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 2px; }
.journey-phase { min-width: 0; color: var(--journey-muted); font-size: 10px; font-weight: 650; }
.journey-phase-track { display: block; height: 4px; margin-bottom: 7px; overflow: hidden; border-radius: 999px; background: rgb(157 211 240 / .12); }
.journey-phase-track i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #9dd3f0, #4d9bd0, #68d7b0); }
.journey-phase:nth-child(2) .journey-phase-track i { background: #4d9bd0; }
.journey-phase:nth-child(3) .journey-phase-track i { background: #68d7b0; }
.journey-phase:nth-child(4) .journey-phase-track i { background: #c8f4ff; }
.journey-phase:last-child { text-align: right; }
.journey-log { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin: 19px 0 0; padding: 15px 0 0; border-top: 1px dashed rgb(157 211 240 / .18); list-style: none; }
.journey-entry { display: grid; grid-template-columns: 25px minmax(0, 1fr) 12px; align-items: start; gap: 2px 8px; width: 100%; height: 100%; padding: 10px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; transition: background .2s ease, border-color .2s ease, opacity .2s ease; }
.journey-entry:hover { background: rgb(157 211 240 / .06); border-color: rgb(157 211 240 / .12); }
.journey-stage--next .journey-entry { opacity: .53; }
.journey-stage--now .journey-entry { background: rgb(77 155 208 / .13); border-color: rgb(77 155 208 / .32); }
.journey-entry-number { color: #72bee5; font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums; }
.journey-entry-copy { min-width: 0; }
.journey-entry-copy strong { display: block; margin-bottom: 5px; color: var(--journey-ink); font-size: 11px; line-height: 1.35; }
.journey-entry-copy small { display: block; color: var(--journey-muted); font-size: 10px; line-height: 1.45; }
.journey-entry-arrow { justify-self: end; color: #68d7b0; font-size: 12px; }
.journey-footnote { margin: 12px 0 0; color: #809bad; font-size: 9px; line-height: 1.5; }
@media (max-width: 900px) {
  .journey-log { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .journey-entry { padding: 9px 7px; gap: 2px 5px; }
  .journey-entry-arrow { font-size: 10px; }
}
@media (max-width: 640px) {
  .journey-film { padding: 18px 14px; border-radius: 18px; }
  .journey-head { align-items: center; gap: 10px; }
  .journey-head strong { font-size: 1rem; }
  .journey-head small { max-width: 230px; font-size: 11px; }
  .journey-readout span { font-size: 2.2rem; }
  .journey-readout small { font-size: 10px; }
  .journey-contexts { grid-template-columns: 1fr; gap: 10px; margin-top: 17px; padding: 13px; }
  .journey-contexts div { display: grid; grid-template-columns: 94px minmax(0, 1fr); align-items: baseline; gap: 8px; }
  .journey-contexts span { margin: 0; }
  .journey-contexts strong { font-size: 12px; }
  .journey-focus { margin-top: 11px; padding: 13px; }
  .journey-focus h4 { font-size: 18px; }
  .journey-focus p { font-size: 12px; }
  .journey-focus-context { margin-left: 0; }
  .journey-chart { margin-top: 10px; }
  .journey-marker { font-size: 10px; }
  .journey-step-number { font-size: 8px; }
  .journey-phase-list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px 13px; }
  .journey-phase { font-size: 9px; }
  .journey-phase:last-child { text-align: left; }
  .journey-log { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px; margin-top: 14px; padding-top: 12px; }
  .journey-entry { grid-template-columns: 22px minmax(0, 1fr); padding: 8px 6px; gap: 2px 6px; }
  .journey-entry-arrow { display: none; }
  .journey-entry-copy strong { font-size: 10px; }
  .journey-entry-copy small { font-size: 9px; }
  .journey-footnote { font-size: 8px; }
}
</style>
