<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilmClock } from '../film-clock';
import { mesinAskAt, mesinChapters, mesinDefaultQuestion, mesinDuration, mesinFrame, mesinPalette, mesinStill } from '../mesin-film';
import FilmControls from './FilmControls.vue';
import FilmFrame from './FilmFrame.vue';

// Pemutar film Mesin WhatsApp: seluruh gambar dihitung ulang oleh mesinFrame dari jam film.
const question = ref(mesinDefaultQuestion);
const { time, format, playing, chapter, seek, toggle } = useFilmClock({
  duration: mesinDuration,
  still: mesinStill,
  chapters: mesinChapters,
  onLoop: () => (question.value = mesinDefaultQuestion),
});
const frame = computed(() => mesinFrame(time.value, format.value, question.value));
const palette = mesinPalette;

function jump(index: number): void {
  seek(index);
  if (time.value < mesinChapters[2].start) question.value = mesinDefaultQuestion;
}

// Pengunjung memilih pertanyaan pembeli: Agen AI menjawab pertanyaan itu.
function ask(index: number): void {
  question.value = index;
  time.value = mesinAskAt;
}
</script>

<template>
  <div ref="film" :class="['film', `film--${frame.format}`]" :data-state="frame.state">
    <FilmFrame
      :width="frame.width"
      :height="frame.height"
      :format="frame.format"
      title="Simulasi Ketahanan Sistem"
      :subtitle="frame.subtitle"
      :chips="frame.chips"
      :caption="frame.caption"
    >
      <svg class="film-world wa-world" :viewBox="`0 0 ${frame.width} ${frame.height}`" aria-hidden="true">
        <defs>
          <radialGradient id="wa-bg" cx="34%" cy="44%" r="80%">
            <stop offset="0" stop-color="#173b5a" />
            <stop offset="1" stop-color="#071a2b" />
          </radialGradient>
          <radialGradient id="wa-alarm" cx="50%" cy="48%" r="75%">
            <stop offset="0.5" stop-color="#ff8795" stop-opacity="0" />
            <stop offset="1" stop-color="#ff8795" stop-opacity="0.85" />
          </radialGradient>
          <linearGradient id="wa-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#071a2b" stop-opacity="0.85" />
            <stop offset="0.16" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="0.76" stop-color="#071a2b" stop-opacity="0" />
            <stop offset="1" stop-color="#071a2b" stop-opacity="0.92" />
          </linearGradient>
          <pattern id="wa-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" :stroke="palette.ink" stroke-opacity="0.05" />
          </pattern>
          <filter id="wa-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath v-if="frame.campaign" id="wa-log">
            <rect x="0" :y="frame.campaign.logTop" :width="frame.panel?.w ?? 0" :height="frame.campaign.logHeight" />
          </clipPath>
        </defs>

        <rect :width="frame.width" :height="frame.height" fill="url(#wa-bg)" />

        <g :opacity="frame.fade">
          <g :transform="frame.camera">
            <rect :x="-frame.width" :y="-frame.height" :width="frame.width * 3" :height="frame.height * 3" fill="url(#wa-grid)" />

            <!-- Rak server, masing-masing menjalankan dua belas nomor WhatsApp pelanggan. -->
            <g v-for="rack in frame.racks" :key="rack.label" :transform="rack.transform" :opacity="rack.opacity">
              <rect :x="rack.x" :y="rack.y" :width="rack.w" :height="rack.h" rx="10" :class="['wa-rack', { 'wa-rack--dead': rack.dead }]" />
              <text :x="rack.x + 9" :y="rack.y + 17" class="wa-rack-label">{{ rack.label }}</text>
              <circle :cx="rack.x + rack.w - 9" :cy="rack.y + 13" r="3" :fill="rack.color" filter="url(#wa-glow)" />
              <text v-if="rack.dead" :x="rack.x + 9" :y="rack.y + 29.5" class="wa-rack-dead">mati</text>
              <template v-else>
                <rect :x="rack.x + 9" :y="rack.y + 23" :width="rack.w - 20" height="3" rx="1.5" class="wa-load" />
                <rect :x="rack.x + 9" :y="rack.y + 23" :width="rack.load" height="3" rx="1.5" class="wa-load-fill" />
              </template>
            </g>

            <g
              v-for="slot in frame.slots"
              :key="slot.id"
              :transform="`translate(${slot.x + slot.w / 2} ${slot.y + slot.h / 2}) scale(${slot.scale}) translate(${-slot.w / 2} ${-slot.h / 2})`"
              :opacity="slot.opacity"
              :filter="slot.trail ? 'url(#wa-glow)' : undefined"
            >
              <rect
                :width="slot.w"
                :height="slot.h"
                rx="4"
                :class="['wa-slot', { 'wa-slot--empty': slot.empty, 'wa-slot--hero': slot.hero && !slot.empty }]"
                :fill="slot.fill"
                :stroke="slot.fill"
              />
              <text v-if="slot.hero && !slot.empty" :x="slot.w / 2" :y="slot.h / 2 + 3" text-anchor="middle" class="wa-slot-text">KD</text>
              <circle v-else-if="!slot.empty" :cx="slot.w - 5" cy="5" r="1.8" :fill="slot.fill" :opacity="slot.lit" />
            </g>
            <circle v-for="(ring, index) in frame.rings" :key="`ring-${index}`" :cx="ring.x" :cy="ring.y" :r="ring.r" :opacity="ring.opacity" class="wa-ring" />

            <!-- Kabel dari nomor Toko Aira ke ponselnya, dengan kilau pesan yang berjalan. -->
            <path
              v-if="frame.cable"
              :d="frame.cable.d"
              pathLength="100"
              :class="['wa-cable', { 'wa-cable--broken': frame.cable.broken }]"
              :stroke="frame.cable.color"
              :stroke-dasharray="frame.cable.broken ? '2 4' : `${frame.cable.draw * 100} 100`"
              :opacity="frame.cable.opacity"
            />
            <g filter="url(#wa-glow)">
              <circle v-for="(packet, index) in frame.packets" :key="`packet-${index}`" :cx="packet.x" :cy="packet.y" :r="packet.r" :opacity="packet.opacity" class="wa-packet" />
            </g>
          </g>

          <!-- Ponsel Toko Aira: portal pemindai QR, chat pembeli, lalu kampanye. -->
          <g v-if="frame.panel" :transform="frame.panel.transform" :opacity="frame.panel.opacity">
            <rect :width="frame.panel.w" :height="frame.panel.h" rx="14" class="wa-panel" />
            <g transform="translate(28 25)">
              <circle r="13" class="wa-avatar" />
              <text y="3.8" text-anchor="middle" class="wa-avatar-text">{{ frame.panel.owner.initials }}</text>
            </g>
            <text x="50" y="22" class="wa-name">{{ frame.panel.owner.name }}</text>
            <text x="50" y="37" class="wa-small">{{ frame.qr ? 'Hubungkan ruang' : frame.chat ? `Interaksi: ${frame.chat.buyer.name}` : 'Urutan materi' }}</text>
            <line x1="0" :x2="frame.panel.w" y1="48" y2="48" class="wa-divider" />

            <!-- Portal: kode QR yang dipindai sekali saja. -->
            <g v-if="frame.qr" :transform="`translate(0 ${frame.qr.y})`" :opacity="frame.qr.opacity">
              <g :transform="`translate(${frame.qr.x} ${frame.qr.top})`">
                <rect x="-8" y="-8" :width="frame.qr.size + 16" :height="frame.qr.size + 16" rx="8" class="wa-qr-card" />
                <rect
                  v-for="(module, index) in frame.qr.modules"
                  :key="`qr-${index}`"
                  :x="module.x"
                  :y="module.y"
                  :width="frame.qr.cell"
                  :height="frame.qr.cell"
                  :opacity="module.opacity"
                  class="wa-qr-module"
                />
                <line
                  v-if="frame.qr.scan"
                  x1="-10"
                  :x2="frame.qr.size + 10"
                  :y1="frame.qr.scan.y"
                  :y2="frame.qr.scan.y"
                  :opacity="frame.qr.scan.opacity"
                  class="wa-qr-scan"
                  filter="url(#wa-glow)"
                />
                <g v-if="frame.qr.check" :transform="`translate(${frame.qr.size / 2} ${frame.qr.size / 2}) scale(${frame.qr.check.scale})`">
                  <circle r="24" class="wa-check" />
                  <path d="M-9 0l6 6 12-13" pathLength="100" :stroke-dasharray="`${frame.qr.check.draw * 100} 100`" class="wa-check-mark" />
                </g>
              </g>
              <text :x="frame.panel.w / 2" :y="frame.qr.textY" text-anchor="middle" class="wa-qr-title" :fill="frame.qr.titleColor">{{ frame.qr.title }}</text>
              <text :x="frame.panel.w / 2" :y="frame.qr.textY + 17" text-anchor="middle" class="wa-small">{{ frame.qr.detail }}</text>
            </g>

            <!-- Chat: pertanyaan pembeli dan balasan Agen AI. -->
            <g v-if="frame.chat" :transform="`translate(0 ${frame.chat.y})`" :opacity="frame.chat.opacity">
              <g
                v-if="frame.chat.ask"
                :transform="`translate(12 ${frame.chat.ask.y}) translate(0 ${frame.chat.ask.h}) scale(${frame.chat.ask.scale}) translate(0 ${-frame.chat.ask.h})`"
                :opacity="frame.chat.ask.opacity"
              >
                <rect :width="frame.chat.ask.w" :height="frame.chat.ask.h" rx="10" class="wa-bubble-in" />
                <text v-for="(line, index) in frame.chat.ask.lines" :key="line" x="10" :y="17 + index * 14" class="wa-bubble-text">{{ line }}</text>
              </g>
              <g v-if="frame.chat.typing" :transform="`translate(${frame.panel.w - 76} ${frame.chat.typing.y})`" :opacity="frame.chat.typing.opacity">
                <text x="-8" y="18" text-anchor="end" class="wa-small">Menyiapkan respons</text>
                <rect width="64" height="28" rx="10" class="wa-bubble-out" />
                <circle v-for="(lift, index) in frame.chat.typing.dots" :key="`dot-${index}`" :cx="20 + index * 12" :cy="14 + lift" r="2.6" class="wa-typing-dot" />
              </g>
              <g
                v-if="frame.chat.reply"
                :transform="`translate(${frame.chat.reply.x + frame.chat.reply.w} ${frame.chat.reply.y + frame.chat.reply.h}) scale(${frame.chat.reply.scale}) translate(${-frame.chat.reply.w} ${-frame.chat.reply.h})`"
                :opacity="frame.chat.reply.opacity"
              >
                <rect :width="frame.chat.reply.w" :height="frame.chat.reply.h" rx="10" class="wa-bubble-out" />
                <text x="10" y="16" class="wa-bubble-agent">Panduan belajar</text>
                <text v-for="(line, index) in frame.chat.reply.lines" :key="line" x="10" :y="32 + index * 14" class="wa-bubble-text">{{ line }}</text>
                <text :x="frame.chat.reply.w - 26" :y="frame.chat.reply.h - 8" text-anchor="end" class="wa-bubble-time">10.41</text>
                <g :transform="`translate(${frame.chat.reply.w - 22} ${frame.chat.reply.h - 15})`" :class="['wa-ticks', `wa-ticks--${frame.chat.reply.tick}`]">
                  <path d="M1 4.5l2.4 2.4 5-5.6" />
                  <path v-if="frame.chat.reply.tick !== 'sent'" d="M6.2 6.9L11.2 1.3" />
                </g>
              </g>

              <g v-if="frame.chat.chips" :opacity="frame.chat.chips.opacity">
                <text :x="frame.panel.w / 2" :y="frame.chat.chips.hintY" text-anchor="middle" class="wa-hint">Pilih pemantik pembelajaran</text>
                <g v-for="item in frame.chat.chips.items" :key="item.label" :transform="`translate(${item.x} ${item.y})`" :opacity="item.faded ? 0.35 : 1">
                  <rect :width="item.w" height="28" rx="14" :class="['wa-quick', { 'wa-quick--chosen': item.chosen }]" />
                  <text :x="item.w / 2" y="18" text-anchor="middle" class="wa-quick-text">{{ item.label }}</text>
                  <rect v-if="frame.chat.chips.pickable" :width="item.w" height="28" rx="14" class="wa-hit" @click="ask(item.index)" />
                </g>
              </g>
              <g v-if="frame.chat.cursor" :transform="`translate(${frame.chat.cursor.x} ${frame.chat.cursor.y}) scale(${frame.chat.cursor.scale})`" :opacity="frame.chat.cursor.opacity">
                <path d="M0 0V15l4-4 3.5 7 2.6-1.2-3.4-6.8H12z" class="wa-cursor" />
              </g>
            </g>

            <!-- Smart campaign: terkirim bertahap, ditahan saat server mati, lalu lanjut. -->
            <g v-if="frame.campaign" :transform="`translate(0 ${frame.campaign.y})`" :opacity="frame.campaign.opacity">
              <text x="18" y="74" class="wa-campaign-title">Urutan materi belajar</text>
              <text x="18" y="91" class="wa-small">Simulasi tahapan yang berjalan berurutan</text>
              <g :transform="`translate(${frame.panel.w - 18} 66)`">
                <rect x="-92" y="-1" width="92" height="22" rx="11" class="wa-status" :fill="frame.campaign.statusColor" />
                <text x="-46" y="14" text-anchor="middle" class="wa-status-text" :fill="frame.campaign.statusColor">{{ frame.campaign.status }}</text>
              </g>
              <text x="18" y="128" class="wa-count">
                <tspan class="wa-count-big">{{ frame.campaign.sent }}</tspan>
                <tspan dx="6" class="wa-count-total">{{ frame.campaign.total }}</tspan>
              </text>
              <rect x="18" y="138" :width="frame.campaign.barWidth" height="4" rx="2" class="wa-bar" />
              <rect x="18" y="138" :width="frame.campaign.bar" height="4" rx="2" :fill="frame.campaign.barColor" />

              <g clip-path="url(#wa-log)">
                <g v-for="row in frame.campaign.log" :key="row.key" :transform="`translate(18 ${frame.campaign.logTop + row.y - 8})`" :opacity="row.opacity">
                  <text y="0" class="wa-log-name">{{ row.name }}</text>
                  <text :x="frame.panel.w - 74" y="0" text-anchor="end" class="wa-log-number">tahap ke-{{ row.number }}</text>
                  <g :transform="`translate(${frame.panel.w - 66} -8)`" class="wa-ticks wa-ticks--delivered">
                    <path d="M1 4.5l2.4 2.4 5-5.6" />
                    <path d="M6.2 6.9L11.2 1.3" />
                  </g>
                </g>
              </g>

              <g v-if="frame.campaign.alert" :transform="`translate(18 ${frame.campaign.logTop + 8}) scale(${frame.campaign.alert.scale})`" :opacity="frame.campaign.alert.opacity">
                <rect :width="frame.campaign.barWidth" height="58" rx="10" class="wa-alert" :stroke="frame.campaign.alert.color" />
                <text x="12" y="22" class="wa-alert-title" :fill="frame.campaign.alert.color">{{ frame.campaign.alert.title }}</text>
                <text x="12" y="39" class="wa-small">{{ frame.campaign.alert.detail }}</text>
                <rect x="12" y="47" :width="frame.campaign.barWidth - 24" height="3" rx="1.5" class="wa-bar" />
                <rect x="12" y="47" :width="(frame.campaign.barWidth - 24) * frame.campaign.alert.progress" height="3" rx="1.5" :fill="frame.campaign.alert.color" />
              </g>

              <g v-if="frame.campaign.done" :transform="`translate(18 ${frame.campaign.logTop + 8})`">
                <g :transform="`scale(${frame.campaign.done.scale})`" :opacity="frame.campaign.done.opacity">
                  <rect :width="frame.campaign.barWidth" height="58" rx="10" class="wa-alert wa-alert--done" />
                  <text x="12" y="25" class="wa-alert-title wa-alert-title--done">{{ frame.campaign.done.title }}</text>
                  <text x="12" y="42" class="wa-small">{{ frame.campaign.done.detail }}</text>
                </g>
                <g :transform="`translate(${frame.campaign.barWidth - 26} 29) scale(${frame.campaign.done.check})`">
                  <circle r="12" class="wa-check" />
                  <path d="M-5 0l3.4 3.4 6.6-7" class="wa-check-mark wa-check-mark--small" />
                </g>
                <circle
                  v-for="(spark, index) in frame.campaign.done.sparks"
                  :key="`spark-${index}`"
                  :cx="frame.campaign.barWidth - 26 + spark.x"
                  :cy="29 + spark.y"
                  :r="spark.r"
                  :opacity="spark.opacity"
                  class="wa-spark"
                />
              </g>
            </g>
          </g>
        </g>

        <rect :width="frame.width" :height="frame.height" fill="url(#wa-shade)" />
        <rect v-if="frame.alarm > 0" :width="frame.width" :height="frame.height" fill="url(#wa-alarm)" :opacity="frame.alarm" />
        <rect v-if="frame.flash > 0" :width="frame.width" :height="frame.height" fill="#fff6ee" :opacity="frame.flash" />
      </svg>
    </FilmFrame>

    <FilmControls :chapters="mesinChapters" :duration="mesinDuration" :time="time" :current="chapter" :playing="playing" @toggle="toggle" @seek="jump" />
  </div>
