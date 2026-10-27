<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilmClock } from '../film-clock';
import { kavlingChapters, kavlingDefaultHero, kavlingDuration, kavlingFrame, kavlingPalette, kavlingStill } from '../kavling-film';
import FilmControls from './FilmControls.vue';
import FilmFrame from './FilmFrame.vue';

// Pemutar film ERP kavling: seluruh gambar dihitung ulang oleh kavlingFrame dari jam film.
const hero = ref(kavlingDefaultHero);
const { time, format, playing, chapter, seek, toggle } = useFilmClock({
  duration: kavlingDuration,
  still: kavlingStill,
  chapters: kavlingChapters,
  onLoop: () => (hero.value = kavlingDefaultHero),
});
const frame = computed(() => kavlingFrame(time.value, format.value, hero.value));
const palette = kavlingPalette;

function jump(index: number): void {
  seek(index);
  if (time.value < kavlingChapters[2].start) hero.value = kavlingDefaultHero;
}

// Pengunjung memilih kavling kosong: kavling itulah yang dipesan, dan film lanjut dari bab Booking.
function pick(index: number): void {
  hero.value = index;
  seek(2);
}
</script>

<template>
  <div ref="film" :class="['film', `film--${frame.format}`]" :data-state="frame.state">
    <FilmFrame
      :width="frame.width"
      :height="frame.height"
      :format="frame.format"
      title="Peta karya PPG"
      :subtitle="frame.subtitle"
      :chips="frame.chips"
      :caption="frame.caption"
    >
      <svg class="film-world kav-world" :viewBox="`0 0 ${frame.width} ${frame.height}`" aria-hidden="true">
        <defs>
          <radialGradient id="kav-bg" cx="50%" cy="44%" r="80%">
            <stop offset="0" stop-color="#173b5a" />
            <stop offset="1" stop-color="#071a2b" />
          </radialGradient>
          <linearGradient id="kav-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#071a2b" stop-opacity="0.85" />
            <stop offset="0.16" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="0.76" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="1" stop-color="#071a2b" stop-opacity="0.92" />
          </linearGradient>
          <pattern id="kav-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" :stroke="palette.ink" stroke-opacity="0.05" />
          </pattern>
          <linearGradient id="kav-scan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" :stop-color="palette.ok" stop-opacity="0" />
            <stop offset="1" :stop-color="palette.ok" stop-opacity="0.22" />
          </linearGradient>
          <filter id="kav-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect :width="frame.width" :height="frame.height" fill="url(#kav-bg)" />

        <g :opacity="frame.fade">
          <g :transform="frame.camera">
            <rect :x="-frame.width" :y="-frame.height" :width="frame.width * 3" :height="frame.height * 3" fill="url(#kav-grid)" />

            <!-- Lahan: batas survei, kontur tanah, dan patok sudut. -->
            <g :opacity="frame.dim">
              <path :d="frame.land.d" class="kav-land" :fill-opacity="0.05 * frame.land.fill" />
              <path
                v-for="(line, index) in frame.contours"
                :key="`topo-${index}`"
                class="kav-contour"
                :d="line.d"
                pathLength="100"
                :stroke-dasharray="`${line.draw * 100} 100`"
                :opacity="line.opacity"
              />
              <path :d="frame.land.d" class="kav-boundary" pathLength="100" :stroke-dasharray="`${frame.land.draw * 100} 100`" :opacity="1 - frame.land.dashed" />
              <path :d="frame.land.d" class="kav-boundary kav-boundary--dash" :stroke-dashoffset="frame.land.march" :opacity="frame.land.dashed" />
              <template v-for="(pin, index) in frame.pins" :key="`pin-${index}`">
                <circle v-if="pin.ring" :cx="pin.ring.x" :cy="pin.ring.y" :r="pin.ring.r" :opacity="pin.ring.opacity" class="kav-pin-ring" />
                <g :transform="`translate(${pin.x} ${pin.y})`" :opacity="pin.opacity">
                  <line y1="-13" y2="0" class="kav-pin-stick" />
                  <circle cy="-15" r="4" class="kav-pin-head" />
                </g>
              </template>

              <g v-if="frame.road.w > 0">
                <rect :x="frame.road.x" :y="frame.road.y" :width="frame.road.w" :height="frame.road.h" rx="4" class="kav-road" />
                <line
                  :x1="frame.road.x + 6"
                  :x2="frame.road.x + Math.max(frame.road.w - 6, 6)"
                  :y1="frame.road.y + frame.road.h / 2"
                  :y2="frame.road.y + frame.road.h / 2"
                  class="kav-road-line"
                />
                <g :opacity="frame.road.label">
                  <rect :x="frame.road.x + frame.road.full / 2 - 38" :y="frame.road.y + 3" width="76" :height="frame.road.h - 6" rx="4" class="kav-road-tag" />
                  <text :x="frame.road.x + frame.road.full / 2" :y="frame.road.y + frame.road.h / 2 + 3.5" text-anchor="middle" class="kav-road-text">Jalur artefak</text>
                </g>
              </g>
            </g>

            <!-- Peta konsep karya dan konteksnya. -->
            <g v-if="frame.survey.opacity > 0.01" :opacity="frame.survey.opacity" :transform="`translate(${frame.survey.x} ${frame.survey.y + frame.survey.rise})`">
              <text y="-8" text-anchor="middle" class="kav-survey-title">Koleksi portofolio</text>
              <text y="12" text-anchor="middle" class="kav-small">JurnalKita · SIGAP · Ruang Belajar</text>
              <g :transform="`translate(0 38) scale(${frame.survey.legal.scale})`" :opacity="frame.survey.legal.opacity">
                <rect x="-75" y="-13" width="150" height="26" rx="13" class="kav-legal" :stroke="frame.survey.legal.color" />
                <g transform="translate(-58 0)" :stroke="frame.survey.legal.color" class="kav-legal-icon">
                  <path v-if="frame.survey.legal.ok" d="M-4 0l2.6 2.6 5-5.6" />
                  <path v-else d="M0 -5A5 5 0 0 1 5 0" :transform="`rotate(${frame.survey.legal.spin})`" />
                </g>
                <text x="-46" y="4" class="kav-legal-text" :fill="frame.survey.legal.color">{{ frame.survey.legal.text }}</text>
              </g>
            </g>

            <!-- Garis pindai yang membuka peta karya. -->
            <g v-if="frame.scan" :opacity="frame.scan.opacity">
              <rect :x="frame.scan.x - 46" :y="frame.scan.y1" width="46" :height="frame.scan.y2 - frame.scan.y1" fill="url(#kav-scan)" />
              <line :x1="frame.scan.x" :x2="frame.scan.x" :y1="frame.scan.y1" :y2="frame.scan.y2" class="kav-scan" filter="url(#kav-glow)" />
            </g>

            <!-- Kartu karya: status berubah mengikuti alur simulasi. -->
            <template v-for="plot in frame.plots" :key="plot.code">
              <g v-if="plot.visible" :transform="plot.transform" :opacity="plot.opacity">
                <rect
                  :x="plot.x"
                  :y="plot.y"
                  :width="plot.w"
                  :height="plot.h"
                  rx="5"
                  class="kav-plot"
                  :fill="plot.fill"
                  :fill-opacity="plot.fillOpacity"
                  :stroke="plot.stroke"
                  :stroke-opacity="plot.strokeOpacity"
                />
                <text :x="plot.cx" :y="plot.labelY" text-anchor="middle" class="kav-code" :fill="plot.text">{{ plot.code }}</text>
                <text v-if="plot.area > 0.01" :x="plot.cx" :y="plot.cy + 10" text-anchor="middle" class="kav-area" :fill="plot.text" :opacity="plot.area">pilihan</text>
                <rect v-if="plot.pickable" :x="plot.x" :y="plot.y" :width="plot.w" :height="plot.h" rx="5" class="kav-hit" @click="pick(plot.index)" />
              </g>
            </template>

            <rect
              v-if="frame.ring"
              :x="frame.ring.x"
              :y="frame.ring.y"
              :width="frame.ring.w"
              :height="frame.ring.h"
              rx="8"
              class="kav-ring"
              :stroke="frame.ring.stroke"
              :opacity="frame.ring.opacity"
            />
            <circle v-if="frame.ripple" :cx="frame.ripple.x" :cy="frame.ripple.y" :r="frame.ripple.r" :opacity="frame.ripple.opacity" class="kav-ripple" />
            <text v-if="frame.hint" :x="frame.hint.x" :y="frame.hint.y + frame.hint.rise" :opacity="frame.hint.opacity" text-anchor="middle" class="kav-hint">
              Pilih karya untuk melihat alurnya
            </text>
            <g v-if="frame.cursor" :transform="`translate(${frame.cursor.x} ${frame.cursor.y}) scale(${frame.cursor.scale})`" :opacity="frame.cursor.opacity">
              <path d="M0 0V15l4-4 3.5 7 2.6-1.2-3.4-6.8H12z" class="kav-cursor" />
            </g>
          </g>

          <!-- Panel tinjau karya. -->
          <g v-if="frame.panel" :transform="frame.panel.transform" :opacity="frame.panel.opacity">
            <rect :width="frame.panel.w" :height="frame.panel.h" rx="14" class="kav-panel" />
            <text x="18" y="28" class="kav-panel-title">{{ frame.panel.title }}</text>
            <text x="18" y="45" class="kav-small">{{ frame.panel.detail }}</text>
            <text :x="frame.panel.w - 52" y="29" text-anchor="end" class="kav-name">{{ frame.panel.buyer.name }}</text>
            <text :x="frame.panel.w - 52" y="44" text-anchor="end" class="kav-small">portofolio</text>
            <g :transform="`translate(${frame.panel.w - 32} 33)`">
              <circle r="14" class="kav-avatar" />
              <text y="4" text-anchor="middle" class="kav-avatar-text">{{ frame.panel.buyer.initials }}</text>
            </g>
            <g v-for="stage in frame.panel.rail" :key="stage.label">
              <rect :x="stage.x" y="60" :width="stage.w" height="3" rx="1.5" class="kav-rail" />
              <rect v-if="stage.fill > 0" :x="stage.x" y="60" :width="stage.fill" height="3" rx="1.5" class="kav-rail-fill" />
              <text :x="stage.x" y="78" class="kav-rail-label" :opacity="stage.opacity">{{ stage.label }}</text>
            </g>

            <g :transform="`translate(18 ${frame.panel.bodyTop})`">
              <!-- Tujuan belajar dan bukti kegiatan. -->
              <g v-if="frame.booking" :transform="`translate(0 ${frame.booking.y})`" :opacity="frame.booking.opacity">
                <g v-for="row in frame.booking.rows" :key="row.label" :transform="`translate(0 ${row.y})`" :opacity="row.opacity">
                  <rect :width="frame.body.w" :height="frame.body.row" rx="9" class="kav-row" />
                  <rect v-if="row.bar !== null" x="12" :y="frame.body.row - 6" :width="row.bar" height="2" rx="1" class="kav-row-bar" />
                  <text x="12" :y="frame.body.row / 2 + 4" class="kav-row-label">{{ row.label }}</text>
                  <text :x="frame.body.w - 34" :y="frame.body.row / 2 + 4" text-anchor="end" class="kav-row-amount">{{ row.amount }}</text>
                  <g :transform="`translate(${frame.body.w - 16} ${frame.body.row / 2}) scale(${row.check})`">
                    <circle r="8" class="kav-check" />
                    <path d="M-3.5 0l2.4 2.4 4.6-5" pathLength="100" :stroke-dasharray="`${row.draw * 100} 100`" class="kav-check-mark" />
                  </g>
                </g>
                <text x="2" :y="frame.booking.restY" class="kav-small" :opacity="frame.booking.restOpacity">{{ frame.booking.rest }}</text>
              </g>

              <!-- Catatan analisis dan refleksi. -->
              <g v-if="frame.ppjb" :transform="`translate(0 ${frame.ppjb.y})`" :opacity="frame.ppjb.opacity">
                <g v-for="clause in frame.ppjb.clauses" :key="clause.label" :transform="`translate(0 ${clause.y})`">
                  <rect :width="frame.ppjb.chipWidth" height="26" rx="7" class="kav-clause" />
                  <rect v-if="clause.glow > 0" :width="frame.ppjb.chipWidth" height="26" rx="7" class="kav-clause-glow" :opacity="clause.glow" />
                  <text x="10" :y="clause.parts.length > 1 ? 10 : 16" class="kav-clause-text">
                    <tspan v-for="(part, index) in clause.parts" :key="part" x="10" :dy="index === 0 ? 0 : 10">{{ part }}</tspan>
                  </text>
                </g>
                <g :transform="`translate(${frame.ppjb.doc.x} 0)`">
                  <rect :width="frame.ppjb.doc.w" :height="frame.ppjb.doc.h" rx="8" class="kav-doc" />
                  <text x="10" y="18" class="kav-doc-title">{{ frame.ppjb.doc.title }}</text>
                  <g v-for="clause in frame.ppjb.clauses" :key="`line-${clause.label}`" :opacity="clause.line.opacity">
                    <template v-for="part in clause.line.parts" :key="part.text">
                      <text x="10" :y="part.y" class="kav-doc-line">{{ part.text }}</text>
                      <rect x="92" :y="part.y - 5" :width="Math.max(frame.ppjb.doc.w - 104, 0)" height="3" rx="1.5" class="kav-doc-text" />
                    </template>
                  </g>
                  <line x1="10" :x2="Math.min(frame.ppjb.doc.w - 70, 110)" :y1="frame.ppjb.signature.lineY" :y2="frame.ppjb.signature.lineY" class="kav-sign-line" />
                  <path
                    v-if="frame.ppjb.signature.draw > 0"
                    :d="frame.ppjb.signature.d"
                    pathLength="100"
                    :stroke-dasharray="`${frame.ppjb.signature.draw * 100} 100`"
                    class="kav-sign"
                  />
                  <g
                    v-if="frame.ppjb.stamp"
                    :transform="`translate(${frame.ppjb.stamp.x - frame.ppjb.doc.x} ${frame.ppjb.stamp.y}) rotate(-9) scale(${frame.ppjb.stamp.scale})`"
                    :opacity="frame.ppjb.stamp.opacity"
                  >
                    <rect x="-46" y="-11" width="92" height="22" rx="5" class="kav-stamp" />
                    <text y="4" text-anchor="middle" class="kav-stamp-text">Tersusun</text>
                  </g>
                </g>
                <template v-for="clause in frame.ppjb.clauses" :key="`copy-${clause.label}`">
                  <g v-if="clause.copy" :transform="`translate(${clause.copy.x} ${clause.copy.y}) scale(${clause.copy.scale})`" :opacity="clause.copy.opacity">
                    <rect :width="frame.ppjb.chipWidth" height="26" rx="7" class="kav-clause kav-clause--copy" />
                    <text x="10" :y="clause.parts.length > 1 ? 10 : 16" class="kav-clause-text">
                      <tspan v-for="(part, index) in clause.parts" :key="part" x="10" :dy="index === 0 ? 0 : 10">{{ part }}</tspan>
                    </text>
                  </g>
                </template>
              </g>

              <!-- Tahapan refleksi dan catatan peninjauan. -->
              <g v-if="frame.cicilan" :transform="`translate(0 ${frame.cicilan.y})`" :opacity="frame.cicilan.opacity">
                <text x="2" y="8" class="kav-small">{{ frame.cicilan.info }}</text>
                <g v-for="cell in frame.cicilan.cells" :key="cell.number" :transform="cell.transform" :opacity="cell.pulse">
                  <rect :x="cell.x" :y="cell.y" :width="cell.w" :height="cell.h" rx="5" :class="['kav-cell', `kav-cell--${cell.state}`]" />
                  <text :x="cell.x + cell.w / 2" :y="cell.y + cell.h / 2 + 3.5" text-anchor="middle" :class="['kav-cell-text', `kav-cell-text--${cell.state}`]">
                    {{ cell.number }}
                  </text>
                </g>
                <g
                  v-if="frame.cicilan.bubble"
                  :transform="`translate(${frame.cicilan.bubble.x + frame.cicilan.bubble.w} ${frame.cicilan.bubble.y + 42}) scale(${frame.cicilan.bubble.scale}) translate(${-frame.cicilan.bubble.w} -42)`"
                  :opacity="frame.cicilan.bubble.opacity"
                >
                  <rect :width="frame.cicilan.bubble.w" height="42" rx="10" class="kav-bubble" />
                  <text x="10" y="17" class="kav-bubble-title">{{ frame.cicilan.bubble.title }}</text>
                  <text x="10" y="33" class="kav-bubble-text">tinjau tujuan dan bukti karya.</text>
                  <text :x="frame.cicilan.bubble.w - 28" y="33" text-anchor="end" class="kav-bubble-time">PPG</text>
                  <g :transform="`translate(${frame.cicilan.bubble.w - 24} 26)`" :class="['kav-ticks', { 'kav-ticks--read': frame.cicilan.bubble.read }]">
                    <path d="M1 4.5l2.4 2.4 5-5.6" />
                    <path d="M6.2 6.9L11.2 1.3" />
                  </g>
                </g>
              </g>

              <!-- Rangkuman siap ditinjau setelah tujuan dan bukti tercatat. -->
              <g v-if="frame.komisi" :transform="`translate(0 ${frame.komisi.y})`" :opacity="frame.komisi.opacity">
                <g v-for="condition in frame.komisi.conditions" :key="condition.label" :transform="`translate(0 ${condition.y})`" :opacity="condition.opacity">
                  <circle cx="9" cy="10" r="8" class="kav-check-empty" />
                  <g :transform="`translate(9 10) scale(${condition.check})`">
                    <circle r="8" class="kav-check" />
                    <path d="M-3.5 0l2.4 2.4 4.6-5" pathLength="100" :stroke-dasharray="`${condition.draw * 100} 100`" class="kav-check-mark" />
                  </g>
                  <text x="26" y="14" class="kav-row-label">{{ condition.label }}</text>
                </g>
                <g :transform="`translate(${frame.komisi.lock.x} ${frame.komisi.lock.y})`" :stroke="frame.komisi.lock.color" class="kav-lock">
                  <path :transform="`translate(0 ${frame.komisi.lock.lift})`" d="M-6 -2V-7a6 6 0 0 1 12 0V-2" />
                  <rect x="-9" y="-2" width="18" height="14" rx="3" :fill="frame.komisi.lock.color" fill-opacity="0.16" />
                </g>
                <text x="0" :y="frame.komisi.amountY" class="kav-amount" :fill="frame.komisi.amountColor">{{ frame.komisi.amount }}</text>
                <text x="1" :y="frame.komisi.amountY + 19" class="kav-small">{{ frame.komisi.note }}</text>
                <g v-if="frame.komisi.badge" :transform="`translate(${frame.komisi.badge.x} ${frame.komisi.badge.y}) scale(${frame.komisi.badge.scale})`" :opacity="frame.komisi.badge.opacity">
                  <rect x="-42" y="-12" width="84" height="24" rx="12" class="kav-badge" />
                  <text y="4" text-anchor="middle" class="kav-badge-text">Siap ditinjau</text>
                </g>
                <circle v-for="(spark, index) in frame.komisi.sparks" :key="`spark-${index}`" :cx="spark.x" :cy="spark.y" :r="spark.r" :opacity="spark.opacity" class="kav-spark" />
              </g>
            </g>
          </g>
        </g>

        <rect :width="frame.width" :height="frame.height" fill="url(#kav-shade)" />
      </svg>
    </FilmFrame>

    <FilmControls :chapters="kavlingChapters" :duration="kavlingDuration" :time="time" :current="chapter" :playing="playing" @toggle="toggle" @seek="jump" />
  </div>
</template>

<style scoped>
/* Warna status terbaca karena layar film selalu gelap, di mode terang maupun gelap. */
.film { display: grid; gap: 12px; width: 100%; }
.film-world { display: block; width: 100%; height: 100%; font-family: inherit; }
.kav-world * { pointer-events: none; }
.kav-world .kav-hit { fill: transparent; stroke: transparent; stroke-width: 2; cursor: pointer; pointer-events: all; }
.kav-hit:hover { stroke: #f5f0e8; }

.kav-land { fill: #f5f0e8; }
.kav-contour { fill: none; stroke: #f0c185; stroke-width: 1; }
.kav-boundary { fill: none; stroke: #f0c185; stroke-width: 1.6; stroke-linejoin: round; }
.kav-boundary--dash { stroke-dasharray: 7 5; }
.kav-pin-stick { stroke: #f0c185; stroke-width: 1.4; }
.kav-pin-head { fill: #f0c185; }
.kav-pin-ring { fill: none; stroke: #f0c185; stroke-width: 1.2; }
.kav-road { fill: #f5f0e8; fill-opacity: 0.06; }
.kav-road-line { stroke: #f5f0e8; stroke-opacity: 0.3; stroke-dasharray: 8 7; }
.kav-road-tag { fill: #1d140f; }
.kav-road-text { fill: #bba791; font-size: 9.5px; font-weight: 600; }

.kav-survey-title { fill: #f5f0e8; font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.kav-legal { fill: #1d140f; stroke-opacity: 0.6; }
.kav-legal-icon { fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kav-legal-text { font-size: 11.5px; font-weight: 700; }

.kav-scan { stroke: #8fd6a3; stroke-width: 2; }
.kav-plot { stroke-width: 1; vector-effect: non-scaling-stroke; }
.kav-code { font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.kav-area { font-size: 6.5px; font-weight: 600; }
.kav-ring { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; }
.kav-ripple { fill: none; stroke: #f5f0e8; stroke-width: 1.5; }
.kav-hint { fill: #bba791; font-size: 11px; font-weight: 600; }
.kav-cursor { fill: #f5f0e8; stroke: #140d09; stroke-width: 1.2; stroke-linejoin: round; }

.kav-panel { fill: #221812; stroke: #f5f0e8; stroke-opacity: 0.12; }
.kav-panel-title { fill: #f5f0e8; font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
.kav-name { fill: #f5f0e8; font-size: 12px; font-weight: 700; }
.kav-small { fill: #bba791; font-size: 11px; font-weight: 500; }
.kav-avatar { fill: #e0b257; fill-opacity: 0.2; stroke: #e0b257; stroke-opacity: 0.5; }
.kav-avatar-text { fill: #f0c185; font-size: 10.5px; font-weight: 800; }
.kav-rail { fill: #f5f0e8; fill-opacity: 0.12; }
.kav-rail-fill { fill: #8fd6a3; }
.kav-rail-label { fill: #f5f0e8; font-size: 10px; font-weight: 600; }

.kav-row { fill: #f5f0e8; fill-opacity: 0.05; }
.kav-row-bar { fill: #e0b257; }
.kav-row-label { fill: #f5f0e8; font-size: 11.5px; font-weight: 600; }
.kav-row-amount { fill: #f5f0e8; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
.kav-check { fill: #8fd6a3; }
.kav-check-empty { fill: none; stroke: #f5f0e8; stroke-opacity: 0.25; stroke-dasharray: 2 2.5; }
.kav-check-mark { fill: none; stroke: #16261b; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.kav-clause { fill: #2e2119; stroke: #f5f0e8; stroke-opacity: 0.14; }
.kav-clause--copy { fill: #3a2a1d; stroke: #ec8f74; stroke-opacity: 0.8; }
.kav-clause-glow { fill: none; stroke: #ec8f74; stroke-width: 1.4; }
.kav-clause-text { fill: #f5f0e8; font-size: 10.5px; font-weight: 600; }
.kav-doc { fill: #f5f0e8; fill-opacity: 0.94; }
.kav-doc-title { fill: #2a1d15; font-size: 10.5px; font-weight: 800; }
.kav-doc-line { fill: #2a1d15; font-size: 10px; font-weight: 600; }
.kav-doc-text { fill: #2a1d15; fill-opacity: 0.16; }
.kav-sign-line { stroke: #2a1d15; stroke-opacity: 0.25; }
.kav-sign { fill: none; stroke: #23408e; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.kav-stamp { fill: none; stroke: #c8644c; stroke-width: 1.6; }
.kav-stamp-text { fill: #c8644c; font-size: 10.5px; font-weight: 800; letter-spacing: 0.02em; }

.kav-cell { stroke-width: 1; }
.kav-cell--later { fill: none; stroke: #f5f0e8; stroke-opacity: 0.18; }
.kav-cell--due { fill: #f0c185; fill-opacity: 0.12; stroke: #f0c185; }
.kav-cell--paid { fill: #8fd6a3; stroke: #8fd6a3; }
.kav-cell-text { font-size: 9.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.kav-cell-text--later { fill: #bba791; }
.kav-cell-text--due { fill: #f0c185; }
.kav-cell-text--paid { fill: #16261b; }
.kav-bubble { fill: #1f4a3c; }
.kav-bubble-title { fill: #f5f0e8; font-size: 11px; font-weight: 700; }
.kav-bubble-text { fill: #e6efe9; font-size: 11px; }
.kav-bubble-time { fill: #a9c4b8; font-size: 9px; }
.kav-ticks { fill: none; stroke: #a9c4b8; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.kav-ticks--read { stroke: #53bdeb; }

.kav-lock { fill: none; stroke-width: 1.8; stroke-linecap: round; }
.kav-amount { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.kav-badge { fill: #8fd6a3; }
.kav-badge-text { fill: #16261b; font-size: 11px; font-weight: 800; }
.kav-spark { fill: #c9f0d4; }
</style>
