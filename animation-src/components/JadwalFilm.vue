<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilmClock } from '../film-clock';
import { jadwalChapters, jadwalDefaultTeacher, jadwalDuration, jadwalFocusAt, jadwalFrame, jadwalPalette, jadwalStill } from '../jadwal-film';
import FilmControls from './FilmControls.vue';
import FilmFrame from './FilmFrame.vue';

// Pemutar film penjadwal guru: seluruh gambar dihitung ulang oleh jadwalFrame dari jam film.
const teacher = ref(jadwalDefaultTeacher);
const { time, format, playing, chapter, seek, toggle } = useFilmClock({
  duration: jadwalDuration,
  still: jadwalStill,
  chapters: jadwalChapters,
  onLoop: () => (teacher.value = jadwalDefaultTeacher),
});
const frame = computed(() => jadwalFrame(time.value, format.value, teacher.value));
const palette = jadwalPalette;

function jump(index: number): void {
  seek(index);
  if (time.value < jadwalChapters[4].start) teacher.value = jadwalDefaultTeacher;
}

// Pengunjung mengklik satu mapel di jadwal yang sudah rampung: jadwal gurunya disorot.
function spotlight(name: string): void {
  teacher.value = name;
  time.value = jadwalFocusAt;
}
</script>

<template>
  <div ref="film" :class="['film', `film--${frame.format}`]" :data-state="frame.state">
    <FilmFrame
      :width="frame.width"
      :height="frame.height"
      :format="frame.format"
      title="Ilustrasi jadwal sekolah"
      :subtitle="frame.subtitle"
      :chips="frame.chips"
      :caption="frame.caption"
    >
      <svg class="film-world jad-world" :viewBox="`0 0 ${frame.width} ${frame.height}`" aria-hidden="true">
        <defs>
          <radialGradient id="jad-bg" cx="45%" cy="42%" r="80%">
            <stop offset="0" stop-color="#163b5c" />
            <stop offset="1" stop-color="#071a2b" />
          </radialGradient>
          <radialGradient id="jad-alarm" cx="50%" cy="48%" r="75%">
            <stop offset="0.5" stop-color="#ff876d" stop-opacity="0" />
            <stop offset="1" stop-color="#ff876d" stop-opacity="0.85" />
          </radialGradient>
          <linearGradient id="jad-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#071a2b" stop-opacity="0.85" />
            <stop offset="0.16" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="0.76" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="1" stop-color="#071a2b" stop-opacity="0.92" />
          </linearGradient>
          <pattern id="jad-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" :stroke="palette.ink" stroke-opacity="0.18" stroke-width="2.4" />
          </pattern>
          <clipPath id="jad-tray">
            <rect :x="frame.tray.clip.x" :y="frame.tray.clip.y" :width="frame.tray.clip.w" :height="frame.tray.clip.h" />
          </clipPath>
          <filter id="jad-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.55" />
          </filter>
        </defs>

        <rect :width="frame.width" :height="frame.height" fill="url(#jad-bg)" />

        <g :opacity="frame.fade">
          <g :transform="frame.camera">
            <!-- Kisi minggu: hari, jam, dan petak kosong. -->
            <text v-for="day in frame.days" :key="day.label" :x="day.x" :y="day.y" :opacity="day.opacity" text-anchor="middle" class="jad-day">{{ day.label }}</text>
            <text v-for="hour in frame.hours" :key="`jam-${hour.label}`" :x="hour.x" :y="hour.y" :opacity="hour.opacity" text-anchor="middle" class="jad-hour">{{ hour.label }}</text>
            <rect v-for="(slot, index) in frame.slots" :key="`slot-${index}`" :x="slot.x" :y="slot.y" :width="slot.w" :height="slot.h" rx="7" :opacity="slot.opacity" class="jad-slot" />

            <!-- Slot guru yang tidak tersedia. -->
            <g
              v-if="frame.unavailable.scale > 0"
              :transform="`translate(0 ${frame.unavailable.y}) scale(1 ${frame.unavailable.scale}) translate(0 ${-frame.unavailable.y})`"
              :opacity="frame.unavailable.opacity"
            >
              <rect :x="frame.unavailable.x" :y="frame.unavailable.y" :width="frame.unavailable.w" :height="frame.unavailable.h" rx="7" fill="url(#jad-hatch)" />
              <rect
                :x="frame.unavailable.x"
                :y="frame.unavailable.y"
                :width="frame.unavailable.w"
                :height="frame.unavailable.h"
                rx="7"
                class="jad-busy"
                :stroke="frame.unavailable.stroke"
                :fill="frame.unavailable.stroke"
                :fill-opacity="frame.unavailable.fillOpacity"
              />
              <text :x="frame.unavailable.label.x" :y="frame.unavailable.label.y - 3" text-anchor="middle" class="jad-busy-text" :fill="frame.unavailable.label.color" :opacity="frame.unavailable.label.opacity">Guru J</text>
              <text :x="frame.unavailable.label.x" :y="frame.unavailable.label.y + 9" text-anchor="middle" class="jad-busy-text" :fill="frame.unavailable.label.color" :opacity="frame.unavailable.label.opacity">berhalangan</text>
            </g>

            <rect v-for="(band, index) in frame.bands" :key="`band-${index}`" :x="band.x" :y="band.y" :width="band.w" :height="band.h" rx="10" :opacity="band.opacity" class="jad-band" />

            <!-- Percobaan slot lain untuk Fisika. -->
            <g v-for="probe in frame.probes" :key="`probe-${probe.x}`" :opacity="probe.opacity">
              <rect :x="probe.x" :y="probe.y" :width="probe.w" :height="probe.h" rx="7" :class="['jad-probe', { 'jad-probe--ok': probe.ok }]" />
              <g v-if="probe.mark > 0" :transform="`translate(${probe.x + probe.w / 2} ${probe.y + probe.h / 2}) scale(${probe.mark})`" :class="['jad-mark', { 'jad-mark--ok': probe.ok }]">
                <circle r="9" />
                <path v-if="probe.ok" d="M-3.6 0l2.5 2.5 4.8-5.2" />
                <path v-else d="M-3 -3l6 6M3 -3l-6 6" />
              </g>
            </g>

            <!-- Jam pelajaran. -->
            <g v-for="block in frame.blocks" :key="block.id" :transform="block.transform" :opacity="block.opacity">
              <rect
                v-if="block.ring > 0"
                :x="block.x - 2 - 6 * (1 - block.ring)"
                :y="block.y - 2 - 6 * (1 - block.ring)"
                :width="block.w + 4 + 12 * (1 - block.ring)"
                :height="block.h + 4 + 12 * (1 - block.ring)"
                rx="10"
                class="jad-landing"
                :opacity="block.ring * 0.7"
              />
              <rect v-if="block.focus > 0" :x="block.x - 3" :y="block.y - 3" :width="block.w + 6" :height="block.h + 6" rx="9" class="jad-focus" :opacity="block.focus" />
              <rect :x="block.x" :y="block.y" :width="block.w" :height="block.h" rx="7" :fill="block.fill" class="jad-block" :filter="block.shadow > 0.05 ? 'url(#jad-shadow)' : undefined" />
              <text :x="block.cx" :y="block.cy - 1" text-anchor="middle" class="jad-subject">{{ block.subject }}</text>
              <text :x="block.cx" :y="block.cy + 11" text-anchor="middle" class="jad-teacher">{{ block.teacher }}</text>
              <g v-if="block.locked" :transform="`translate(${block.x + block.w - 4} ${block.y + 4}) scale(${block.locked})`" class="jad-lock">
                <circle r="7.5" />
                <path d="M-2.4 -0.6V-2.2a2.4 2.4 0 0 1 4.8 0v1.6" />
                <rect x="-3.4" y="-0.6" width="6.8" height="4.6" rx="1" />
              </g>
              <rect v-if="block.clickable" :x="block.x" :y="block.y" :width="block.w" :height="block.h" rx="7" class="jad-hit" @click="spotlight(block.teacher)" />
            </g>

            <!-- Petak yang penuh pada hari ketersediaan guru. -->
            <template v-for="(slot, index) in frame.slots" :key="`full-${index}`">
              <g v-if="slot.full > 0" :transform="`translate(${slot.x + slot.w - 9} ${slot.y + 9}) scale(${slot.full})`" class="jad-mark">
                <circle r="6.5" />
                <path d="M-2.2 -2.2l4.4 4.4M2.2 -2.2l-4.4 4.4" />
              </g>
            </template>
          </g>

          <!-- Baki: aturan, antrean, jadwal guru, dan penolakan. -->
          <text :x="frame.tray.x" :y="frame.tray.titleY" class="jad-tray-title" :opacity="frame.tray.title.opacity">{{ frame.tray.title.text }}</text>
          <text v-if="frame.tray.title.count" :x="frame.tray.titleEnd" :y="frame.tray.titleY" text-anchor="end" class="jad-tray-count" :opacity="frame.tray.title.opacity">
            {{ frame.tray.title.count }}
          </text>

          <g v-for="rule in frame.ruleCards" :key="rule.title" :transform="`translate(${rule.x} ${rule.y})`" :opacity="rule.opacity">
            <rect :width="rule.w" :height="rule.h" rx="9" class="jad-card" />
            <rect x="0" y="8" width="3" :height="rule.h - 16" rx="1.5" :fill="rule.color" />
            <text :x="frame.ruleText.title.x" :y="frame.ruleText.title.y" class="jad-card-title">{{ rule.title }}</text>
            <text :x="frame.ruleText.note.x" :y="frame.ruleText.note.y" class="jad-card-note">{{ rule.note }}</text>
          </g>

          <g clip-path="url(#jad-tray)">
            <g v-for="card in frame.cards" :key="card.id" :transform="`translate(${card.x} ${card.y})`" :opacity="card.opacity">
              <rect :width="card.w" :height="card.h" rx="8" class="jad-card" />
              <rect x="0" y="6" width="3" :height="card.h - 12" rx="1.5" :fill="card.tone" />
              <text :x="frame.cardText.name.x" :y="frame.cardText.name.y" class="jad-card-title">{{ card.subject }}</text>
              <text :x="frame.cardText.teacher.x" :y="frame.cardText.teacher.y" class="jad-card-note">{{ card.teacher }}</text>
              <text :x="frame.cardText.hours.x" :y="frame.cardText.hours.y" text-anchor="end" class="jad-card-note">{{ card.hours }}</text>
            </g>
          </g>

          <g v-if="frame.focus" :transform="`translate(${frame.focus.x} ${frame.focus.y})`" :opacity="frame.focus.opacity">
            <rect :width="frame.focus.w" :height="frame.focus.h" rx="10" class="jad-card jad-card--focus" />
            <text :x="frame.focus.name.x" :y="frame.focus.name.y" class="jad-focus-name">{{ frame.focus.name.text }}</text>
            <text :x="frame.focus.detail.x" :y="frame.focus.detail.y" class="jad-card-note">{{ frame.focus.detail.text }}</text>
            <text :x="frame.focus.clean.x" :y="frame.focus.clean.y" :text-anchor="frame.focus.clean.anchor" class="jad-clean">tanpa bentrok</text>
          </g>
          <g v-if="frame.hint" :opacity="frame.hint.opacity">
            <text v-for="(line, index) in frame.hint.lines" :key="line" :x="frame.hint.x" :y="frame.hint.y + index * 14" class="jad-hint">{{ line }}</text>
          </g>

          <g v-if="frame.request" :transform="`translate(${frame.request.x} ${frame.request.y})`" :opacity="frame.request.opacity">
            <rect :width="frame.request.w" :height="frame.request.h" rx="8" class="jad-card jad-card--request" />
            <rect x="0" y="6" width="3" :height="frame.request.h - 12" rx="1.5" :fill="frame.request.tone" />
            <text :x="frame.cardText.name.x" :y="frame.cardText.name.y" class="jad-card-title">{{ frame.request.subject }}</text>
            <text :x="frame.cardText.teacher.x" :y="frame.cardText.teacher.y" class="jad-card-note">{{ frame.request.teacher }}</text>
            <text :x="frame.cardText.hours.x" :y="frame.cardText.hours.y" text-anchor="end" class="jad-card-note">1 jam</text>
          </g>

          <g v-if="frame.refusal" :transform="`translate(${frame.refusal.x} ${frame.refusal.y})`" :opacity="frame.refusal.opacity">
            <rect :width="frame.refusal.w" :height="frame.refusal.h" rx="10" class="jad-card jad-card--refusal" />
            <g transform="translate(22 22)" class="jad-alert">
              <circle r="8" />
              <path d="M0 -3.8v4.2M0 3.4v0.2" />
            </g>
            <text x="38" y="26" class="jad-refusal-title">Tidak bisa disusun</text>
            <text v-for="(line, index) in frame.refusal.bodyLines" :key="line" x="14" :y="frame.refusal.body[index]" class="jad-refusal-body">{{ line }}</text>
            <text v-for="(line, index) in frame.refusal.tipLines" :key="line" x="14" :y="frame.refusal.tip[index]" class="jad-card-note">{{ line }}</text>
          </g>
        </g>

        <rect :width="frame.width" :height="frame.height" fill="url(#jad-shade)" />
        <rect v-if="frame.alarm > 0" :width="frame.width" :height="frame.height" fill="url(#jad-alarm)" :opacity="frame.alarm" />
      </svg>
    </FilmFrame>

    <FilmControls :chapters="jadwalChapters" :duration="jadwalDuration" :time="time" :current="chapter" :playing="playing" @toggle="toggle" @seek="jump" />
  </div>