</template>

<style scoped>
/* Lampu server dan gelembung chat terbaca karena layar film selalu gelap, di mode terang maupun gelap. */
.film { display: grid; gap: 12px; width: 100%; }
.film-world { display: block; width: 100%; height: 100%; font-family: inherit; }
.wa-world * { pointer-events: none; }
.wa-world .wa-hit { fill: transparent; stroke: transparent; stroke-width: 1.5; cursor: pointer; pointer-events: all; }
.wa-hit:hover { stroke: #eaf6ff; }

.wa-rack { fill: #102c45; stroke: #eaf6ff; stroke-opacity: 0.18; }
.wa-rack--dead { fill: #3b2534; stroke: #ff8795; stroke-opacity: 0.7; }
.wa-rack-label { fill: #eaf6ff; font-size: 10px; font-weight: 700; }
.wa-rack-dead { fill: #ff8795; font-size: 9.5px; font-weight: 700; }
.wa-load { fill: #eaf6ff; fill-opacity: 0.1; }
.wa-load-fill { fill: #68d7b0; fill-opacity: 0.75; }
.wa-slot { fill-opacity: 0.16; stroke-opacity: 0.6; stroke-width: 1; }
.wa-slot--empty { fill: none; stroke: #eaf6ff; stroke-opacity: 0.2; stroke-dasharray: 2 2.5; }
.wa-slot--hero { fill-opacity: 0.95; stroke-opacity: 1; }
.wa-slot-text { fill: #102c45; font-size: 7.5px; font-weight: 800; }
.wa-ring { fill: none; stroke: #68d7b0; stroke-width: 1.4; }
.wa-cable { fill: none; stroke-width: 1.6; stroke-opacity: 0.55; stroke-linecap: round; }
.wa-cable--broken { stroke-opacity: 0.7; }
.wa-packet { fill: #c8f4ff; }

.wa-panel { fill: #102c45; stroke: #eaf6ff; stroke-opacity: 0.18; }
.wa-avatar { fill: #68d7b0; fill-opacity: 0.18; stroke: #68d7b0; stroke-opacity: 0.55; }
.wa-avatar-text { fill: #c8f4ff; font-size: 10px; font-weight: 800; }
.wa-name { fill: #eaf6ff; font-size: 13px; font-weight: 800; }
.wa-small { fill: #9bb6ca; font-size: 11px; font-weight: 500; }
.wa-divider { stroke: #eaf6ff; stroke-opacity: 0.1; }
.wa-hint { fill: #9bb6ca; font-size: 10.5px; font-weight: 600; }

.wa-qr-card { fill: #eaf6ff; }
.wa-qr-module { fill: #102c45; }
.wa-qr-scan { stroke: #68d7b0; stroke-width: 2.4; stroke-linecap: round; }
.wa-check { fill: #68d7b0; }
.wa-check-mark { fill: none; stroke: #102c45; stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round; }
.wa-qr-title { font-size: 13px; font-weight: 800; }

.wa-bubble-in { fill: #173b5a; }
.wa-bubble-out { fill: #183e5a; }
.wa-bubble-text { fill: #eaf6ff; font-size: 11px; }
.wa-bubble-agent { fill: #68d7b0; font-size: 9.5px; font-weight: 800; }
.wa-bubble-time { fill: #9bb6ca; font-size: 9px; }
.wa-typing-dot { fill: #9bb6ca; }
.wa-ticks { fill: none; stroke: #9bb6ca; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.wa-ticks--read { stroke: #5fc7ff; }
.wa-quick { fill: #102c45; stroke: #68d7b0; stroke-opacity: 0.45; }
.wa-quick--chosen { fill: #183e5a; stroke-opacity: 1; }
.wa-quick-text { fill: #eaf6ff; font-size: 11px; font-weight: 700; }
.wa-cursor { fill: #eaf6ff; stroke: #071a2b; stroke-width: 1.2; stroke-linejoin: round; }

.wa-campaign-title { fill: #eaf6ff; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
.wa-status { fill-opacity: 0.16; }
.wa-status-text { font-size: 10.5px; font-weight: 700; }
.wa-count { font-variant-numeric: tabular-nums; }
.wa-count-big { fill: #eaf6ff; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
.wa-count-total { fill: #9bb6ca; font-size: 11.5px; font-weight: 600; }
.wa-bar { fill: #eaf6ff; fill-opacity: 0.1; }
.wa-log-name { fill: #eaf6ff; font-size: 11.5px; font-weight: 600; }
.wa-log-number { fill: #9bb6ca; font-size: 10.5px; font-variant-numeric: tabular-nums; }
.wa-alert { fill: #102c45; stroke-width: 1.2; }
.wa-alert-title { font-size: 12px; font-weight: 800; }
.wa-alert--done { stroke: #68d7b0; }
.wa-alert-title--done { fill: #68d7b0; }
.wa-check-mark--small { stroke-width: 2.2; }
.wa-spark { fill: #c8f4ff; }
</style>
