<script setup lang="ts">
import type { FilmChapter } from '../film-clock';

// Kendali film: jeda atau putar, dan bab yang bisa dilompati, masing-masing dengan garis kemajuannya.
const props = defineProps<{ chapters: readonly FilmChapter[]; duration: number; time: number; current: number; playing: boolean }>();
defineEmits<{ toggle: []; seek: [index: number] }>();

function progress(index: number): number {
  const start = props.chapters[index]!.start;
  const end = props.chapters[index + 1]?.start ?? props.duration;
  return Math.min(Math.max((props.time - start) / (end - start), 0), 1);
}
</script>

<template>
  <div class="film-controls">
    <button type="button" class="film-play" :aria-label="playing ? 'Jeda film' : 'Putar film'" @click="$emit('toggle')">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path v-if="playing" class="film-play-pause" d="M5.5 3.5v9M10.5 3.5v9" />
        <path v-else class="film-play-start" d="M5 3v10l8-5z" />
      </svg>
    </button>
    <ol class="film-chapters" aria-label="Bab film" :style="{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }">
      <li v-for="(chapter, index) in chapters" :key="chapter.label">
        <button type="button" :aria-current="index === current ? 'step' : undefined" @click="$emit('seek', index)">
          <span class="film-chapter-bar"><span :style="{ transform: `scaleX(${progress(index)})` }" /></span>
          {{ chapter.label }}
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
/* Kendali film berada di halaman, jadi mengikuti warna halaman. */
.film-controls { display: flex; align-items: flex-start; gap: 12px; }
.film-play {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  color: var(--fg);
  cursor: pointer;
}
.film-play svg { width: 14px; height: 14px; }
.film-play-pause { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
.film-play-start { fill: currentColor; }
.film-chapters { display: grid; flex: 1; gap: 6px; margin: 0; padding: 0; list-style: none; }
.film-chapters button {
  display: grid;
  gap: 7px;
  width: 100%;
  padding: 6px 0 0;
  border: 0;
  background: none;
  color: var(--muted);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.film-chapters button[aria-current] { color: var(--fg); }
.film-chapter-bar { display: block; height: 3px; overflow: hidden; border-radius: 2px; background: var(--line); }
.film-chapter-bar span { display: block; height: 100%; background: var(--fg); transform-origin: left; }
.film-play:focus-visible, .film-chapters button:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }

@media (max-width: 520px) {
  .film-chapters { gap: 4px; }
  .film-chapters button { font-size: 11px; }
}
</style>
