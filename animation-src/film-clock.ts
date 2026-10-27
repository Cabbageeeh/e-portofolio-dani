import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

export type FilmFormat = 'wide' | 'tall';

export interface FilmChapter {
  label: string;
  start: number;
  /** Gambar yang paling bercerita di bab ini, dipakai saat gerak dikurangi. */
  still: number;
}

// Jam film: satu angka detik yang dimajukan requestAnimationFrame selama film terlihat dan tidak dijeda.
// Bentuk layarnya ikut lebar wadah bertanda ref="film"; dengan gerak dikurangi, film berhenti di gambar `still`.
// Film dengan `loop: false` diputar sekali: jamnya terus berjalan melewati `duration` dan gambarnya ditahan di akhir.
export function useFilmClock(options: {
  duration: number;
  still: number;
  chapters: readonly FilmChapter[];
  onLoop?: () => void;
  loop?: boolean;
}) {
  const root = useTemplateRef<HTMLElement>('film');
  const time = ref(0);
  const format = ref<FilmFormat>('wide');
  const playing = ref(true);
  const inView = ref(false);
  const reduced = ref(false);

  let frameId = 0;
  let last = 0;
  function run(now: number): void {
    const step = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    let next = time.value + step;
    if (options.loop !== false && next >= options.duration) {
      next -= options.duration;
      options.onLoop?.();
    }
    time.value = next;
    frameId = requestAnimationFrame(run);
  }
  function stop(): void {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }
  watch([playing, inView], ([play, seen]) => {
    if (!play || !seen) return stop();
    if (frameId || typeof requestAnimationFrame !== 'function') return;
    last = 0;
    frameId = requestAnimationFrame(run);
  });

  const chapter = computed(() => {
    let index = 0;
    options.chapters.forEach((item, at) => {
      if (time.value >= item.start) index = at;
    });
    return index;
  });
  /** Lompat ke awal bab, atau ke gambar diamnya bila gerak dikurangi. */
  function seek(index: number): void {
    const item = options.chapters[index]!;
    time.value = reduced.value ? item.still : item.start;
  }
  function toggle(): void {
    playing.value = !playing.value;
  }

  let watchView: IntersectionObserver | undefined;
  let watchSize: ResizeObserver | undefined;
  onMounted(() => {
    const el = root.value!;
    const fit = (width: number) => (format.value = width > 0 && width < 460 ? 'tall' : 'wide');
    fit(el.clientWidth);
    if (typeof ResizeObserver !== 'undefined') {
      watchSize = new ResizeObserver(([entry]) => entry && fit(entry.contentRect.width));
      watchSize.observe(el);
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      reduced.value = true;
      playing.value = false;
      time.value = options.still;
    }
    if (typeof IntersectionObserver === 'undefined') {
      inView.value = true;
      return;
    }
    watchView = new IntersectionObserver(([entry]) => (inView.value = Boolean(entry?.isIntersecting)), { threshold: 0.3 });
    watchView.observe(el);
  });
  onBeforeUnmount(() => {
    stop();
    watchView?.disconnect();
    watchSize?.disconnect();
  });

  return { time, format, playing, reduced, chapter, seek, toggle };
}