</template>

<style scoped>
/* Warna mapel terbaca karena layar film selalu gelap, di mode terang maupun gelap. */
.film { display: grid; gap: 12px; width: 100%; }
.film-world { display: block; width: 100%; height: 100%; font-family: inherit; }
.jad-world * { pointer-events: none; }
.jad-world .jad-hit { fill: transparent; stroke: transparent; stroke-width: 2; cursor: pointer; pointer-events: all; }
.jad-hit:hover { stroke: #eef7ff; }

.jad-day { fill: #9bb8cf; font-size: 11.5px; font-weight: 700; }
.jad-hour { fill: #9bb8cf; font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums; }
.jad-slot { fill: #eef7ff; fill-opacity: 0.03; stroke: #eef7ff; stroke-opacity: 0.1; }
.jad-busy { stroke-width: 1.2; stroke-dasharray: 4 3; }
.jad-busy-text { font-size: 9.5px; font-weight: 700; }
.jad-band { fill: none; stroke: #85cfff; stroke-width: 1.6; stroke-dasharray: 5 4; }
.jad-probe { fill: none; stroke: #f7bf63; stroke-width: 1.6; stroke-dasharray: 4 3; }
.jad-probe--ok { stroke: #7ce0b7; }
.jad-mark circle { fill: #ff876d; }
.jad-mark path { fill: none; stroke: #071a2b; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.jad-mark--ok circle { fill: #7ce0b7; }
.jad-mark--ok path { stroke: #071a2b; }

.jad-block { stroke: #071a2b; stroke-opacity: 0.35; }
.jad-subject { fill: #082039; font-size: 11.5px; font-weight: 800; }
.jad-teacher { fill: #082039; fill-opacity: 0.7; font-size: 9px; font-weight: 600; }
.jad-landing { fill: none; stroke: #eef7ff; stroke-width: 1.4; }
.jad-focus { fill: none; stroke: #7ce0b7; stroke-width: 2; }
.jad-lock circle { fill: #eef7ff; stroke: #071a2b; stroke-opacity: 0.4; }
.jad-lock path { fill: none; stroke: #082039; stroke-width: 1.3; stroke-linecap: round; }
.jad-lock rect { fill: #082039; }

.jad-tray-title { fill: #eef7ff; font-size: 11.5px; font-weight: 700; }
.jad-tray-count { fill: #9bb8cf; font-size: 10.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.jad-card { fill: #102b45; stroke: #eef7ff; stroke-opacity: 0.12; }
.jad-card--focus { stroke: #7ce0b7; stroke-opacity: 0.6; }
.jad-card--request { stroke: #85cfff; stroke-opacity: 0.9; stroke-dasharray: 4 3; }
.jad-card--refusal { stroke: #f7bf63; stroke-opacity: 0.55; }
.jad-card-title { fill: #eef7ff; font-size: 11.5px; font-weight: 700; }
.jad-card-note { fill: #9bb8cf; font-size: 10px; font-weight: 500; }
.jad-focus-name { fill: #eef7ff; font-size: 14px; font-weight: 800; }
.jad-clean { fill: #7ce0b7; font-size: 11px; font-weight: 700; }
.jad-hint { fill: #9bb8cf; font-size: 10.5px; font-weight: 600; }
.jad-alert circle { fill: #f7bf63; }
.jad-alert path { stroke: #071a2b; stroke-width: 2; stroke-linecap: round; }
.jad-refusal-title { fill: #f7bf63; font-size: 12.5px; font-weight: 800; }
.jad-refusal-body { fill: #eef7ff; font-size: 11px; font-weight: 500; }
</style>
